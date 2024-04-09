<script setup>
    import ProduitComponent from '@/components/ProduitComponent.vue';
    import FiltreComponent from '@/components/FiltreComponent.vue';
        
    import { onMounted, ref, watchEffect } from 'vue'
    import { getRequest } from '../composable/httpRequests.js'

    const produitsFiltre = ref([])

    const tailles = ref()
    const taillesLibelle = ref([])

    const genres = ref()
    const genresNom = ref([])

    const coloris = ref()
    const colorisNom = ref([])
    const colorisId = ref([])

    const categories = ref()
    const categoriesNom = ref([])
    const categoriesId = ref([])

    const pays = ref()
    const paysNom = ref([])
    const paysId = ref([])

    const ordprix = ref(null);

    let produitsAffiches = ref(10)

    async function fetchObjects() {
        // pour avoir les tailles
        const tailleResponse = await fetch("https://apififa2.azurewebsites.net/api/taille", {
            method: "GET",
            mode: "cors"
        })
        
        tailles.value = await tailleResponse.json()
        

        tailles.value.forEach(taille => {
            taillesLibelle.value.push(taille.tailleLibelle);
        });

        // pour avoir les genre
        const genreResponse = await fetch("https://apififa2.azurewebsites.net/api/genre", {
            method: "GET",
            mode: "cors"
        })

        genres.value = await genreResponse.json()

        genres.value.forEach(genre => {
            genresNom.value.push(genre.genreNom);
        });

        // pour avoir les coloris
        const colorisResponse = await fetch("https://apififa2.azurewebsites.net/api/coloris", {
            method: "GET",
            mode: "cors"
        })

        coloris.value = await colorisResponse.json()

        coloris.value.forEach(coloris => {
            colorisNom.value.push(coloris.colorisNom);
            colorisId.value.push(coloris.colorisId);
        });

        // pour avoir les categories
        const categorisResponse = await fetch("https://apififa2.azurewebsites.net/api/categorie", {
            method: "GET",
            mode: "cors"
        })

        categories.value = await categorisResponse.json()

        categories.value.forEach(categorie => {
            categoriesNom.value.push(categorie.categorieNom);
            categoriesId.value.push(categorie.categorieId);
        });

        // pour avoir les pays
        const paysResponse = await fetch("https://apififa2.azurewebsites.net/api/pays/GetWhereProduitExists ", {
            method: "GET",
            mode: "cors"
        })

        pays.value = await paysResponse.json()

         pays.value.forEach(pays => {
             paysNom.value.push(pays.paysNom);
             paysId.value.push(pays.paysId);
         });


    }

    onMounted(() => {
        fetchObjects(); 

        if (ordprix.value) {
        ordprix.value.addEventListener('change', (event) => {
            trierProduits(event);
        });
        }
    });

    // pour gérer les fitres
    const optionsTaillesChecked = ref([])
    const optionsGenresChecked = ref([])
    const optionsColorisChecked = ref([])
    const optionsCategoriesChecked = ref([])
    const optionsPaysChecked = ref([])

    function emptyList(){
        optionsTaillesChecked.value = []
        optionsGenresChecked.value = []
        optionsColorisChecked.value = []
        optionsCategoriesChecked.value = []
        optionsPaysChecked.value = []
    }

    // pour récupérer les produits selon les filtres et les triers
    const filtreRequestList = ref([])
    const filtreRequestStr = ref("")

    
    watchEffect(()=>{
        filtreRequestList.value = []
        optionsTaillesChecked.value.forEach(element => {
            filtreRequestList.value.push([taillesLibelle.value.indexOf(element)+1,"taiId"])
        });
        optionsGenresChecked.value.forEach(element => {
            filtreRequestList.value.push([genresNom.value.indexOf(element)+1,"genreId"])
        });
        optionsColorisChecked.value.forEach(element => {
            filtreRequestList.value.push([colorisId.value[colorisNom.value.indexOf(element)],"colId"])
        });
        optionsCategoriesChecked.value.forEach(element => {
            filtreRequestList.value.push([categoriesId.value[categoriesNom.value.indexOf(element)],"catId"])
        });
        optionsPaysChecked.value.forEach(element => {
            filtreRequestList.value.push([paysId.value[paysNom.value.indexOf(element)], "paysId"])
        });

        filtreRequestStr.value = ""

        filtreRequestList.value.forEach(filtre => {
            filtreRequestStr.value = filtreRequestStr.value + filtre[1] + "=" + filtre[0] + "&"
        });

        fetchProduitsFiltres(filtreRequestStr.value);
        produitsAffiches = ref(10)

    },{
        deep: true
    });

    watchEffect(() => {
        const triParPrix = document.querySelector('#ordprix');
        if (triParPrix) {
            console.log("hehe")
            triParPrix.addEventListener('change', (event) => {
                trierProduits(event);
            });
        }
    });

    async function fetchProduitsFiltres(request){
        const Response = await fetch(`https://apififa2.azurewebsites.net/api/produit/getbyfilter?${request}`, {
            method: "GET",
            mode: "cors"
        })
        
        produitsFiltre.value = await Response.json()

        console.log(produitsFiltre.value)

    }

    function compare(a, b) {
        if (a.parametre < b.parametre) {
            return -1;
        }
        if (a.parametre > b.parametre) {
            return 1;
        }
        return 0;
    }
    
    function trierProduits(event) {
        const ordre = event.target.value;

        if (ordre === 'croissant') {
            // par ordre croissant du prix
            produitsFiltre.value.sort((a, b) => {
                if (a.variantesProduit && a.variantesProduit.length > 0 && b.variantesProduit && b.variantesProduit.length > 0) {
                    const prixA = (a.variantesProduit[0].varianteProduitPrix - (a.variantesProduit[0].varianteProduitPrix * a.variantesProduit[0].varianteProduitPromo)).toFixed(2);
                    const prixB = (b.variantesProduit[0].varianteProduitPrix - (b.variantesProduit[0].varianteProduitPrix * b.variantesProduit[0].varianteProduitPromo)).toFixed(2);
                    return prixA - prixB;
                }
            });
            
            
        } else if (ordre === 'decroissant') {
            // par ordre décroissant du prix
            produitsFiltre.value.sort((a, b) => {
                if (a.variantesProduit && a.variantesProduit.length > 0 && b.variantesProduit && b.variantesProduit.length > 0) {
                    const prixA = (a.variantesProduit[0].varianteProduitPrix - (a.variantesProduit[0].varianteProduitPrix * a.variantesProduit[0].varianteProduitPromo)).toFixed(2);
                    const prixB = (b.variantesProduit[0].varianteProduitPrix - (b.variantesProduit[0].varianteProduitPrix * b.variantesProduit[0].varianteProduitPromo)).toFixed(2);
                    return prixB - prixA;
                }
            });
            
        } else if (ordre === 'defaut') {
            // par ordre croissant du produitId
            produitsFiltre.value.sort((a, b) => {
                return a.produitId - b.produitId;
            });
        }
    }

    function chargerPlusProduits() {
        produitsAffiches.value += 10;
    }

</script>

<template>
    <div>
        <div class="sticky top-20 z-[5] bg-secondary p-4 flex justify-between items-center min-h-20 " id="right_part">
            <div class="text-sm breadcrumbs text-white start hidden lg:block">
            <ul>
                <li><RouterLink :to="{name: 'index'}" class="hover:opacity-50 hover:cursor-pointer">FIFA</RouterLink></li> 
                <li><a @click= "retour"  class="hover:opacity-50 hover:cursor-pointer">Produits</a></li>
            </ul>
        </div>

            <template v-if="selectedFilter">
            <select v-model="selectedOption" class="select select-primary w-full max-w-xs lg:hidden">
                <option selected disabled>Choisir {{ selectedFilter }}</option>
                <option v-for="option in getOptions(selectedFilter)" :key="option">{{ option }}</option>
            </select>
        </template>

            <select ref="ordprix" class="select select-primary w-full max-w-xs bg-secondary text-white border-white" @change="trierProduits">
                <option selected value="defaut">Classer par défaut</option>
                <option value="croissant">Prix: Par ordre croissant</option>
                <option value="decroissant">Prix: Par ordre décroissant</option>
            </select>

        </div>
        
        <div class="flex">
            <div id="left_part" class="bg-base-300 hidden lg:block w-72">
                <p class="flex justify-center text-xl m-5"  >Filtres</p>
                
                <FiltreComponent v-model:optionsChecked="optionsTaillesChecked" v-if="taillesLibelle" :filtreData="{ titre: 'Taille', options: taillesLibelle }" />
                <FiltreComponent v-model:optionsChecked="optionsGenresChecked" v-if="genresNom" :filtreData="{ titre: 'Genre', options: genresNom }" />
                <FiltreComponent v-model:optionsChecked="optionsColorisChecked" v-if="colorisNom" :filtreData="{ titre: 'Coloris', options: colorisNom }" />
                <FiltreComponent v-model:optionsChecked="optionsCategoriesChecked" v-if="categoriesNom" :filtreData="{ titre: 'Categorie', options: categoriesNom }" />
                <FiltreComponent v-model:optionsChecked="optionsPaysChecked" v-if="paysNom" :filtreData="{ titre: 'Pays', options: paysNom }" />

            </div>
            <div id="right_part" class="w-full bg-base-200">
                <div class="flex m-5 gap-2">
                    <div class=" whitespace-nowrap" v-if="produitsFiltre">
                        <div class="flex gap-2">
                            <p >{{ produitsFiltre.length }}</p>
                            <p>résultats</p>
                            <div class="flex gap-2" v-if=" optionsTaillesChecked.length != 0 ||  optionsGenresChecked.length != 0 ||  optionsColorisChecked.length != 0 ||  optionsCategoriesChecked.length != 0 ||  optionsPaysChecked.length != 0 ">
                                pour
                                <div class=" flex gap-2 flex-wrap *:badge *:badge-neutral *:flex *:gap-2">
                                    <div v-if="optionsTaillesChecked" v-for="(option, index) in optionsTaillesChecked" :key="option"><div @click="optionsTaillesChecked.splice(index,1)"><i class="fa-solid fa-xmark hover:cursor-pointer"></i></div>{{ option }}</div>
                                    <div v-if="optionsGenresChecked" v-for="(option, index) in optionsGenresChecked" :key="option"><div @click="optionsGenresChecked.splice(index,1)"><i class="fa-solid fa-xmark hover:cursor-pointer"></i></div>{{ option }}</div>
                                    <div v-if="optionsColorisChecked" v-for="(option, index) in optionsColorisChecked" :key="option"><div @click="optionsColorisChecked.splice(index,1)"><i class="fa-solid fa-xmark hover:cursor-pointer"></i></div>{{ option }}</div>
                                    <div v-if="optionsCategoriesChecked" v-for="(option, index) in optionsCategoriesChecked" :key="option"><div @click="optionsCategoriesChecked.splice(index,1)"><i class="fa-solid fa-xmark hover:cursor-pointer"></i></div>{{ option }}</div>
                                    <div v-if="optionsPaysChecked" v-for="(option, index) in optionsPaysChecked" :key="option"><div @click="optionsPaysChecked.splice(index,1)"><i class="fa-solid fa-xmark hover:cursor-pointer"></i></div>{{ option }}</div>                                    
                                    <div class="hover:cursor-pointer" @click="emptyList"> Supprimer tous les filtres </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="container" class="flex flex-wrap items-center justify-center gap-10 p-2">
                    <template v-if="produitsFiltre.length > 0">
                        <ProduitComponent v-for="produit in produitsFiltre.slice(0, produitsAffiches)" :key="produit.produitId" :id="produit.produitId" :nom="produit.produitNom" />
                        <div v-if="produitsFiltre.length > produitsAffiches" class="m-10 flex items-center justify-center">
                            <button class="btn btn-primary text-white" @click="chargerPlusProduits">Voir plus</button>
                        </div>
                    </template>
                    <template v-else>
                        <div class="text-gray-500">Aucun produit trouvé.</div>
                    </template>
                </div>



               
            </div>
        </div>
    </div>
</template>