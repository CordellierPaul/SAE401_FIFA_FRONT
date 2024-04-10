<script setup>
import { ref, onMounted } from 'vue'
import useCompteStore from "../store/compte.js"

import { verifierMotDePasse, encrypter } from "../composable/hashageMdp.js";
import { formatEmailEstBon, emailEstDansLaBaseDeDonnees } from "../composable/verificationEmail.js";
import VerificationMdpComponent from "../components/VerificationMdpComponent.vue";
import { classesPourListeCondition } from "../components/VerificationMdpComponent.vue";

import { useRouter } from "vue-router"
const router = useRouter()

const compteStore = useCompteStore()
const donneesCompte = ref()

const variablesDeVerificationMdp = ref()

const bottonClass = "block text-white hover:bg-white hover:text-black border rounded-lg py-2 px-4 duration-75 my-2"
const deleteButtonClass = bottonClass + " bg-red-500 border-red-500" 
const basicButtonClass = bottonClass + " bg-gray-500 border-gray-500" 

const readonlyCompteDataClass = "inline-block py-1.5"
const inputClass = "inline p-1 w-max border border-gray-200 rounded-lg text-s focus:ring-blue-500 focus:border-blue-500 border-gray-600 focus:ring-blue-500 focus:border-blue-500"

var modificationCompteEnCours = ref(false)
var popupModificationMdpAffichee = ref(false)

var donnesPopupModicatMdp = ref({
    mdpActuel: "",
    nouveauMdp: "",
    verificationNouveauMdp: "",
})

// Conditions pour le mot de passe
var styleConditionMdpChampsVerificationDifferents = ref(classesPourListeCondition["cachee"])
var styleConditionMdpUnChampVide = ref(classesPourListeCondition["cachee"])
var styleConditionMdpActuelDifferent = ref(classesPourListeCondition["cachee"])

// Conditions pour le reste des données
var styleConditionEMailMauvaisFormat = ref(classesPourListeCondition["cachee"])
var styleConditionEMailPasUnique = ref(classesPourListeCondition["cachee"])
var styleConditionLoginPasRempli = ref(classesPourListeCondition["cachee"])
var styleConditionNomPasRempli = ref(classesPourListeCondition["cachee"])
var styleConditionPrenomPasRempli = ref(classesPourListeCondition["cachee"])

function reinitialiserStyleCondition() {
    let stylesConditions = [
        styleConditionMdpChampsVerificationDifferents,
        styleConditionMdpUnChampVide,
        styleConditionMdpActuelDifferent,
        styleConditionEMailMauvaisFormat,
        styleConditionEMailPasUnique,
        styleConditionLoginPasRempli,
        styleConditionNomPasRempli,
        styleConditionPrenomPasRempli
    ]
    stylesConditions.forEach(element => {
        element.value = classesPourListeCondition["cachee"]
    })
}

var eMailAvantModification

async function fetchCompteData() {

    const response = await fetch("https://apififa2.azurewebsites.net/api/compte/getbyid/" + compteStore.compteId, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${compteStore.token}`,
            "Content-Type": "application/json",
        }
    })

    donneesCompte.value = await response.json()

    donneesCompte.value.utilisateurCompte.utilisateurId = undefined

    eMailAvantModification = donneesCompte.value.compteEmail
}

onMounted(fetchCompteData)

async function enregistrerModifications() {
    
    donneesCompte.value.utilisateurCompte.adresseUtilisateur = undefined

    const response = await fetch("https://apififa2.azurewebsites.net/api/compte/" + compteStore.compteId, {
        method: "PUT",
        headers: {
            "Authorization": `Bearer ${compteStore.token}`, 
            "Content-Type": "application/json",
        },
        body: JSON.stringify(donneesCompte.value)
    })
    
    await fetchCompteData()

    modificationCompteEnCours.value = false


}

async function annulerModifications() {
    donneesCompte.value = undefined
    await fetchCompteData()
    modificationCompteEnCours.value = false
}

async function supprimerCompte() {
    //anonymisation de l'utilisateur
    var user = donneesCompte.value.utilisateurCompte
    user.adresseId = null
    user.prenomUtilisateur = "X"
    user.paysFavorisId = null
    user.utilisateurNomAcheteur = null
    user.utilisateurTelAcheteur = null
    user.activiteId = null
    user.societeId = null
    user.utilisateurNumTva = null
    donneesCompte.value.utilisateurCompte = user
    const response = await fetch("https://apififa2.azurewebsites.net/api/compte/" + compteStore.compteId, {
        method: "PUT",
        headers: {
            "Authorization": `Bearer ${compteStore.token}`, 
            "Content-Type": "application/json",
        },
        body: JSON.stringify(donneesCompte.value)
        })
    //Suppression du compte
    await fetch("https://apififa2.azurewebsites.net/api/compte/" + compteStore.compteId, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${compteStore.token}`
        }
    })
    
    // on se déconnecte et on va à la page d'accueil :
    compteStore.disconnect()
    router.push({ "name" : "index" })   
}

async function enregistrerDonneesCompte() {

    reinitialiserStyleCondition()

    if (eMailAvantModification !== donneesCompte.value.compteEmail) {
        // Si l'e-mail a été modifié, il faut vérifier l'e-mail a un bon format et ne se trouve pas dans la base de données

        if (!formatEmailEstBon(donneesCompte.value.compteEmail)) {
            styleConditionEMailMauvaisFormat.value = classesPourListeCondition["pasRespectee"]
            return
        }

        if (await emailEstDansLaBaseDeDonnees(donneesCompte.value.compteEmail)) {
            styleConditionEMailPasUnique.value = classesPourListeCondition["pasRespectee"]
            return
        }
    }

    if (!donneesCompte.value.comptelogin) {
        styleConditionLoginPasRempli.value = classesPourListeCondition["pasRespectee"]
        return
    }

    if (!donneesCompte.value.utilisateurCompte.utilisateurNomAcheteur) {
        styleConditionNomPasRempli.value = classesPourListeCondition["pasRespectee"]
        return
    }

    if (!donneesCompte.value.utilisateurCompte.prenomUtilisateur) {
        styleConditionPrenomPasRempli.value = classesPourListeCondition["pasRespectee"]
        return
    }
    
    await enregistrerModifications()
}

function cacherPopup() {
    // On réinitialise tous les champs todo ?
    donnesPopupModicatMdp.value.mdpActuel = ""
    donnesPopupModicatMdp.value.nouveauMdp = ""
    donnesPopupModicatMdp.value.verificationNouveauMdp = ""
    
    reinitialiserStyleCondition()

    popupModificationMdpAffichee.value = false
}

async function enregistrerMdp() {

    reinitialiserStyleCondition()

    if (donnesPopupModicatMdp.value.ancienMdp == ""
        || donnesPopupModicatMdp.value.nouveauMdp == ""
        || donnesPopupModicatMdp.value.verificationNouveauMdp == "") {
        styleConditionMdpUnChampVide.value = classesPourListeCondition["pasRespectee"]
        return
    }

    if (donnesPopupModicatMdp.value.nouveauMdp !== donnesPopupModicatMdp.value.verificationNouveauMdp) {
        styleConditionMdpChampsVerificationDifferents.value = classesPourListeCondition["pasRespectee"]
        return
    }

    if (!verifierMotDePasse(donnesPopupModicatMdp.value.mdpActuel, donneesCompte.value.compteMdp)) {
        styleConditionMdpActuelDifferent.value = classesPourListeCondition["pasRespectee"]
        return
    }

    donneesCompte.value.compteMdp = encrypter(donnesPopupModicatMdp.value.nouveauMdp)

    popupModificationMdpAffichee.value = false
     
    await enregistrerModifications()
    await fetchCompteData()
}
</script>

<template>
<!-- Le code HTML est provisoire, puisqu'on va devoir ajouter une modification des champs -->

<p class="flex justify-center items-center m-12 text-3xl font-bold">Paramètres du compte</p>

<template v-if="donneesCompte" class="container mx-auto max-w-7xl px-4 pb-8">

    <p class="text-2xl font-semibold">Informations générales :</p>
    
    <div>
        <p class="inline">Nom d'utilisateur (login) : </p>
        <input v-if="modificationCompteEnCours" id="champLogin" :class="inputClass" v-model="donneesCompte.comptelogin">
        <p v-else :class="readonlyCompteDataClass" id="champLogin">{{ donneesCompte.comptelogin }}</p>
    </div>
    <div>
        <p class="inline">Email : </p>
        <input v-if="modificationCompteEnCours" id="champEmail" :class="inputClass" v-model="donneesCompte.compteEmail">
        <p v-else :class="readonlyCompteDataClass" id="champEmail">{{ donneesCompte.compteEmail }}</p>
    </div>
    <div>
        <p class="inline">Nom : </p>
        <input v-if="modificationCompteEnCours" id="champNom" :class="inputClass" v-model="donneesCompte.utilisateurCompte.utilisateurNomAcheteur">
        <p v-else :class="readonlyCompteDataClass" id="champNom">{{ donneesCompte.utilisateurCompte.utilisateurNomAcheteur }}</p>
    </div>
    <div>
        <p class="inline">Prénom : </p>
        <input v-if="modificationCompteEnCours" id="champPrenom" :class="inputClass" v-model="donneesCompte.utilisateurCompte.prenomUtilisateur">
        <p v-else :class="readonlyCompteDataClass" id="champPrenom">{{ donneesCompte.utilisateurCompte.prenomUtilisateur }}</p>
    </div>

    <div v-if="modificationCompteEnCours">
        <button :class="basicButtonClass" @click="enregistrerDonneesCompte" id="btEnregistrerModifCompte">Enregistrer</button>
        <button :class="basicButtonClass" @click="annulerModifications" id="btAnnulerModifCompte">Annuler</button>
    </div>
    <div v-else>
        <button v-if="!modificationCompteEnCours" :class="basicButtonClass" @click="modificationCompteEnCours = true" id="btModifierCompte">Modifier le compte</button>
        <button v-if="!modificationCompteEnCours" :class="basicButtonClass" @click="popupModificationMdpAffichee = true" id="btModifierMdp">Modifier le mot de passe</button>
    
        <!-- <button :class="basicButtonClass">     ! Sans utilisation de <button> le css fait des trucs bizarres
            <RouterLink :to="{name: 'donnees-bancaires'}">Modifier mes données bancaires</RouterLink>
        </button> -->
    
        <button :class="deleteButtonClass" @click="supprimerCompte" id="btsupprimerCompte">Supprimer le compte</button>
    </div>
    <!-- Conditions pour modifier le compte -->
    <ul>
        <li :class="styleConditionEMailMauvaisFormat">Le format de l'e-mail n'est pas bon</li>
        <li :class="styleConditionEMailPasUnique">Cet e-mail est déjà dans la base de données</li>
        <li :class="styleConditionLoginPasRempli">Le login doit être spécifié</li>
        <li :class="styleConditionNomPasRempli">Le nom doit être spécifié</li>
        <li :class="styleConditionPrenomPasRempli">Le prenom doit être spécifié</li>
    </ul>
</template>

<template v-else class="text-xl mx-auto max-w-7xl px-4 pb-8">Chargement...</template>


<!-- Popup modification mot de passe -->
<div v-if="popupModificationMdpAffichee"
    class="min-w-screen h-screen fixed  left-0 top-0 flex justify-center items-center inset-0 z-50 outline-none focus:outline-none bg-no-repeat bg-center bg-cover">

    <div class="absolute bg-black opacity-50 inset-0 z-0"></div>
    <div class="w-25 p-5 relative mx-auto my-auto rounded-xl shadow-lg  bg-white">
        <p class="text-lg"></p>
        <div class="py-1">
            <label for="ancienMdp" class="pr-1">Votre mot de passe actuel :</label>
            <input id="ancienMdp" v-model="donnesPopupModicatMdp.mdpActuel" :class="inputClass" type="password">
        </div>
        <div class="py-1">
            <label for="nouveauMdp" class="pr-1">Votre nouveau mot de passe :</label>
            <input id="nouveauMdp" v-model="donnesPopupModicatMdp.nouveauMdp" :class="inputClass" type="password">
        </div>
        <div class="py-1"> 
            <label for="verificationNouveauMdp" class="pr-1">Réécrivez votre nouveau mot de passe :</label>
            <input id="verificationNouveauMdp" v-model="donnesPopupModicatMdp.verificationNouveauMdp" :class="inputClass" type="password">
        </div>
        <!-- Conditions pour enregistrer le mot de passe -->
        <ul>
            <VerificationMdpComponent :motDePasse="donnesPopupModicatMdp.nouveauMdp" ref="variablesDeVerificationMdp"/>
            <li :class="styleConditionMdpChampsVerificationDifferents">Les deux champs de mot de passe sont écrits différemment</li>
            <li :class="styleConditionMdpUnChampVide">Un ou plusieurs champs sont vides, ne peux pas continuer</li>
            <li :class="styleConditionMdpActuelDifferent">Le mot de passe actuel est différent par rapport à celui écrit</li>
        </ul>
        <div class="flex items-center justify-center space-x-2">
            <button :class="basicButtonClass" @click="cacherPopup" id="btAnnulerModifMdp">Annuler</button>
            <button :class="basicButtonClass" @click="enregistrerMdp" id="btEnregistrerModifMdp">Enregistrer</button>
        </div>
    </div>
</div>

</template>