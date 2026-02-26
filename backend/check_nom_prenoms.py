from pymongo import MongoClient

"""
Script pour vérifier que les comptes pharmaciens ont nom et prenoms.
"""

MONGODB_URI = "mongodb://mongo:PUnGGIpyAbMtWoQohyXGFpMjVkAWTYXJ@trolley.proxy.rlwy.net:38507"
DB_NAME = "onpg"

def main():
    client = MongoClient(MONGODB_URI)
    db = client[DB_NAME]
    users = db["users"]
    
    # Récupérer tous les pharmaciens
    pharmaciens = list(users.find({"role": "pharmacien"}, {"username": 1, "nom": 1, "prenoms": 1}))
    
    missing_nom = []
    missing_prenoms = []
    complete = []
    
    for p in pharmaciens:
        username = p.get("username", "N/A")
        has_nom = "nom" in p and p["nom"]
        has_prenoms = "prenoms" in p and p["prenoms"]
        
        if not has_nom:
            missing_nom.append(username)
        if not has_prenoms:
            missing_prenoms.append(username)
        if has_nom and has_prenoms:
            complete.append(username)
    
    print(f"Total pharmaciens: {len(pharmaciens)}")
    print(f"Avec nom ET prenoms: {len(complete)}")
    print(f"Sans nom: {len(missing_nom)}")
    print(f"Sans prenoms: {len(missing_prenoms)}")
    
    if missing_nom:
        print(f"\nPharmaciens sans nom (premiers 10): {missing_nom[:10]}")
    if missing_prenoms:
        print(f"\nPharmaciens sans prenoms (premiers 10): {missing_prenoms[:10]}")

if __name__ == "__main__":
    main()




