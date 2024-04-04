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
                <input type="text" required  placeholder="Téléphone" class="input input-bordered w-full " />
                <div class="label ">
                    <span class="label-text-alt text-red-500">Le téléphone est obligatoire.</span>
                    <span class="label-text-alt ">
                    </span>
                </div>
            </div>
        </label>
        
        <p class="text-xl font-medium">ADRESSE DE LIVRAISON</p>
        {{ adresse }}
        {{ ville }}
        {{ pays }}
        <div class="*:my-2 w-full" v-if="!compteStore.utilisateur[0].adresseId">
            <select class="select select-bordered w-full" placeholder="Pays">
                <option >France</option>
                <option >Belgique</option>
                <option>Suisse</option>
                <option>Italie</option>
            </select>
            
            <input type="text" required placeholder="Adresse" class="input input-bordered w-full " />
            <input type="text" placeholder="Appartement, suite, etc. (champ faculatatif)" class="input input-bordered w-full " />

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
    import { onMounted, ref } from "vue";
    import useCompteStore from "../../store/compte.js";
    
    const adresse = ref();
    const ville = ref();
    const pays = ref();
    async function fetchAddresse() {
        if(!compteStore.utilisateur[0].adresseId)
            return;
        const adrResponse = await fetch("https://apififa2.azurewebsites.net/api/adresse/getbyid/"+compteStore.utilisateur[0].adresseId, {
            method: "GET",
            mode: "cors"
        })

        adresse.value = await adrResponse.json()
        const vilResponse = await fetch("https://apififa2.azurewebsites.net/api/ville/getbyid/"+adresse.value.villeId, {
            method: "GET",
            mode: "cors"
        })

        ville.value = await vilResponse.json()
        const paysResponse = await fetch("https://apififa2.azurewebsites.net/api/pays/getbyid/"+ville.value.paysId, {
            method: "GET",
            mode: "cors"
        })

        pays.value = await paysResponse.json()
    }
    onMounted(fetchAddresse)
    const compteStore = useCompteStore();

     const emit = defineEmits(['next'])

    function btClick() {
        emit('next')
    }
</script>