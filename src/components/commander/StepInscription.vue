<template>

    <ul class="steps steps-vertical lg:steps-horizontal">
        <li class="step step-primary">Inscritpion</li>
        <li class="step">Livrasion</li>
        <li class="step">Paiement</li>
    </ul>

    <form @submit.prevent action="" class="w-10/12 *:my-2" >


        
        <p class="text-xl font-medium">COORDONNÉES</p>
        <label class="form-control w-full max-w-s gap-4">
           
            <div v-if="compteStore.utilisateur[0].utilisateurNomAcheteur">
                <p class="input input-bordered w-full ">Nom : {{ compteStore.utilisateur[0].utilisateurNomAcheteur }}</p>
            </div>
            <div v-else>
                <input type="text" required placeholder="Nom Complet" class="input input-bordered w-full " />
                <div class="label ">
                    <span class="label-text-alt text-red-500">Le nom est obligatoire.</span>
                    <span class="label-text-alt ">
                    </span>
                </div>
            </div>
            <div v-if="compteStore.utilisateur[0].utilisateurTelAcheteur">
                <p class="input input-bordered w-full ">Telephone : {{ compteStore.utilisateur[0].utilisateurTelAcheteur }}</p>
            </div>
            <div v-else>
                <input type="text" required  placeholder="Téléphone" class="input input-bordered w-full " pattern="[0]{1}[0-9]{9}"/>
                <div class="label ">
                    <span class="label-text-alt text-red-500">Le téléphone est obligatoire.</span>
                    <span class="label-text-alt ">
                    </span>
                </div>
            </div>
        </label>
        
        <p class="text-xl font-medium">ADRESSE DE LIVRAISON</p>
        <div class="*:my-2 w-full" v-if="!compteStore.utilisateur[0].adresseId">
            <select class="select select-bordered w-full" placeholder="Pays">
                <option >France</option>
                <option >Belgique</option>
                <option>Suisse</option>
                <option>Italie</option>
            </select>
            
            <input type="text" required placeholder="Adresse" class="input input-bordered w-full " />

            <div class="flex gap-2">
                <input type="text" required placeholder="Code postal" class="input input-bordered w-full " />
                <input type="text" required placeholder="Ville" class="input input-bordered w-full " />
            </div>

        </div>
        <div class="*:my-2 w-full" v-else>
            <p class="input input-bordered w-full ">{{ pays? pays.paysNom :'' }}</p>
            
            <p type="text" class="input input-bordered w-full ">{{ adresse? adresse.adresseRue : '' }}</p>

            <div class="flex gap-2">
                <p type="text" class="input input-bordered w-full ">{{ ville? ville.villeCodePostal : '' }}</p>
                <p type="text" class="input input-bordered w-full ">{{ ville? ville.villeNom : '' }}</p>
            </div>

        </div>

        <button @click="btClick" class="btn btn-block btn-accent text-white">Suite</button>
    </form>

</template>


<script setup>
    import { defineModel, ref } from "vue";
    import useCompteStore from "../../store/compte.js";
    
    // const adresse = ref();
    // const ville = ref();
    // const pays = ref();
    const props = defineProps({
        adresse: Object,
        ville: Object,
        pays: Object,
    });
    
    const newAdresse = defineModel()
    const villeChoisis = ref()
    const paysChoisis = ref()
    // const villes = ref()
    // const pays = ref()
    // let inputVille = ref("")
    // let inputPays = ref("")

    // function filteredListVille() {
    //     return villes.filter((ville) =>
    //         ville.villeNom.toLowerCase().includes(inputVille.value.toLowerCase())
    //     );
    // }
    // function filteredListPays() {
    //     return pays.filter((p) =>
    //         p.paysNom.toLowerCase().includes(inputPays.value.toLowerCase())
    //     );
    // }
    // // async function fetchAddresse() {
    //     if(compteStore.utilisateur[0].adresseId)
    //         return;
    //     const paysResponse = await fetch("https://apififa2.azurewebsites.net/api/pays", {
    //         method: "GET",
    //         mode: "cors"
    //     })

    //     pays.value = await paysResponse.json()
    //     const vilResponse = await fetch("https://apififa2.azurewebsites.net/api/ville", {
    //         method: "GET",
    //         mode: "cors"
    //     })

    //     villes.value = await vilResponse.json()
    // }
    // onMounted(fetchAddresse)
    const compteStore = useCompteStore();

     const emit = defineEmits(['next'])

    function btClick() {
        emit('next')
    }
</script>