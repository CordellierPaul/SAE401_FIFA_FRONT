<script setup>

import { ref, watch } from "vue"

const props = defineProps({
    motDePasse: String
})

const motDePasseEstCorrect = ref(false)

defineExpose({
    motDePasseEstCorrect
})

var idTimeoutVerificationMdp = null

function onPasswordTyped() {
    if (idTimeoutVerificationMdp != null) {
        clearTimeout(idTimeoutVerificationMdp)
    }
    idTimeoutVerificationMdp = setTimeout(() => {
        motDePasseEstCorrect.value = verifierConditionsMotDePasse(props.motDePasse)
        idTimeoutVerificationMdp = null
    }, 500)
}

watch(props, (_1, _2) => {
    onPasswordTyped()
})

// cette fonction met la couleur des puces de la liste des conditions
function verifierConditionsMotDePasse(motDePasse) {
    
    if (motDePasse == "") {
        styleConditionMajuscule.value = classesPourListeCondition["infomation"]
        styleConditionMinuscule.value = classesPourListeCondition["infomation"]
        styleConditionCaractereSpecial.value = classesPourListeCondition["infomation"]
        styleConditionChiffre.value = classesPourListeCondition["infomation"]
        styleCondition12Caracteres.value = classesPourListeCondition["infomation"]
        return false
    }

    let motDePasseEstBon = true

    if (motDePasse == motDePasse.toLowerCase()) {
        motDePasseEstBon = false
        styleConditionMajuscule.value = classesPourListeCondition["pasRespectee"]
    } else {
        styleConditionMajuscule.value = classesPourListeCondition["respectee"]
    }

    if (motDePasse == motDePasse.toUpperCase()) {
        motDePasseEstBon = false
        styleConditionMinuscule.value = classesPourListeCondition["pasRespectee"]
    } else {
        styleConditionMinuscule.value = classesPourListeCondition["respectee"]
    }

    if (!motDePasse.match(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/)) {
        motDePasseEstBon = false
        styleConditionCaractereSpecial.value = classesPourListeCondition["pasRespectee"]
    } else {
        styleConditionCaractereSpecial.value = classesPourListeCondition["respectee"]
    }

    if (!motDePasse.match(/[0-9]+/)) {
        motDePasseEstBon = false
        styleConditionChiffre.value = classesPourListeCondition["pasRespectee"]
    } else {
        styleConditionChiffre.value = classesPourListeCondition["respectee"]
    }

    if (motDePasse.length < 12) {
        motDePasseEstBon = false
        styleCondition12Caracteres.value = classesPourListeCondition["pasRespectee"]
    } else {
        styleCondition12Caracteres.value = classesPourListeCondition["respectee"]
    }

    return motDePasseEstBon
}

</script>

<script>

export const classesPourListeCondition = {
    "infomation": "list-image-[url(/images/icon/bulle-condition-info.png)] list-inside",
    "respectee": "list-image-[url(/images/icon/bulle-condition-reussie.png)] list-inside",
    "pasRespectee": "list-image-[url(/images/icon/bulle-condition-pas-respectee.png)] list-inside",
    "cachee": "hidden"
}

// Textes des classes conditions pour que le mot de passe soit correct
const styleConditionMajuscule = ref(classesPourListeCondition["infomation"])
const styleConditionMinuscule = ref(classesPourListeCondition["infomation"])
const styleConditionCaractereSpecial = ref(classesPourListeCondition["infomation"])
const styleConditionChiffre = ref(classesPourListeCondition["infomation"])
const styleCondition12Caracteres = ref(classesPourListeCondition["infomation"])

</script>

<template>
    <ul>
        <li :class="styleConditionMajuscule">Le mot de passe avoir au moins une majuscule</li>
        <li :class="styleConditionMinuscule">Le mot de passe avoir au moins une minuscule</li>
        <li :class="styleConditionCaractereSpecial">Le mot de passe avoir au moins un caractère spécial</li>
        <li :class="styleConditionChiffre">Le mot de passe avoir au moins un chiffre</li>
        <li :class="styleCondition12Caracteres">Le mot de passe avoir au minimum 12 caractères</li>
    </ul>
</template>