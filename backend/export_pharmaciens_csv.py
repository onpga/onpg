"""
Exporte les comptes pharmaciens (nom, prénom, pseudo, mot de passe commun) en CSV.

Usage (depuis la racine du dépôt) :

    set MONGODB_URI=mongodb://...
    set PHARMACIEN_MDP_PLAIN=admin123
    python backend/export_pharmaciens_csv.py

Par défaut, le fichier est écrit dans le répertoire courant :
    pharmaciens_export_YYYYMMDD_HHMMSS.csv

Les mots de passe en base sont des hash bcrypt : ce script n’exporte pas le hash,
mais répète le mot de passe en clair commun (variable PHARMACIEN_MDP_PLAIN).
"""

from __future__ import annotations

import csv
import os
import sys
from datetime import datetime, timezone

from pymongo import MongoClient

DB_NAME = os.environ.get("MONGODB_DB", "onpg")
ROLE = "pharmacien"
# Mot de passe en clair identique pour tous (à ajuster si besoin)
MDP_PLAIN = os.environ.get("PHARMACIEN_MDP_PLAIN", "admin123")


def main() -> None:
    uri = os.environ.get("MONGODB_URI")
    if not uri:
        print(
            "Erreur : définissez la variable d'environnement MONGODB_URI.",
            file=sys.stderr,
        )
        sys.exit(1)

    out_name = os.environ.get(
        "EXPORT_CSV_PATH",
        f"pharmaciens_export_{datetime.now(timezone.utc):%Y%m%d_%H%M%S}.csv",
    )

    client = MongoClient(uri, serverSelectionTimeoutMS=15000)
    client.admin.command("ping")
    db = client[DB_NAME]
    users = db["users"]

    cursor = users.find(
        {"role": ROLE},
        {"username": 1, "nom": 1, "prenoms": 1, "prenom": 1},
    ).sort("username", 1)

    rows = []
    for doc in cursor:
        prenom = doc.get("prenoms") or doc.get("prenom") or ""
        rows.append(
            {
                "nom": (doc.get("nom") or "").strip(),
                "prenom": (prenom if isinstance(prenom, str) else str(prenom)).strip(),
                "pseudo": (doc.get("username") or "").strip(),
                "mot_de_passe": MDP_PLAIN,
            }
        )

    # UTF-8 avec BOM pour Excel Windows
    with open(out_name, "w", encoding="utf-8-sig", newline="") as f:
        w = csv.DictWriter(
            f,
            fieldnames=["nom", "prenom", "pseudo", "mot_de_passe"],
            delimiter=";",
        )
        w.writeheader()
        w.writerows(rows)

    client.close()
    print(f"Exporté {len(rows)} ligne(s) vers {os.path.abspath(out_name)}")


if __name__ == "__main__":
    main()
