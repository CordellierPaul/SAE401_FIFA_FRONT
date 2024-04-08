<template>
    {{ match }}
    
</template>

<script setup>
    import { onMounted, ref } from 'vue';
    import { useRoute } from 'vue-router';
    import { getRequest } from '@/composable/httpRequests';

    const route = useRoute();
    const matchId = route.params.id;
    const match = ref([]);

    async function fetchAll(){
        await getRequest(match, 'https://apififa2.azurewebsites.net/api/match/getbyid/' + matchId);
    }

    onMounted(fetchAll)
</script>