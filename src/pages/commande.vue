<script setup>
    import { ref, onMounted } from 'vue';
    import { useRouter, useRoute } from 'vue-router';

    const router = useRouter();
    const route = useRoute();
    const commandeId = route.params.id;
    const lignesCommande = ref([]);
    const variantesProduits = ref([]);
    const produits = ref([]);
    const produit = ref()


    async function fetchLignesCommandes() {
        try {
            const responseLigneCommande = await fetch(`https://apififa2.azurewebsites.net/api/LigneCommande/GetByCommandeId/${commandeId}`, {
                method: 'GET',
                mode: 'cors'
            });

            lignesCommande.value = await responseLigneCommande.json();

            for (const ligneCommande of lignesCommande.value) {
                const responseVarianteProduit = await fetch(`https://apififa2.azurewebsites.net/api/VarianteProduit/GetById/${ligneCommande.varianteProduitId}`, {
                    method: 'GET',
                    mode: 'cors'
                });
                const varianteProduit = await responseVarianteProduit.json();

                const responseProduit = await fetch(`https://apififa2.azurewebsites.net/api/Produit/GetById/${varianteProduit.produitId}`, {
                    method: 'GET',
                    mode: 'cors'
                });

                const produit = await responseProduit.json();

                ligneCommande.produitId = produit.produitId; // Ajouter l'ID du produit à la ligne de commande
            }


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

                variantesProduits.value.push(varianteProduit)


                const responseProduit = await fetch(`https://apififa2.azurewebsites.net/api/Produit/GetById/${varianteProduit.produitId}`, {
                method: 'GET',
                mode: 'cors'
                });

                produit.value = await responseProduit.json();

                //console.log(JSON.stringify(produit.value))

                produits.value.push(produit.value);
            }
        } catch (error) {
        console.error('Erreur lors de la récupération des produits :', error);
        }
    }

    onMounted(async () => {
        await fetchLignesCommandes();
        await fetchProduits();
    })

    function voirDetails(ligneCommande) {
        router.push({ name: 'produit', params: { id: ligneCommande.produitId } });
    }

    function getNomProduit(ligneCommande) {
        const varianteProduit = variantesProduits.value.find(varianteProduit => varianteProduit.varianteProduitId === ligneCommande.varianteProduitId);
        
        if (varianteProduit) {

            const produit = produits.value.find(produit => produit.produitId === varianteProduit.produitId);
            if (produit) {
                return produit.produitNom;
            } else {
                return 'Produit introuvable';
            }
        } else {
            return 'Variante de produit introuvable';
        }
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
            <td>{{ ligneCommande.ligneCommandeQuantite }}</td>
            <td>{{ ligneCommande.ligneCommandePrix }}</td>
            <td><button @click="voirDetails(ligneCommande)">Voir plus</button></td>
            </tr>
        </tbody>
        </table>
    </template>
    <template v-else>
        <div>Vous n'avez effectué aucune commande...</div>
    </template>
</template>