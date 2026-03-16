from pymongo import MongoClient
import bcrypt

MONGODB_URI = "mongodb://mongo:PUnGGIpyAbMtWoQohyXGFpMjVkAWTYXJ@trolley.proxy.rlwy.net:38507"
DB_NAME = "onpg"
USERNAME = "noke"
NEW_PASSWORD = "admin123"


def main() -> None:
    client = MongoClient(MONGODB_URI)
    db = client[DB_NAME]
    users = db["users"]

    user = users.find_one({"username": USERNAME})
    if not user:
        raise SystemExit(f"Utilisateur introuvable: {USERNAME}")

    hashed = bcrypt.hashpw(NEW_PASSWORD.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

    result = users.update_one(
        {"_id": user["_id"]},
        {"$set": {"password": hashed, "isActive": True}},
    )

    updated = users.find_one({"_id": user["_id"]}, {"username": 1, "role": 1, "isActive": 1, "password": 1})
    password_ok = bcrypt.checkpw(NEW_PASSWORD.encode("utf-8"), updated["password"].encode("utf-8"))

    print(f"matched={result.matched_count} modified={result.modified_count}")
    print(f"username={updated.get('username')} role={updated.get('role')} isActive={updated.get('isActive')}")
    print(f"password_ok={password_ok}")


if __name__ == "__main__":
    main()
