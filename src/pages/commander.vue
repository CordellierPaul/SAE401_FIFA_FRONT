<script setup>
    import usePanierStore from "../store/panier.js"
    import CommanderProduitComponent from '@/components/commander/ProduitComponent.vue';
    import StepInscription from '@/components/commander/StepInscription.vue';
    import StepLivraison from '@/components/commander/StepLivraison.vue';
    import StepPaiement from '@/components/commander/StepPaiement.vue';
    import { onMounted, ref, watchEffect } from 'vue';
    
    const panierStore = usePanierStore()
    
    const livraisons = ref([])
    const livraisonChoisis = ref(0)
    const step = ref('inscription')

    function prixPresision2(prix){
        return parseFloat(prix).toFixed(2)
    }

    
    async function fetchLivraisons() {
        const livResponse = await fetch("https://apififa2.azurewebsites.net/api/livraison ", {
            method: "GET",
            mode: "cors"
        })

        livraisons.value = await livResponse.json()
    }

    onMounted(fetchLivraisons)

    function scrollTop(){

        console.log("oui");
        
        window.scrollTo({
            top: 0,
            behavior: 'smooth' 
        });

    }

</script>

<template>

    
    <div class="flex w-full ">
        <!-- Partie gauche -->
        <div class="flex items-center  flex-col w-7/12 bg-base-200 p-2 mr-1" >
            
            <StepInscription  v-if="step === 'inscription'" @next="step = 'livraison'" ></StepInscription>
            <StepLivraison  v-if="step === 'livraison'" @next="step = 'paiement'" @previous="step = 'inscription'" v-model="livraisonChoisis" :livraisons="livraisons"></StepLivraison>
            <StepPaiement  v-if="step === 'paiement'"  @previous="step = 'livraison'"></StepPaiement>
        </div>

        <!-- Partie droite -->
        <div class="flex flex-col min-h-fit w-5/12 bg-base-200 p-2 ml-1" >
            
            <div v-for="index in panierStore.getProduits.length"class="flex flex-col gap-2 h-76 overflow-auto p-2">
                <CommanderProduitComponent :prz="((panierStore.getVariantes[index-1].varianteProduitPrix * (1- panierStore.getVariantes[index-1].varianteProduitPromo))* panierStore.getQuantites[index-1]).toFixed(2)" :oldprz="(panierStore.getVariantes[index-1].varianteProduitPrix* panierStore.getQuantites[index-1]).toFixed(2)" :clr="panierStore.getColoris[index-1].colorisNom" :size="panierStore.getStocks[index-1].tailleStockee.tailleLibelle" :qte="panierStore.getQuantites[index-1].toString()" :title="panierStore.getProduits[index-1].produitNom" :img="panierStore.getImages[index-1]"></CommanderProduitComponent>
            </div>
            
            <div class="">
                <div class="bg-base-200 p-5">
                    <p class="font-semibold">Utiliser un code promo</p>
                    <div class="my-2">
        
                        <p class="text-xs pb-1">Votre code:</p>
                        <div class="flex">
                            <input type="text" placeholder="Code promo" class="input input-bordered w-full max-w-xs mx-2" />
                            <input type="button" class="btn btn-accent text-white" value="Valider">
                        </div>
                    </div>
                </div>
                <div class="bg-base-200 p-5">
                    <div class="flex justify-between">
                        <div class="flex items-center">
                            <p>Sous-total</p>
                            <p class="mx-1 font-normal text-sm">({{ panierStore.count }})</p>
                        </div>
                        <p>{{ prixPresision2(panierStore.sousTotal) }} €</p>
                    </div>
                    <div class="divider"></div> 
                    <div>
                        <div class="flex justify-between">
                            <p>Livraison</p>
                            <div v-if="livraisons.length >1" class="flex gap-1">
                                <p>{{livraisons[livraisonChoisis].livraisonType}}</p>
                                <p>({{prixPresision2(livraisons[livraisonChoisis].livraisonPrix)}}€)</p>
                            </div>
                        </div>
                    </div>
                    <div class="divider"></div> 
                    <div>
                        <div class="flex justify-between my-5 min-w-72">
                            <div class="flex justify-center items-end">
                                <p class="text-xl font-bold">TOTAL</p>
                                <p class="mx-1">(TVA incluse)</p>
                            </div>
                            <p v-if="livraisons.length >1" class="text-2xl font-semibold">{{ parseFloat(panierStore.sousTotal) + livraisons[livraisonChoisis].livraisonPrix}} €</p>
                        </div>
                    </div>
                </div>
            </div>
            
        </div>
    </div>
    
</template>