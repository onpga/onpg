#!/usr/bin/env python3
"""
Script d'import des pharmacies depuis le dataset Google Places vers MongoDB.
Optionnellement, enrichit les données avec les photos via Google Places API.

Usage:
    # Import simple (sans photos)
    python import-google-pharmacies.py

    # Import avec récupération des photos (nécessite une clé API Google Maps Platform)
    python import-google-pharmacies.py --photos --api-key VOTRE_CLE_API

    # Dry run (voir ce qui sera inséré sans toucher à la base)
    python import-google-pharmacies.py --dry-run
"""

import json
import re
import sys
import os
import time
import argparse
from datetime import datetime, timezone
from pathlib import Path

# ─────────────────────────────────────────────
# Dépendances : pymongo   → pip install pymongo
#               requests  → pip install requests
# ─────────────────────────────────────────────
try:
    from pymongo import MongoClient, UpdateOne
    from pymongo.errors import BulkWriteError
except ImportError:
    print("❌  pymongo manquant. Installez-le avec : pip install pymongo")
    sys.exit(1)

try:
    import requests
except ImportError:
    print("❌  requests manquant. Installez-le avec : pip install requests")
    sys.exit(1)

# ──────────────────────────────────────────────────────────
# CONFIG — adaptez si nécessaire
# ──────────────────────────────────────────────────────────
MONGODB_URI = "mongodb://mongo:PUnGGIpyAbMtWoQohyXGFpMjVkAWTYXJ@trolley.proxy.rlwy.net:38507"
DB_NAME     = "onpg"
COLLECTION  = "pharmacies"

# Chemin vers le fichier JSON (relatif à ce script)
JSON_FILE = Path(__file__).parent.parent / "public" / "dataset_crawler-google-places_2026-03-01_21-03-56-912.json"

# Google Places API — uniquement utilisé si --photos est passé
GOOGLE_PLACES_DETAILS_URL = "https://maps.googleapis.com/maps/api/place/details/json"
GOOGLE_PLACES_PHOTO_URL   = "https://maps.googleapis.com/maps/api/place/photo"
PHOTO_MAX_WIDTH = 800  # pixels

# ──────────────────────────────────────────────────────────
# UTILITAIRES
# ──────────────────────────────────────────────────────────

def extract_place_id(url: str) -> str | None:
    """Extrait le place_id Google depuis l'URL Maps."""
    if not url:
        return None
    m = re.search(r"query_place_id=([^&]+)", url)
    return m.group(1) if m else None


def normalize_phone(phone: str | None) -> str:
    """Normalise le numéro de téléphone."""
    if not phone:
        return ""
    # Supprimer les espaces multiples, garder le + initial
    return re.sub(r"\s+", " ", phone.strip())


def infer_quartier(street: str | None, city: str | None) -> str:
    """
    Tente d'extraire un nom de quartier depuis la rue.
    Les Plus Codes Google (ex: 7QCJ+P2J, 9JH4+J3V) sont filtrés.
    Si la rue contient "PlusCode, Nom de quartier", retourne uniquement le nom.
    """
    if not street:
        return ""
    # Détecter les Plus Codes (format: 4+ chars alphanumériques + "+" + 2-4 chars)
    # Ex: "7QCJ+P2J, Av. du Grand Village" → "Av. du Grand Village"
    # Ex: "7QJP+38C" → ""
    if re.match(r"^[0-9A-Z]{4,8}\+[0-9A-Z]{2,4}([\s,].*)?$", street.strip()):
        parts = street.strip().split(",", 1)
        if len(parts) > 1:
            return parts[1].strip()
        return ""
    return street.strip()


def map_google_to_mongo(item: dict) -> dict:
    """
    Convertit un enregistrement Google Places vers le schéma MongoDB
    utilisé par l'application ONPG.
    """
    place_id = extract_place_id(item.get("url", ""))
    street   = item.get("street") or ""
    city     = item.get("city") or ""

    doc = {
        # Champs principaux
        "nom":      (item.get("title") or "").strip(),
        "ville":    city.strip(),
        "quartier": infer_quartier(street, city),
        "adresse":  street.strip(),

        # Contact
        "telephone": normalize_phone(item.get("phone")),
        "email":     "",
        "website":   (item.get("website") or "").strip(),

        # Photo — sera remplie plus tard si --photos
        "photo": "",

        # Géolocalisation — non disponible dans ce dataset
        "latitude":  None,
        "longitude": None,
        "location":  None,

        # Données Google Places
        "googlePlaceId":      place_id or "",
        "googleMapsUrl":      (item.get("url") or "").strip(),
        "googleRating":       item.get("totalScore"),
        "googleReviewsCount": item.get("reviewsCount"),

        # Horaires et statut — inconnus, à compléter via l'admin
        "horaires": {},
        "garde":    False,

        # Métadonnées
        "source":    "google_places_crawler_2026-03-01",
        "isActive":  True,
        "messages":  [],
        "createdAt": datetime.now(timezone.utc),
        "updatedAt": datetime.now(timezone.utc),
    }

    return doc


# ──────────────────────────────────────────────────────────
# RÉCUPÉRATION DE PHOTO VIA GOOGLE PLACES API
# ──────────────────────────────────────────────────────────

def fetch_photo_url(place_id: str, api_key: str) -> str | None:
    """
    Récupère l'URL d'une photo pour un place_id via l'API Google Places.

    Étapes :
    1. Place Details → récupère le photo_reference
    2. Place Photo   → construit l'URL de la photo (redirect permanent)
    """
    if not place_id or not api_key:
        return None

    try:
        # Étape 1 : Place Details pour avoir le photo_reference
        resp = requests.get(
            GOOGLE_PLACES_DETAILS_URL,
            params={
                "place_id": place_id,
                "fields":   "photo",
                "key":      api_key,
                "language": "fr",
            },
            timeout=10,
        )
        resp.raise_for_status()
        data = resp.json()

        if data.get("status") != "OK":
            return None

        photos = data.get("result", {}).get("photos", [])
        if not photos:
            return None

        photo_reference = photos[0].get("photo_reference")
        if not photo_reference:
            return None

        # Étape 2 : construire l'URL de la photo
        # L'API renvoie un redirect 302 vers l'URL réelle de l'image.
        # On peut stocker directement l'URL de l'API (elle redirige vers l'image).
        photo_url = (
            f"{GOOGLE_PLACES_PHOTO_URL}"
            f"?maxwidth={PHOTO_MAX_WIDTH}"
            f"&photo_reference={photo_reference}"
            f"&key={api_key}"
        )
        return photo_url

    except Exception as e:
        print(f"    ⚠️  Erreur photo pour {place_id}: {e}")
        return None


# ──────────────────────────────────────────────────────────
# PROGRAMME PRINCIPAL
# ──────────────────────────────────────────────────────────

def parse_args():
    parser = argparse.ArgumentParser(description="Import pharmacies Google Places → MongoDB")
    parser.add_argument("--photos",   action="store_true",
                        help="Récupérer les photos via Google Places API")
    parser.add_argument("--api-key",  default="",
                        help="Clé API Google Maps Platform (requise avec --photos)")
    parser.add_argument("--dry-run",  action="store_true",
                        help="Afficher les données sans insérer en base")
    parser.add_argument("--delay",    type=float, default=0.3,
                        help="Délai entre chaque appel API photo (défaut: 0.3s)")
    return parser.parse_args()


def main():
    args = parse_args()

    if args.photos and not args.api_key:
        print("❌  --photos requiert --api-key VOTRE_CLE_API")
        print("    Obtenez une clé sur https://console.cloud.google.com/")
        print("    Services à activer : Places API")
        sys.exit(1)

    # ── Lecture du fichier JSON ────────────────────────────
    print(f"\n📂  Lecture du fichier : {JSON_FILE}")
    if not JSON_FILE.exists():
        print(f"❌  Fichier introuvable : {JSON_FILE}")
        sys.exit(1)

    with open(JSON_FILE, encoding="utf-8") as f:
        raw_data = json.load(f)

    print(f"✅  {len(raw_data)} entrées chargées\n")

    # ── Mapping vers le schéma MongoDB ────────────────────
    pharmacies = [map_google_to_mongo(item) for item in raw_data]

    # Stats rapides
    with_phone   = sum(1 for p in pharmacies if p["telephone"])
    with_placeid = sum(1 for p in pharmacies if p["googlePlaceId"])
    with_website = sum(1 for p in pharmacies if p["website"])
    cities       = {}
    for p in pharmacies:
        cities[p["ville"]] = cities.get(p["ville"], 0) + 1

    print("📊  Statistiques :")
    print(f"    Total         : {len(pharmacies)}")
    print(f"    Avec téléphone: {with_phone} ({with_phone*100//len(pharmacies)}%)")
    print(f"    Avec Place ID : {with_placeid} ({with_placeid*100//len(pharmacies)}%)")
    print(f"    Avec website  : {with_website}")
    print(f"    Villes        :")
    for city, count in sorted(cities.items(), key=lambda x: -x[1]):
        print(f"        {city or '(inconnue)':<25} {count}")

    # ── Récupération des photos (optionnel) ───────────────
    if args.photos:
        print(f"\n📸  Récupération des photos ({with_placeid} pharmacies avec Place ID)…")
        fetched = 0
        failed  = 0
        for i, p in enumerate(pharmacies, 1):
            if not p["googlePlaceId"]:
                continue
            photo_url = fetch_photo_url(p["googlePlaceId"], args.api_key)
            if photo_url:
                p["photo"] = photo_url
                fetched += 1
                print(f"    ✅  [{i:>3}/{len(pharmacies)}] {p['nom'][:40]}")
            else:
                failed += 1
                print(f"    ❌  [{i:>3}/{len(pharmacies)}] {p['nom'][:40]} — pas de photo")
            time.sleep(args.delay)
        print(f"\n    Photos récupérées : {fetched} | Échecs : {failed}\n")

    # ── Dry run ───────────────────────────────────────────
    if args.dry_run:
        print("\n🔍  MODE DRY-RUN — Aperçu des 3 premiers documents :\n")
        for doc in pharmacies[:3]:
            print(json.dumps(
                {k: (v.isoformat() if isinstance(v, datetime) else v)
                 for k, v in doc.items()},
                ensure_ascii=False, indent=2
            ))
            print("---")
        print(f"\n✅  Dry run terminé — {len(pharmacies)} documents prêts (rien n'a été inséré)")
        return

    # ── Connexion MongoDB ─────────────────────────────────
    print("🔌  Connexion à MongoDB…")
    try:
        client = MongoClient(MONGODB_URI, serverSelectionTimeoutMS=8000)
        client.admin.command("ping")
        print("✅  Connecté à MongoDB\n")
    except Exception as e:
        print(f"❌  Connexion échouée : {e}")
        sys.exit(1)

    db         = client[DB_NAME]
    collection = db[COLLECTION]

    # ── Création d'un index unique sur googlePlaceId ──────
    try:
        # Index sparse pour que les docs sans place_id ne se bloquent pas
        collection.create_index(
            [("googlePlaceId", 1)],
            unique=True,
            sparse=True,
            name="idx_googlePlaceId_unique"
        )
        print("✅  Index unique sur googlePlaceId créé / vérifié")
    except Exception:
        pass  # Index existe déjà

    # ── Upsert en bulk ────────────────────────────────────
    # Stratégie : si googlePlaceId existe → mise à jour, sinon → insert par nom+ville
    operations = []
    for doc in pharmacies:
        if doc["googlePlaceId"]:
            filter_q = {"googlePlaceId": doc["googlePlaceId"]}
        else:
            # Fallback : upsert par nom + ville pour éviter les doublons
            filter_q = {
                "nom":  doc["nom"],
                "ville": doc["ville"],
            }

        # On ne re-écrase pas createdAt si le doc existe déjà
        set_on_insert = {"createdAt": doc.pop("createdAt"), "messages": []}
        update_doc = doc.copy()
        update_doc.pop("messages", None)

        operations.append(UpdateOne(
            filter_q,
            {
                "$set":         update_doc,
                "$setOnInsert": set_on_insert,
            },
            upsert=True
        ))

    print(f"💾  Insertion / mise à jour de {len(operations)} pharmacies…")
    try:
        result = collection.bulk_write(operations, ordered=False)
        inserted = result.upserted_count
        updated  = result.modified_count
        print(f"\n🎉  Terminé !")
        print(f"    Nouvelles pharmacies insérées : {inserted}")
        print(f"    Pharmacies mises à jour       : {updated}")
        print(f"    Total dans la collection       : {collection.count_documents({})}")
    except BulkWriteError as bwe:
        print(f"⚠️  BulkWriteError (partiellement exécuté) : {bwe.details}")
    finally:
        client.close()
        print("\n🔌  Connexion fermée")


if __name__ == "__main__":
    main()

