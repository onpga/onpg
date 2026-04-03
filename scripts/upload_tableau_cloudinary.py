"""
Upload du tableau ONPG 2026 sur Cloudinary.

Prérequis (recommandé):
  pip install cloudinary

Variables d'environnement (obligatoires):
  CLOUDINARY_CLOUD_NAME
  CLOUDINARY_API_KEY
  CLOUDINARY_API_SECRET

Variables d'environnement (optionnelles):
  CLOUDINARY_FOLDER        (par défaut: onpg/tableau)
  CLOUDINARY_PUBLIC_ID     (par défaut: tableau-ordre-2026)
  TABLEAU_PATH             (par défaut: public/tableau-onpg-2026.png)

Exemple:
  set CLOUDINARY_CLOUD_NAME=xxxxx
  set CLOUDINARY_API_KEY=yyyy
  set CLOUDINARY_API_SECRET=zzzz
  python scripts\\upload_tableau_cloudinary.py
"""

from __future__ import annotations

import json
import os
from pathlib import Path


def main() -> None:
  try:
    import cloudinary
    import cloudinary.uploader
  except ModuleNotFoundError:
    raise SystemExit(
      "Module 'cloudinary' manquant. Lance: pip install cloudinary"
    )

  cloud_name = os.getenv("CLOUDINARY_CLOUD_NAME", "").strip()
  api_key = os.getenv("CLOUDINARY_API_KEY", "").strip()
  api_secret = os.getenv("CLOUDINARY_API_SECRET", "").strip()

  if not cloud_name or not api_key or not api_secret:
    raise SystemExit(
      "CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY et CLOUDINARY_API_SECRET sont requis."
    )

  folder = os.getenv("CLOUDINARY_FOLDER", "onpg/tableau").strip().strip("/")
  public_id = os.getenv("CLOUDINARY_PUBLIC_ID", "tableau-ordre-2026").strip().strip("/")

  default_path = Path("public") / "tableau-onpg-2026.png"
  tableau_path = Path(os.getenv("TABLEAU_PATH", str(default_path))).expanduser()

  if not tableau_path.exists():
    raise SystemExit(f"Fichier introuvable: {tableau_path}")

  cloudinary.config(
    cloud_name=cloud_name,
    api_key=api_key,
    api_secret=api_secret,
  )

  # Upload PNG -> Cloudinary gère le format final (auto transformations côté frontend)
  result = cloudinary.uploader.upload(
    str(tableau_path),
    folder=folder,
    public_id=public_id,
    overwrite=True,
    invalidate=True,
    resource_type="image",
  )

  full_public_id = f"{folder}/{public_id}"

  print(json.dumps(
    {
      "cloud_name": cloud_name,
      "folder": folder,
      "public_id": public_id,
      "full_public_id": full_public_id,
      "secure_url": result.get("secure_url"),
      "url": result.get("url"),
    },
    indent=2,
    ensure_ascii=False
  ))

  print("\nA mettre dans le frontend:")
  print(f"VITE_ONPG_TABLEAU_PUBLIC_ID={full_public_id}")


if __name__ == "__main__":
  main()

