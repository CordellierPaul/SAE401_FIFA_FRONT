<script setup>
import { onMounted, ref } from "vue"

const props = defineProps({
  id: Number,
  nom: String
});

const image = ref("")

const produit = ref()
const variantesProduit = ref([])

const varianteProduitPrix = ref()
const varianteProduitPromo = ref()
const variantProduitPrixAvecPromo = ref()



async function fetchProductImagePath() {

  let response;

  response = await fetch("https://apififa2.azurewebsites.net/api/produit/getanimageofproduitbyid/" + props.id, {
      method: "GET",
      mode: "cors"
  })

  if (response.status === 404) {
    image.value = "/images/image_pas_trouvee.jpg"
    return
  }

  image.value = await response.text()

  const secondResponse = await fetch(`https://apififa2.azurewebsites.net/api/produit/getbyid/${props.id}`, {
            method: "GET",
            mode: "cors"
        })

  produit.value = await secondResponse.json()
  variantesProduit.value = produit.value.variantesProduit
  varianteProduitPromo.value = variantesProduit.value[0].varianteProduitPromo
  varianteProduitPrix.value = variantesProduit.value[0].varianteProduitPrix

  // calcul du prix avec promo
  if (varianteProduitPrix.value) {
      variantProduitPrixAvecPromo.value = (varianteProduitPrix.value - (varianteProduitPrix.value * varianteProduitPromo.value)).toFixed(2);
  }   
}

onMounted(fetchProductImagePath)


</script>

<template>
  <div class="card  w-96 h-96 bg-neutral-400 shadow-xl overflow-hidden">
    <RouterLink  :to="{
                name: 'produit', 
                params:{
                    id: id
                }}">
      <figure class="relative h-96 flex flex-col">
        <img v-if="image" :src="'/~sa13/' + image" alt="Image du produit" class="  hover:grayscale hover:brightness-50" />
        <div class="card-body h-1/2 bottom-0 w-full absolute bg-neutral-400/90 ">
          <p class="bg-accent h-fit w-fit flex justify-center items-center px-2 py-1 rounded-full  text-white">NOUVEAU</p>
          <h2 class="card-title text-white"  v-if="produit">{{produit.produitNom}}</h2>
          <div class="flex">
            <p class="text-white font-medium" v-if="varianteProduitPrix && varianteProduitPromo && variantProduitPrixAvecPromo"  >{{ variantProduitPrixAvecPromo}}€</p>
            <p class="ml-5 line-through text-white font-light" v-if="varianteProduitPrix">{{varianteProduitPrix}}€</p>
          </div>
        </div>
        <div class="cursor-pointer absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center opacity-0 transition-opacity hover:opacity-100">
          <p class="text-white text-lg ">Voir plus</p>
        </div>
      </figure>

      
    </RouterLink>
  </div>
</template>
