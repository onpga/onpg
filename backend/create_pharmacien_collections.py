from pymongo import MongoClient
from bson import ObjectId

"""
Script utilitaire (optionnel) pour préparer les collections spécifiques à l'espace pharmacien :
- pharmacien_theses
- contact_messages (index sur source + pharmacienId)

À exécuter une seule fois si besoin :
    python create_pharmacien_collections.py
"""

MONGODB_URI = "mongodb://mongo:PUnGGIpyAbMtWoQohyXGFpMjVkAWTYXJ@trolley.proxy.rlwy.net:38507"
DB_NAME = "onpg"


def main() -> None:
  client = MongoClient(MONGODB_URI)
  db = client[DB_NAME]

  # Création explicite de la collection des thèses de pharmaciens (si elle n'existe pas)
  if "pharmacien_theses" not in db.list_collection_names():
    db.create_collection("pharmacien_theses")

  theses = db["pharmacien_theses"]

  # Index utiles
  theses.create_index("pharmacienId")
  theses.create_index("createdAt")

  # Sur contact_messages, index pour filtrer les messages venant de l'espace pharmacien
  contact_messages = db["contact_messages"]
  contact_messages.create_index([("source", 1), ("pharmacienId", 1)])

  print("✅ Collections / index pour l'espace pharmacien vérifiés/créés.")


if __name__ == "__main__":
  main()




