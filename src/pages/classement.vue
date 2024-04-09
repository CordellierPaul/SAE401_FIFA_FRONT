<template>
    <div>
        <p>Classement</p>

    </div>
</template>

<script setup>
import { getRequest } from "@/composable/httpRequests"
import { onMounted, ref } from "vue"

const match = ref([])
const classement = ref([])

async function fetchAll(){
    await getRequest(match, "https://apififa2.azurewebsites.net/api/match/")
    classer();
}

function classer(){
    const clubs = {};
    match.value.forEach(match => {
        if (!clubs[match.clubDomicileId]) clubs[match.clubDomicileId] = { clubId: match.clubDomicileId, wins: 0, scored: 0 };
        if (!clubs[match.clubExterieurId]) clubs[match.clubExterieurId] = { clubId: match.clubExterieurId, wins: 0, scored: 0 };

        if (match.matchScoreDomicile > match.matchScoreExterieur) {
            clubs[match.clubDomicileId].wins++;
        } else if (match.matchScoreDomicile < match.matchScoreExterieur) {
            clubs[match.clubExterieurId].wins++;
        }
        
        // Mise à jour du score marqué
        clubs[match.clubDomicileId].scored += match.matchScoreDomicile;
        clubs[match.clubExterieurId].scored += match.matchScoreExterieur;
    });

    // Convertir l'objet en tableau pour le tri
    const sortedClubs = Object.values(clubs).sort((a, b) => {
        // Si le nombre de victoires est égal, comparer le score marqué
        if (a.wins === b.wins) {
            return b.scored - a.scored; // Tri décroissant du score marqué
        } else {
            return b.wins - a.wins; // Tri décroissant du nombre de victoires
        }
    });

    classement.value = sortedClubs;
}

onMounted(fetchAll)
</script>
