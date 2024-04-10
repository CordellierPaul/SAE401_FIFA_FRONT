<script setup>
import useCompteStore from "../store/compte.js"
import { useRouter } from "vue-router"
import usePanierStore from "../store/panier.js"
import { ref } from 'vue'

const compteStore = useCompteStore()
const panierStore = usePanierStore()
const router = useRouter()

const searchInput = ref("")

function lancerRecherche() {

  if (!searchInput.value) {
    return
  }

  router.push({ "name" : "produits", "params": { recherche: searchInput.value } })  // on va à la page des produits pour rechercher
}

function deconnexion() {
  compteStore.disconnect()
  router.push({ "name" : "index" })   // on va à la page d'accueil
}

function panierPlus(index) {
  let quantiteStock = panierStore.getStocks[index].quantiteStockee
  let quantiteAchat = panierStore.getQuantites[index]
  if(quantiteStock == quantiteAchat){
    modal_plus_de_stock.showModal()
    return;
  }
  panierStore.augmenteQuantite(panierStore.getStocks[index])

}

</script>

<template>
  <div class="navbar bg-primary sticky top-0 z-50 min-h-20">
    <!-- Menu a droite avec titre + navigation quand petit ecran -->
    <div class="navbar-start">
      <!-- Menu navigation quand petit écran -->
      <div class="dropdown">
        <div tabindex="0" role="button" class="btn btn-ghost lg:hidden">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="white"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
        </div>
        <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-300 rounded-box w-52 z-[2]">
          <li>
            <RouterLink :to="{name: 'produits'}">Produits</RouterLink>
            <ul id="dropDownCenter" class="p-2">
              <li><RouterLink :to="{name: 'produits'}">Maillots</RouterLink></li>
              <li><RouterLink  :to="{name: 'produits'}">Ballons</RouterLink></li>
            </ul>
          </li>
          <li><RouterLink :to="{name: 'contact'}">Contact</RouterLink></li>
          <li><RouterLink :to="{name: 'articles'}">Articles</RouterLink></li>
          <li><RouterLink :to="{name: 'clubs'}">Clubs</RouterLink></li>
          <li><RouterLink :to="{name: 'classement'}">Classement</RouterLink></li>
          <li><RouterLink :to="{name: 'theme'}">Voter pour un theme</RouterLink></li>
        </ul>
      </div>
      <RouterLink :to="{name: 'index'}" class="btn btn-ghost text-3xl text-white">FIFA</RouterLink>
      
    </div>


    <!-- //Menu navigation quand grand écran -->
    <div class="navbar-center hidden lg:flex">
      <ul class="menu menu-horizontal px-1">
        
        <li><RouterLink class="text-white btn btn-primary" :to="{name: 'produits'}">Produits</RouterLink></li>
        <li><RouterLink class="text-white btn btn-primary" :to="{name: 'contact'}">Contact</RouterLink></li>
        <li><RouterLink class="text-white btn btn-primary" :to="{name: 'clubs'}">Clubs</RouterLink></li>
        <li><RouterLink class="text-white btn btn-primary" :to="{name: 'classement'}">Classement</RouterLink></li>
        <li><RouterLink class="text-white btn btn-primary" :to="{name: 'articles'}">Articles</RouterLink></li>
        <li><RouterLink class="text-white btn btn-primary" :to="{name: 'theme'}">Voter pour un theme</RouterLink></li>
      </ul>
    </div>


    <!-- //Partie droite du header-->
    <div class="navbar-end">
      <div class="flex">
        
        <!-- Barre de recherche -->
        <label class="input input-bordered flex items-center gap-2 bg-secondary">
          <input type="text" class="grow text-white" placeholder="Rechercher" v-model="searchInput" v-on:keyup.enter="lancerRecherche"/>
          <div class="p-3" @click="lancerRecherche">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="white" class="w-4 h-4 opacity-70"><path fill-rule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clip-rule="evenodd" /></svg>
          </div>
        </label>

        <!-- SI L'UTILISATEUR EST CONNECTE -->
        <div v-if="compteStore.isConnected" class="dropdown dropdown-end ml-3">
          <div tabindex="0" role="button" class="btn btn-primary hover:opacity-70 btn-circle avatar">
            <div class="w-10 rounded-full ">
              <div class="avatar placeholder">
                <div id="iconeUtilisateur" class="bg-accent text-neutral-content rounded-full w-8">
                  <span class="text-xs">M</span>
                </div>
              </div>
            </div>
          </div>

          <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-300 rounded-box w-52">
            <li>
              <RouterLink class="justify-between" :to="{name: 'commandes'}">
                Vos commandes<span class="badge badge-accent">Nouveau</span>
              </RouterLink>
            </li>
            <li>
              <RouterLink class="justify-between" :to="{name: 'parametres-compte'}" id="lienVersParametresCompte">
                Paramètres
              </RouterLink>
            </li>
            <li><a @click="deconnexion()" id="btDeconnexion">Déconnexion</a></li>
          </ul>
        </div>

        <!-- SI L'UTILISATEUR EST LOGOUT : -->
        <div v-else class="dropdown dropdown-end ml-3">
          <RouterLink :to="{name: 'login'}" id="iconeConnexion">
            <div tabindex="0" role="button" class="btn btn-primary hover:opacity-70 btn-circle flex justify-center items-center">
              <div class="w-10 rounded-full  flex justify-center items-center">
                <i class="fa-solid fa-user text-xl text-white"></i>
              </div>
            </div>
          </RouterLink>
        </div>

        <!-- Partie panier -->
        <div class="dropdown dropdown-end">
          <div tabindex="0" role="button" class="btn btn-primary hover:opacity-70 btn-circle">
            <div class="indicator">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="white"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              <span class="badge badge-sm badge-accent indicator-item">{{ panierStore.count }}</span>
            </div>
          </div>
          <div tabindex="0" class="mt-3 z-[1] card card-compact dropdown-content w-96 bg-base-200 shadow "> 
            <div class="card-body">
              <div class="flex justify-center flex-col items-center">
                <p class="font-bold text-lg">Votre panier</p>
                <p>{{ panierStore.count }} articles</p>
              </div>

              <!-- PANIER VIDE -->
              <div class="h-96" v-if="panierStore.count == 0">
                <div class="h-full flex flex-col justify-center items-center">
                    <p class="flex items-center ">Votre panier est vide !</p>
                    <RouterLink :to="{name: 'produits'}" class="btn-block btn btn-primary text-white">Visiter la boutique</RouterLink>
                </div>
                </div>

              <!-- PANIER PAS VIDE -->
              <div v-else>
                <div class="max-h-96 overflow-y-auto">
                  <div v-for="index in panierStore.getProduits.length" class="flex m-5">
                    <img class="w-32" :src="panierStore.getImages[index-1]" alt="">
                    <div class="mx-3 flex flex-col justify-between">
                      <p>{{ panierStore.getProduits[index-1].produitNom}}</p>
                      <p>Taille : {{ panierStore.getStocks[index-1].tailleStockee.tailleLibelle}}</p>
                      <div class="flex justify-between items-center">
                        <p class="text-base font-bold">{{ ((panierStore.getVariantes[index-1].varianteProduitPrix * (1- panierStore.getVariantes[index-1].varianteProduitPromo))* panierStore.getQuantites[index-1]).toFixed(2) }}</p>
                        <button class="btn btn-circle h-3 w-3" @click="panierStore.baisseQuantite(panierStore.getStocks[index-1])">-</button>
                        <p  class="bg-base-200 font-bold w-7">{{panierStore.getQuantites[index-1]}}</p>
                        <button class="btn btn-circle h-3 w-3" @click="panierPlus(index-1)">+</button>
                        <i class="fa-solid fa-trash ml-2" @click="panierStore.supprimeProduit(panierStore.getStocks[index-1])"></i>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-if="compteStore.isConnected">
                  <RouterLink :to="{name: 'commander'}" class="btn-block btn btn-primary text-white">Payer la commande</RouterLink>
                </div>
                <div v-else class="card-actions">
                  <RouterLink :to="{name: 'login'}" class="btn-block btn btn-primary">Connectez-vous pour passer commande</RouterLink>                  
                </div>
              </div>

            </div>
          </div>
        </div>
        <!-- FENETRE MODAL SI UTILISATEUR DEMANDE PLUS DE PRODUIT ALORS QU'IL N'Y A PAS ASSEZ DE STOCK -->
        <dialog id="modal_plus_de_stock" class="modal">
          <div class="modal-box">
            <h3 class="font-bold text-lg">Action impossible</h3>
            <p class="py-4">Il n'y a plus assez de produits en stock.</p>
          </div>
          <form method="dialog" class="modal-backdrop">
            <button>Fermer</button>
          </form>
        </dialog>
        
      </div>
    </div>

  </div>
</template>