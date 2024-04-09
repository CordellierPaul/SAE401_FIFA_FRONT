<script setup>
  import { ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import useCompteStore from "../store/compte.js";

  const compteStore = useCompteStore();
  const router = useRouter();
  const commandes = ref([]);
  const userId = compteStore.utilisateur[0].utilisateurId
  //const userId = 5

    async function fetchCommandes() {
        try {
            const responseCommande = await fetch(`https://apififa2.azurewebsites.net/api/Commande/GetCommandesByUserId/${userId}`, {
                method: 'GET',
                mode: 'cors'
            });


            commandes.value = await responseCommande.json();

        } catch (error) {
            console.error('Erreur lors de la récupération des commandes :', error);
        }
    }

    onMounted(async () => {
        await fetchCommandes();
    })

    function voirDetails(commande) {
        router.push({ name: 'commande', params: { id: commande.commandeId } });
    }
</script>

<template>
    <template v-if="commandes.length > 0">
        <table class="table table-zebra">
        <thead>
            <tr>
            <th>Date de commande</th>
            <th>État de commande</th>
            <th>Date de livraison</th>
            <th>Action</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(commande, index) in commandes" :key="index">
            <td>{{ commande.commandeDateCommande }}</td>
            <td>{{ commande.commandeEtatCommande }}</td>
            <td>{{ commande.commandeDateLivraison }}</td>
            <td><button @click="voirDetails(commande)">Voir plus</button></td>
            </tr>
        </tbody>
        </table>
    </template>
    <template v-else>
        <div>Vous n'avez effectué aucune commande...</div>
    </template>
</template>
