export default {
  // Liste des contacts dans la DB
  contacts: [
  ],
  // Valeurs du formulaire de création de contact -> mis à jour par mutation en temps réel quand l'utilisateur encode des valeurs dans les champs
  formNewContact: {},
  // Liste des contacts créés mais dont l'insertion en DB n'a pas été confirmée
  tempContacts: []
}
