from pymongo import MongoClient
from bson.binary import Binary

"""
Script de correction pour convertir les mots de passe BinData
des comptes pharmaciens en chaînes de caractères (bcrypt hash).

À exécuter une fois :

  cd C:\\Users\\zto\\Downloads\\ordrepharmacie-main\\ordrepharmacie-main
  python backend/fix_pharmacien_passwords.py
"""

MONGODB_URI = "mongodb://mongo:PUnGGIpyAbMtWoQohyXGFpMjVkAWTYXJ@trolley.proxy.rlwy.net:38507"
DB_NAME = "onpg"


def main() -> None:
  client = MongoClient(MONGODB_URI)
  db = client[DB_NAME]
  users = db["users"]

  fixed = 0

  # On cible les users dont le password est stocké en BinData
  for doc in users.find({"password": {"$type": "binData"}}):
    pw = doc.get("password")
    # Selon la version du driver, pw peut être Binary ou bytes
    if isinstance(pw, Binary) or isinstance(pw, (bytes, bytearray)):
      try:
        decoded = bytes(pw).decode("utf-8")
      except Exception:
        continue

      users.update_one(
        {"_id": doc["_id"]},
        {"$set": {"password": decoded}}
      )
      fixed += 1

  print(f"Mots de passe convertis en chaîne : {fixed}")


if __name__ == "__main__":
  main()


