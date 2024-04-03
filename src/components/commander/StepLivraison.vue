<template>
    
    <ul class="steps steps-vertical lg:steps-horizontal">
        <li class="step step-primary">Inscritpion</li>
        <li class="step step-primary">Livrasion</li>
        <li class="step">Paiement</li>
    </ul>
    

    <form @submit.prevent action="" class="w-10/12 *:my-2" >


        <p class="text-xl font-medium">LIVRAISON</p>

        <div class="*:my-2 *:flex *:w-full *:justify-between" v-if="livraisons.length >1">

            <div>
                <div class="flex gap-2">
                    <input type="radio" name="radio-1" id="radio_std" class="radio" value="0" v-model="livraisonChoisis" checked/>
                    <label for="radio_std">{{livraisons[0].livraisonType}} (Jusqu'à 4 jours ouvrables)</label>
                </div>
                <p>{{livraisons[0].livraisonPrix}}€</p>
            </div>
            <div class="divider"></div> 
            <div >
                <div class="flex gap-2">
                    <input type="radio" name="radio-1" id="radio_xpr" class="radio" value="1" v-model="livraisonChoisis"/>
                    <label for="radio_xpr">{{livraisons[1].livraisonType}} (Jusqu'à 3 jours ouvrables)</label>
                </div>
                <p>{{livraisons[1].livraisonPrix}}€</p>
            </div>
        </div>

        <div class="flex gap-2 justify-between ">
            <button @click="btPreviousClick" class="btn w-1/12 bg-secondary text-white"><i class="fa-solid fa-chevron-left"></i></button>
            <button @click="btNextClick" class="btn w-10/12 btn-accent text-white">Suite</button>

        </div>
        

    </form>

</template>


<script setup>
import { onMounted, ref } from 'vue';

    const livraisons = ref([])
    
    const livraisonChoisis = defineModel()


    async function fetchLivraisons() {
        const livResponse = await fetch("https://apififa2.azurewebsites.net/api/livraison ", {
            method: "GET",
            mode: "cors"
        })

        livraisons.value = await livResponse.json()
    }

    onMounted(fetchLivraisons)

    const emit = defineEmits(['next','previous'])

    function btPreviousClick() {
        emit('previous')
    }

    function btNextClick() {
        emit('next')
    }

</script>