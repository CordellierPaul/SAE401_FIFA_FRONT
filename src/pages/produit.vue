<template>
    
    <div class="sticky top-20 z-[5] bg-secondary p-4 flex  items-center text-white min-h-20" >

        <!-- Liens entre les pages -->
        <div class="text-sm breadcrumbs hidden lg:block">
            <ul>
                <li><RouterLink :to="{name: 'index'}" class="hover:opacity-50 hover:cursor-pointer">FIFA</RouterLink></li> 
                <li><a @click= "retour"  class="hover:opacity-50 hover:cursor-pointer">Produits</a></li> 
                <!-- Titre de la page actuelle -->
                <li>{{ produit.produitNom }}</li>
            </ul>
        </div>
    </div>


    <div class="flex ">
        <div  class=" flex justify-center items-center bg-base-200  lg:block w-1/2 p-2 mr-1">
  
            <img v-if="image" :src="'/~sa13/' + image" alt="">

        </div>

        

        <div  class="bg-base-200 w-1/2  p-2 ml-1" >
            <p class="text-2xl font-bold" v-if="produit">{{produit.produitNom}}</p>
            <div class="flex gap-2">
                <p class="text-xl" v-if="variantesProduit[variantesSelectionne]"  >{{   (variantesProduit[variantesSelectionne].varianteProduitPrix - (variantesProduit[variantesSelectionne].varianteProduitPrix * variantesProduit[variantesSelectionne].varianteProduitPromo)).toFixed(2)}} €</p>
                <p class="text-xl font-light line-through" v-if="variantesProduit[variantesSelectionne]">{{variantesProduit[variantesSelectionne].varianteProduitPrix}}€</p>
            </div>


            <div  class="flex gap-1">
                <p class="font-bold">TAILLE :</p>
                <p v-if="VarianteStocks[TailleSelectionner]">{{ VarianteStocks[TailleSelectionner].tailleStockee.tailleLibelle }}</p>
            </div>
            <div id="container" class="flex flex-wrap gap-2 p-2">
                <template v-for="(stock, index) in VarianteStocks" :key="index" >
                    <button v-if="stock.varianteProduitId == variantesProduit[variantesSelectionne].varianteProduitId" @click="TailleSelectionner = stock.tailleStockee.tailleId-1"
                    v-bind:class="{'btn btn-square btn-outline flex gap-2' : stock.quantiteStockee !=0, 'btn btn-square btn-outline btn-disabled':stock.quantiteStockee ==0,
                    'btn btn-square btn-accent btn-outline flex gap-2' : TailleSelectionner+1 == stock.tailleStockee.tailleId }">
                        {{ stock.tailleStockee.tailleLibelle }}
                    </button>
                </template >
            </div>


            <div class="flex gap-1">
                <p class="font-bold">COULEUR :</p>
                <p v-if="coloris[variantesSelectionne]">{{ coloris[variantesSelectionne].colorisNom }}</p>
            </div>
            <div v-if="colorisHexa" class="flex gap-2">
                <div  v-for="(hexa, index) in colorisHexa" :key="index" :class="hexa" @click="variantesSelectionne = index, TailleSelectionner = ref()" class="size-8 border-solid border-black border-2 hover:cursor-pointer hover:opacity-75  ">

            </div>

            </div>

            <button class="btn btn-block btn-accent text-white my-5" @click="ajoute(produit, variantesProduit[variantesSelectionne], VarianteStocks[TailleSelectionner], image, coloris[variantesSelectionne])">AJOUTER AU PANIER</button>
            
            
            <p class="font-semibold">Description</p>
            <p class="my-5" v-if="produit.produitDescription">{{ produit.produitDescription }}</p>
            <p class="my-5 opacity-50" v-else>Pas de déscription</p>  
        </div>    
    </div>
    
    <div class="p-2 w-full bg-base-200 mt-2">
        <p class="text-2xl font-bold">Produits associés</p>
        <div id="container" class="flex overflow-x-auto w-full gap-10 p-2" v-if="listIdProduitsSimilaire">
            <ProduitComponent class="min-w-96" v-for="id in listIdProduitsSimilaire" :id="id" :key="id" />
        </div>
        <div v-else v-for="i in 5" >
            <div class="flex flex-col gap-4 w-52">
                <div class="skeleton h-32 w-full"></div>
                <div class="skeleton h-4 w-28"></div>
                <div class="skeleton h-4 w-full"></div>
                <div class="skeleton h-4 w-full"></div>
            </div>
        </div>
    </div>
  
    <!-- FENETRE MODAL EN CAS DE TAILLE NON SELECTIONNER -->
    <dialog id="modal_taille_non_choisis" class="modal">
      <div class="modal-box">
        <h3 class="font-bold text-lg">Attention!</h3>
        <p class="py-4">Vous devez choisir une taille.</p>
        <div class="modal-action">
          <form method="dialog">
            <button class="btn">OK</button>
          </form>
        </div>
      </div>
    </dialog>
  
  <!-- FENETRE MODAL EN CAS DE STOCK MAX -->
  <dialog id="modal_quantite_max_choisis" class="modal">
    <div class="modal-box">
      <h3 class="font-bold text-lg">Impossible d'ajouter ce produit.</h3>
      <p class="py-4">Vous avez déjà la quantitée maximum pour ce produit dans votre panier. </p>
      <div class="modal-action">
        <form method="dialog">
          <button class="btn">OK</button>
        </form>
      </div>
    </div>
  </dialog>
    
</template>
    
<script setup>

    import usePanierStore from "../store/panier.js"
    import { defineProps, ref, onMounted, watch, watchEffect } from 'vue';
    import { useRoute,useRouter } from 'vue-router';
    import ProduitComponent from '@/components/ProduitComponent.vue';
    import { isProxy, toRaw } from 'vue';
    
    const panierStore = usePanierStore()
    const router = useRouter();
    const route = useRoute();

    const props = defineProps({
        
    });

    //Pour ajouter le produit dans le panier
    function ajoute(produit, variante, stock, image, coloris) {
        if(stock == null){
            modal_taille_non_choisis.showModal();
            return;
        }
        if(!panierStore.augmentationPossible(stock)){            
            modal_quantite_max_choisis.showModal();
            return;
        }
        panierStore.add(produit, variante, stock, image, coloris)
    }

    // Pour retourner à la page précédente

    function retour (){
        router.back()
    }

    // Pour le data

    const produit = ref([])

    const variantesProduit = ref([])
    const variantesSelectionne =ref(0)

    



    const variantProduitPrixAvecPromo = ref()
     

    const produitsSimilaire = ref()
    const listIdProduitsSimilaire = ref([])

    const coloris = ref([])
    const colorisHexa = ref([])

    const image = ref()

    const tailles = ref()
    const TailleSelectionner = ref(0)
    const VarianteStocks = ref([])

    watchEffect(()=>{

        fetchProduit()
        colorisHexa.value =[]
        window.scrollTo({
            top: 0,
            behavior: 'smooth' 
        });
    },{
        deep: true
    });

    async function fetchProduit() {
        const firstResponse = await fetch(`https://apififa2.azurewebsites.net/api/produit/getbyid/${route.params.id}`, {
            method: "GET",
            mode: "cors"
        })

        produit.value = await firstResponse.json()
        variantesProduit.value = produit.value.variantesProduit

        variantProduitPrixAvecPromo.value = (
        variantesProduit.value[variantesSelectionne.value].varianteProduitPrix 
        - (variantesProduit.value[variantesSelectionne.value].varianteProduitPrix 
        * variantesProduit.value[variantesSelectionne.value].varianteProduitPromo)).toFixed(2)
       

        // pour avoir les produits similaires
        if (produit.value.produitSimilaireLienUn.length != 0) {
            produitsSimilaire.value = produit.value.produitSimilaireLienUn 
            produitsSimilaire.value.forEach(produit => {
    
                listIdProduitsSimilaire.value.push(produit.produitDeuxId)
            });
            
        }
        else{
            produitsSimilaire.value = produit.value.produitSimilaireLienDeux 
            produitsSimilaire.value.forEach(produit => {
                
                listIdProduitsSimilaire.value.push(produit.produitUnId)
            });
        }
        
        

        // pour avoir les coloris 

        let r
        let c

        for (const variante of variantesProduit.value) {
            r = await fetch(`https://apififa2.azurewebsites.net/api/coloris/getbyid/${variante.colorisId}`, {
                method: "GET",
                mode: "cors"
            });
            c = await r.json();
            coloris.value.push(c);

            if (variante.colorisNom == 1) {
                colorisHexa.value.push("bg-orange-200")
            }
            else if (variante.colorisId == 2){
                colorisHexa.value.push("bg-black")
            }
            else if (variante.colorisId == 3){
                colorisHexa.value.push("bg-blue-500")
            }
            else if (variante.colorisId == 4){
                colorisHexa.value.push("bg-green-500")
            }
            else if (variante.colorisId == 5){
                colorisHexa.value.push("bg-gray-500")
            }
            else if (variante.colorisId == 6){
                colorisHexa.value.push("bg-gradient-to-bl from-violet-600 via-yellow-400 to-green-600")
            }
            else if (variante.colorisId == 7){
                colorisHexa.value.push("bg-blue-800")
            }
            else if (variante.colorisId == 8){
                colorisHexa.value.push("bg-orange-500")
            }
            else if (variante.colorisId == 9){
                colorisHexa.value.push("bg-pink-500")
            }
            else if (variante.colorisId == 10){
                colorisHexa.value.push("bg-red-500")
            }
            else if (variante.colorisId == 11){
                colorisHexa.value.push("bg-white")
            }
            else if (variante.colorisId == 12){
                colorisHexa.value.push("bg-yellow-500")
            }
            else if (variante.colorisId == 13){
                colorisHexa.value.push("bg-purple-500")
            }
        }

        //pour avoir les tailles

        let stocks
        let t

        VarianteStocks.value = []
        for (const variante of variantesProduit.value) {
            stocks = await fetch(`https://apififa2.azurewebsites.net/api/Stock/GetByVarianteId?ids=${variante.varianteProduitId}`, {
                method: "GET",
                mode: "cors"
            });
            t = await stocks.json();
            t.forEach(stock => {
                VarianteStocks.value.push(stock)
            });
        }

        // pour avoir l'image 
        const thirdResponse = await fetch(`https://apififa2.azurewebsites.net/api/produit/getanimageofproduitbyid/${route.params.id}`, {
            method: "GET",
            mode: "cors"
        })

        if (thirdResponse.status === 404) {
            image.value = "/images/image_pas_trouvee.jpg"   
        }else{
            image.value = await thirdResponse.text()
        }

    }



</script>

<style scoped>
</style>
    