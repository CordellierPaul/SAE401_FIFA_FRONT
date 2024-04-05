<template>
    <div>

        <div v-if="match && clubDomi.clubNom && clubExt.clubNom" :class="{
            // Si club est domicile et que domicile gagne ou si club est exterieur et exterieur gagne
        'bg-green-200': (
            (match.clubDomicileId == idClub && match.matchScoreDomicile > match.matchScoreExterieur) ||
            (match.clubExterieurId == idClub && match.matchScoreExterieur > match.matchScoreDomicile)),

            // Si club est domicile et que domicile perde ou si club est exterieur et exterieur perde
        'bg-red-200': (
            (match.clubDomicileId == idClub && match.matchScoreDomicile < match.matchScoreExterieur) ||
            (match.clubExterieurId == idClub && match.matchScoreExterieur < match.matchScoreDomicile)),

            //égalité
        'bg-base-200': (match.matchScoreDomicile == match.matchScoreExterieur),

    }" class="m-5 p-5 flex items-center justify-center">
            <div class="w-full">
                <p>{{ match.matchDate }}</p>
                <div class="m-5 flex items-center justify-center text-2xl *:mx-2">
                    <div class="w-96 flex items-center justify-center flex-col">
                        <p class="flex items-center justify-center" :class="{'font-bold': (match.clubDomicileId == idClub)}">{{ clubDomi.clubNom }}</p>
                        <p :class="{'font-bold': (match.clubDomicileId == idClub)}">{{ clubDomi.clubInitiales }}</p>
                    </div>
                    <p class="text-4xl w-48 flex items-center justify-center"> 
                        <p :class="{'font-semibold': (match.clubDomicileId == idClub)}">{{ match.matchScoreDomicile }}</p>
                        <p>-</p>
                        <p :class="{'font-semibold': (match.clubExterieurId == idClub)}">{{ match.matchScoreExterieur }}</p> 
                    </p>
                    <div class="w-96 flex items-center justify-center flex-col">
                        <p class="flex items-center justify-center" :class="{'font-bold': (match.clubExterieurId == idClub)}">{{ clubExt.clubNom }}</p>
                        <p :class="{'font-bold': (match.clubExterieurId == idClub)}">{{ clubExt.clubInitiales }}</p>
                    </div>
                </div>
            </div>
        </div>
        
        <div v-else>
            <div class="m-5 p-5 flex items-center justify-center bg-base-200">
                <div class="w-full">
                    <div class="skeleton h-4 w-36"></div>
                    <div class="m-5 flex items-center justify-center text-2xl *:mx-2">
                        <div class="w-96 flex items-center justify-center flex-col">
                            <p class="flex items-center justify-center font-bold"><div class="skeleton h-6 w-64"></div></p>
                            <p class="m-1"><div class="skeleton h-8 w-20"></div></p>
                        </div>
                        <div class="text-4xl font-bold w-48 flex items-center justify-center">
                            <div class="skeleton h-11 w-8"/> <div class="skeleton h-1 w-3 m-2"/> <div class="skeleton h-11 w-8"/>
                        </div>
                        <div class="w-96 flex items-center justify-center flex-col">
                            <p class="flex items-center justify-center font-bold"><div class="skeleton h-6 w-64"></div></p>
                            <p class="m-1"><div class="skeleton h-8 w-20"></div></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>


<script setup>
    import { defineProps, onMounted, ref } from 'vue';
    import { getRequest } from '@/composable/httpRequests';
    const props = defineProps({
        match: Object,
        idClub: String
    })

    const clubDomi = ref([]);
    const clubExt = ref([]);
    async function fetchAll(){
        await getRequest(clubExt, 'https://apififa2.azurewebsites.net/api/club/getbyid/'+props.match.clubExterieurId)
        await getRequest(clubDomi, 'https://apififa2.azurewebsites.net/api/club/getbyid/'+props.match.clubDomicileId)
    }
    onMounted(fetchAll)   
</script>