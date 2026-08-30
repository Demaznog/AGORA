/* ============================================================
   AGORA — configuration locale

   CE FICHIER NE SERA PLUS JAMAIS LIVRÉ NI RÉÉCRIT.
   Les valeurs que tu mets ici survivent à toutes les mises à jour
   d'index.html. Renseigne-les une fois, n'y touche plus.
   ============================================================ */

window.AGORA_CONFIG = {

  /* Adresse du relais de jury, avec /jury à la fin.
     Laisser vide fait tourner AGORA sur son moteur local à règles. */
  relayUrl: 'https://agora-jury.gonzague-drion.workers.dev/jury',

  /* Doit être identique au secret AGORA_TOKEN du Worker.
     Ce n'est pas un secret de sécurité : il est lisible dans la page.
     Il empêche seulement l'usage fortuit du relais par un tiers. */
  relayToken: 'ZERTGHUIOPTR2345809RTGDSZKL865',

  /* Délai au-delà duquel AGORA retombe sur son moteur local, en ms. */
  relayTimeout: 9000,

  /* Prénom du candidat, utilisé à l'accueil. */
  prenom: 'Pierre'
};
