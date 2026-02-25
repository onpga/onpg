from pymongo import MongoClient

"""
Script de nettoyage pour la collection `users` :
- Garde uniquement :
    - le compte superadmin `admin`
    - le compte pharmacien de base `pharmacien`
- Supprime tous les autres utilisateurs avec role = 'pharmacien'

À exécuter une fois :

    cd C:\\Users\\zto\\Downloads\\ordrepharmacie-main\\ordrepharmacie-main
    python backend/cleanup_pharmaciens.py
"""

MONGODB_URI = "mongodb://mongo:PUnGGIpyAbMtWoQohyXGFpMjVkAWTYXJ@trolley.proxy.rlwy.net:38507"
DB_NAME = "onpg"


def main() -> None:
    client = MongoClient(MONGODB_URI)
    db = client[DB_NAME]
    users = db["users"]

    # Comptes à conserver
    keep_usernames = {"admin", "pharmacien"}

    total_before = users.count_documents({})
    pharmaciens_before = users.count_documents({"role": "pharmacien"})

    # Supprimer tous les pharmaciens sauf username = 'pharmacien'
    result = users.delete_many(
        {
            "role": "pharmacien",
            "username": {"$ne": "pharmacien"},
        }
    )

    total_after = users.count_documents({})
    pharmaciens_after = users.count_documents({"role": "pharmacien"})

    print(f"Utilisateurs totaux AVANT : {total_before}")
    print(f"Pharmaciens AVANT : {pharmaciens_before}")
    print(f"Pharmaciens supprimés : {result.deleted_count}")
    print(f"Utilisateurs totaux APRES : {total_after}")
    print(f"Pharmaciens APRES : {pharmaciens_after}")


if __name__ == "__main__":
    main()


