<template>
    <ul class="steps steps-vertical lg:steps-horizontal">
        <li class="step step-primary">Inscritpion</li>
        <li class="step step-primary">Livrasion</li>
        <li class="step step-primary">Paiement</li>
    </ul>

    <form @submit.prevent action="" class="w-10/12 *:my-2">


        <p class="text-xl">Paiement</p>
        {{ compteStore.utilisateur[0].infosBancairesUtilisateur}}
        <p>Toutes les transactions sont chiffrées et sécurisées.</p>

        <div class="bg-base-300 p-3 *:my-1 rounded-lg w-full">
            <div class="flex justify-between ">
                <p class="font-bold text-lg">Carte de crédit</p>
                <div class="flex gap-2">
                    <img class="h-6" src="https://images.ctfassets.net/ei8z56ft9sxn/3e8qIIXqJukjUnSpu0VxGX/b211c732ee077291fab058fbbc05fc73/visa-logo.svg " alt="">
                    <p>MasterCard</p>
                    <p>|</p>
                    <p>Discover</p>
                    <p>|</p>
                    <p>American Express</p>
                </div>
            </div>
            <div v-if="compteStore.utilisateur[0].infosBancairesUtilisateur.length >0">
                <p type="text" class="input input-bordered w-full " >{{ compteStore.utilisateur[0].infosBancairesUtilisateur[0].InfosBancaireNumCarte}}</p>
                <p type="text" required placeholder="Nom Complet" class="input input-bordered w-full " >{{ compteStore.utilisateur[0].infosBancairesUtilisateur[0].InfosBancaireNomCarte }}</p>
    
                <div class="flex gap-2">     
                    <input type="text" required placeholder="Numéro de sécurité (cvv)" pattern="[0-9]{3}" class="input input-bordered w-full " title="Les trois chiffres sur votre carte." v-model="donneesBancaire.keyCVV"/>
                    <p type="text"  class="input input-bordered w-full " >{{ compteStore.utilisateur[0].infosBancairesUtilisateur[0].InfosBancaireMoisExpiration + "/" + compteStore.utilisateur[0].infosBancairesUtilisateur[0].AnneeExpiration }}</p>
                </div>
            </div>
            <div v-else>
                <input type="text" required placeholder="Numéro de carte" pattern="[0-9]{12}" class="input input-bordered w-full " title="12 chiffres" v-model="donneesBancaire.keyNumCarte"/>
                <input type="text" required placeholder="Nom Complet" class="input input-bordered w-full " v-model="donneesBancaire.keyNomCarte"/>
    
                <div class="flex gap-2">     
                    <input type="text" required placeholder="Numéro de sécurité (cvv)" pattern="[0-9]{3}" class="input input-bordered w-full " title="Les trois chiffres sur votre carte." v-model="donneesBancaire.keyCVV"/>
                    <input type="text" required placeholder="Date d'expiration (MM/AA)" class="input input-bordered w-full " title="Format MM/AA, la date doit être supérieur à celle d'aujourd'hui." v-model="donneesBancaire.keyDate"/>
                </div>                
            </div>
        </div>
        
        <div v-if="compteStore.utilisateur[0].infosBancairesUtilisateur.length == 0">
            <!-- Enregistrer la carte -->
            <p class="text-xl">Enregistrer la carte pour vos prochaine commande</p>

            <div class="*:my-2 *:flex *:w-full *:justify-between">
                <div>
                    <div class="flex gap-2">
                        <input type="radio" name="enregistreCb" id="eNon" class="radio" value="0" checked v-model="donneesBancaire.keyEnregistre"/>
                        <label for="eNon">Ne pas enregistrer.</label>
                    </div>
                </div>
                <div class="divider"></div> 
                <div >
                    <div class="flex gap-2">
                        <input type="radio" name="enregistreCb" id="eOk" class="radio" value="1" v-model="donneesBancaire.keyEnregistre"/>
                        <label for="eOk">Enregistrer.</label>
                    </div>
                </div>
            </div>
        </div>                
        <br>
        <p class="text-xl">Facturation</p>
        <p>Sélectionnez l'adresse qui correspond à votre carte ou à votre mode de paiement.</p>

        <div class="*:my-2 *:flex *:w-full *:justify-between">
            <div >
                <div class="flex gap-2">
                    <input type="radio" name="radio-1" id="radio_adr_fac_ide" class="radio" checked  @click="hideInput"/>
                    <label for="radio_adr_fac_ide">Identique à l'adresse de livraison</label>
                </div>
            </div>
            <div class="divider"></div> 
            <div >
                <div class="flex gap-2">
                    <input type="radio" id="radio_adr_fac_dif" name="radio-1" class="radio" @click="showInput" />
                    <label for="radio_adr_fac_dif">Utiliser une adresse de facturation différente</label>
                </div>
            </div>
        </div>

        <div :class="adresseInputClass" class="*:my-2 w-full">
            <select class="select select-bordered w-full" placeholder="Pays">
                <option>France</option>
                <option>Belgique</option>
                <option>Suisse</option>
                <option>Italie</option>
            </select>
            
            <input type="text" required placeholder="Nom Complet" class="input input-bordered w-full " />
            <input type="text" required placeholder="Adresse 1" class="input input-bordered w-full " />
            <input type="text" placeholder="Appartement, suite, etc. (champ faculatatif)" class="input input-bordered w-full " />

            <div class="flex gap-2">
                <input type="text" required placeholder="Code postal" class="input input-bordered w-full " />
                <input type="text" required placeholder="Ville" class="input input-bordered w-full " />
            </div>

            <input type="text" required  placeholder="Téléphone" class="input input-bordered w-full " />
        </div>

        <div class="flex gap-2 justify-between mt-2">
            <button @click="btPreviousClick" class="btn w-1/12 bg-secondary text-white"><i class="fa-solid fa-chevron-left"></i></button>
            <button class="btn w-10/12 btn-accent text-white" @click="validerPaiement">Payer Maintenant</button>

        </div>

    </form>


    <!-- FENETRE MODAL COMMANDE VALIDER -->
    <dialog id="modal_commande_valier" class="modal">
        <div class="modal-box">
            <h3 class="text-lg font-bold">Commande effectuée</h3>
            <p class="py-4">Félicitation, votre commande à été prise en compte. <br>Retrouver vos commande dans l'onglet "Vos commande" de votre compte. <br><br>
            Vous allez être rediriger à l'accueil.</p>
          <div class="modal-action">
            <form method="dialog">
              <button class="btn" @click="router.push({ name: 'index' })">Fermer</button>
            </form>
          </div>
        </div>
    </dialog>
    

</template>

<script setup>
import {ref, defineProps, onMounted} from 'vue'
import usePanierStore from "../../store/panier.js"
import { useRouter } from 'vue-router';
import useCompteStore from "../../store/compte.js";

const panierStore = usePanierStore()    
const compteStore = useCompteStore()
const router = useRouter();
const donneesCompte = ref()
const emit = defineEmits(['next','previous'])

const props = defineProps({
    livraisons : Object,
    livraisonChoisis: Object,
    inscription: Object,
    prixCmd: Object
});

const donneesBancaire = defineModel()

async function fetchCompteData() {

const response = await fetch("https://apififa2.azurewebsites.net/api/compte/getbyid/" + compteStore.compteId, {
    method: "GET",
    headers: {
        "Authorization": `Bearer ${compteStore.token}`,
        "Content-Type": "application/json",
    }
})

donneesCompte.value = await response.json()

}
onMounted(fetchCompteData)

function btPreviousClick() {
    emit('previous')
}

const adresseInputClass = ref("hidden")

function showInput(){
        adresseInputClass.value = ""
}

function hideInput(){
        adresseInputClass.value = "hidden"
}


async function validerPaiement(){
    if(verifChamps()){
        await valideCommande()
        panierStore.reset()
        modal_commande_valier.showModal();
    }
    return;
}

function verifChamps(){
    if(compteStore.utilisateur[0].infosBancairesUtilisateur.length === 0){
        if(!donneesBancaire.value.keyDate){
            return false
        }
        //Vérification de la date
        let date = new Date()
        let moisActuelle = (date.getMonth()+1)%12
        let anneeActuelle = parseInt(date.getFullYear().toString().substring(2))
        let mmaa = donneesBancaire.value.keyDate.split('/')
        if(mmaa[1] < anneeActuelle){
            return false
        }
        if(mmaa[1]== anneeActuelle){
            if(mmaa[0]<moisActuelle)
                return false
        }
        if(donneesBancaire.value.keyNomCarte){
            //Vérification nom carte
            if(donneesBancaire.value.keyNomCarte.length <=0)
                return false;
        }
        else
            return false;
        if(donneesBancaire.value.keyNumCarte){
            //Vérification num
            if(donneesBancaire.value.keyNumCarte.length != 12)
                return false;
        }
        else
            return false;
    }    
    //Vérification du CVV
    if(!donneesBancaire.value.keyCVV)
        return false
    if (donneesBancaire.value.keyCVV.length != 3)
        return false;
    return true;
}

async function valideCommande() {
    let userNeedUpdate = false;

    //Récupération des données
    const utilisateur = compteStore.utilisateur[0]
    const utilisateurId = compteStore.utilisateur[0].utilisateurId
    const livraisonId = props.livraisons[parseInt(props.livraisonChoisis)].livraisonId
    //------Récupération de l'adresse
    let adresseId = null
    let commandeId = null
    if(compteStore.utilisateur[0].adresseId != null){
        adresseId = compteStore.utilisateur[0].adresseId
    }
    else{     
        userNeedUpdate = true;
        let villeId = props.inscription.keyVille.villeId;

        let rue = props.inscription.keyNomAdresse;
        let adresse = {
            adresseRue: rue,
            villeId : villeId
        } 
        const response = await fetch("https://apififa2.azurewebsites.net/api/adresse", {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(adresse)
        })

        if (response.status == 201) {
            let data = await response.json()
             adresseId = data.adresseId;
             utilisateur.adresseId = adresseId

        } else {
            console.warn("réponse non gérée " + response.status + "\n" + response)
        }
    }

    //Mise à jour de l'utilisateur
    if(!utilisateur.utilisateurNomAcheteur){
        userNeedUpdate = true;
        utilisateur.utilisateurNomAcheteur = props.inscription.keyNomAcheteur
    }
    if(!utilisateur.utilisateurTelAcheteur){
        userNeedUpdate = true;
        utilisateur.utilisateurTelAcheteur = props.inscription.keyTelAcheteur
    }
    console.log(donneesBancaire.value.keyEnregistre == 1)
    if(donneesBancaire.value.keyEnregistre == 1)
        userNeedUpdate = true;
    if(userNeedUpdate){
        if(donneesBancaire.value.keyEnregistre == 1){
            let mmaa = donneesBancaire.value.keyDate.split('/') 
            let cb = {
                utilisateurId : utilisateurId,
                InfosBancaireNumCarte : donneesBancaire.value.keyNumCarte,
                InfosBancaireNomCarte : donneesBancaire.value.keyNomCarte,
                InfosBancaireMoisExpiration : mmaa[0],
                AnneeExpiration : mmaa[1],
            }
            donneesBancaire.value.keyEnregistre = 0
            if(!utilisateur.infosBancairesUtilisateur.includes(cb))
                utilisateur.infosBancairesUtilisateur.unshift(cb)
            //Ajout de la cb dans la base de données //TODO
            const response = await fetch("https://apififa2.azurewebsites.net/api/InfosBancaires/", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${compteStore.token}`, 
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(cb)
            })

        }
        //Mise à jour utilisateur
        donneesCompte.value.utilisateurCompte = utilisateur
        compteStore.utilisateur[0] = utilisateur        
        const response = await fetch("https://apififa2.azurewebsites.net/api/compte/" + compteStore.compteId, {
        method: "PUT",
        headers: {
            "Authorization": `Bearer ${compteStore.token}`, 
            "Content-Type": "application/json",
        },
        body: JSON.stringify(donneesCompte.value)
        })
    }

    // Insertion commande
    var date = new Date();
    let commande ={
        utilisateurId : utilisateurId,
        adresseId : adresseId,
        LivraisonId : livraisonId,
        commandePrix : props.prixCmd,
        CommandeDateCommande : date.toJSON(),
        CommandeEtatCommande : "En cours"
    }
    const responseCommande = await fetch("https://apififa2.azurewebsites.net/api/commande", {
        method: "POST",
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(commande)
    })
    if (responseCommande.status == 201) {
        let data = await responseCommande.json()
         commandeId = data.commandeId;
    } else {
        console.warn("réponse non gérée " + responseCommande.status + "\n" + responseCommande)
    }

    //Insertion reglement
    let reglement = {
        CommandeId : commandeId,
        ReglementMontant : props.prixCmd,
        ReglementDate : date.toJSON(),
    }
    const response = await fetch("https://apififa2.azurewebsites.net/api/reglement", {
        method: "POST",
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(reglement)
    })

    //Inséré les ligne commandes
    let vpdId = null;
    let tailleId = null;
    let quantite = null;
    let prixligne = null;
    let lcd = null;
    for (let index = 0; index< panierStore.produits.length; index++){
        vpdId = panierStore.variantes[index].varianteProduitId;
        tailleId = panierStore.stocks[index].tailleId;
        quantite = panierStore.quantites[index];
        prixligne = panierStore.variantes[index].varianteProduitPrix * panierStore.quantites[index];
        lcd = {
            CommandeId: commandeId,
            NumeroLigneCommande: index+1,
            VarianteProduitId : vpdId,
            TailleId : tailleId,
            LigneCommandeQuantite: quantite,
            LigneCommandePrix: prixligne
        }
        //Insère les lignes
        try {
            const response = await fetch("https://apififa2.azurewebsites.net/api/LigneCommande", {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(lcd)
          });
        } catch (error) {
          console.error('Erreur lors de la requête fetch :', error);
        }

        //Baisse le stock
        let stock = panierStore.stocks[index]
        stock.quantiteStockee = stock.quantiteStockee-panierStore.quantites[index]
        try {
          const response = await fetch('https://apififa2.azurewebsites.net/api/Stock/'+stock.stockId, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(stock)
          });
        } catch (error) {
          console.error('Erreur lors de la requête fetch :', error);
        }

    }  
  }

</script>