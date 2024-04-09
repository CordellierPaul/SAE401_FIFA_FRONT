<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import useCompteStore from "../store/compte.js";


const compteStore = useCompteStore();

const themes = ref([]);
const router = useRouter();

const votes = ref([]);

async function fetchThemes() {
  try {
    const response = await fetch('https://apififa2.azurewebsites.net/api/Theme', {
      method: 'GET',
      mode: 'cors'
    });

    themes.value = await response.json();
  } catch (error) {
    console.error('Erreur lors de la récupération des thèmes :', error);
  }
}

async function fetchVotes() {
        try {
        const responseVote = await fetch(`https://apififa2.azurewebsites.net/api/Vote`, {
            method: 'GET',
            mode: 'cors'
        });

        votes.value = await responseVote.json();


        } catch (error) {
        console.error('Erreur lors de la récupération des votes :', error);
        }

       
    }

  function redirectToVotePage(themeId) {
    router.push({ name: 'vote', query: { id: themeId } });
  }

  function redirectToConnexion() {
    router.push({ name: 'login' });
  }

  onMounted(async () => {
        await fetchThemes();
        await fetchVotes();
      })
      
  function dejaVote(themeId) {
    for (var vote of votes.value) {
        if (
            vote.utilisateurId === parseInt(compteStore.utilisateur[0].utilisateurId, 10) &&
            vote.themeId === themeId
        ) {
            return true;
        }
    }
    return false;
}

</script>


<template>
    
    <div class="sticky top-20 z-[5] bg-secondary p-4 flex  items-center text-white min-h-20" >

        <!-- Liens entre les pages -->
        <div class="text-sm breadcrumbs hidden lg:block">
            <ul>
                <li><RouterLink :to="{name: 'index'}" class="hover:opacity-50 hover:cursor-pointer">FIFA</RouterLink></li> 
                <li><a @click= "retour"  class="hover:opacity-50 hover:cursor-pointer">Thèmes</a></li>
            </ul>
        </div>
    </div>
  <div>
    <!-- Liste des thèmes -->
    <h1 class="flex justify-center items-center m-12 text-3xl font-bold">Liste des thèmes :</h1>
    <br>
    <div class="grid grid-cols-3 gap-4 place-content-stretch ">
      <div v-for="theme in themes" :key="theme.themeId" class="collapse collapse-arrow bg-base-300 p-5">
        <p class="flex justify-center font-bold p-12"> {{ theme.themeLibelle }} </p>
        <template v-if="compteStore.isConnected && !dejaVote(theme.themeId)">
            <!-- Utilisateur connecté -->
            <button class="btn btn-outline btn-primary" @click="redirectToVotePage(theme.themeId)">
                Voter
            </button>
        </template>
        <template v-if="compteStore.isConnected && dejaVote(theme.themeId)">
            <!-- Déjà Voté -->
            <button class="btn btn-outline btn-primary">
                Vous avez déjà voté
            </button>
        </template>
        <template v-if="!compteStore.isConnected">
            <!-- Utilisateur non connecté -->
            <button class="btn btn-outline btn-primary" @click="redirectToConnexion()" >Connectez-vous pour voter</button>
        </template>
      </div>
    </div>
    <br>
  </div>
</template>