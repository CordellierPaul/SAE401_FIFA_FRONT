<template>
    <div v-if="match.length > 0">
        <p class="text-2xl font-bold flex items-center justify-center m-10">Classement</p>

        <div class="overflow-x-auto">
            <table class="table table-zebra">
                <!-- head -->
                <thead>
                <tr>
                    <th></th>
                    <th>Club</th>
                    <th>Joué</th>
                    <th>Victoires</th>
                    <th>Égalité</th>
                    <th>Défaites</th>
                    <th>Pourcentage de victoire (%)</th>
                    <th>BP/BC</th>
                    <th>+/-</th>
                    <th>B/M</th>
                    <th>PTS</th>
                </tr>
                </thead>
                <tbody>
                    <tr v-for="(club, index) in classement" :key="club.clubId">
                        <td>{{ index + 1 }}</td>
                        <td class="font-bold">{{ getClubName(club.clubId) }}</td>
                        <td>{{ club.wins + club.draw + club.losses}}</td>
                        <td>{{ club.wins }}</td>
                        <td>{{ club.draw }}</td>
                        <td>{{ club.losses }}</td>
                        <td>{{ calculateWinrate(club.wins, club.losses, club.draw) }}</td>
                        <td>{{ club.goalsFor }}:{{ club.goalsAgainst }}</td>
                        <td>{{ club.goalsFor - club.goalsAgainst }}</td>
                        <td>{{ calculateGoalPerMatch(club.wins, club.losses, club.draw, club.goalsFor) }}</td>
                        <td class="font-bold">{{ club.points }}</td>
                        
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    <div v-else class="flex justify-center items-center h-screen">
        <span class="loading loading-spinner loading-lg"></span>
    </div>
</template>

<script setup>
    import { getRequest } from "@/composable/httpRequests"
    import { onMounted, ref } from "vue"

    const match = ref([])
    const classement = ref([])
    const clubs = ref([])
    const clubNames = {};

    async function fetchAll(){
        await getRequest(match, "https://apififa2.azurewebsites.net/api/match/")
        await getRequest(clubs, "https://apififa2.azurewebsites.net/api/club/")
        classer();
    }

    function classer(){

        // Map des identifiants de club aux noms des clubs
        clubs.value.forEach(club => {
            clubNames[club.clubId] = club.clubNom;
        });

        const clubsStats = {};

        match.value.forEach(match => {
            if (!clubsStats[match.clubDomicileId]) clubsStats[match.clubDomicileId] = { clubId: match.clubDomicileId, wins: 0, draw: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, points: 0, };
            if (!clubsStats[match.clubExterieurId]) clubsStats[match.clubExterieurId] = { clubId: match.clubExterieurId, wins: 0, draw: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, points: 0, };

            if (match.matchScoreDomicile > match.matchScoreExterieur) {
                clubsStats[match.clubDomicileId].wins++;
                clubsStats[match.clubDomicileId].points = clubsStats[match.clubDomicileId].points +3;
                clubsStats[match.clubExterieurId].losses++;
            } else if (match.matchScoreDomicile < match.matchScoreExterieur) {
                clubsStats[match.clubDomicileId].losses++;
                clubsStats[match.clubExterieurId].wins++;
                clubsStats[match.clubExterieurId].points = clubsStats[match.clubExterieurId].points +3;
            }else{
                clubsStats[match.clubDomicileId].draw++;
                clubsStats[match.clubExterieurId].draw++;
                clubsStats[match.clubDomicileId].points++;
                clubsStats[match.clubExterieurId].points++;
            }
            
            // Mise à jour des buts pour et contre
            clubsStats[match.clubDomicileId].goalsFor += match.matchScoreDomicile;
            clubsStats[match.clubDomicileId].goalsAgainst += match.matchScoreExterieur;
            clubsStats[match.clubExterieurId].goalsFor += match.matchScoreExterieur;
            clubsStats[match.clubExterieurId].goalsAgainst += match.matchScoreDomicile;
        });

        // Convertir l'objet en tableau pour le tri
        const sortedClubs = Object.values(clubsStats).sort((a, b) => {
            // Comparaison des points
            if (a.points !== b.points) return b.points - a.points;
            
            // Comparaison des différences de buts
            const diffGoalsA = a.goalsFor - a.goalsAgainst;
            const diffGoalsB = b.goalsFor - b.goalsAgainst;
            if (diffGoalsA !== diffGoalsB) return diffGoalsB - diffGoalsA;
            
            // Comparaison des buts marqués
            return b.goalsFor - a.goalsFor;
        });

        classement.value = sortedClubs;

        // Fonction pour obtenir le nom du club à partir de son ID
    }

    const getClubName = (clubId) => {
        return clubNames[clubId] || `Club ${clubId}`; // Si le nom du club n'est pas trouvé, utilisez "Club (numéro)"
    }
    const calculateWinrate = (wins, losses, draw) => {
        const totalMatches = wins + losses + draw;
        if (totalMatches === 0) return 0; // Pour éviter une division par zéro
        return ((wins / totalMatches) * 100).toFixed(2); // Renvoie le pourcentage arrondi à 2 décimales
    }

    const calculateGoalPerMatch = (wins, losses, draw, goalsFor) => {
        const totalMatches = wins + losses + draw;
        if (totalMatches === 0) return 0; // Pour éviter une division par zéro
        return ((goalsFor / totalMatches)).toFixed(2); // Renvoie le pourcentage arrondi à 2 décimales
    }


    onMounted(fetchAll)
</script>
