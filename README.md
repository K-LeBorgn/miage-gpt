# Projet Miage-GPT

Groupe :
- Le Borgne Killian
- Lessatini Morgane


## Mise en place

Pour tester le projet il faut ouvrir 2 terminaux :

Dans le premier terminal, il faut se placer dans le dossier backend et rentrer ces commandes :
```bash
  npm install
  npm start
  ```
Cela lancera le serveur, qui écoutera sur le port 8080

Dans le deuxième, il faut se placer dans le dossier frontend et rentrer ces commandes :
```bash
npm install
npm start
```
Cela lancera le frontend, qui sera disponible à cette url ```http://localhost:4200```

## Modes:

Miage-GPT possède plusieurs modes :

- chat : utilise le model “gpt-3.5-turbo-0125”. C'est le mode de chat completion basique, renvoi une réponse en fonction de l’input donné

- image : Renvoi une image crée par le model “dall-e-2” en fonction de l’input passé. Ne tiens pas compte du contexte de la conversation en cours.

- speech : Renvoi un fichier audio à l’aide du model “tts-1”.

- vision : Analyse les images qui lui sont envoyés grâce au model “gpt-4o”, puis répond en fonction de ce qui est demandé par l’utilisateur, utilisé par défaut lorsqu’il y a des pièces jointes sélectionnées.

Pour chaque requête un seul mode peut être utilisé, pas plus, vous ne pouvez pas mixer speech et vision par exemple.


## Frontend
Le frontend est une application Angular. Il permet de communiquer avec le backend pour envoyer des requêtes à l'API OpenAI, en posant de simples questions, en générant des images, en demandant des réponses audio, ou en analysant des images que vous pouvez envoyer en pièces jointes via le bouton "Add attachment" à gauche de l'input de chat. 

Le frontend possède un thème clair et un thème sombre, qui peuvent être changés en cliquant sur l'icône en haut à droite de la page, ainsi qu'un historique des conversations qui s'affiche dans la sidebar à gauche de l'écran.
Chaque conversation que vous ferez sera enregistré dans votre localStorage.

Vous pouvez choisir les modes de conversation en commencant une conversation par un '/' ce qui vous affichera les modes disponibles, ce qui permettra de cliquer sur le mode que vous souhaitez utiliser si vous ne voulez pas écrire directement le mode dans l'input. Le fait d'ajouter des images

## Backend

Le projet nécessite une clé API OpenAI pour fonctionner. Pour cela, il faut créer un fichier .env à la racine du dossier backend, et y ajouter la ligne suivante :
```
OPENAI_API_KEY=VOTRE_CLE_API
```
ou alors ajouter directement votre clé API dans votre environnement zsh ou bash.