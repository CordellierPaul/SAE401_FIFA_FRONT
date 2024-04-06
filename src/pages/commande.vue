<script setup>
    import { ref, onMounted } from 'vue';
    import { useRouter } from 'vue-router';

    const router = useRouter();
    const lignesCommande = ref([]);
    const variantesProduits = ref([]);
    const produits = ref([]);

    async function fetchLignesCommandes() {
        try {
        // const responseCommande = await fetch(`https://apififa2.azurewebsites.net/api/LigneCommande/GetByCompteId/id`, {
        //     method: 'GET',
        //     mode: 'cors'
        // });

                
            const responseLigneCommande = await fetch(`https://apififa2.azurewebsites.net/api/LigneCommande/`, {
                method: 'GET',
                mode: 'cors'
            });

            lignesCommande.value = await responseLigneCommande.json();

        } catch (error) {
            console.error('Erreur lors de la récupération des lignes de la commande :', error);
        }
    }

    async function fetchProduits() {
        try {
        for (const ligneCommande of lignesCommande.value) {
            const responseVarianteProduit = await fetch(`https://apififa2.azurewebsites.net/api/VarianteProduit/GetById/${ligneCommande.varianteProduitId}`, {
            method: 'GET',
            mode: 'cors'
            });
            const varianteProduit = await responseVarianteProduit.json();
            variantesProduits.value.pudh(varianteProduit)

            const responseProduit = await fetch(`https://apififa2.azurewebsites.net/api/Produit/GetById/${varianteProduit.produitId}`, {
            method: 'GET',
            mode: 'cors'
            });
            const produit = await responseProduit.json();

            console.log(produit.produitNom)

            produits.value.push(produit);
        }
        } catch (error) {
        console.error('Erreur lors de la récupération des produits :', error);
        }
    }

    onMounted(async () => {
        await fetchLignesCommandes();
        await fetchProduits();
    })

    function voirDetails(commande) {
        router.push({ name: 'produit', params: { id: commande.commandeId } });
    }

    function getNomProduit(ligneCommande) {
        const varianteProduit = variantesProduits.value.find(variantesProduit => variantesProduit.varianteProduitId === ligneCommande.varianteProduitId);
        if (varianteProduit) {
        const produit = produits.value.find(produit => produit.id === varianteProduit.produitId);
        return produit ? produit.nomProduit : 'Produit introuvable';
        }
        return 'Variante de produit introuvable';
    }
</script>

<template>
    <template v-if="lignesCommande.length > 0">
        <table class="table table-zebra">
        <thead>
            <tr>
            <th>Nom du produit</th>
            <th>Quantité</th>
            <th>Prix</th>
            <th>Voir le produit</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(ligneCommande, index) in lignesCommande" :key="index">
            <td>{{ getNomProduit(ligneCommande) }}</td>
            <td>{{ ligneCommande.commandeEtatCommande }}</td>
            <td>{{ ligneCommande.commandeDateLivraison }}</td>
            <td><button @click="voirDetails(ligneCommande)">Voir plus</button></td>
            </tr>
        </tbody>
        </table>
    </template>
    <template v-else>
        <div>Vous n'avez effectué aucune commande...</div>
    </template>
</template>