<script setup>
import { useRouter } from 'vue-router'
import useCompteStore from "../store/compte.js"

const router = useRouter()
const compteStore = useCompteStore()

if (!compteStore.isConnected) {

    router.push({ "name" : "erreur-pas-connecte" })
}
</script>