<template>
    <div v-if="match" :class="{
    'bg-green-200': (match.clubDomicile === clubId && match.matchScoreDomicile > match.matchScoreExterieur),
    'bg-red-200': (match.clubDomicile === clubId && match.matchScoreDomicile < match.matchScoreExterieur),
    'bg-base-200': (match.matchScoreDomicile === match.matchScoreExterieur),
    'bg-green-200': (match.clubExterieur === clubId && match.matchScoreExterieur > match.matchScoreDomicile),
    'bg-red-200': (match.clubExterieur === clubId && match.matchScoreExterieur < match.matchScoreDomicile)
}" class="m-5 w-2/3 p-5 flex items-center justify-center">
        <div class="w-full">

            <p>{{ match.matchDate }}</p>
            <div class="m-5 flex items-center justify-center text-2xl *:mx-2">
                <div class="w-96 flex items-center justify-center flex-col">
                    <p class="flex items-center justify-center font-bold">{{ clubDomi.clubNom }}</p>
                    <p>{{ clubDomi.clubInitiales }}</p>
                </div>
                <p class="text-4xl font-bold w-48 flex items-center justify-center"> {{ match.matchScoreDomicile }} - {{ match.matchScoreExterieur }} </p>
                <div class="w-96 flex items-center justify-center flex-col">
                    <p class="flex items-center justify-center font-bold">{{ clubExt.clubNom }}</p>
                    <p>{{ clubExt.clubInitiales }}</p>
                </div>
            </div>
        </div>
    </div>
</template>


<script setup>
    import { defineProps, onMounted, ref } from 'vue';
    import { getRequest } from '@/composable/httpRequests';
    const props = defineProps({
        match: Object
    })

    const clubDomi = ref([]);
    const clubExt = ref([]);
    async function fetchAll(){
        await getRequest(clubExt, 'https://apififa2.azurewebsites.net/api/club/getbyid/'+props.match.clubExterieurId)
        await getRequest(clubDomi, 'https://apififa2.azurewebsites.net/api/club/getbyid/'+props.match.clubDomicileId)
    }
    onMounted(fetchAll)   
</script>