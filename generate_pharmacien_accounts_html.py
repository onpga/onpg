import unicodedata
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
SOURCE_FILE = BASE_DIR / "public" / "liste_pharmaciens.txt"
OUTPUT_FILE = BASE_DIR / "public" / "comptes-pharmaciens.html"


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

    for raw in lines[2:]:  # sauter l'en-tête
        line = raw.strip()
        if not line:
            continue

        tokens = line.split()
        if tokens[0] == "Dr":
            # Si on avait déjà un enregistrement en cours, on le push
            if current is not None:
                records.append(current)

            # Nouveau record
            name_tokens = tokens[:]  # on va nettoyer nombre / pays à la fin
            number = None
            nation = None

            # Traiter numéro et nation éventuels sur la même ligne
            # Exemple : Dr ABBO ADJI Farida Yasmine 345 Gabon
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
            # Ligne complémentaire pour le record courant (numéro, nation ou suite du nom)
            if current is None:
                continue

            if len(tokens) == 1 and tokens[0].isdigit():
                current["number"] = tokens[0]
            elif len(tokens) == 1 and tokens[0] in {"Gabon", "ETRANGER"}:
                current["nation"] = tokens[0]
            else:
                # suite du nom
                current["name_tokens"].extend(tokens)

    # Dernier record
    if current is not None:
        records.append(current)

    return records


def build_username(full_name_tokens, seen):
    """
    Construit un pseudo du type :
    - 1ère lettre du NOM (premier token après 'Dr')
    - suivi du 1er prénom
    Le tout en minuscules, sans accents, sans espaces.
    Si doublon, on ajoute un suffixe numérique (aexemple, aexemple2, aexemple3, ...).
    """
    if not full_name_tokens:
        return ""

    # On retire 'Dr' si présent
    if full_name_tokens[0] == "Dr":
        tokens = full_name_tokens[1:]
    else:
        tokens = full_name_tokens[:]

    if not tokens:
        return ""

    # NOM = premier token, 1er prénom = second token si dispo
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

    # Gestion doublons
    seen[base] += 1
    return f"{base}{seen[base]}"


def generate_html(records):
    DEFAULT_PASSWORD = "admin123"

    rows = []
    seen = {}

    for rec in records:
        name_tokens = rec["name_tokens"]
        # Nettoyage du nom complet
        if name_tokens and name_tokens[0] == "Dr":
            display_name_tokens = name_tokens[1:]
        else:
            display_name_tokens = name_tokens[:]

        full_name = " ".join(display_name_tokens).strip()

        # Découper en "Nom" + "Prénom(s)" de manière simple :
        # - Nom = premier token
        # - Prénom(s) = le reste
        split_tokens = display_name_tokens
        if split_tokens:
            last_name = split_tokens[0]
            first_names = " ".join(split_tokens[1:]) if len(split_tokens) > 1 else ""
        else:
            last_name = ""
            first_names = ""

        username = build_username(name_tokens, seen)

        rows.append(
            f"<tr>"
            f"<td>{last_name}</td>"
            f"<td>{first_names}</td>"
            f"<td>{username}</td>"
            f"</tr>"
        )

    rows_html = "\n".join(rows)

    html = f"""<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <title>Comptes Pharmaciens ONPG</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>
    body {{
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      background: #f5f7fa;
      margin: 0;
      padding: 2rem 1rem;
    }}
    .container {{
      max-width: 1100px;
      margin: 0 auto;
      background: #ffffff;
      padding: 2rem 1.5rem;
      border-radius: 12px;
      box-shadow: 0 10px 35px rgba(15, 23, 42, 0.12);
    }}
    h1 {{
      font-size: 1.8rem;
      margin-top: 0;
      margin-bottom: 0.5rem;
      color: #002f6c;
    }}
    p.intro {{
      margin-top: 0;
      margin-bottom: 1rem;
      color: #4b5563;
    }}
    .note {{
      background: #ecfdf3;
      border-left: 4px solid #16a34a;
      padding: 0.75rem 1rem;
      border-radius: 0.5rem;
      margin-bottom: 1.5rem;
      font-size: 0.95rem;
      color: #14532d;
    }}
    table {{
      width: 100%;
      border-collapse: collapse;
      margin-top: 1rem;
      font-size: 0.92rem;
    }}
    thead {{
      background: #f3f4f6;
    }}
    th, td {{
      padding: 0.5rem 0.75rem;
      border: 1px solid #e5e7eb;
      text-align: left;
    }}
    th {{
      font-weight: 600;
      color: #111827;
      background: #f9fafb;
    }}
    tbody tr:nth-child(even) {{
      background: #f9fafb;
    }}
    code {{
      background: #f3f4f6;
      padding: 0.15rem 0.35rem;
      border-radius: 0.25rem;
      font-size: 0.9rem;
    }}
  </style>
</head>
<body>
  <div class="container">
    <h1>Comptes Pharmaciens – ONPG</h1>
    <p class="intro">
      Tableau récapitulatif des comptes pharmaciens générés automatiquement à partir de la
      liste des inscrits.
    </p>
    <div class="note">
      <strong>Mot de passe initial pour tous les comptes&nbsp;:</strong>
      <code>{DEFAULT_PASSWORD}</code><br />
      À changer impérativement lors de la première connexion.
    </div>

    <table>
      <thead>
        <tr>
          <th>Nom</th>
          <th>Prénom(s)</th>
          <th>Pseudo (identifiant)</th>
        </tr>
      </thead>
      <tbody>
{rows_html}
      </tbody>
    </table>
  </div>
</body>
</html>
"""
    return html


def main():
    if not SOURCE_FILE.exists():
        raise SystemExit(f"Fichier source introuvable: {SOURCE_FILE}")

    lines = SOURCE_FILE.read_text(encoding="utf-8").splitlines()
    records = parse_pharmacists(lines)
    html = generate_html(records)
    OUTPUT_FILE.write_text(html, encoding="utf-8")
    # Message simple compatible avec la console Windows (sans emoji)
    print(f"HTML généré : {OUTPUT_FILE}")


if __name__ == "__main__":
    main()


