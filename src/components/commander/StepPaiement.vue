<template>
    <ul class="steps steps-vertical lg:steps-horizontal">
        <li class="step step-primary">Inscritpion</li>
        <li class="step step-primary">Livrasion</li>
        <li class="step step-primary">Paiement</li>
    </ul>

    <form @submit.prevent action="" class="w-10/12 *:my-2">


        <p class="text-xl">Paiement</p>
        <p>Toutes les transactions sont chiffrées et sécurisées.</p>
        {{ inscription? inscription : '' }}

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
            <div v-if="cb">
                {{ cb }}
                <p type="text" class="input input-bordered w-full " >{{ cb? cb.NumeroCarte : '' }}</p>
                <p type="text" required placeholder="Nom Complet" class="input input-bordered w-full " >{{ cb? cb.NomCarte :'' }}</p>
    
                <div class="flex gap-2">     
                    <p type="text"  class="input input-bordered w-full " >{{ cb? cb:'' }}</p>
                    <p type="text"  class="input input-bordered w-full " >{{ cb? cb:'' }}</p>
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
        
        <div v-if(!cb)>
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
            <button class="btn w-10/12 btn-accent text-white" @click="valideCommande">Payer Maintenant</button>

        </div>

    </form>

</template>

<script setup>
import {ref, defineProps} from 'vue'
import usePanierStore from "../../store/panier.js"
import useCompteStore from "../../store/compte.js";


const panierStore = usePanierStore()    
const compteStore = useCompteStore();
const emit = defineEmits(['next','previous'])

const props = defineProps({
    cb: Object,
    livraisons : Object,
    livraisonChoisis: Object,
    inscription: Object,
    prixCmd: Object
});

const donneesBancaire = defineModel()

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


async function valideCommande() {
    //Récupération des données
    let userNeedUpdate = false;
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

            // récupération de  l'id de l'adresse ----TODO
            let data = await response.json()
             adresseId = data.adresseId;
             utilisateur.adresseId = adresseId

        } else {
            console.warn("réponse non gérée " + response.status + "\n" + response)
        }
    }

    //Mise à jour de l'utilisateur
    if(props.inscription.keyNomAcheteur){
        userNeedUpdate = true;
        utilisateur.UtilisateurNomAcheteur = props.inscription.keyNomAcheteur
    }
    if(props.inscription.keyTelAcheteur){
        userNeedUpdate = true;
        utilisateur.UtilisateurNomAcheteur = props.inscription.keyTelAcheteur
    }

    if(userNeedUpdate){
        try {
          const response = await fetch('https://apififa2.azurewebsites.net/api/Utilisateur/'+utilisateur.utilisateurId, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(utilisateur)
          });
        } catch (error) {
          console.error('Erreur lors de la requête fetch :', error);
        }
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
        // récupération de  l'id de la commande ----TODO
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
    
    // ---- FONCTIONNE
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
        const response = await fetch("https://apififa2.azurewebsites.net/api/lignecommande", {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(lcd)
        })

        if (response.status != 201) {
            console.warn("réponse non gérée " + response.status + "\n" + response)
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