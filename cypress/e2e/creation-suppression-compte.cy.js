// Test d'inscription, de connexion, de modification et de suppression du compte

function genererStringAleatoire() {
  return Math.random().toString(36).slice(-5);
}

function genererCompte() {
  return {
    prenom: genererStringAleatoire(),
    nom: genererStringAleatoire(),
    dateDeNaissance: "2004-07-07",
    inputPaysNom: "France",
    login: genererStringAleatoire(),
    mdp: genererStringAleatoire() + genererStringAleatoire() + "1!A",
    email: genererStringAleatoire() + '@gmail.com'
  }
}

const compteAvantModif = genererCompte()
const compteApresModif = genererCompte()

const nouveauMotDePasse = genererStringAleatoire() + genererStringAleatoire() + "1!A"

describe("Test où un compte est créé, on se déconnecte, se connecte, et supprimer le compte", () => {
    it("Inscription", () => {
      cy.visit('/register')

      cy.get('#inputPrenom').type(compteAvantModif.prenom)
      cy.get('#inputNom').type(compteAvantModif.nom)
      cy.get('#inputDateDeNaissance').type(compteAvantModif.dateDeNaissance)
      cy.get('#inputPaysNom').select(compteAvantModif.inputPaysNom)
      cy.get('#inputLogin').type(compteAvantModif.login)
      cy.get('#inputEmail').type(compteAvantModif.email)
      cy.get('#inputMdp').type(compteAvantModif.mdp)

      // Il y a un problème avec cypress, et bizarrement pour cliquer il faut faire ces deux commandes.
      // C'est probablement lié au famrwork dasyui
      cy.get('#btnCreationCompte').dblclick({ force: true }) 
      cy.get('#btnCreationCompte').trigger("click")
      
      cy.url().should("not.include", "/register")
    })

    it("Modification du compte", () => {

      // On va sur la page //

      cy.visit('/')   // Je contourne un bug est très bizarre (probablement un bug de version)

      cy.get('#iconeUtilisateur').click()
      cy.get('#lienVersParametresCompte').click()

      cy.url().should("include", "/parametres-compte")


      // On vérifie les données //

      cy.get('#champPrenom').should('have.text', compteAvantModif.prenom)
      cy.get('#champNom').should('have.text', compteAvantModif.nom)
      // cy.get('#champDateDeNaissance').should('have.text', compteAvantModif.dateDeNaissance)
      // cy.get('#champPaysNom').should('have.text', compteAvantModif.inputPaysNom)
      cy.get('#champLogin').should('have.text', compteAvantModif.login)
      cy.get('#champEmail').should('have.text', compteAvantModif.email)


      // On modifie les données générales //
      
      cy.get('#btModifierCompte').click() 
      
      cy.get('#champPrenom').clear().type(compteApresModif.prenom)
      cy.get('#champNom').clear().type(compteApresModif.nom)
      // cy.get('#champDateDeNaissance').clear().type(compteApresModif.dateDeNaissance)
      // cy.get('#champPaysNom').clear().select(compteApresModif.inputPaysNom)
      cy.get('#champLogin').clear().type(compteApresModif.login)
      cy.get('#champEmail').clear().type(compteApresModif.email)

      cy.get('#btEnregistrerModifCompte').click()

      // On modifie le mot de passe //

      cy.get('#btModifierMdp').click()

      cy.get('#ancienMdp').type(compteAvantModif.mdp)
      cy.get('#nouveauMdp').type(compteApresModif.mdp)
      cy.get('#verificationNouveauMdp').type(compteApresModif.mdp)

      cy.get('#btEnregistrerModifMdp').click()
    })

    it("Déconnexion", () => {
      cy.get('#iconeUtilisateur').click()
      cy.get('#btDeconnexion').click()
    })

    it("Connexion", () => {
      cy.get('#iconeConnexion').click()

      cy.get('#inputEmail').type(compteApresModif.email)
      cy.get('#inputMdp').type(compteApresModif.mdp)

      cy.get('#btSeConnecter').dblclick({ force: true }) 
      
      cy.url().should("not.include", "/login")
    })

    it("Suppression du compte", () => {
      cy.get('#iconeUtilisateur').click()
      cy.get('#lienVersParametresCompte').click()

      cy.get('#btsupprimerCompte').click()
      cy.url().should("not.include", "/parametres-compte")
    })

    it("Connexion, qui doit maintenant échouer car me compte est supprimé", () => {
      cy.get('#iconeConnexion').click()

      cy.get('#inputEmail').type(compteApresModif.email)
      cy.get('#inputMdp').type(compteApresModif.mdp)

      cy.get('#btSeConnecter').dblclick({ force: true }) 
      
      cy.url().should("include", "/login")
    })
  })
  