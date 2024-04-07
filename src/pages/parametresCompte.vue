<script setup>
import { ref, onMounted } from 'vue'
import useCompteStore from "../store/compte.js"
import { useRouter } from "vue-router"
const router = useRouter()

const compteStore = useCompteStore()
const donneesCompte = ref()

const deleteButtonClass = "block bg-red-500 text-white hover:bg-white hover:text-black border border-red-500 rounded-lg py-2 px-4 duration-75 my-2"
const basicButtonClass = "block bg-gray-500 text-white hover:bg-white hover:text-black border border-gray-500 rounded-lg py-2 px-4 duration-75 my-2"

const readonlyCompteDataClass = "inline-block py-1.5"
const inputClass = "inline p-1 w-max border border-gray-200 rounded-lg text-s focus:ring-blue-500 focus:border-blue-500 border-gray-600 focus:ring-blue-500 focus:border-blue-500"

var modificationEnCours = ref(false)

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

function modifierCompte() {
    modificationEnCours.value = true
}

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

    modificationEnCours.value = false
}

async function annulerModifications() {
    donneesCompte.value = undefined
    await fetchCompteData()
    modificationEnCours.value = false
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
</script>

<template>
<!-- Le code HTML est provisoire, puisqu'on va devoir ajouter une modification des champs -->

<p class="flex justify-center items-center m-12 text-3xl font-bold">Paramètres du compte</p>

<div v-if="donneesCompte" class="container mx-auto max-w-7xl px-4 pb-8">

    <p class="text-2xl font-semibold">Informations générales :</p>
    
    <div>
        <p class="inline">Nom d'utilisateur (login) : </p>
        <input v-if="modificationEnCours" id="comptelogin" :class="inputClass" v-model="donneesCompte.comptelogin">
        <p v-else :class="readonlyCompteDataClass" id="comptelogin">{{ donneesCompte.comptelogin }}</p>
    </div>
    <div>
        <p class="inline">Email : </p>
        <input v-if="modificationEnCours" id="compteEmail" :class="inputClass" v-model="donneesCompte.compteEmail">
        <p v-else :class="readonlyCompteDataClass" id="compteEmail">{{ donneesCompte.compteEmail }}</p>
    </div>
    <div>
        <p class="inline">Nom : </p>
        <input v-if="modificationEnCours" id="utilisateurNomAcheteur" :class="inputClass" v-model="donneesCompte.utilisateurCompte.utilisateurNomAcheteur">
        <p v-else :class="readonlyCompteDataClass" id="utilisateurNomAcheteur">{{ donneesCompte.utilisateurCompte.utilisateurNomAcheteur }}</p>
    </div>
    <div>
        <p class="inline">Prénom : </p>
        <input v-if="modificationEnCours" id="prenomUtilisateur" :class="inputClass" v-model="donneesCompte.utilisateurCompte.prenomUtilisateur">
        <p v-else :class="readonlyCompteDataClass" id="prenomUtilisateur">{{ donneesCompte.utilisateurCompte.prenomUtilisateur }}</p>
    </div>

    <button v-if="modificationEnCours" :class="basicButtonClass" @click="enregistrerModifications">Enregister</button>
    <button v-if="modificationEnCours" :class="basicButtonClass" @click="annulerModifications">Annuler</button>
    <button v-else :class="basicButtonClass" @click="modifierCompte">Modifier le compte</button>

    <button :class="basicButtonClass">  <!-- Sans utilisation du bouton le css fait des trucs bizarres -->
        <RouterLink :to="{name: 'donnees-bancaires'}">Modifier mes données bancaires</RouterLink>
    </button>

    <button :class="deleteButtonClass" @click="supprimerCompte">Supprimer le compte</button>

</div>

<p v-else class="text-xl mx-auto max-w-7xl px-4 pb-8">Chargement...</p>

</template>