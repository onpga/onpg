from pymongo import MongoClient
from collections import Counter

"""
Script pour vérifier les doublons dans la collection users.
"""

MONGODB_URI = "mongodb://mongo:PUnGGIpyAbMtWoQohyXGFpMjVkAWTYXJ@trolley.proxy.rlwy.net:38507"
DB_NAME = "onpg"

def main():
    client = MongoClient(MONGODB_URI)
    db = client[DB_NAME]
    users = db["users"]
    
    # Récupérer tous les usernames
    all_users = list(users.find({}, {"username": 1, "role": 1, "_id": 1}))
    usernames = [u["username"] for u in all_users]
    
    # Compter les occurrences
    username_counts = Counter(usernames)
    duplicates = {u: count for u, count in username_counts.items() if count > 1}
    
    if duplicates:
        print(f"DOUBLONS DETECTES:")
        for username, count in duplicates.items():
            print(f"   - {username}: {count} occurrences")
            # Afficher les _id des doublons
            dup_users = [u for u in all_users if u["username"] == username]
            for dup in dup_users:
                print(f"     _id: {dup['_id']}, role: {dup.get('role', 'N/A')}")
    else:
        print("Aucun doublon detecte dans la collection users")
    
    print(f"\nTotal d'utilisateurs: {len(all_users)}")
    print(f"Usernames uniques: {len(set(usernames))}")

if __name__ == "__main__":
    main()

