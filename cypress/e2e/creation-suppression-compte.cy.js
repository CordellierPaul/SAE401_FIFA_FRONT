// Test d'inscription, de connexion et de suppression du compte

function genererStringAleatoire() {
  return Math.random().toString(36).slice(-5);
}

const compte = {
  prenom: genererStringAleatoire(),
  nom: genererStringAleatoire(),
  dateDeNaissance: "2004-07-07",
}

describe("Test où un compte est créé, on se déconnecte, se connecte, et supprimer le compte", () => {
    it("Inscription", () => {
      cy.visit('/register')
      cy.get('#inputPrenom').type(compte.prenom)
      cy.get('#inputNom').type(compte.nom)
      cy.get('#inputDateDeNaissance').type(compte.dateDeNaissance)
    })
  })
  