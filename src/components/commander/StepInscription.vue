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
                <input type="text" required placeholder="Nom Complet" class="input input-bordered w-full " v-model="inscription.keyNomAcheteur"/>
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
                <input type="text" required  placeholder="Téléphone" class="input input-bordered w-full " pattern="[0]{1}[0-9]{9}" v-model="inscription.keyTelAcheteur" title="Le numro est composer de 10 chifres et commence par 0." />
                <div class="label ">
                    <span class="label-text-alt text-red-500">Le téléphone est obligatoire.</span>
                    <span class="label-text-alt ">
                    </span>
                </div>
            </div>
        </label>
        
        <p class="text-xl font-medium">ADRESSE DE LIVRAISON</p>
        <div class="*:my-2 w-full" v-if="!compteStore.utilisateur[0].adresseId">
            <!-- <select class="select select-bordered w-full" placeholder="Pays">
                <option >France</option>
                <option >Belgique</option>
                <option>Suisse</option>
                <option>Italie</option>
            </select> -->
            
            <input type="text" required placeholder="Pays" class="input input-bordered w-full " v-model="inscription.keyPays"/>
            <input type="text" required placeholder="Adresse" class="input input-bordered w-full " v-model="inscription.keyNomAdresse"/>

            <div class="flex gap-2">
                <input type="text" required placeholder="Code postal" class="input input-bordered w-full " v-model="inscription.keyVilleCP" title="Code a 5 chiffres." pattern="[0-9]{5}">
                <input type="text" required placeholder="Ville" class="input input-bordered w-full " v-model="inscription.keyVilleNom"/>
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
import { verifierMotDePasse } from "@/composable/hashageMdp";
    
    // const adresse = ref();
    // const ville = ref();
    // const pays = ref();
    const props = defineProps({
        adresse: Object,
        ville: Object,
        pays: Object,
    });
    
    const inscription = defineModel()
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

     async function verifChamps(){
        //Vérification Coordonées
        //--------Nom
        if(compteStore.utilisateur[0].utilisateurNomAcheteur == null){
            if(inscription.value.keyNomAcheteur == '' ){
                return false;
            }
        }
        // ------Tel
        if(compteStore.utilisateur[0].utilisateurTelAcheteur == null){
            if(inscription.value.keyTelAcheteur.length != 10 ){
                return false;
            }
            else{
                var re = new RegExp("^([0]{1}[0-9]{9})$");
                if (! re.test(inscription.value.keyTelAcheteur))  {
                    return false;
                }
            }
        }
        //Vérification adresse
        if(compteStore.utilisateur[0].adresseId == null){
            //Vérification VilleNom
            if(inscription.value.keyVilleNom.length != 0){
                const ville = ref();
                try {
                    const vilResponse = await fetch("https://apififa2.azurewebsites.net/api/ville/getbynom/"+inscription.value.keyVilleNom, {
                    method: "GET",
                    mode: "cors"
                })
            
                ville.value = await vilResponse.json()           
            
                } catch (error) {
                    return false;
                }
                
                if(ville.value == null){
                    return false;
                }
                else{
                    inscription.value.keyVille = ville
                }
            }
            else{
                return false;
            }

            //Vérification Pays
            if(inscription.value.keyPays.length != 0){
                const pays = ref();
                try {
                    const paysResponse = await fetch("https://apififa2.azurewebsites.net/api/pays/getbynom/"+inscription.value.keyPays, {
                    method: "GET",
                    mode: "cors"
                })
            
                pays.value = await paysResponse.json()
            
            
                } catch (error) {
                    return false;
                }
                if(pays.value == null){
                    return false;
                }
                else{
                    inscription.value.keyPaysJson = pays
                }
            }
            else{
                return false;
            }
            //Vérification AdresseRue
            if(inscription.value.keyNomAdresse.length == 0){
                return false;
            }
        }
        return true;
     }

    async function btClick() {
        if(!await verifChamps()){
            return;
        }
        emit('next')
    }
</script>