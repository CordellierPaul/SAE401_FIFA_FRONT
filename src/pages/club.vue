<template>
    <div>
        <div v-if="club && club.clubId" class="m-10">
            <div class="flex items-end justify-start">
                <p class="text-5xl font-bold">{{ club.clubNom }}</p>
                <p class="text-xl flex items-end mx-2">({{ club.clubInitiales }})</p>
            </div>
            
            <div class="my-10">
                <p class="text-3xl">Matchs:</p>
                <div class="divider"></div>
                <p class="text-2xl">Domiciles:</p>
                <div class="flex items-center justify-center flex-col">
                    <MatchClubComponent v-for="(match, index) in displayedMatchesDomi" :key="index" :match="match" :idClub="clubId"></MatchClubComponent>
                </div>
                <div class="flex justify-center items-center m-10">
                    <button @click="loadMoreMatchesDomi" v-if="displayedMatchesDomi.length < club.matchesDomicile.length" class="btn btn-primary">Voir plus</button>
                </div>
                <div class="divider"></div>
                <p class="text-2xl">Exterieur:</p>
                <div class="flex items-center justify-center flex-col">
                    <MatchClubComponent v-for="(match,index) in displayedMatchesExt" :key="index" :match="match" :idClub="clubId"></MatchClubComponent>
                </div>
                <div class="flex justify-center items-center m-10">
                    <button @click="loadMoreMatchesExt" v-if="displayedMatchesExt.length < club.matchesExterieur.length" class="btn btn-primary">Voir plus</button>
                </div>
            </div>
        </div>
        <div v-else class="flex justify-center items-center h-screen">
            <span class="loading loading-spinner loading-lg"></span>
        </div>
    </div>
</template>

<script setup>
    import { useRouter, useRoute } from 'vue-router';
    import { onMounted, ref } from 'vue';
    import { getRequest } from '../composable/httpRequests';
    import MatchClubComponent from '../components/MatchClubComponent.vue';

    const route = useRoute();
    const router = useRouter();
    const clubId = route.params.id;

    const club = ref([]);
    const displayedMatchesDomi = ref([]);
    const displayedMatchesExt = ref([]);
    const matchesPerPage = 5;
    let startIndexDomi = 0;
    let startIndexExt = 0;

    async function fetchAll() {
        await getRequest(club, 'https://apififa2.azurewebsites.net/api/club/getbyid/' + clubId);
        sortMatchesByDate(club.value.matchesDomicile);
        sortMatchesByDate(club.value.matchesExterieur);
        updateDisplayedMatchesDomi();
        updateDisplayedMatchesExt();
    }

    function loadMoreMatchesDomi() {
        startIndexDomi += matchesPerPage;
        updateDisplayedMatchesDomi();
    }
    function loadMoreMatchesExt() {
        startIndexExt += matchesPerPage;
        updateDisplayedMatchesExt();
    }

    function updateDisplayedMatchesDomi() {
        displayedMatchesDomi.value = club.value.matchesDomicile.slice(0, startIndexDomi + matchesPerPage);
    }
    function updateDisplayedMatchesExt() {
        displayedMatchesExt.value = club.value.matchesExterieur.slice(0, startIndexExt + matchesPerPage);
    }

    function sortMatchesByDate(matches) {
    matches.sort((a, b) => {
        // Convertir les dates en objets Date pour faciliter la comparaison
        const dateA = new Date(a.matchDate);
        const dateB = new Date(b.matchDate);
        // Comparer les dates pour le tri (du plus récent au plus ancien)
        return dateB - dateA;
    });
}

    function retour() {
        router.back();
    }

    onMounted(fetchAll);
</script>