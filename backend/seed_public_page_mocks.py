"""
Seed ciblé des pages publiques ONPG (1 mock par collection).

Collections seedées:
- pharmacies (Pratique)
- formations (Formation continue)
- deontologie
- decrets
- decisions
- lois
- commissions
- articles
- actualites

Collections volontairement exclues (déjà alimentées):
- photos
- theses
- communiques

Usage:
  python seed_public_page_mocks.py
  python seed_public_page_mocks.py --replace
  python seed_public_page_mocks.py --dry-run
"""

from __future__ import annotations

import argparse
import os
from datetime import datetime, timezone
from typing import Any, Dict, List

from pymongo import MongoClient

DEFAULT_MONGODB_URI = "mongodb://mongo:PUnGGIpyAbMtWoQohyXGFpMjVkAWTYXJ@trolley.proxy.rlwy.net:38507"
DEFAULT_DB_NAME = "onpg"
SEED_VERSION = "2026-03-14-premium-v1"


def now_utc() -> datetime:
  return datetime.now(timezone.utc)


def iso_date(value: str) -> str:
  return value


def build_documents() -> Dict[str, Dict[str, Any]]:
  common_image = "https://images.unsplash.com/photo-1584516150909-c43483ee7939?w=1600&h=900&fit=crop"
  article_image = "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=1400&h=800&fit=crop"
  pharma_image = "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=1200&h=800&fit=crop"

  return {
    "pharmacies": {
      "nom": "Pharmacie Test Premium Centre",
      "ville": "Libreville",
      "quartier": "Centre-Ville",
      "adresse": "Boulevard Triomphal, Immeuble Test ONPG",
      "telephone": "+241 01 23 45 67",
      "email": "test.pharmacie@onpg.ga",
      "photo": pharma_image,
      "garde": True,
      "ouvert": True,
      "latitude": 0.3901,
      "longitude": 9.4544,
      "horaires": {
        "lundi": "08:00 - 20:00",
        "mardi": "08:00 - 20:00",
        "mercredi": "08:00 - 20:00",
        "jeudi": "08:00 - 20:00",
        "vendredi": "08:00 - 20:00",
        "samedi": "09:00 - 18:00",
        "dimanche": "09:00 - 13:00",
      },
      "isActive": True,
      "featured": True,
      "category": "Pratique",
      "summary": "Pharmacie mock premium avec informations de garde, contact et horaires complets.",
      "content": """
        <h3>Services disponibles</h3>
        <ul>
          <li>Conseil pharmaceutique personnalise</li>
          <li>Suivi des traitements chroniques</li>
          <li>Dispensation en urgence de garde</li>
        </ul>
        <h3>Informations pratiques</h3>
        <p>Cette fiche sert a valider le rendu detaille des cartes pharmacies,
        des badges de garde et des liens de contact.</p>
      """,
      "tags": ["pratique", "pharmacie", "mock"],
      "image": pharma_image,
      "date": iso_date("2026-03-14"),
      "readTime": 2,
      "order": 1,
    },
    "formations": {
      "title": "Formation Continue Mock: Bonnes Pratiques Officinales 2026",
      "description": "Session de test pour visualiser le rendu formation continue.",
      "duration": "2 jours",
      "price": 75000,
      "showPrice": True,
      "category": "Obligatoire",
      "instructor": "Dr Elise Mba",
      "date": iso_date("2026-05-12"),
      "location": "Libreville - Centre de formation ONPG",
      "content": """
        <h3>Objectifs pedagogiques</h3>
        <ul>
          <li>Renforcer la conformite des pratiques officinales</li>
          <li>Standardiser le conseil pharmaceutique patient</li>
          <li>Mettre en place une tracabilite robuste</li>
        </ul>
        <h3>Deroule de la formation</h3>
        <p><strong>Jour 1:</strong> cadre reglementaire, pharmacovigilance, cas pratiques.</p>
        <p><strong>Jour 2:</strong> audit d'officine, indicateurs qualite, plan d'action.</p>
      """,
      "featured": True,
      "isActive": True,
      "image": common_image,
      "summary": "Mock premium de formation continue.",
      "tags": ["formation", "obligatoire", "onpg"],
      "readTime": 6,
      "order": 1,
    },
    "deontologie": {
      "title": "Code de Déontologie Pharmaceutique (Version Mock 2026)",
      "pdfUrl": "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      "description": "Document mock enrichi pour verification du rendu premium de la page Deontologie.",
      "lastUpdated": iso_date("2026-03-14"),
      "isActive": True,
      "featured": True,
      "image": common_image,
      "summary": "Version de test du document déontologique.",
      "content": """
        <h3>Principes fondamentaux</h3>
        <p>Le pharmacien exerce avec independance, probite, competence et respect
        des droits du patient.</p>
        <h3>Engagements prioritaires</h3>
        <ul>
          <li>Secret professionnel et confidentialite</li>
          <li>Information claire et loyale du patient</li>
          <li>Cooperation interprofessionnelle pour la securite des soins</li>
        </ul>
      """,
      "tags": ["deontologie", "reglementation", "pdf"],
      "date": iso_date("2026-03-14"),
      "readTime": 4,
      "order": 1,
    },
    "decrets": {
      "number": "2026-001-ONPG",
      "title": "Décret mock relatif à la sécurisation de la dispensation",
      "publicationDate": iso_date("2026-01-08"),
      "entryDate": iso_date("2026-02-01"),
      "date": iso_date("2026-01-08"),
      "ministry": "Ministère de la Santé",
      "category": "Dispensation",
      "summary": "Texte mock complet pour validation premium de la page Decrets.",
      "keyArticles": ["Article 1 - Objet", "Article 4 - Traçabilité", "Article 9 - Contrôle"],
      "tags": ["decret", "dispensation", "traçabilité"],
      "status": "active",
      "downloads": 128,
      "views": 560,
      "featured": True,
      "language": "fr",
      "isActive": True,
      "image": article_image,
      "excerpt": "Résumé court du décret mock.",
      "content": """
        <h3>Contexte du texte</h3>
        <p>Ce decret fixe un cadre harmonise pour la dispensation en officine
        afin d'ameliorer la securite therapeutique et la traçabilite.</p>
        <h3>Dispositions principales</h3>
        <ul>
          <li>Verification systematique des prescriptions sensibles</li>
          <li>Traçabilite numerique des delivrances prioritaires</li>
          <li>Procedure de signalement rapide des incidents</li>
        </ul>
        <h3>Impact attendu</h3>
        <p>Reduction des erreurs de dispensation et meilleure coordination entre
        officines, medecins et autorites de regulation.</p>
      """,
      "readTime": 5,
      "order": 1,
    },
    "decisions": {
      "reference": "DEC-ONPG-2026-015",
      "title": "Décision mock de la commission disciplinaire",
      "date": iso_date("2026-02-20"),
      "jurisdiction": "Conseil National ONPG",
      "category": "Discipline",
      "summary": "Decision de test avec argumentaire complet pour valider la page detail.",
      "parties": ["Pharmacien A", "Conseil Régional"],
      "decision": "partiellement favorable",
      "keywords": ["discipline", "règlement", "profession"],
      "downloads": 42,
      "citations": 7,
      "featured": True,
      "isActive": True,
      "image": article_image,
      "excerpt": "Extrait de décision mock premium.",
      "content": """
        <h3>Motifs de la decision</h3>
        <p>La commission retient des manquements partiels aux obligations
        de tracabilite, avec circonstances attenuantes documentees.</p>
        <h3>Mesures prononcees</h3>
        <ul>
          <li>Mise en conformite sous 60 jours</li>
          <li>Audit de suivi a 3 mois</li>
          <li>Obligation de formation complementaire</li>
        </ul>
        <h3>Portee de la decision</h3>
        <p>La decision vise une correction rapide des pratiques et la prevention
        de recurrence, tout en preservant la continuite de service.</p>
      """,
      "tags": ["decision", "jurisprudence", "onpg"],
      "readTime": 4,
      "order": 1,
    },
    "lois": {
      "number": "L-2026-014",
      "title": "Loi mock encadrant l'exercice officinal",
      "publicationDate": iso_date("2026-01-15"),
      "entryDate": iso_date("2026-03-01"),
      "date": iso_date("2026-01-15"),
      "category": "Législation",
      "summary": "Loi de test complete pour rendu premium de la page Lois.",
      "tableOfContents": [
        {"title": "Titre I - Dispositions générales", "articles": ["Art. 1", "Art. 2", "Art. 3"]},
        {"title": "Titre II - Contrôles", "articles": ["Art. 10", "Art. 11"]},
      ],
      "keyArticles": ["Art. 1", "Art. 10"],
      "tags": ["loi", "officine", "régulation"],
      "status": "active",
      "downloads": 95,
      "views": 910,
      "featured": True,
      "language": "fr",
      "isActive": True,
      "image": article_image,
      "excerpt": "Extrait synthétique de la loi mock.",
      "content": """
        <h3>Objet de la loi</h3>
        <p>Cette loi precise les conditions d'exercice officinal, les obligations
        de qualite de service et les mecanismes de controle institutionnel.</p>
        <h3>Axes structurants</h3>
        <ul>
          <li>Encadrement de la delivrance et du conseil pharmaceutique</li>
          <li>Regles de gouvernance pour les officines et depots</li>
          <li>Dispositif de sanctions graduees et proportionnees</li>
        </ul>
        <h3>Mise en application</h3>
        <p>Des textes d'application precisent les obligations operatoires par type
        d'etablissement et par niveau de risque sanitaire.</p>
      """,
      "readTime": 6,
      "order": 1,
    },
    "commissions": {
      "title": "Commission Mock - Qualité et Innovation",
      "name": "Commission Qualité et Innovation",
      "description": "Commission de test orientee amelioration continue, innovation et qualite.",
      "president": "Dr Patience Asseko NTOGONO OKE",
      "members": ["Dr Alice Nze", "Dr Jean Ondo", "Dr Sarah Minko", "Dr Paul Meye"],
      "creationDate": iso_date("2025-11-12"),
      "category": "Recherche",
      "attributions": [
        "Proposer des référentiels qualité",
        "Coordonner les audits de pratiques",
        "Publier des rapports semestriels",
      ],
      "missions": [
        "Accompagnement des pharmacies",
        "Veille réglementaire",
        "Innovation en santé numérique",
      ],
      "meetings": 8,
      "reports": 3,
      "status": "active",
      "featured": True,
      "isActive": True,
      "image": common_image,
      "summary": "Commission mock premium.",
      "content": """
        <h3>Role de la commission</h3>
        <p>La commission pilote les travaux d'amelioration des pratiques
        professionnelles et accompagne le deploiement des standards qualite.</p>
        <h3>Priorites 2026</h3>
        <ul>
          <li>Evaluation des indicateurs de performance des officines</li>
          <li>Guide operationnel de gestion des risques</li>
          <li>Programme de mentoring pour jeunes pharmaciens</li>
        </ul>
        <h3>Livrables attendus</h3>
        <p>Publication de recommandations semestrielles et tableau de bord
        de suivi des actions corrective.</p>
      """,
      "tags": ["commission", "qualité", "innovation"],
      "date": iso_date("2026-03-01"),
      "readTime": 5,
      "order": 1,
    },
    "articles": {
      "title": "Article scientifique mock: Optimisation de la dispensation officinale",
      "authors": ["Dr Elise Mba", "Dr Jean Ondo"],
      "abstract": "Analyse multicentrique des protocoles de dispensation en contexte urbain et periurbain.",
      "excerpt": "Article mock enrichi pour tests premium (resume, metadata, lecture detaillee).",
      "journal": "Revue Pharmaceutique Gabonaise",
      "volume": "12",
      "issue": "1",
      "pages": "22-35",
      "year": 2026,
      "doi": "10.1234/onpg.mock.2026.001",
      "keywords": ["dispensation", "qualité", "officine"],
      "tags": ["dispensation", "qualité", "officine"],
      "category": "Recherche appliquée",
      "downloads": 210,
      "citations": 14,
      "featured": True,
      "language": "fr",
      "publicationType": "article",
      "isActive": True,
      "image": article_image,
      "content": """
        <h2>Introduction</h2>
        <p>Cette etude evalue la qualite de dispensation sur un echantillon
        d'officines, avec comparaison des protocoles avant/apres standardisation.</p>
        <h2>Methodologie</h2>
        <ul>
          <li>Audit de 38 officines sur 4 trimestres</li>
          <li>Analyse d'indicateurs cliniques et operationnels</li>
          <li>Validation par revue de pairs ONPG</li>
        </ul>
        <h2>Resultats cle</h2>
        <p>La mise en place de protocoles harmonises reduit significativement
        les ecarts de pratique et ameliore la satisfaction patient.</p>
      """,
      "date": iso_date("2026-02-11"),
      "readTime": 7,
      "order": 1,
    },
    "actualites": {
      "title": "Actualité mock: Lancement de la plateforme premium ONPG",
      "excerpt": "Publication de test enrichie pour valider une page Actualites plus editoriale et premium.",
      "summary": "Synthese mock complete de l'actualite premium.",
      "content": """
        <h2>Une nouvelle experience de consultation</h2>
        <p>L'ONPG deploye une refonte orientee lisibilite, rapidite d'acces et
        coherence visuelle pour les contenus institutionnels.</p>
        <h2>Ce qui change concretement</h2>
        <ul>
          <li>Navigation simplifiee par thematiques</li>
          <li>Design plus editorial pour les contenus longs</li>
          <li>Partage social harmonise sur toutes les pages detail</li>
        </ul>
        <h2>Prochaines etapes</h2>
        <p>Le cycle suivant inclut l'enrichissement des ressources et la publication
        de guides pratiques pour les pharmaciens et le public.</p>
      """,
      "image": "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1400&h=800&fit=crop",
      "featuredImage": "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=1400&h=800&fit=crop",
      "category": "actualites",
      "pole": "Général",
      "publishedAt": "2026-03-10T09:30:00Z",
      "date": "2026-03-10T09:30:00Z",
      "readTime": 4,
      "tags": ["onpg", "plateforme", "premium"],
      "featured": True,
      "author": {
        "name": "Équipe Communication ONPG",
        "role": "Communication institutionnelle",
      },
      "isActive": True,
      "language": "fr",
      "order": 1,
    },
  }


def seed_collection(
  db: Any,
  collection_name: str,
  base_document: Dict[str, Any],
  replace: bool,
  dry_run: bool,
) -> Dict[str, Any]:
  collection = db[collection_name]
  mock_key = f"seed:{collection_name}:{SEED_VERSION}"

  timestamp = now_utc()
  doc = {
    **base_document,
    "mockKey": mock_key,
    "seedVersion": SEED_VERSION,
    "updatedAt": timestamp,
    "createdAt": base_document.get("createdAt", timestamp),
    "isActive": base_document.get("isActive", True),
  }

  existing = collection.find_one({"mockKey": mock_key})
  action = "none"
  inserted_id = None

  if dry_run:
    action = "would_update" if existing else "would_insert"
  elif existing:
    if replace:
      collection.update_one({"_id": existing["_id"]}, {"$set": doc})
      action = "updated"
      inserted_id = str(existing["_id"])
    else:
      action = "skipped_existing"
      inserted_id = str(existing["_id"])
  else:
    result = collection.insert_one(doc)
    action = "inserted"
    inserted_id = str(result.inserted_id)

  verify_count = collection.count_documents({"mockKey": mock_key})
  return {
    "collection": collection_name,
    "action": action,
    "id": inserted_id,
    "verify_count": verify_count,
  }


def parse_args() -> argparse.Namespace:
  parser = argparse.ArgumentParser(description="Seed des mocks publics ONPG.")
  parser.add_argument("--uri", default=os.getenv("MONGODB_URI", DEFAULT_MONGODB_URI), help="MongoDB URI")
  parser.add_argument("--db", default=os.getenv("MONGODB_DB", DEFAULT_DB_NAME), help="Nom de la base MongoDB")
  parser.add_argument("--replace", action="store_true", help="Mettre à jour les mocks existants")
  parser.add_argument("--dry-run", action="store_true", help="Simulation sans écriture")
  return parser.parse_args()


def main() -> None:
  args = parse_args()
  docs_by_collection = build_documents()
  skipped_collections = ["photos", "theses", "communiques"]

  client = MongoClient(args.uri)
  db = client[args.db]

  print(f"[INFO] Base connectee: {args.db}")
  print(f"[INFO] Seed version: {SEED_VERSION}")
  print(f"[INFO] Collections exclues: {', '.join(skipped_collections)}")
  print("-" * 70)

  results: List[Dict[str, Any]] = []
  for collection_name, document in docs_by_collection.items():
    result = seed_collection(
      db=db,
      collection_name=collection_name,
      base_document=document,
      replace=args.replace,
      dry_run=args.dry_run,
    )
    results.append(result)
    print(
      f"[{collection_name}] action={result['action']} id={result['id']} "
      f"verify_count={result['verify_count']}"
    )

  print("-" * 70)
  verification_ok = all(item["verify_count"] == 1 for item in results)
  if verification_ok:
    print("[OK] Verification: 1 document mock par collection seedee.")
  else:
    print("[WARN] Verification incomplete: certaines collections n'ont pas exactement 1 mock seede.")

  print(f"[INFO] Total collections seedees: {len(results)}")
  print("[OK] Termine.")


if __name__ == "__main__":
  main()
