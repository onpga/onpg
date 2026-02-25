from datetime import datetime
import unicodedata

from pymongo import MongoClient
from bson.binary import Binary

"""
Script pour créer automatiquement des comptes `pharmacien` dans la collection `users`
à partir de la liste des pharmaciens (`public/liste_pharmaciens.txt`).

À exécuter une fois (ou ponctuellement) depuis la racine du projet :

    cd C:\\Users\\zto\\Downloads\\ordrepharmacie-main\\ordrepharmacie-main
    python backend/create_pharmacien_users.py

Pré‑requis :
  - `pymongo` installé (pip install pymongo)
  - `bcrypt` installé (pip install bcrypt)
"""

try:
    import bcrypt  # type: ignore
except ImportError as e:  # pragma: no cover
    raise SystemExit(
        "Le module 'bcrypt' est requis. Installez‑le avec : pip install bcrypt"
    ) from e


MONGODB_URI = "mongodb://mongo:PUnGGIpyAbMtWoQohyXGFpMjVkAWTYXJ@trolley.proxy.rlwy.net:38507"
DB_NAME = "onpg"

BASE_DIR = __file__.replace("\\backend\\create_pharmacien_users.py", "")
LIST_FILE = BASE_DIR + "\\public\\liste_pharmaciens.txt"


def normalize_token(s: str) -> str:
    """Supprime les accents et caractères non alphanumériques, renvoie en minuscules."""
    nfkd = unicodedata.normalize("NFKD", s)
    only_ascii = "".join(c for c in nfkd if not unicodedata.combining(c))
    cleaned = "".join(c for c in only_ascii if c.isalnum())
    return cleaned.lower()


def parse_pharmacists(lines):
    """
    Parse la liste brute des pharmaciens.
    Hypothèses :
    - Les enregistrements commencent par 'Dr '.
    - Parfois tout est sur une ligne : 'Dr NOM PRENOMS NUMERO Nation'
    - Parfois le numéro et/ou la nation sont sur les lignes suivantes.
    """
    records = []
    current = None

    # on saute les 2 premières lignes d'en‑tête
    for raw in lines[2:]:
        line = raw.strip()
        if not line:
            continue

        tokens = line.split()
        if tokens[0] == "Dr":
            if current is not None:
                records.append(current)

            name_tokens = tokens[:]
            number = None
            nation = None

            if name_tokens[-1] in {"Gabon", "ETRANGER"}:
                nation = name_tokens.pop()
            if name_tokens and name_tokens[-1].isdigit():
                number = name_tokens.pop()

            current = {
                "name_tokens": name_tokens,
                "number": number,
                "nation": nation,
            }
        else:
            if current is None:
                continue

            if len(tokens) == 1 and tokens[0].isdigit():
                current["number"] = tokens[0]
            elif len(tokens) == 1 and tokens[0] in {"Gabon", "ETRANGER"}:
                current["nation"] = tokens[0]
            else:
                current["name_tokens"].extend(tokens)

    if current is not None:
        records.append(current)

    return records


def build_username(full_name_tokens, seen):
    """
    Construit un pseudo du type :
    - 1ère lettre du NOM (premier token après 'Dr')
    - suivi du 1er prénom
    Le tout en minuscules, sans accents, sans espaces.
    Si doublon, on ajoute un suffixe numérique (aexemple, aexemple2, ...).
    """
    if not full_name_tokens:
        return ""

    if full_name_tokens[0] == "Dr":
        tokens = full_name_tokens[1:]
    else:
        tokens = full_name_tokens[:]

    if not tokens:
        return ""

    last_name = tokens[0]
    first_name = tokens[1] if len(tokens) >= 2 else tokens[0]

    last_initial = normalize_token(last_name[:1])
    first_name_norm = normalize_token(first_name)

    base = f"{last_initial}{first_name_norm}"
    if not base:
        base = "pharmacien"

    if base not in seen:
        seen[base] = 1
        return base

    seen[base] += 1
    return f"{base}{seen[base]}"


def main() -> None:
    # Lecture de la liste texte
    try:
        with open(LIST_FILE, "r", encoding="utf-8") as f:
            lines = f.read().splitlines()
    except FileNotFoundError:
        raise SystemExit(f"Fichier liste pharmaciens introuvable : {LIST_FILE}")

    records = parse_pharmacists(lines)

    client = MongoClient(MONGODB_URI)
    db = client[DB_NAME]
    users = db["users"]

    # Récupérer tous les users existants (pour éviter doublons et mettre à jour)
    existing_users = {
        u["username"]: u for u in users.find({}, {"username": 1, "role": 1, "_id": 0})
    }
    # Comptes à ne jamais modifier (admin et pharmacien)
    protected_usernames = {"admin", "pharmacien"}
    
    # Vérifier les doublons dans la base
    all_usernames = list(existing_users.keys())
    duplicates = [u for u in all_usernames if all_usernames.count(u) > 1]
    if duplicates:
        print(f"⚠️  ATTENTION: Doublons détectés dans la base: {set(duplicates)}")
    
    seen = {u: 1 for u in existing_users.keys()}

    password_plain = "admin123"
    password_hash_bytes = bcrypt.hashpw(
        password_plain.encode("utf-8"), bcrypt.gensalt()
    )
    # On stocke le hash en chaîne (même format que l'ancien compte pharmacien)
    password_hash = password_hash_bytes.decode("utf-8")

    created = 0
    updated = 0
    skipped = 0

    for rec in records:
        name_tokens = rec["name_tokens"]

        if name_tokens and name_tokens[0] == "Dr":
            display_tokens = name_tokens[1:]
        else:
            display_tokens = name_tokens[:]

        if not display_tokens:
            continue

        # Découpe Nom / Prénom(s) pour stocker aussi ces infos dans users
        last_name = display_tokens[0]
        first_names = " ".join(display_tokens[1:]) if len(display_tokens) > 1 else ""

        username = build_username(name_tokens, seen)
        if not username:
            continue

        # Si le username existe déjà
        if username in existing_users:
            # Ne jamais modifier admin et pharmacien
            if username in protected_usernames:
                skipped += 1
                continue
            
            # Mise à jour: ajouter nom et prenoms si manquants, corriger password si BinData
            update_fields = {}
            existing_user = users.find_one({"username": username})
            
            # Ajouter/mettre à jour nom et prenoms
            if "nom" not in existing_user or existing_user.get("nom") != last_name:
                update_fields["nom"] = last_name
            if "prenoms" not in existing_user or existing_user.get("prenoms") != first_names:
                update_fields["prenoms"] = first_names
            
            # Corriger password si c'est un BinData (convertir en string)
            existing_pw = existing_user.get("password")
            if isinstance(existing_pw, Binary):
                # C'est un BinData, on le convertit en string
                try:
                    decoded_pw = existing_pw.decode("utf-8")
                    # Si le décodage fonctionne et que ça ressemble à un hash bcrypt, on le garde
                    if not decoded_pw.startswith("$2b$") and not decoded_pw.startswith("$2a$"):
                        update_fields["password"] = password_hash
                except:
                    # Si le décodage échoue, on remplace par le nouveau hash
                    update_fields["password"] = password_hash
            elif not isinstance(existing_pw, str) or not existing_pw.startswith("$2"):
                # Si ce n'est pas une string ou pas un hash bcrypt valide, on le remplace
                update_fields["password"] = password_hash
            
            if update_fields:
                update_fields["updatedAt"] = datetime.utcnow()
                users.update_one(
                    {"username": username},
                    {"$set": update_fields}
                )
                updated += 1
            else:
                skipped += 1
            continue

        # Nouveau compte à créer
        now = datetime.utcnow()

        doc = {
            "username": username,
            "email": "",
            "password": password_hash,
            "role": "pharmacien",
            "isActive": True,
            "nom": last_name,
            "prenoms": first_names,
            "createdAt": now,
            "updatedAt": now,
            "lastLogin": None,
        }

        users.insert_one(doc)
        existing_users[username] = {"username": username, "role": "pharmacien"}
        created += 1

    print(f"Utilisateurs pharmaciens créés : {created}")
    print(f"Utilisateurs pharmaciens mis à jour : {updated}")
    print(f"Déjà existants / ignorés (admin/pharmacien) : {skipped}")


if __name__ == "__main__":
    main()


