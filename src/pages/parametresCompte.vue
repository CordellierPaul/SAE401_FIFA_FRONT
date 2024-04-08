<script setup>
import { ref, onMounted } from 'vue'
import useCompteStore from "../store/compte.js"

import { verifierMotDePasse } from "../composable/hashageMdp.js";
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
const errorMessageClass = "pl-1 list-image-[url(/images/icon/bulle-condition-pas-respectee.png)] list-inside"

var modificationCompteEnCours = ref(false)
var popupModificationMdpAffichee = ref(false)

var donnesPopupModicatMdp = ref({
    mdpActuel: "",
    nouveauMdp: "",
    verificationNouveauMdp: "",
})

var stytleConditionMdpChampsVerificationDifferents = ref(classesPourListeCondition["cachee"])
var stytleConditionMdpUnChampVide = ref(classesPourListeCondition["cachee"])
var stytleConditionMdpActuelDifferent = ref(classesPourListeCondition["cachee"])

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
}

onMounted(fetchCompteData)

async function enregistrerModifications() {

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

function cacherPopup() {
    // On réinitialise tous les champs todo ?
    donnesPopupModicatMdp.value.mdpActuel = ""
    donnesPopupModicatMdp.value.nouveauMdp = ""
    donnesPopupModicatMdp.value.verificationNouveauMdp = ""
    stytleConditionMdpChampsVerificationDifferents.value = classesPourListeCondition["cachee"]
    stytleConditionMdpUnChampVide.value = classesPourListeCondition["cachee"]
    stytleConditionMdpActuelDifferent.value = classesPourListeCondition["cachee"]

    popupModificationMdpAffichee.value = false
}

async function enregistrerMdp() {

    stytleConditionMdpUnChampVide.value = classesPourListeCondition["cachee"]
    stytleConditionMdpChampsVerificationDifferents.value = classesPourListeCondition["cachee"]
    stytleConditionMdpActuelDifferent.value = classesPourListeCondition["cachee"]

    if (donnesPopupModicatMdp.value.ancienMdp == ""
        || donnesPopupModicatMdp.value.nouveauMdp == ""
        || donnesPopupModicatMdp.value.verificationNouveauMdp == "") {
        stytleConditionMdpUnChampVide.value = classesPourListeCondition["pasRespectee"]
        return
    }

    if (donnesPopupModicatMdp.value.nouveauMdp !== donnesPopupModicatMdp.value.verificationNouveauMdp) {
        stytleConditionMdpChampsVerificationDifferents.value = classesPourListeCondition["pasRespectee"]
        return
    }

    if (!verifierMotDePasse(donnesPopupModicatMdp.value.mdpActuel, donneesCompte.value.compteMdp)) {
        stytleConditionMdpActuelDifferent.value = classesPourListeCondition["pasRespectee"]
        return
    }
}
</script>

<template>
<!-- Le code HTML est provisoire, puisqu'on va devoir ajouter une modification des champs -->

<p class="flex justify-center items-center m-12 text-3xl font-bold">Paramètres du compte</p>

<div v-if="donneesCompte" class="container mx-auto max-w-7xl px-4 pb-8">

    <p class="text-2xl font-semibold">Informations générales :</p>
    
    <div>
        <p class="inline">Nom d'utilisateur (login) : </p>
        <input v-if="modificationCompteEnCours" id="comptelogin" :class="inputClass" v-model="donneesCompte.comptelogin">
        <p v-else :class="readonlyCompteDataClass" id="comptelogin">{{ donneesCompte.comptelogin }}</p>
    </div>
    <div>
        <p class="inline">Email : </p>
        <input v-if="modificationCompteEnCours" id="compteEmail" :class="inputClass" v-model="donneesCompte.compteEmail">
        <p v-else :class="readonlyCompteDataClass" id="compteEmail">{{ donneesCompte.compteEmail }}</p>
    </div>
    <div>
        <p class="inline">Nom : </p>
        <input v-if="modificationCompteEnCours" id="utilisateurNomAcheteur" :class="inputClass" v-model="donneesCompte.utilisateurCompte.utilisateurNomAcheteur">
        <p v-else :class="readonlyCompteDataClass" id="utilisateurNomAcheteur">{{ donneesCompte.utilisateurCompte.utilisateurNomAcheteur }}</p>
    </div>
    <div>
        <p class="inline">Prénom : </p>
        <input v-if="modificationCompteEnCours" id="prenomUtilisateur" :class="inputClass" v-model="donneesCompte.utilisateurCompte.prenomUtilisateur">
        <p v-else :class="readonlyCompteDataClass" id="prenomUtilisateur">{{ donneesCompte.utilisateurCompte.prenomUtilisateur }}</p>
    </div>

    <div v-if="modificationCompteEnCours">
        <button :class="basicButtonClass" @click="enregistrerModifications">Enregister</button>
        <button :class="basicButtonClass" @click="annulerModifications">Annuler</button>
    </div>
    <div v-else>
        <button v-if="!modificationCompteEnCours" :class="basicButtonClass" @click="modificationCompteEnCours = true">Modifier le compte</button>
        <button v-if="!modificationCompteEnCours" :class="basicButtonClass" @click="popupModificationMdpAffichee = true">Modifier le mot de passe</button>
    
        <button :class="basicButtonClass">  <!-- Sans utilisation de <button> le css fait des trucs bizarres -->
            <RouterLink :to="{name: 'donnees-bancaires'}">Modifier mes données bancaires</RouterLink>
        </button>
    
        <button :class="deleteButtonClass" @click="supprimerCompte">Supprimer le compte</button>
    </div>

</div>

<p v-else class="text-xl mx-auto max-w-7xl px-4 pb-8">Chargement...</p>


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
        <ul>
            <VerificationMdpComponent :motDePasse="donnesPopupModicatMdp.nouveauMdp" ref="variablesDeVerificationMdp"/>
            <li :class="stytleConditionMdpChampsVerificationDifferents">Les deux champs de mot de passe sont écrits différemment</li>
            <li :class="stytleConditionMdpUnChampVide">Un ou plusieurs champs sont vides, ne peux pas continuer</li>
            <li :class="stytleConditionMdpActuelDifferent">Le mot de passe actuel est différent par rapport à celui écrit</li>
        </ul>
        <div class="flex items-center justify-center space-x-2">
            <button :class="basicButtonClass" @click="cacherPopup">Annuler</button>
            <button :class="basicButtonClass" @click="enregistrerMdp">Enregistrer</button>
        </div>
    </div>
</div>

</template>