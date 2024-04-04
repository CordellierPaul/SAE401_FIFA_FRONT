<script setup>
import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
import useCompteStore from "../store/compte.js"

const router = useRouter()
const compteStore = useCompteStore()
const infosBancaires = ref()

if (!compteStore.isConnected) {

    router.push({ "name" : "erreur-pas-connecte" })
}


async function fetchInfosBancaires() {

    // const response = await fetch(`https://apififa2.azurewebsites.net/api/InfosBancaires/GetInfosBancairesOfUser/${compteStore.utilisateurId}`, {
    //     method: "GET",
    //     headers: {
    //         "Authorization": `Bearer ${compteStore.token}`,
    //         "Content-Type": "application/json",
    //     }
    // })

    // console.log("InfosBancaires : " + JSON.stringify(await response.json()))
}

onMounted(fetchInfosBancaires)
</script>