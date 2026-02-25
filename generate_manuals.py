from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from reportlab.lib.units import cm
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
LOGO_PATH = os.path.join(BASE_DIR, "public", "CIPS_logo_noir_HD_transparent.png")

def draw_cover(c, title, subtitle):
    width, height = A4
    c.setFillColorRGB(1, 1, 1)
    c.rect(0, 0, width, height, fill=1, stroke=0)

    # Bandeau vert en haut
    c.setFillColorRGB(0, 0.65, 0.32)  # vert ONPG #00A651
    c.rect(0, height - 3 * cm, width, 3 * cm, fill=1, stroke=0)

    # Logo
    if os.path.exists(LOGO_PATH):
        try:
            c.drawImage(
                LOGO_PATH,
                width / 2 - 2 * cm,
                height - 5 * cm,
                4 * cm,
                4 * cm,
                preserveAspectRatio=True,
                mask="auto",
            )
        except:
            pass

    c.setFillColor(colors.HexColor("#002F6C"))  # bleu ONPG
    c.setFont("Helvetica-Bold", 22)
    c.drawCentredString(width / 2, height / 2 + 1 * cm, title)

    c.setFont("Helvetica", 14)
    c.setFillColor(colors.black)
    c.drawCentredString(width / 2, height / 2 - 0.3 * cm, subtitle)

    c.setFont("Helvetica", 10)
    c.drawCentredString(
        width / 2,
        2 * cm,
        "Ordre National des Pharmaciens du Gabon – v1.0",
    )

    c.showPage()

def draw_section_title(c, text, y_start):
    width, height = A4
    c.setFont("Helvetica-Bold", 16)
    c.setFillColor(colors.HexColor("#002F6C"))
    c.drawString(2 * cm, y_start, text)
    c.setStrokeColor(colors.HexColor("#00A651"))
    c.setLineWidth(2)
    c.line(2 * cm, y_start - 0.2 * cm, width - 2 * cm, y_start - 0.2 * cm)
    return y_start - 0.5 * cm

def draw_subsection_title(c, text, y_start):
    width, height = A4
    c.setFont("Helvetica-Bold", 12)
    c.setFillColor(colors.HexColor("#00A651"))
    c.drawString(2 * cm, y_start, text)
    return y_start - 0.4 * cm

def draw_paragraph(c, text, y_start, font_size=10, max_width=None):
    width, height = A4
    if max_width is None:
        max_width = width - 4 * cm
    c.setFont("Helvetica", font_size)
    c.setFillColor(colors.black)
    
    y = y_start
    words = text.split(" ")
    current_line = ""
    
    for word in words:
        test_line = current_line + (" " if current_line else "") + word
        if c.stringWidth(test_line, "Helvetica", font_size) <= max_width:
            current_line = test_line
        else:
            if current_line:
                c.drawString(2 * cm, y, current_line)
                y -= 0.5 * cm
                if y < 3 * cm:
                    c.showPage()
                    y = height - 3 * cm
            current_line = word
    
    if current_line:
        c.drawString(2 * cm, y, current_line)
        y -= 0.5 * cm
    
    return y

def draw_bullet_list(c, items, y_start):
    y = y_start
    width, height = A4
    c.setFont("Helvetica", 10)
    c.setFillColor(colors.black)
    
    for item in items:
        if y < 3 * cm:
            c.showPage()
            y = height - 3 * cm
        c.drawString(2.5 * cm, y, "• " + item)
        y -= 0.5 * cm
    
    return y

def draw_screenshot_box(c, label, y_start):
    width, height = A4
    box_height = 7 * cm
    if y_start - box_height < 3 * cm:
        c.showPage()
        y_start = height - 3 * cm
    
    c.setStrokeColor(colors.HexColor("#00A651"))
    c.setLineWidth(1)
    c.rect(2 * cm, y_start - box_height, width - 4 * cm, box_height, stroke=1, fill=0)
    c.setFont("Helvetica-Oblique", 9)
    c.setFillColor(colors.HexColor("#555555"))
    c.drawString(2.2 * cm, y_start - 0.5 * cm, f"Capture d'ecran : {label}")
    return y_start - box_height - 1 * cm

def create_admin_manual():
    c = canvas.Canvas("manuel-espace-admin.pdf", pagesize=A4)
    width, height = A4

    # Page de garde
    draw_cover(
        c,
        "MANUEL D'UTILISATION – ESPACE ADMINISTRATEUR",
        "Gestion complete du site public, des pharmaciens et de la messagerie de l'Ordre",
    )

    # Sommaire
    y = height - 3 * cm
    c.setFont("Helvetica-Bold", 18)
    c.setFillColor(colors.HexColor("#002F6C"))
    c.drawString(2 * cm, y, "Sommaire")
    y -= 1 * cm
    
    c.setFont("Helvetica", 11)
    sommaire = [
        "1. Presentation generale de l'espace administrateur",
        "2. Connexion et securite d'acces",
        "3. Vue d'ensemble du tableau de bord",
        "4. Gestion des contenus (actualites, ressources, etc.)",
        "5. Gestion des pharmacies et des pharmaciens",
        "6. Messagerie de l'Ordre (messages recus et reponses)",
        "7. Parametres du site",
        "8. Bonnes pratiques et conseils d'exploitation",
        "9. Support et contacts",
    ]
    for item in sommaire:
        c.drawString(2.2 * cm, y, f"- {item}")
        y -= 0.6 * cm
    c.showPage()

    # 1. PRESENTATION GENERALE
    y = height - 3 * cm
    y = draw_section_title(c, "1. PRESENTATION GENERALE DE L'ESPACE ADMINISTRATEUR", y)
    y -= 0.5 * cm
    
    y = draw_paragraph(c, 
        "L'espace administrateur est l'interface de gestion centrale du site web de l'Ordre National des "
        "Pharmaciens du Gabon. Il permet aux personnes autorisees (membres du Conseil, secretariat, "
        "equipe communication) de gerer l'ensemble des contenus publics, des pharmacies, des comptes "
        "pharmaciens et des messages recus par l'Ordre.",
        y, font_size=11
    )
    y -= 0.3 * cm
    
    y = draw_subsection_title(c, "1.1. Objectifs de l'espace administrateur", y)
    y -= 0.3 * cm
    
    y = draw_paragraph(c,
        "L'espace administrateur a pour objectif principal de permettre a l'Ordre de maintenir et de "
        "faire evoluer son site web de maniere autonome, sans dependre d'un prestataire externe pour "
        "chaque modification. Il offre les fonctionnalites suivantes :",
        y
    )
    y -= 0.3 * cm
    
    items = [
        "Publication et mise a jour des actualites, communiques, articles, decisions, lois, decrets, etc.",
        "Gestion des pharmacies et de leurs informations visibles par le public",
        "Creation et administration des comptes pharmaciens",
        "Reception et traitement des messages envoyes par les visiteurs du site et par les pharmaciens",
        "Configuration des parametres generaux du site (photos d'accueil, etc.)",
        "Suivi des statistiques et de l'activite du site"
    ]
    y = draw_bullet_list(c, items, y)
    y -= 0.5 * cm
    
    y = draw_subsection_title(c, "1.2. Public vise", y)
    y -= 0.3 * cm
    
    y = draw_paragraph(c,
        "Ce manuel s'adresse aux personnes designees par l'Ordre pour administrer le site web. Il est "
        "recommandé de limiter le nombre de comptes administrateurs et de s'assurer que chaque "
        "utilisateur a bien lu et compris ce manuel avant de commencer a utiliser l'interface.",
        y
    )
    y -= 0.5 * cm
    
    y = draw_screenshot_box(c, "Page de connexion a l'espace administrateur", y)
    c.showPage()

    # 2. CONNEXION ET SECURITE
    y = height - 3 * cm
    y = draw_section_title(c, "2. CONNEXION ET SECURITE D'ACCES", y)
    y -= 0.5 * cm
    
    y = draw_subsection_title(c, "2.1. Acceder a l'espace administrateur", y)
    y -= 0.3 * cm
    
    y = draw_paragraph(c,
        "Pour acceder a l'espace administrateur, vous devez vous rendre sur l'URL dediee. Cette URL "
        "peut etre differente selon que vous travaillez en local (developpement) ou sur le site en "
        "production. En general, l'URL ressemble a :",
        y
    )
    y -= 0.3 * cm
    
    c.setFont("Helvetica-Bold", 10)
    c.setFillColor(colors.HexColor("#00A651"))
    c.drawString(2.5 * cm, y, "https://onpg.ga/admin")
    y -= 0.5 * cm
    
    c.setFont("Helvetica", 10)
    c.setFillColor(colors.black)
    y = draw_paragraph(c,
        "ou, en local :",
        y
    )
    y -= 0.3 * cm
    
    c.setFont("Helvetica-Bold", 10)
    c.setFillColor(colors.HexColor("#00A651"))
    c.drawString(2.5 * cm, y, "http://localhost:5173/admin")
    y -= 0.8 * cm
    
    c.setFont("Helvetica", 10)
    c.setFillColor(colors.black)
    y = draw_subsection_title(c, "2.2. Formulaire de connexion", y)
    y -= 0.3 * cm
    
    y = draw_paragraph(c,
        "Une fois sur la page de connexion, vous devez renseigner deux champs obligatoires :",
        y
    )
    y -= 0.3 * cm
    
    items = [
        "Nom d'utilisateur : identifiant unique qui vous a ete attribue par l'Ordre",
        "Mot de passe : mot de passe personnel et confidentiel"
    ]
    y = draw_bullet_list(c, items, y)
    y -= 0.5 * cm
    
    y = draw_paragraph(c,
        "Apres avoir saisi ces informations, cliquez sur le bouton de connexion. Si les identifiants "
        "sont corrects, vous serez redirige vers le tableau de bord de l'espace administrateur. "
        "Dans le cas contraire, un message d'erreur s'affichera.",
        y
    )
    y -= 0.5 * cm
    
    y = draw_subsection_title(c, "2.3. Bonnes pratiques de securite", y)
    y -= 0.3 * cm
    
    y = draw_paragraph(c,
        "La securite de l'espace administrateur est primordiale. Voici les regles a respecter :",
        y
    )
    y -= 0.3 * cm
    
    items = [
        "Ne jamais partager votre identifiant et votre mot de passe avec une autre personne",
        "Choisir un mot de passe suffisamment long (minimum 8 caracteres recommande) et complexe",
        "Ne pas utiliser le meme mot de passe que pour d'autres services",
        "Changer regulierement votre mot de passe (tous les 3 a 6 mois)",
        "Toujours vous deconnecter apres chaque session, surtout sur un poste partage",
        "Ne pas laisser votre session ouverte sur un ordinateur non surveille"
    ]
    y = draw_bullet_list(c, items, y)
    y -= 0.5 * cm
    
    y = draw_subsection_title(c, "2.4. Problemes de connexion", y)
    y -= 0.3 * cm
    
    y = draw_paragraph(c,
        "Si vous rencontrez des difficultes pour vous connecter, verifiez d'abord que vous avez bien "
        "saisi votre nom d'utilisateur et votre mot de passe (attention aux majuscules/minuscules). "
        "Si le probleme persiste, contactez le support technique de l'Ordre qui pourra verifier votre "
        "compte et, si necessaire, reinitialiser votre mot de passe selon la procedure interne definie.",
        y
    )
    y -= 0.5 * cm
    
    y = draw_screenshot_box(c, "Ecran de connexion admin (champ login / mot de passe)", y)
    c.showPage()

    # 3. TABLEAU DE BORD
    y = height - 3 * cm
    y = draw_section_title(c, "3. VUE D'ENSEMBLE DU TABLEAU DE BORD", y)
    y -= 0.5 * cm
    
    y = draw_subsection_title(c, "3.1. Structure generale", y)
    y -= 0.3 * cm
    
    y = draw_paragraph(c,
        "Le tableau de bord est la premiere page que vous voyez apres vous etre connecte. Il se compose "
        "de plusieurs elements principaux :",
        y
    )
    y -= 0.3 * cm
    
    items = [
        "Menu lateral gauche : navigation principale vers toutes les rubriques de gestion",
        "Zone centrale : cartes de statistiques et indicateurs cles",
        "En-tete : informations sur votre compte et bouton de deconnexion"
    ]
    y = draw_bullet_list(c, items, y)
    y -= 0.5 * cm
    
    y = draw_subsection_title(c, "3.2. Menu lateral", y)
    y -= 0.3 * cm
    
    y = draw_paragraph(c,
        "Le menu lateral gauche contient les principales rubriques de l'espace administrateur. Voici "
        "les principales sections disponibles :",
        y
    )
    y -= 0.3 * cm
    
    items = [
        "Tableau de bord : retour a la page d'accueil de l'espace admin",
        "Ressources : gestion des actualites, articles, communiques, decisions, lois, decrets, etc.",
        "Pharmacies : liste et gestion de toutes les pharmacies",
        "Pharmaciens : creation et gestion des comptes pharmaciens",
        "Formations : gestion des formations continues",
        "Deontologie : gestion des contenus deontologiques",
        "Messagerie : reception et traitement des messages recus",
        "Parametres : configuration generale du site",
        "Analytics : statistiques et analyses du site (si active)"
    ]
    y = draw_bullet_list(c, items, y)
    y -= 0.5 * cm
    
    y = draw_subsection_title(c, "3.3. Cartes de statistiques", y)
    y -= 0.3 * cm
    
    y = draw_paragraph(c,
        "Le tableau de bord affiche des cartes de statistiques qui donnent un apercu rapide de l'activite "
        "du site : nombre total d'actualites publiees, nombre de pharmacies, nombre de messages recus, etc. "
        "Ces indicateurs sont mis a jour en temps reel et permettent d'avoir une vision synthetique de "
        "l'etat du site.",
        y
    )
    y -= 0.5 * cm
    
    y = draw_screenshot_box(c, "Tableau de bord admin avec statistiques et menu lateral", y)
    c.showPage()

    # 4. GESTION DES CONTENUS
    y = height - 3 * cm
    y = draw_section_title(c, "4. GESTION DES CONTENUS (ACTUALITES, RESSOURCES, ETC.)", y)
    y -= 0.5 * cm
    
    y = draw_subsection_title(c, "4.1. Principe general", y)
    y -= 0.3 * cm
    
    y = draw_paragraph(c,
        "L'espace administrateur permet de gerer tous les contenus publies sur le site web de l'Ordre. "
        "Chaque type de contenu (actualites, communiques, articles, decisions, lois, decrets, commissions, "
        "theses, photos, videos, etc.) correspond a une collection distincte dans le systeme. Vous pouvez "
        "creer, modifier, activer, desactiver ou supprimer n'importe quel contenu depuis l'interface "
        "administrateur.",
        y
    )
    y -= 0.5 * cm
    
    y = draw_subsection_title(c, "4.2. Acceder a la liste des contenus", y)
    y -= 0.3 * cm
    
    y = draw_paragraph(c,
        "Pour acceder a la liste des contenus d'un type donne, cliquez sur la rubrique correspondante "
        "dans le menu lateral. Par exemple, pour voir toutes les actualites, cliquez sur 'Ressources' puis "
        "'Actualites' (ou directement sur 'Actualites' selon l'organisation du menu). La liste s'affiche "
        "sous forme de tableau ou de cartes, avec les informations principales de chaque contenu : titre, "
        "date de publication, statut (actif/inactif), etc.",
        y
    )
    y -= 0.5 * cm
    
    y = draw_subsection_title(c, "4.3. Creer un nouveau contenu", y)
    y -= 0.3 * cm
    
    y = draw_paragraph(c,
        "Pour creer un nouveau contenu, cliquez sur le bouton 'Nouveau', 'Ajouter' ou 'Creer' present en "
        "haut de la liste. Un formulaire s'ouvre avec tous les champs a renseigner. Les champs principaux "
        "sont generalement :",
        y
    )
    y -= 0.3 * cm
    
    items = [
        "Titre : titre principal du contenu (obligatoire)",
        "Resume ou extrait : texte court qui apparaitra dans les listes et apercus",
        "Contenu : texte complet de l'article, communique, decision, etc.",
        "Image : image principale associee au contenu (optionnel mais recommande)",
        "Date de publication : date a laquelle le contenu a ete publie ou doit etre publie",
        "Categorie : categorie du contenu (si applicable)",
        "Statut : actif (visible sur le site public) ou inactif (cache mais conserve dans la base)",
        "Auteur : nom de l'auteur ou de la personne qui a redige le contenu"
    ]
    y = draw_bullet_list(c, items, y)
    y -= 0.5 * cm
    
    y = draw_paragraph(c,
        "Une fois tous les champs remplis, cliquez sur 'Enregistrer' ou 'Publier' pour sauvegarder le "
        "contenu. Si le statut est 'actif', le contenu apparaitra immediatement sur le site public dans "
        "la section correspondante.",
        y
    )
    y -= 0.5 * cm
    
    y = draw_subsection_title(c, "4.4. Modifier un contenu existant", y)
    y -= 0.3 * cm
    
    y = draw_paragraph(c,
        "Pour modifier un contenu existant, cliquez sur le contenu dans la liste (ou sur le bouton "
        "'Modifier' / 'Editer'). Le formulaire s'ouvre avec les informations actuelles pre-remplies. "
        "Modifiez les champs souhaites, puis cliquez sur 'Enregistrer' pour appliquer les modifications. "
        "Les changements sont immediatement visibles sur le site public si le contenu est actif.",
        y
    )
    y -= 0.5 * cm
    
    y = draw_subsection_title(c, "4.5. Supprimer un contenu", y)
    y -= 0.3 * cm
    
    y = draw_paragraph(c,
        "La suppression d'un contenu est une action irreversible. Avant de supprimer, assurez-vous que "
        "c'est bien ce que vous souhaitez faire. Pour supprimer, cliquez sur le bouton 'Supprimer' "
        "associe au contenu. Un message de confirmation peut apparaitre pour eviter les suppressions "
        "accidentelles. Une fois supprime, le contenu disparait du site public et de la base de donnees.",
        y
    )
    y -= 0.5 * cm
    
    y = draw_subsection_title(c, "4.6. Activer ou desactiver un contenu", y)
    y -= 0.3 * cm
    
    y = draw_paragraph(c,
        "Plutot que de supprimer definitivement un contenu, vous pouvez le desactiver. Un contenu "
        "desactive reste dans la base de donnees mais n'est plus visible sur le site public. Cela permet "
        "de le reactiver ulterieurement si besoin. Pour changer le statut, modifiez le contenu et changez "
        "le champ 'Statut' de 'actif' a 'inactif' (ou vice versa).",
        y
    )
    y -= 0.5 * cm
    
    y = draw_screenshot_box(c, "Liste des actualites / articles dans l'interface admin", y)
    c.showPage()
    y = height - 3 * cm
    y = draw_screenshot_box(c, "Formulaire de creation / modification d'un article", y)
    c.showPage()

    # 5. PHARMACIES ET PHARMACIENS
    y = height - 3 * cm
    y = draw_section_title(c, "5. GESTION DES PHARMACIES ET DES PHARMACIENS", y)
    y -= 0.5 * cm
    
    y = draw_subsection_title(c, "5.1. Vue d'ensemble", y)
    y -= 0.3 * cm
    
    y = draw_paragraph(c,
        "L'espace administrateur permet de gerer deux elements distincts mais lies : les pharmacies "
        "(les etablissements) et les pharmaciens (les comptes utilisateurs individuels). Il est important "
        "de comprendre la difference : une pharmacie est un etablissement physique, tandis qu'un pharmacien "
        "est une personne qui peut gerer une ou plusieurs pharmacies via son compte.",
        y
    )
    y -= 0.5 * cm
    
    y = draw_subsection_title(c, "5.2. Gestion des pharmacies", y)
    y -= 0.3 * cm
    
    y = draw_paragraph(c,
        "La rubrique 'Pharmacies' affiche la liste complete de toutes les pharmacies connues de l'Ordre. "
        "Pour chaque pharmacie, vous pouvez voir et modifier :",
        y
    )
    y -= 0.3 * cm
    
    items = [
        "Nom de la pharmacie",
        "Ville et quartier",
        "Adresse complete",
        "Coordonnees (telephone, email)",
        "Horaires d'ouverture",
        "Service de garde (oui/non)",
        "Photo de la pharmacie",
        "Localisation geographique (latitude, longitude) si disponible",
        "Pharmacien associe (lien vers le compte pharmacien)"
    ]
    y = draw_bullet_list(c, items, y)
    y -= 0.5 * cm
    
    y = draw_paragraph(c,
        "Pour associer une pharmacie a un pharmacien, modifiez la pharmacie et selectionnez le pharmacien "
        "dans le champ dedie. Une fois associee, le pharmacien pourra mettre a jour les informations de "
        "sa pharmacie depuis son propre espace pharmacien.",
        y
    )
    y -= 0.5 * cm
    
    y = draw_subsection_title(c, "5.3. Gestion des comptes pharmaciens", y)
    y -= 0.3 * cm
    
    y = draw_paragraph(c,
        "La rubrique 'Pharmaciens' permet de creer et gerer les comptes individuels des pharmaciens. "
        "Chaque compte pharmacien donne acces a l'espace pharmacien dedie. Pour creer un nouveau compte, "
        "cliquez sur 'Nouveau pharmacien' et renseignez :",
        y
    )
    y -= 0.3 * cm
    
    items = [
        "Nom d'utilisateur (identifiant unique)",
        "Mot de passe (a communiquer securise au pharmacien)",
        "Email",
        "Telephone",
        "Role : 'pharmacien' (obligatoire pour l'acces a l'espace pharmacien)",
        "Statut : actif (le compte peut se connecter) ou inactif (le compte est desactive)"
    ]
    y = draw_bullet_list(c, items, y)
    y -= 0.5 * cm
    
    y = draw_paragraph(c,
        "Un pharmacien actif peut se connecter a son espace, mettre a jour sa pharmacie, deposer des "
        "theses, envoyer des messages a l'Ordre, etc. Un pharmacien inactif ne peut pas se connecter, "
        "mais son compte et ses donnees sont conserves dans le systeme.",
        y
    )
    y -= 0.5 * cm
    
    y = draw_screenshot_box(c, "Liste des pharmacies (admin)", y)
    c.showPage()
    y = height - 3 * cm
    y = draw_screenshot_box(c, "Liste des pharmaciens (admin)", y)
    c.showPage()
    y = height - 3 * cm
    y = draw_screenshot_box(c, "Formulaire d'edition d'une pharmacie", y)
    c.showPage()

    # 6. MESSAGERIE
    y = height - 3 * cm
    y = draw_section_title(c, "6. MESSAGERIE DE L'ORDRE (MESSAGES RECUS ET REPONSES)", y)
    y -= 0.5 * cm
    
    y = draw_subsection_title(c, "6.1. Types de messages recus", y)
    y -= 0.3 * cm
    
    y = draw_paragraph(c,
        "La messagerie de l'Ordre centralise tous les messages recus via le site web. Il existe deux "
        "types de messages :",
        y
    )
    y -= 0.3 * cm
    
    items = [
        "Messages du site public : envoyes par des visiteurs anonymes via le formulaire de contact du site",
        "Messages des pharmaciens : envoyes par des pharmaciens connectes depuis leur espace pharmacien"
    ]
    y = draw_bullet_list(c, items, y)
    y -= 0.5 * cm
    
    y = draw_paragraph(c,
        "Tous ces messages apparaissent dans la meme interface de messagerie, avec un badge indiquant "
        "leur provenance ('Public' ou 'Pharmacien').",
        y
    )
    y -= 0.5 * cm
    
    y = draw_subsection_title(c, "6.2. Interface de messagerie", y)
    y -= 0.3 * cm
    
    y = draw_paragraph(c,
        "L'interface de messagerie est divisee en deux colonnes principales :",
        y
    )
    y -= 0.3 * cm
    
    items = [
        "Colonne de gauche : liste de tous les messages recus, avec des filtres (Tous, Non lus, Archives)",
        "Colonne de droite : detail du message selectionne, avec toutes les informations et les actions possibles"
    ]
    y = draw_bullet_list(c, items, y)
    y -= 0.5 * cm
    
    y = draw_subsection_title(c, "6.3. Liste des messages", y)
    y -= 0.3 * cm
    
    y = draw_paragraph(c,
        "Dans la colonne de gauche, chaque message affiche :",
        y
    )
    y -= 0.3 * cm
    
    items = [
        "Nom de l'expediteur",
        "Date d'envoi",
        "Sujet du message",
        "Badge indiquant la source (Public ou Pharmacien)",
        "Point vert si le message est nouveau (non lu)"
    ]
    y = draw_bullet_list(c, items, y)
    y -= 0.5 * cm
    
    y = draw_paragraph(c,
        "Vous pouvez filtrer les messages en cliquant sur les boutons 'Tous', 'Non lus' ou 'Archives' en "
        "haut de la liste. Vous pouvez egalement rechercher un message en utilisant la barre de recherche "
        "qui permet de filtrer par nom, email, sujet ou contenu.",
        y
    )
    y -= 0.5 * cm
    
    y = draw_subsection_title(c, "6.4. Detail d'un message", y)
    y -= 0.3 * cm
    
    y = draw_paragraph(c,
        "En cliquant sur un message dans la liste, le detail s'affiche dans la colonne de droite. Vous "
        "y trouverez :",
        y
    )
    y -= 0.3 * cm
    
    items = [
        "Sujet du message",
        "Nom complet de l'expediteur",
        "Email de l'expediteur",
        "Telephone (si renseigne)",
        "Date et heure d'envoi",
        "Contenu complet du message",
        "Badge indiquant la provenance (Public ou Pharmacien)"
    ]
    y = draw_bullet_list(c, items, y)
    y -= 0.5 * cm
    
    y = draw_paragraph(c,
        "Lorsque vous ouvrez un message pour la premiere fois, il est automatiquement marque comme 'lu'. "
        "Vous pouvez egalement le marquer manuellement comme 'archive' pour le retirer de la vue principale "
        "tout en le conservant dans le systeme.",
        y
    )
    y -= 0.5 * cm
    
    y = draw_subsection_title(c, "6.5. Repondre a un message", y)
    y -= 0.3 * cm
    
    y = draw_paragraph(c,
        "L'Ordre peut repondre uniquement aux messages envoyes par des pharmaciens connectes. Pour les "
        "messages du site public (visiteurs anonymes), aucune reponse n'est possible depuis l'interface, "
        "car l'Ordre n'a pas acces direct aux coordonnees des visiteurs via le site.",
        y
    )
    y -= 0.5 * cm
    
    y = draw_paragraph(c,
        "Pour repondre a un pharmacien :",
        y
    )
    y -= 0.3 * cm
    
    items = [
        "Selectionnez le message du pharmacien dans la liste",
        "Dans le panneau de droite, une zone de texte 'Repondre a ce pharmacien' apparait",
        "Saisissez votre reponse dans cette zone",
        "Cliquez sur 'Envoyer la reponse'",
        "La reponse est enregistree et le pharmacien pourra la voir dans son propre espace pharmacien"
    ]
    y = draw_bullet_list(c, items, y)
    y -= 0.5 * cm
    
    y = draw_paragraph(c,
        "Une fois qu'une reponse a ete envoyee, elle s'affiche dans le detail du message avec la date "
        "d'envoi. L'historique complet de l'echange est conserve dans le systeme.",
        y
    )
    y -= 0.5 * cm
    
    y = draw_screenshot_box(c, "Vue de la messagerie admin (liste + detail d'un message)", y)
    c.showPage()
    y = height - 3 * cm
    y = draw_screenshot_box(c, "Exemple de message public (sans zone de reponse)", y)
    c.showPage()
    y = height - 3 * cm
    y = draw_screenshot_box(c, "Exemple de message pharmacien (avec zone de reponse remplie)", y)
    c.showPage()

    # 7. PARAMETRES
    y = height - 3 * cm
    y = draw_section_title(c, "7. PARAMETRES DU SITE", y)
    y -= 0.5 * cm
    
    y = draw_subsection_title(c, "7.1. Photos d'accueil", y)
    y -= 0.3 * cm
    
    y = draw_paragraph(c,
        "La section 'Parametres du site' permet de gerer les elements visuels principaux du site public, "
        "notamment les photos d'accueil :",
        y
    )
    y -= 0.3 * cm
    
    items = [
        "Photo de la Presidente : image qui apparait dans la section 'Message de la Presidente' sur la page d'accueil",
        "Image hero : image principale de la banniere d'accueil du site"
    ]
    y = draw_bullet_list(c, items, y)
    y -= 0.5 * cm
    
    y = draw_paragraph(c,
        "Pour modifier une photo, cliquez sur 'Parametres' dans le menu, puis uploadez la nouvelle image "
        "en remplacant l'ancienne. Les images doivent etre de bonne qualite et aux formats standards "
        "(JPG, PNG). Apres enregistrement, les modifications sont immediatement visibles sur le site public.",
        y
    )
    y -= 0.5 * cm
    
    y = draw_subsection_title(c, "7.2. Autres parametres", y)
    y -= 0.3 * cm
    
    y = draw_paragraph(c,
        "D'autres parametres peuvent etre disponibles selon les fonctionnalites implementees dans le site. "
        "Consultez l'interface des parametres pour voir toutes les options disponibles. Il est recommande "
        "de ne modifier que les parametres que vous comprenez bien, et de consulter un responsable en cas "
        "de doute.",
        y
    )
    y -= 0.5 * cm
    
    y = draw_screenshot_box(c, "Ecran des parametres du site (photos d'accueil, etc.)", y)
    c.showPage()

    # 8. BONNES PRATIQUES
    y = height - 3 * cm
    y = draw_section_title(c, "8. BONNES PRATIQUES ET CONSEILS D'EXPLOITATION", y)
    y -= 0.5 * cm
    
    y = draw_subsection_title(c, "8.1. Gestion des contenus", y)
    y -= 0.3 * cm
    
    items = [
        "Mettre a jour regulierement les actualites et informations importantes pour maintenir le site a jour",
        "Relire systematiquement les contenus avant publication pour eviter les erreurs",
        "Utiliser des images de bonne qualite et aux bonnes dimensions pour un rendu optimal",
        "Ne pas supprimer une information sans en mesurer l'impact sur le public (preferer la desactivation)",
        "Respecter les droits d'auteur et les regles de publication pour les images et textes"
    ]
    y = draw_bullet_list(c, items, y)
    y -= 0.5 * cm
    
    y = draw_subsection_title(c, "8.2. Securite et acces", y)
    y -= 0.3 * cm
    
    items = [
        "Limiter le nombre de comptes administrateurs aux personnes reellement necessaires",
        "Ne jamais partager ses identifiants avec un tiers, meme temporairement",
        "Changer regulierement les mots de passe (tous les 3 a 6 mois)",
        "Toujours se deconnecter apres chaque session, surtout sur un poste partage",
        "Signaler immediatement toute activite suspecte ou acces non autorise"
    ]
    y = draw_bullet_list(c, items, y)
    y -= 0.5 * cm
    
    y = draw_subsection_title(c, "8.3. Traitement des messages", y)
    y -= 0.3 * cm
    
    items = [
        "Consulter regulierement la messagerie pour repondre aux demandes dans les delais raisonnables",
        "Repondre de maniere professionnelle et courtoise aux pharmaciens",
        "Archiver les messages traites pour garder une vue claire des nouveaux messages",
        "Ne pas supprimer les messages, meme anciens, car ils constituent un historique important"
    ]
    y = draw_bullet_list(c, items, y)
    y -= 0.5 * cm
    
    y = draw_subsection_title(c, "8.4. Maintenance et sauvegarde", y)
    y -= 0.3 * cm
    
    y = draw_paragraph(c,
        "Bien que le systeme effectue des sauvegardes automatiques, il est recommande de :",
        y
    )
    y -= 0.3 * cm
    
    items = [
        "Verifier regulierement que le site fonctionne correctement",
        "Tester les nouvelles fonctionnalites avant de les rendre publiques",
        "Conserver une trace des modifications importantes effectuees",
        "Documenter les procedures specifiques a l'Ordre pour faciliter la transmission des connaissances"
    ]
    y = draw_bullet_list(c, items, y)
    c.showPage()

    # 9. SUPPORT
    y = height - 3 * cm
    y = draw_section_title(c, "9. SUPPORT ET CONTACTS", y)
    y -= 0.5 * cm
    
    y = draw_subsection_title(c, "9.1. Support technique", y)
    y -= 0.3 * cm
    
    y = draw_paragraph(c,
        "Pour toute question technique concernant l'utilisation de l'espace administrateur (probleme de "
        "connexion, anomalie d'affichage, fonctionnalite qui ne fonctionne pas, etc.), veuillez contacter "
        "le support technique designe par l'Ordre. Indiquez clairement le probleme rencontre, les etapes "
        "pour le reproduire, et toute information utile (navigateur utilise, message d'erreur, etc.).",
        y
    )
    y -= 0.5 * cm
    
    y = draw_subsection_title(c, "9.2. Support contenu", y)
    y -= 0.3 * cm
    
    y = draw_paragraph(c,
        "Pour toute question concernant le contenu a publier (texte a rediger, actualite a mettre en avant, "
        "decision editoriale, etc.), contactez la personne ou le service charge de la communication de "
        "l'Ordre.",
        y
    )
    y -= 0.5 * cm
    
    y = draw_subsection_title(c, "9.3. Mise a jour du manuel", y)
    y -= 0.3 * cm
    
    y = draw_paragraph(c,
        "Ce manuel peut etre mis a jour regulierement pour refleter les evolutions de l'interface et les "
        "nouvelles fonctionnalites. Consultez la version la plus recente disponible pour vous assurer "
        "d'avoir les informations a jour.",
        y
    )
    c.showPage()

    c.save()

def create_pharmacien_manual():
    c = canvas.Canvas("manuel-espace-pharmacien.pdf", pagesize=A4)
    width, height = A4

    # Page de garde
    draw_cover(
        c,
        "MANUEL D'UTILISATION – ESPACE PHARMACIEN",
        "Tableau de bord, gestion de la pharmacie, theses et messagerie avec l'Ordre",
    )

    # Sommaire
    y = height - 3 * cm
    c.setFont("Helvetica-Bold", 18)
    c.setFillColor(colors.HexColor("#002F6C"))
    c.drawString(2 * cm, y, "Sommaire")
    y -= 1 * cm
    
    c.setFont("Helvetica", 11)
    sommaire = [
        "1. Presentation de l'espace pharmacien",
        "2. Connexion a l'espace pharmacien",
        "3. Tableau de bord",
        "4. Gestion de la pharmacie",
        "5. Gestion des theses",
        "6. Messagerie avec l'Ordre",
        "7. Mise a jour du profil et du mot de passe",
        "8. Bonnes pratiques",
        "9. Contacts utiles",
    ]
    for item in sommaire:
        c.drawString(2.2 * cm, y, f"- {item}")
        y -= 0.6 * cm
    c.showPage()

    # 1. PRESENTATION
    y = height - 3 * cm
    y = draw_section_title(c, "1. PRESENTATION DE L'ESPACE PHARMACIEN", y)
    y -= 0.5 * cm
    
    y = draw_subsection_title(c, "1.1. Qu'est-ce que l'espace pharmacien ?", y)
    y -= 0.3 * cm
    
    y = draw_paragraph(c,
        "L'espace pharmacien est un espace securise reserve aux pharmaciens inscrits au Tableau de "
        "l'Ordre National des Pharmaciens du Gabon. Il permet a chaque pharmacien de gerer de maniere "
        "autonome les informations de sa pharmacie visibles par le public, de deposer ses theses, et "
        "d'echanger des messages officiels avec l'Ordre.",
        y, font_size=11
    )
    y -= 0.5 * cm
    
    y = draw_subsection_title(c, "1.2. Fonctionnalites principales", y)
    y -= 0.3 * cm
    
    y = draw_paragraph(c,
        "L'espace pharmacien offre les fonctionnalites suivantes :",
        y
    )
    y -= 0.3 * cm
    
    items = [
        "Gestion de la pharmacie : mise a jour des informations (adresse, horaires, coordonnees, etc.)",
        "Depot de theses : enregistrement de vos travaux (theses, memoires, publications)",
        "Messagerie avec l'Ordre : envoi de messages officiels et reception des reponses",
        "Gestion du profil : mise a jour de vos informations personnelles et de votre mot de passe"
    ]
    y = draw_bullet_list(c, items, y)
    y -= 0.5 * cm
    
    y = draw_subsection_title(c, "1.3. Conditions d'acces", y)
    y -= 0.3 * cm
    
    y = draw_paragraph(c,
        "Pour acceder a l'espace pharmacien, vous devez :",
        y
    )
    y -= 0.3 * cm
    
    items = [
        "Etre inscrit au Tableau de l'Ordre National des Pharmaciens du Gabon",
        "Avoir un compte pharmacien cree et active par l'Ordre",
        "Disposer de vos identifiants de connexion (nom d'utilisateur et mot de passe)"
    ]
    y = draw_bullet_list(c, items, y)
    y -= 0.5 * cm
    
    y = draw_paragraph(c,
        "Si vous ne disposez pas encore d'un compte, contactez l'Ordre pour en faire la demande. "
        "L'Ordre creera votre compte et vous communiquera vos identifiants de maniere securisee.",
        y
    )
    y -= 0.5 * cm
    
    y = draw_screenshot_box(c, "Tableau de bord de l'espace pharmacien", y)
    c.showPage()

    # 2. CONNEXION
    y = height - 3 * cm
    y = draw_section_title(c, "2. CONNEXION A L'ESPACE PHARMACIEN", y)
    y -= 0.5 * cm
    
    y = draw_subsection_title(c, "2.1. Acceder a l'espace pharmacien", y)
    y -= 0.3 * cm
    
    y = draw_paragraph(c,
        "Pour acceder a votre espace pharmacien, vous pouvez utiliser le lien dedie depuis le site web "
        "de l'Ordre ou acceder directement a l'URL de connexion. L'URL generale ressemble a :",
        y
    )
    y -= 0.3 * cm
    
    c.setFont("Helvetica-Bold", 10)
    c.setFillColor(colors.HexColor("#00A651"))
    c.drawString(2.5 * cm, y, "https://onpg.ga/pharmacien/dashboard")
    y -= 0.8 * cm
    
    c.setFont("Helvetica", 10)
    c.setFillColor(colors.black)
    y = draw_subsection_title(c, "2.2. Formulaire de connexion", y)
    y -= 0.3 * cm
    
    y = draw_paragraph(c,
        "Sur la page de connexion, vous devez renseigner deux champs obligatoires :",
        y
    )
    y -= 0.3 * cm
    
    items = [
        "Nom d'utilisateur : identifiant unique qui vous a ete communique par l'Ordre",
        "Mot de passe : mot de passe personnel et confidentiel"
    ]
    y = draw_bullet_list(c, items, y)
    y -= 0.5 * cm
    
    y = draw_paragraph(c,
        "Apres avoir saisi ces informations, cliquez sur le bouton de connexion. Si vos identifiants "
        "sont corrects, vous serez redirige vers votre tableau de bord. Dans le cas contraire, un "
        "message d'erreur s'affichera.",
        y
    )
    y -= 0.5 * cm
    
    y = draw_subsection_title(c, "2.3. Problemes de connexion", y)
    y -= 0.3 * cm
    
    y = draw_paragraph(c,
        "Si vous rencontrez des difficultes pour vous connecter, verifiez d'abord que vous avez bien "
        "saisi votre nom d'utilisateur et votre mot de passe (attention aux majuscules/minuscules et "
        "aux caracteres speciaux). Si le probleme persiste, contactez directement l'Ordre qui pourra "
        "verifier votre compte et, si necessaire, reinitialiser votre mot de passe selon la procedure "
        "interne definie.",
        y
    )
    y -= 0.5 * cm
    
    y = draw_screenshot_box(c, "Ecran de connexion a l'espace pharmacien", y)
    c.showPage()

    # 3. TABLEAU DE BORD
    y = height - 3 * cm
    y = draw_section_title(c, "3. TABLEAU DE BORD", y)
    y -= 0.5 * cm
    
    y = draw_subsection_title(c, "3.1. Vue d'ensemble", y)
    y -= 0.3 * cm
    
    y = draw_paragraph(c,
        "Le tableau de bord est la premiere page que vous voyez apres vous etre connecte. Il presente "
        "un resume de votre activite dans l'espace pharmacien :",
        y
    )
    y -= 0.3 * cm
    
    items = [
        "Nombre de pharmacies que vous gerez",
        "Nombre de theses que vous avez deposees",
        "Nombre de messages echanges avec l'Ordre"
    ]
    y = draw_bullet_list(c, items, y)
    y -= 0.5 * cm
    
    y = draw_subsection_title(c, "3.2. Menu de navigation", y)
    y -= 0.3 * cm
    
    y = draw_paragraph(c,
        "Le menu lateral gauche (ou en haut selon l'interface) vous permet d'acceder aux differentes "
        "rubriques de votre espace :",
        y
    )
    y -= 0.3 * cm
    
    items = [
        "Tableau de bord : retour a la page d'accueil de votre espace",
        "Pharmacies : gestion de vos pharmacies",
        "Theses : depot et gestion de vos theses",
        "Messages : messagerie avec l'Ordre",
        "Profil : modification de vos informations personnelles et de votre mot de passe"
    ]
    y = draw_bullet_list(c, items, y)
    y -= 0.5 * cm
    
    y = draw_screenshot_box(c, "Vue globale du tableau de bord pharmacien", y)
    c.showPage()

    # 4. GESTION DE LA PHARMACIE
    y = height - 3 * cm
    y = draw_section_title(c, "4. GESTION DE LA PHARMACIE", y)
    y -= 0.5 * cm
    
    y = draw_subsection_title(c, "4.1. Voir vos pharmacies", y)
    y -= 0.3 * cm
    
    y = draw_paragraph(c,
        "Depuis la rubrique 'Pharmacies', vous pouvez voir la liste de toutes les pharmacies qui vous "
        "sont rattachees. Chaque pharmacie affiche ses informations principales : nom, ville, quartier, "
        "adresse, telephone, etc. Cliquez sur une pharmacie pour voir ses details complets et pouvoir "
        "la modifier.",
        y
    )
    y -= 0.5 * cm
    
    y = draw_subsection_title(c, "4.2. Modifier les informations de votre pharmacie", y)
    y -= 0.3 * cm
    
    y = draw_paragraph(c,
        "Pour modifier les informations de votre pharmacie, cliquez sur la pharmacie dans la liste, "
        "puis sur le bouton 'Modifier' ou 'Editer'. Un formulaire s'ouvre avec tous les champs modifiables. "
        "Vous pouvez mettre a jour :",
        y
    )
    y -= 0.3 * cm
    
    items = [
        "Nom de la pharmacie",
        "Ville et quartier",
        "Adresse complete",
        "Telephone et email",
        "Horaires d'ouverture (jour par jour, heures d'ouverture et de fermeture)",
        "Service de garde (oui/non)",
        "Photo de la pharmacie (upload d'une nouvelle image)",
        "Localisation geographique (latitude et longitude si vous les connaissez)"
    ]
    y = draw_bullet_list(c, items, y)
    y -= 0.5 * cm
    
    y = draw_paragraph(c,
        "Une fois les modifications effectuees, cliquez sur 'Enregistrer' pour sauvegarder. Les "
        "changements sont immediatement visibles sur le site public dans la section 'Trouver une "
        "pharmacie'.",
        y
    )
    y -= 0.5 * cm
    
    y = draw_subsection_title(c, "4.3. Creer une nouvelle pharmacie", y)
    y -= 0.3 * cm
    
    y = draw_paragraph(c,
        "Si vous gerez plusieurs pharmacies et qu'une nouvelle pharmacie doit etre ajoutee, vous pouvez "
        "cliquer sur le bouton 'Nouvelle pharmacie' ou 'Ajouter'. Remplissez tous les champs du formulaire "
        "(nom, adresse, coordonnees, etc.), puis enregistrez. La nouvelle pharmacie apparaitra dans votre "
        "liste et sur le site public une fois validee.",
        y
    )
    y -= 0.5 * cm
    
    y = draw_subsection_title(c, "4.4. Impact sur le site public", y)
    y -= 0.3 * cm
    
    y = draw_paragraph(c,
        "Toutes les informations que vous mettez a jour dans votre espace pharmacien concernant votre "
        "pharmacie sont automatiquement synchronisees avec le site public. Cela signifie que les "
        "visiteurs du site qui recherchent une pharmacie verront immediatement vos informations a jour : "
        "adresse, horaires, telephone, service de garde, etc. Il est donc important de maintenir ces "
        "informations a jour pour que le public puisse vous contacter facilement.",
        y
    )
    y -= 0.5 * cm
    
    y = draw_screenshot_box(c, "Liste des pharmacies rattachees au pharmacien", y)
    c.showPage()
    y = height - 3 * cm
    y = draw_screenshot_box(c, "Formulaire d'edition de la fiche pharmacie", y)
    c.showPage()

    # 5. THESES
    y = height - 3 * cm
    y = draw_section_title(c, "5. GESTION DES THESES", y)
    y -= 0.5 * cm
    
    y = draw_subsection_title(c, "5.1. Vue d'ensemble", y)
    y -= 0.3 * cm
    
    y = draw_paragraph(c,
        "L'onglet 'Theses' vous permet de deposer et gerer vos travaux academiques (theses, memoires, "
        "publications) afin qu'ils soient references par l'Ordre. Cette fonctionnalite permet de "
        "constituer une base de connaissances et de valoriser les travaux des pharmaciens gabonais.",
        y
    )
    y -= 0.5 * cm
    
    y = draw_subsection_title(c, "5.2. Voir vos theses", y)
    y -= 0.3 * cm
    
    y = draw_paragraph(c,
        "Dans la liste des theses, vous pouvez voir toutes les theses que vous avez deposees, avec pour "
        "chacune : le titre, l'annee, un resume (si renseigne), et un lien vers le fichier PDF. Cliquez "
        "sur une these pour voir ses details complets.",
        y
    )
    y -= 0.5 * cm
    
    y = draw_subsection_title(c, "5.3. Ajouter une nouvelle these", y)
    y -= 0.3 * cm
    
    y = draw_paragraph(c,
        "Pour deposer une nouvelle these, cliquez sur le bouton 'Nouvelle these' ou 'Ajouter'. Un "
        "formulaire s'ouvre avec les champs suivants :",
        y
    )
    y -= 0.3 * cm
    
    items = [
        "Titre : titre complet de votre these (obligatoire)",
        "Resume : resume ou abstract de votre travail (optionnel mais recommande)",
        "Annee : annee de soutenance ou de publication (optionnel)",
        "Fichier PDF : upload du fichier PDF de votre these (obligatoire)"
    ]
    y = draw_bullet_list(c, items, y)
    y -= 0.5 * cm
    
    y = draw_paragraph(c,
        "Une fois tous les champs remplis, cliquez sur 'Enregistrer' pour deposer votre these. Le "
        "fichier PDF sera stocke de maniere securisee et pourra etre consulte par l'Ordre et, selon "
        "les regles definies, par d'autres pharmaciens.",
        y
    )
    y -= 0.5 * cm
    
    y = draw_subsection_title(c, "5.4. Modifier ou supprimer une these", y)
    y -= 0.3 * cm
    
    y = draw_paragraph(c,
        "Vous pouvez modifier les informations d'une these existante (titre, resume, annee) en cliquant "
        "sur la these dans la liste puis sur 'Modifier'. Vous pouvez egalement remplacer le fichier PDF "
        "si vous avez une version mise a jour. Pour supprimer une these, cliquez sur 'Supprimer' (action "
        "irreversible, soyez sur de votre choix).",
        y
    )
    y -= 0.5 * cm
    
    y = draw_screenshot_box(c, "Ecran de gestion des theses", y)
    c.showPage()

    # 6. MESSAGERIE
    y = height - 3 * cm
    y = draw_section_title(c, "6. MESSAGERIE AVEC L'ORDRE", y)
    y -= 0.5 * cm
    
    y = draw_subsection_title(c, "6.1. Envoyer un message a l'Ordre", y)
    y -= 0.3 * cm
    
    y = draw_paragraph(c,
        "La messagerie vous permet d'envoyer des messages officiels a l'Ordre pour toute question, "
        "demande ou communication professionnelle. Pour envoyer un nouveau message :",
        y
    )
    y -= 0.3 * cm
    
    items = [
        "Accedez a la rubrique 'Messages' depuis le menu",
        "Cliquez sur le bouton 'Nouveau message' ou 'Envoyer un message'",
        "Remplissez le formulaire avec :",
        "  - Sujet : resume court de votre message (obligatoire)",
        "  - Message : contenu detaille de votre communication (obligatoire)",
        "Cliquez sur 'Envoyer' pour transmettre votre message a l'Ordre"
    ]
    y = draw_bullet_list(c, items, y)
    y -= 0.5 * cm
    
    y = draw_paragraph(c,
        "Une fois envoye, votre message est enregistre dans le systeme et apparait dans votre liste de "
        "messages. L'Ordre recevra votre message dans sa messagerie administrative et pourra y repondre.",
        y
    )
    y -= 0.5 * cm
    
    y = draw_subsection_title(c, "6.2. Voir vos messages et les reponses", y)
    y -= 0.3 * cm
    
    y = draw_paragraph(c,
        "Dans la liste de vos messages, vous pouvez voir tous les messages que vous avez envoyes a "
        "l'Ordre, avec pour chacun :",
        y
    )
    y -= 0.3 * cm
    
    items = [
        "Le sujet du message",
        "La date et l'heure d'envoi",
        "Le statut (envoye, lu par l'Ordre, etc.)",
        "Indication si l'Ordre a repondu"
    ]
    y = draw_bullet_list(c, items, y)
    y -= 0.5 * cm
    
    y = draw_paragraph(c,
        "En cliquant sur un message, vous pouvez voir son contenu complet ainsi que, le cas echeant, "
        "la reponse de l'Ordre. La reponse de l'Ordre s'affiche directement sous votre message initial, "
        "avec la date d'envoi de la reponse.",
        y
    )
    y -= 0.5 * cm
    
    y = draw_subsection_title(c, "6.3. Historique des echanges", y)
    y -= 0.3 * cm
    
    y = draw_paragraph(c,
        "Tous vos messages et toutes les reponses de l'Ordre sont conserves dans votre espace pharmacien, "
        "creant un historique complet de vos echanges. Cela vous permet de retrouver facilement les "
        "informations communiquees precedemment et de suivre l'evolution de vos demandes.",
        y
    )
    y -= 0.5 * cm
    
    y = draw_screenshot_box(c, "Formulaire d'envoi d'un message a l'Ordre", y)
    c.showPage()
    y = height - 3 * cm
    y = draw_screenshot_box(c, "Exemple de message avec reponse de l'Ordre", y)
    c.showPage()

    # 7. PROFIL
    y = height - 3 * cm
    y = draw_section_title(c, "7. MISE A JOUR DU PROFIL ET DU MOT DE PASSE", y)
    y -= 0.5 * cm
    
    y = draw_subsection_title(c, "7.1. Modifier votre profil", y)
    y -= 0.3 * cm
    
    y = draw_paragraph(c,
        "Depuis la rubrique 'Profil', vous pouvez mettre a jour vos informations personnelles :",
        y
    )
    y -= 0.3 * cm
    
    items = [
        "Email : adresse email de contact",
        "Telephone : numero de telephone",
        "Adresse : adresse personnelle (si applicable)",
        "Photo de profil : image de votre profil (si la fonctionnalite est disponible)"
    ]
    y = draw_bullet_list(c, items, y)
    y -= 0.5 * cm
    
    y = draw_paragraph(c,
        "Pour modifier une information, cliquez sur 'Modifier le profil', changez les champs souhaites, "
        "puis cliquez sur 'Enregistrer'. Les modifications sont immediatement prises en compte.",
        y
    )
    y -= 0.5 * cm
    
    y = draw_subsection_title(c, "7.2. Changer votre mot de passe", y)
    y -= 0.3 * cm
    
    y = draw_paragraph(c,
        "Pour des raisons de securite, il est recommande de changer regulierement votre mot de passe. "
        "Pour modifier votre mot de passe :",
        y
    )
    y -= 0.3 * cm
    
    items = [
        "Accedez a la section 'Changer le mot de passe' dans votre profil",
        "Saisissez votre mot de passe actuel (obligatoire pour verification)",
        "Saisissez votre nouveau mot de passe (deux fois pour confirmation)",
        "Cliquez sur 'Enregistrer' pour appliquer le changement"
    ]
    y = draw_bullet_list(c, items, y)
    y -= 0.5 * cm
    
    y = draw_paragraph(c,
        "Votre nouveau mot de passe doit etre suffisamment long (minimum 8 caracteres recommande) et "
        "complexe pour assurer la securite de votre compte. Ne partagez jamais votre mot de passe avec "
        "un tiers.",
        y
    )
    y -= 0.5 * cm
    
    y = draw_screenshot_box(c, "Ecran de profil du pharmacien", y)
    c.showPage()
    y = height - 3 * cm
    y = draw_screenshot_box(c, "Ecran de changement de mot de passe", y)
    c.showPage()

    # 8. BONNES PRATIQUES
    y = height - 3 * cm
    y = draw_section_title(c, "8. BONNES PRATIQUES", y)
    y -= 0.5 * cm
    
    y = draw_subsection_title(c, "8.1. Mise a jour des informations", y)
    y -= 0.3 * cm
    
    items = [
        "Mettre a jour rapidement les informations de votre pharmacie en cas de changement (adresse, "
        "horaires, telephone, service de garde)",
        "Verifier regulierement que les informations affichees sur le site public sont correctes",
        "Signaler immediatement toute erreur ou information obsolete"
    ]
    y = draw_bullet_list(c, items, y)
    y -= 0.5 * cm
    
    y = draw_subsection_title(c, "8.2. Utilisation de la messagerie", y)
    y -= 0.3 * cm
    
    items = [
        "Utiliser la messagerie pour des echanges professionnels et officiels avec l'Ordre",
        "Formuler vos messages de maniere claire et courtoise",
        "Indiquer un sujet precis pour faciliter le traitement de votre demande",
        "Consulter regulierement vos messages pour voir les reponses de l'Ordre"
    ]
    y = draw_bullet_list(c, items, y)
    y -= 0.5 * cm
    
    y = draw_subsection_title(c, "8.3. Securite", y)
    y -= 0.3 * cm
    
    items = [
        "Ne jamais partager vos identifiants avec un tiers, meme temporairement",
        "Changer regulierement votre mot de passe (tous les 3 a 6 mois)",
        "Toujours vous deconnecter apres chaque session, surtout sur un poste partage",
        "Signaler immediatement toute activite suspecte sur votre compte"
    ]
    y = draw_bullet_list(c, items, y)
    c.showPage()

    # 9. CONTACTS
    y = height - 3 * cm
    y = draw_section_title(c, "9. CONTACTS UTILES", y)
    y -= 0.5 * cm
    
    y = draw_subsection_title(c, "9.1. Support technique", y)
    y -= 0.3 * cm
    
    y = draw_paragraph(c,
        "Pour toute question technique concernant l'utilisation de l'espace pharmacien (probleme de "
        "connexion, anomalie d'affichage, fonctionnalite qui ne fonctionne pas, etc.), vous pouvez "
        "contacter l'Ordre par les canaux de contact officiels (telephone, email, formulaire de contact "
        "du site). Indiquez clairement le probleme rencontre et les etapes pour le reproduire.",
        y
    )
    y -= 0.5 * cm
    
    y = draw_subsection_title(c, "9.2. Questions sur votre compte", y)
    y -= 0.3 * cm
    
    y = draw_paragraph(c,
        "Pour toute question concernant votre compte (oubli de mot de passe, demande de reactivation, "
        "etc.), contactez directement l'Ordre qui pourra vous accompagner selon la procedure interne "
        "definie.",
        y
    )
    c.showPage()

    c.save()

if __name__ == "__main__":
    print("Generation des manuels en cours...")
    create_admin_manual()
    print("Manuel admin genere : manuel-espace-admin.pdf")
    create_pharmacien_manual()
    print("Manuel pharmacien genere : manuel-espace-pharmacien.pdf")
    print("Termine ! Les deux PDFs sont dans le dossier du projet.")
