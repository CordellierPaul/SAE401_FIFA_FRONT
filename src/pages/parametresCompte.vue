<script setup>
import { ref, onMounted } from 'vue'
import useCompteStore from "../store/compte.js"
import { useRouter } from "vue-router"
const router = useRouter()

const compteStore = useCompteStore()
const donneesCompte = ref()

const deleteButtonClass = "block bg-red-500 text-white hover:bg-white hover:text-black border border-red-500 rounded-lg py-2 px-4 duration-75 my-2"
const basicButtonClass = "block bg-gray-500 text-white hover:bg-white hover:text-black border border-gray-500 rounded-lg py-2 px-4 duration-75 my-2"

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

<div v-if="donneesCompte" class="container sm:mx-auto px-5 py-2">

    <p class="text-2xl font-semibold">Informations générales :</p>
    
    <p>Nom d'utilisateur (login) : {{ donneesCompte.comptelogin }}</p>
    <p>Email : {{ donneesCompte.compteEmail }}</p>
    <p>Nom : {{ donneesCompte.utilisateurCompte.utilisateurNomAcheteur }}</p>
    <p>Prénom : {{ donneesCompte.utilisateurCompte.prenomUtilisateur }}</p>

    <p class="text-2xl font-semibold">Commandes :</p>
    <p v-if="donneesCompte.utilisateurCompte.commandesUtilisateur">Vous avez des commandes !</p>
    <p v-else>Vous n'avez pas de commandes pour le moment</p>

    <button :class="basicButtonClass">  <!-- Sans utilisation du bouton le css fait des trucs bizarres -->
        <RouterLink :to="{name: 'donnees-bancaires'}">Modifier mes données bancaires</RouterLink>
    </button>

    <button :class="deleteButtonClass" @click="supprimerCompte">Supprimer le compte</button>

</div>

<p v-else>Chargement...</p>

</template>