<template>
    <div>
        <p>Classement</p>
        {{ match }}
    </div>
</template>

<script setup>
import { getRequest } from "@/composable/httpRequests"
import { onMounted } from "vue"


const match = ref([])

async function fetchAll(){
    await getRequest(match, "https://apififa2.azurewebsites.net/api/match/")
}

onMounted(fetchAll)

</script>