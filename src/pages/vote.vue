<script setup>
    import { getRequest } from '@/composable/httpRequests';
    import { ref, onMounted } from 'vue';
    import { useRoute, useRouter } from 'vue-router';
    import useCompteStore from "../store/compte.js";


    const compteStore = useCompteStore();

    
    const router = useRouter();
    const route = useRoute();
    const joueurs = ref([]);
    const votes = ref([]);
    const theme = ref();
    const utilisateur = ref();
    let dejaVote = false;

    async function fetchTheme() {
        try {
        const responseTheme = await fetch(`https://apififa2.azurewebsites.net/api/Theme/getbyid/${route.query.id}`, {
            method: 'GET',
            mode: 'cors'
        });

        theme.value = await responseTheme.json();

        } catch (error) {
        console.error('Erreur lors de la récupération du theme :', error);
        }
    }


    const props = defineProps({
    });

    
    function retour (){
        router.back()
    }


    async function fetchJoueurs() {
        try {
        const responseJoueurs = await fetch(`https://apififa2.azurewebsites.net/api/Theme/GetJoueursByThemeId/${route.query.id}`, {
            method: 'GET',
            mode: 'cors'
        });

        joueurs.value = await responseJoueurs.json();


        } catch (error) {
        console.error('Erreur lors de la récupération des joueurs :', error);
        }
    }


    async function fetchVotes() {
        try {
        const responseVote = await fetch(`https://apififa2.azurewebsites.net/api/Vote`, {
            method: 'GET',
            mode: 'cors'
        });

        votes.value = await responseVote.json();


        for(var vote of votes.value){

          console.log(vote.utilisateurId)
          console.log(compteStore.utilisateur[0].utilisateurId)
          console.log(vote.themeId)
          console.log(route.query.id)

          if (
            vote.utilisateurId === parseInt(compteStore.utilisateur[0].utilisateurId, 10) &&
            vote.themeId === parseInt(route.query.id, 10)
          ) {
            dejaVote = true;
            break;
          }

        }
        console.log(dejaVote)

        } catch (error) {
        console.error('Erreur lors de la récupération des votes :', error);
        }

       
    }

    onMounted(async () => {
      await fetchTheme();
      await fetchJoueurs();
      await fetchVotes();
    })

    async function voter() {
      
      if(!dejaVote){
        const selectedPlayers = new Set();
    
        // Récupérer les joueurs sélectionnés à partir des sélecteurs nommés
        const joueur1Id = document.querySelector('select[name="joueur1"]').value;
        const joueur2Id = document.querySelector('select[name="joueur2"]').value;
        const joueur3Id = document.querySelector('select[name="joueur3"]').value;

        // Vérifier si les joueurs sont sélectionnés
        if (!joueur1Id || !joueur2Id || !joueur3Id) {
          my_modal_1.showModal();
          return;
        }

        // Vérifier si les joueurs sélectionnés sont différents
        if (joueur1Id === joueur2Id || joueur1Id === joueur3Id || joueur2Id === joueur3Id) {
          my_modal_1.showModal();
          return;
        }

        // Ajouter les joueurs sélectionnés à l'ensemble
        selectedPlayers.add(joueur1Id);
        selectedPlayers.add(joueur2Id);
        selectedPlayers.add(joueur3Id);


        const userId = parseInt(compteStore.utilisateur[0].utilisateurId,10);
        //const userId = 17;
        const themeId = route.query.id;
        const votes = [];

        // Première itération
        let vote1 = {
            utilisateurId: userId,
            themeId: parseInt(themeId, 10),
            joueurId: parseInt(joueur1Id, 10),
            voteNote: 1
        };
        votes.push(vote1);

        // Deuxième itération
        let vote2 = {
            utilisateurId: userId,
            themeId: parseInt(themeId, 10),
            joueurId: parseInt(joueur2Id, 10),
            voteNote: 2
        };
        votes.push(vote2);

        // Troisième itération
        let vote3 = {
            utilisateurId: userId,
            themeId: parseInt(themeId, 10),
            joueurId: parseInt(joueur3Id, 10),
            voteNote: 3
        };
        votes.push(vote3);


        for (let vote of votes) {
          try {
            const response = await fetch('https://apififa2.azurewebsites.net/api/Vote/Ajout', {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(vote)
            });

            console.log(JSON.stringify(vote))

            if (!response.ok) {
              throw new Error('Erreur lors de la requête.');
            }
            //alert('Votre vote a été enregistré avec succès.');
          } catch (error) {
            console.error('Erreur lors de la requête fetch :', error);
          }
        }

        dejaVote = true;
    }else{
      my_modal_2.showModal();
    }
  }

</script>

<template>

  <div class="sticky top-20 z-[5] bg-secondary p-4 flex  items-center text-white min-h-20" >
    <!-- Liens entre les pages -->
    <div class="text-sm breadcrumbs hidden lg:block">
        <ul>
            <li><RouterLink :to="{name: 'index'}" class="hover:opacity-50 hover:cursor-pointer">FIFA</RouterLink></li> 
            <li><a @click= "retour"  class="hover:opacity-50 hover:cursor-pointer">Thèmes</a></li> 
            <!-- Titre de la page actuelle -->
            <li>{{ theme ? theme.themeLibelle : '' }}</li>
        </ul>
    </div>
  </div>

  <div>
    <!-- Affichage des joueurs -->
    <h1 class="flex justify-center items-center m-12 text-3xl font-bold">Liste des joueurs</h1>
    <div class="grid grid-cols-3 gap-4 place-content-stretch ">
      <div v-for="joueur in joueurs" :id="joueur.joueurId" class="card w-96 bg-base-100 shadow-xl gap-4">
        <h2 class="card-title">{{ joueur.joueurNom, joueur.joueurPrenom }}</h2>
        <p>Poids : {{ joueur.joueurPoids }}</p>
        <p>Taille : {{ joueur.joueurTaille }}</p>
        <p>{{ joueur.joueurDescription }}</p>
      </div>
    </div>
  </div>

<template v-if="!dejaVote">

  <div>

      <!-- Selects -->
      <div class="grid grid-cols-3 gap-4 place-content-stretch m-12">
        <label class="form-control w-full max-w-xs">
          <div class="label">
            <span class="label-text">Choisissez le meilleur joueur !</span>
          </div>
          <select class="select select-bordered" name="joueur1" id="joueur1">
            <option disabled selected>Selectionnez un joueur</option>
            <option v-for="joueur in joueurs" :key="joueur.joueurId" :value="joueur.joueurId">{{ joueur.joueurNom, joueur.joueurPrenom }}</option>
          </select>
        </label>
        
        <label class="form-control w-full max-w-xs">
          <div class="label">
            <span class="label-text">Choisissez le joueur de la 2ème position !</span>
          </div>
          <select class="select select-bordered" name="joueur2" id="joueur2">
            <option disabled selected>Selectionnez un joueur</option>
            <option v-for="joueur in joueurs" :key="joueur.joueurId" :value="joueur.joueurId">{{ joueur.joueurNom, joueur.joueurPrenom }}</option>
          </select>
        </label>

        
        <label class="form-control w-full max-w-xs">
          <div class="label">
            <span class="label-text">Choisissez le joueur de la 3ème position !</span>
          </div>
          <select class="select select-bordered" name="joueur3" id="joueur3">
            <option disabled selected>Selectionnez un joueur</option>
            <option v-for="joueur in joueurs" :key="joueur.joueurId" :value="joueur.joueurId">{{ joueur.joueurNom, joueur.joueurPrenom }}</option>
          </select>
        </label>
      </div>
    
        <br>
        <br>
        <button class="btn btn-primary text-white text-2xl" @click="voter">
          Voter 
        </button>
  
      <!-- FENETRE MODAL EN CAS DE VOTE NON OK -->
      <dialog id="my_modal_1" class="modal">
        <div class="modal-box">
          <h3 class="font-bold text-lg">Attention!</h3>
          <p class="py-4">Vous devez choisir trois joueurs différents.</p>
          <div class="modal-action">
            <form method="dialog">
              <button class="btn">OK</button>
            </form>
          </div>
        </div>
      </dialog>

      <!-- FENETRE MODAL EN CAS DE VOTE DEJA FAIT -->
      <dialog id="my_modal_2" class="modal">
        <div class="modal-box">
          <h3 class="font-bold text-lg">Attention!</h3>
          <p class="py-4">Vous ne pouvez pas modifier un vote déjà fait.</p>
          <div class="modal-action">
            <form method="dialog">
              <button class="btn">OK</button>
            </form>
          </div>
        </div>
      </dialog>
      
        <br>
        <br>
      </div>
  </template>
  <template v-else>
    <!-- Utilisateur non connecté -->
    <p>Vous ne pouvez plus voter</p>
  </template>
  </template>

<style scoped> 
</style>