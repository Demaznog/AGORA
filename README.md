# AGORA — prototype, lot septembre

Fichier unique `index.html`. Aucun serveur requis pour l'usage local, sauf pour
le branchement du modèle (étape octobre).

## Arborescence

```
index.html              l'application
config.js               configuration locale — livrée une fois, jamais réécrite
banc.html               comparaison à l'aveugle des deux fournisseurs
assets/images/          visuels des fiches (vides pour l'instant)
worker/src/index.js     relais de jury (Cloudflare Worker)
worker/wrangler.toml    configuration du Worker
scripts/verifier.js     contrôles automatiques (protocole QA Toka)
scripts/parcours.js     simulation de séances complètes
scripts/micro.js        reconnaissance vocale simulée, cas iOS
scripts/relais.mjs      tests du relais, fournisseurs simulés
```

Vérification avant toute livraison :

```
npm install jsdom
node scripts/verifier.js index.html banc.html --modes=home,oral,image,culture,progress,debrief
node scripts/parcours.js
node scripts/micro.js
node scripts/relais.mjs
```

## Ajouter une image

1. Déposer le fichier dans `assets/images/` (nom sans espace, minuscules).
2. Ajouter ou compléter l'entrée correspondante dans le tableau `IMAGES`
   d'`index.html`, et renseigner `fichier` avec le seul nom du fichier.
3. Tant que `fichier` vaut `null`, la carte affiche un aplat et la pastille
   **VISUEL NON FOURNI**. Aucune image factice n'est présentée comme réelle.

Champs obligatoires : `titre`, `auteur`, `date`, `source`, `droits`, `legende`,
`nature`, `periode`, `difficulte` (1 à 5), `themes`.

L'appariement est automatique : natures différentes, écart de difficulté
inférieur ou égal à 1, priorité aux images non encore vues.

## Le relais de jury

`worker/src/index.js` est un Cloudflare Worker. Il reçoit un contexte de tour et
rend une question. Les clés d'API vivent dans ses variables d'environnement et
ne sortent jamais du serveur.

### Déploiement

```
cd worker
npx wrangler login
npx wrangler deploy
npx wrangler secret put ANTHROPIC_API_KEY
npx wrangler secret put OPENAI_API_KEY
npx wrangler secret put AGORA_TOKEN
```

`AGORA_TOKEN` est une valeur que tu inventes, par exemple une suite de trente
caractères aléatoires. Elle doit être identique dans le Worker et dans
`index.html`.

Tout se fait aussi depuis le tableau de bord Cloudflare : **Workers & Pages →
Create → Worker**, coller le contenu de `worker/src/index.js`, puis
**Settings → Variables → Add variable** en cochant *Encrypt* pour les trois
secrets. Vérifier que `ALLOWED_ORIGIN` vaut exactement l'adresse du prototype,
sans barre finale.

Contrôle : ouvrir `https://<ton-worker>.workers.dev/sante` doit rendre
`{"ok":true}`.

### Branchement du client

Tout ce qui est propre à cette installation vit dans **`config.js`**, chargé
avant `index.html` :

```js
window.AGORA_CONFIG = {
  relayUrl:   'https://agora-jury.xxx.workers.dev/jury',
  relayToken: '<la même valeur que AGORA_TOKEN>',
  relayTimeout: 9000,
  prenom: 'Pierre'
};
```

**`config.js` n'est livré qu'une fois et ne doit plus jamais être réécrit.**
`index.html` peut être remplacé à chaque mise à jour sans rien perdre.

`relayUrl` vide garde le moteur local. Renseignée, elle bascule sur le modèle.
`relayToken` est lisible dans la page : ce n'est pas un secret, seulement un
filtre contre l'usage fortuit. La vraie protection est `ALLOWED_ORIGIN`.

Si `config.js` manque, est vide ou contient encore le marqueur, l'application
l'annonce sur l'écran d'oral plutôt que de retomber silencieusement sur les
règles.

### Contrat de la couture

`askJury(ctx)` reçoit :

```
{ phase, turn, answer, analysis, question, elapsed, secondsLeft,
  previousQuestions, image }
```

et rend `{ question, intent, engine }`. Deux implémentations :

- `askJuryRules(ctx)` — moteur local, synchrone, sert de repli ;
- `askJuryModel(ctx)` — appel du relais, délai maximal `RELAY_TIMEOUT`.

Toute erreur, tout dépassement de délai, toute question vide retombe sur les
règles et marque le tour `rules-fallback`. Le débrief annonce le nombre de
replis et leur motif : une séance produite par le moteur local ne doit jamais
passer pour une séance produite par le jury.

L'orchestrateur (phases, durées, transitions, fin de séance) reste local et
déterministe. Il ne passe jamais sous le contrôle du modèle.

### Choix du modèle

`ANTHROPIC_MODEL` et `OPENAI_MODEL` sont des variables du Worker, modifiables
sans toucher au code. Commencer par les paliers rapides : les modèles à
raisonnement produisent des jetons invisibles, facturés et lents, inutiles pour
formuler une question de vingt-cinq mots.

## Banc de comparaison

`banc.html` compare les deux fournisseurs à l'aveugle : douze situations
d'entretien, deux relances par situation, ordre tiré au sort, étiquettes
révélées seulement à la fin. Il s'utilise depuis le téléphone, sans outillage
local : ouvrir la page, coller l'adresse du relais et le jeton, choisir.

Le verdict n'est déclaré que si l'écart dépasse deux sur douze. En deçà, les
deux se valent et la latence tranche.

## Voix du jury

Le sélecteur figure en bas de l'écran oral. Il liste les voix `fr-*` installées
sur l'appareil, telles que les rend `speechSynthesis.getVoices()`.

- Sans choix mémorisé, AGORA retient la meilleure disponible : variante
  premium ou améliorée d'abord, puis `fr-FR`, les voix compactes en dernier.
- Le choix est enregistré dans `state.voiceURI` et survit au rechargement.
- **TESTER** fait prononcer la phrase d'ouverture du jury.
- Si aucune voix française n'est installée, le sélecteur explique où les
  télécharger. Si la synthèse vocale est absente du navigateur, le bloc
  disparaît entièrement.

La qualité est lue dans le `voiceURI` autant que dans le nom : sur iOS, deux
voix peuvent s'appeler « Aurélie » et seul `com.apple.voice.premium.` contre
`com.apple.voice.compact.` les distingue. Les homonymes reçoivent un suffixe
pour rester sélectionnables.

Sur iPhone, les variantes améliorées se téléchargent dans Réglages →
Accessibilité → Contenu énoncé → Voix → Français. Attention : **WebKit
n'expose pas systématiquement au web les voix premium installées dans iOS.**
Le lien « voir les voix détectées » affiche la liste brute renvoyée par
`getVoices()` — nom, langue, `voiceURI`, service local ou distant. C'est le
seul moyen fiable de savoir si une voix est réellement disponible pour la page
plutôt que réservée au système.

## Reconnaissance vocale

Safari iOS n'honore pas `continuous` : le moteur s'arrête seul à chaque pause,
et une instance ayant échoué n'est plus réutilisable. Trois conséquences dans
le code.

- Une instance neuve est créée à chaque prise de parole, jamais réutilisée.
- Sur iOS, `continuous` est désactivé et l'écoute est relancée automatiquement
  après chaque arrêt spontané, jusqu'à 24 fois. Seul l'appui du candidat clôt
  la réponse. Hors iOS, un silence de 900 ms la clôt comme avant.
- Les fragments successifs sont cumulés dans `voice.finalTranscript` : la
  réponse transmise au jury est la prise de parole entière.

La synthèse vocale garde la voie audio ouverte sur iOS. `toggleListening`
appelle donc `speechSynthesis.cancel()` puis attend 220 ms avant d'ouvrir le
micro.

Les codes d'erreur du navigateur sont affichés tels quels, `not-allowed`,
`no-speech`, `audio-capture`, `network`, accompagnés d'un message actionnable.
Un message qui masque le code rend le défaut indiagnosticable à distance.
Les erreurs non fatales n'apparaissent pas pendant les relances automatiques,
seulement une fois la réponse close.

## Phrasé du jury

`speak()` découpe l'énoncé sur la ponctuation forte et prononce les phrases
successivement : 340 ms entre deux affirmations, 620 ms juste avant une
question. Les synthétiseurs compacts rendent mieux trois phrases courtes
qu'une longue, et la pause avant la question imite le rythme d'un examinateur.

Le lien **phrasé : naturel / continu** bascule entre ce découpage et une seule
énonciation, et relit l'ouverture pour comparer immédiatement. Le choix est
mémorisé dans `state.phrasing`.

Deux garde-fous. Un jeton de séquence invalide la file en cours dès qu'on
change de question ou qu'on quitte l'oral, ce qui évite qu'un ancien énoncé
reprenne après coup. Une temporisation de secours passe au segment suivant si
Safari ne déclenche pas `onend`, défaut connu de WebKit sur les files longues.

## Stockage

Clé unique `agora.v1.state`, nom définitif. Ne jamais la renommer : cela
effacerait l'historique. Accès protégé, repli en mémoire en navigation privée
avec avertissement affiché.

Contenu : `prenom`, `priority`, `sessions[]` (date, type, durée, tours, scores,
score global, image vue, version de prompt, moteur), `seenImages[]`.

## Ce que le moteur mesure

La concision est notée par tour, contre une bande de longueur utile propre à
la phase : 150 à 320 mots pour une présentation de deux minutes, 70 à 200 pour
une première lecture d'image, 45 à 110 pour une relance. Une bande unique
notait à 96 une présentation trois fois trop courte.

L'observation n'est mesurée que devant un visuel réel. Tant que les fiches
n'ont pas de fichier image, la dimension s'affiche « non mesuré » plutôt que
d'inventer une faiblesse.

Le moment proposé au rejeu exclut les questions d'ouverture de séquence :
rejouer « présentez-vous » n'apprend rien. Si aucun tour ne s'y prête, la
carte disparaît.


Signaux de surface uniquement : longueur de réponse, présence d'une
justification, d'un exemple, d'une nuance, densité de termes d'observation.
Ces mesures sont affichées comme telles dans le débrief et la progression.
Elles ne mesurent pas la qualité du raisonnement et ne le prétendent pas.
