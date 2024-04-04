<template>
    <div v-if="match" class="bg-base-200 m-5 w-2/3 p-5 flex items-center justify-center">
        <div class="w-full">

            <p>{{ match.matchDate }}</p>
            <div class="m-5 flex items-center justify-center text-2xl *:mx-2">
                <div class="flex items-center justify-center flex-col">
                    <p class="w-72 flex items-center justify-center">{{ clubDomi.clubNom }}</p>
                    <p>{{ clubDomi.clubInitiales }}</p>
                </div>
                <p class="text-3xl font-bold w-48 flex items-center justify-center"> {{ match.matchScoreDomicile }} - {{ match.matchScoreExterieur }} </p>
                <p class="w-72 flex items-center justify-center">{{ clubExt.clubNom }}</p>
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