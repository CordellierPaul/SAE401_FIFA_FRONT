<script setup>
    import { getRequest } from '@/composable/httpRequests';
    import { ref, onMounted } from 'vue';
    import { useRoute, useRouter } from 'vue-router';
    import useCompteStore from "../store/compte.js";


    const compteStore = useCompteStore();


    const router = useRouter();
    const route = useRoute();


    const commandes = ([])


    async function fetchCommandes() {
        try {
        const responseCommande = await fetch(`https://apififa2.azurewebsites.net/api/Commande/`, {
            method: 'GET',
            mode: 'cors'
        });

        joueurs.value = await responseCommande.json();


        } catch (error) {
        console.error('Erreur lors de la récupération des joueurs :', error);
        }
    }

    onMounted(async () => {
      await fetchCommandes();
    })

</script>


<template>



</template>