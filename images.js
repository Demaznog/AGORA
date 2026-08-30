/* ============================================================
   AGORA — corpus d'images

   Ce fichier t'appartient. Je ne le réécris pas : je te fournis des
   fiches à ajouter, tu les colles à la suite. Les mises à jour
   d'index.html ne l'effacent jamais.

   Chaque fiche a deux faces :
     — ce que le candidat lit à l'écran : titre, auteur, date, nature, source
     — ce que seul le jury connaît : legende (contexte), themes

   `fichier` est le nom du fichier déposé dans assets/images/.
   Tant qu'il vaut null, la carte affiche « VISUEL NON FOURNI ».
   Si le fichier est déclaré mais absent, elle affiche
   « FICHIER INTROUVABLE » : aucun aplat de couleur n'est jamais
   présenté comme étant l'œuvre.

   Format conseillé : JPEG, 1600 px au plus grand côté, moins de 800 Ko.
   ============================================================ */

window.AGORA_IMAGES = [

  {
    id: 'img-001',
    fichier: 'daumier-ventre-legislatif.jpg',
    nature: 'caricature',
    periode: 'XIXe',
    difficulte: 4,
    titre: 'Le Ventre législatif',
    auteur: 'Honoré Daumier',
    date: '1834',
    source: 'L’Association mensuelle lithographique',
    droits: 'Domaine public — Met Museum Open Access / Library of Congress',
    legende: 'Réunion fictive de trente-cinq députés du « juste-milieu » sous la monarchie de Juillet, représentés bedonnants, endormis ou en conciliabule.',
    themes: ['pouvoir', 'satire', 'représentation politique', 'censure']
  },

  {
    id: 'img-002',
    fichier: 'lange-migrant-mother.jpg',
    nature: 'photographie',
    periode: 'XXe',
    difficulte: 2,
    titre: 'Migrant Mother',
    auteur: 'Dorothea Lange',
    date: '1936',
    source: 'Farm Security Administration — Library of Congress',
    droits: 'Domaine public — commande fédérale américaine',
    legende: 'Portrait réalisé dans un camp de cueilleurs de pois à Nipomo, Californie, pendant la Grande Dépression. Cadrage resserré, enfants de dos, composition souvent rapprochée des représentations mariales.',
    themes: ['pauvreté', 'travail', 'crise économique', 'photographie documentaire']
  },

  {
    id: 'img-003',
    fichier: 'delacroix-liberte-guidant-le-peuple.jpg',
    nature: 'peinture',
    periode: 'XIXe',
    difficulte: 3,
    titre: 'La Liberté guidant le peuple',
    auteur: 'Eugène Delacroix',
    date: '1830',
    source: 'Musée du Louvre, Paris',
    droits: 'Domaine public (œuvre) — vérifier la notice de la reproduction',
    legende: 'Toile commémorant les Trois Glorieuses de juillet 1830. Allégorie féminine mêlée à des figures sociales très diverses, sur un premier plan jonché de cadavres.',
    themes: ['révolution', 'allégorie', 'peuple', 'représentation du politique']
  },

  {
    id: 'img-004',
    fichier: 'faivre-on-les-aura.jpg',
    nature: 'affiche',
    periode: 'XXe',
    difficulte: 3,
    titre: 'On les aura ! — 2e emprunt de la Défense nationale',
    auteur: 'Abel Faivre',
    date: '1916',
    source: 'Affiche d’emprunt de guerre, collections publiques françaises',
    droits: 'Domaine public — vérifier la notice de la reproduction',
    legende: 'Affiche destinée à financer l’effort de guerre par la souscription. Un soldat lève le bras en signe d’assaut ; le texte occupe autant de place que l’image.',
    themes: ['propagande', 'guerre', 'persuasion', 'financement de l’État']
  },

  {
    id: 'img-005',
    fichier: 'nasa-earthrise.jpg',
    nature: 'photographie',
    periode: 'XXe',
    difficulte: 4,
    titre: 'Earthrise',
    auteur: 'William Anders — mission Apollo 8',
    date: '1968',
    source: 'NASA',
    droits: 'Domaine public — œuvre du gouvernement américain',
    legende: 'La Terre photographiée depuis l’orbite lunaire. Souvent citée comme une image fondatrice de la conscience écologique et de l’idée de finitude planétaire.',
    themes: ['environnement', 'science', 'perspective', 'conquête spatiale', 'guerre froide']
  }

];
