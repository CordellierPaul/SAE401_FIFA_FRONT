<template >
    <!-- {{ match }} -->
    <div class="h-full flex justify-evenly bg-red-200">

        <div>
            {{ clubDomi.clubNom }}
        </div>

        <div class="flex gap-3">
            {{ match.matchScoreDomicile }}
            <p>-</p>
            {{ match.matchScoreExterieur }}
        </div>
        <div>
            {{ clubExt.clubNom }}

        </div>

        <!-- {{ match.matches_joue }} -->
    </div>
    
</template>

<script setup>
    import { onMounted, ref } from 'vue';
    import { useRoute } from 'vue-router';
    import { getRequest } from '@/composable/httpRequests';

    const route = useRoute();
    const matchId = route.params.id;
    const match = ref([]);
    const clubDomi = ref([]);
    const clubExt = ref([]);

    async function fetchAll(){
        await getRequest(match, 'https://apififa2.azurewebsites.net/api/match/getbyid/' + matchId);
        
        await getRequest(clubExt, 'https://apififa2.azurewebsites.net/api/club/getbyid/'+match.value.clubExterieurId)
        await getRequest(clubDomi, 'https://apififa2.azurewebsites.net/api/club/getbyid/'+match.value.clubDomicileId)
    }

    onMounted(fetchAll)

</script>