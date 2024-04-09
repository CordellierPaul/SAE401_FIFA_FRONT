<script setup>
import { ref } from "vue"
import { useRouter } from "vue-router"

import { encrypter } from "../composable/hashageMdp.js"
import { getRequest } from '../composable/httpRequests.js'
import { emailEstDansLaBaseDeDonnees, formatEmailEstBon } from "../composable/verificationEmail.js";

import VerificationMdpComponent from "../components/VerificationMdpComponent.vue";
import { classesPourListeCondition } from "../components/VerificationMdpComponent.vue";

import useCompteStore from "../store/compte.js";

const compteStore = useCompteStore()

const router = useRouter()

const compte = ref({
    comptelogin: "",
    compteNom: "",
    comptePrenom: "",
    dateDeNaissance: "",
    paysDeNaissanceId: null,
    compteEmail: "",
    compteMdp: ""
})

const variablesDeVerificationMdp = ref()

// Textes des classes conditions pour que l'e-mail soit correct
const styleConditionEmailUnique = ref(classesPourListeCondition["cachee"])
const styleConditionFormatEmail = ref(classesPourListeCondition["cachee"])

// Textes des classes conditions pour que le login, le prénom et le pays soient renseignés
const styleConditionLoginReseigne = ref(classesPourListeCondition["cachee"])
const styleConditionPrenomReseigne = ref(classesPourListeCondition["cachee"])
const styleConditionPaysReseigne = ref(classesPourListeCondition["cachee"])

// Textes des classes conditions pour vérifier que l'utilisateur est majeur
const styleConditionDateNaissanceReseigne = ref(classesPourListeCondition["cachee"])
const styleConditionUtilisateurMajeur = ref(classesPourListeCondition["cachee"])

// On accède aux pays
const listePays = ref([])
getRequest(listePays, "https://apififa2.azurewebsites.net/api/pays")

async function boutonCreationCompte() {
    
    let lesConditionsSontRemplies = variablesDeVerificationMdp.value.motDePasseEstCorrect

    if (formatEmailEstBon(compte.value.compteEmail)) {
        styleConditionFormatEmail.value = classesPourListeCondition["cachee"]
    } else {
        styleConditionFormatEmail.value = classesPourListeCondition["pasRespectee"]
        lesConditionsSontRemplies = false
    }

    if (compte.value.comptelogin != "") {
        styleConditionLoginReseigne.value = classesPourListeCondition["cachee"]
    } else {
        styleConditionLoginReseigne.value = classesPourListeCondition["pasRespectee"]
        lesConditionsSontRemplies = false
    }

    if (compte.value.comptePrenom != "") {
        styleConditionPrenomReseigne.value = classesPourListeCondition["cachee"]
    } else {
        styleConditionPrenomReseigne.value = classesPourListeCondition["pasRespectee"]
        lesConditionsSontRemplies = false
    }

    if (compte.value.paysDeNaissanceId != null) {
        styleConditionPaysReseigne.value = classesPourListeCondition["cachee"]
    } else {
        styleConditionPaysReseigne.value = classesPourListeCondition["pasRespectee"]
        lesConditionsSontRemplies = false
    } 

    if (compte.value.dateDeNaissance != "") {
        styleConditionDateNaissanceReseigne.value = classesPourListeCondition["cachee"]
    } else {
        styleConditionDateNaissanceReseigne.value = classesPourListeCondition["pasRespectee"]
        lesConditionsSontRemplies = false
    }

    if (!lesConditionsSontRemplies) {
        return
    }

    let dateDeNaissance = new Date(compte.value.dateDeNaissance)

    // new Date() équivant à la date actuelle :
    let ageMinimumRequis = new Date()  
    // L'âge minimum requis est aujourd'hui - 18 ans, les utilisateurs doivent être majeurs :
    ageMinimumRequis.setFullYear(ageMinimumRequis.getFullYear() - 18)

    if (dateDeNaissance < ageMinimumRequis) {
        styleConditionUtilisateurMajeur.value = classesPourListeCondition["cachee"]
    } else {
        styleConditionUtilisateurMajeur.value = classesPourListeCondition["pasRespectee"]
        return
    }

    if (await emailEstDansLaBaseDeDonnees(compte.value.compteEmail)) {
        styleConditionEmailUnique.value = classesPourListeCondition["pasRespectee"]
        return
    } else {
        styleConditionEmailUnique.value = classesPourListeCondition["cachee"]
    }

    // La version hahsée du mot de passe doit être cachée à l'utilisateur,
    // avec l'objet utilisateur dans l'objet compte :
    let compteAvecMDPHashe = {
        compteEmail: compte.value.compteEmail,
        comptelogin: compte.value.comptelogin,
        compteMdp: encrypter(compte.value.compteMdp),
        utilisateurCompte: {
            utilisateurNomAcheteur: compte.value.compteNom,
            prenomUtilisateur: compte.value.comptePrenom,
            utilisateurDateNaissance: compte.value.dateDeNaissance,
            paysNaissanceId: compte.value.paysDeNaissanceId
        }
    }

    compte.value.compteMdp = ""

    const response = await fetch("https://apififa2.azurewebsites.net/api/accescompte/inscription", {
        method: "POST",
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(compteAvecMDPHashe)
    })

    if (response.status == 200) {

        // On enregistre les données retournées, l'id du compte et le token pour lire les
        // données, dans compteStore
        let data = await response.json()
        compteStore.connect(data.userDetails.compteId, data.token, data.userDetails.utilisateurCompte)

        router.push({ "name" : "index" })   // on va à la page d'accueil

    } else {
        console.warn("réponse non gérée " + response.status + "\n" + response)
    }
}
</script>

<template>
    <div class="flex items-center justify-center flex-col mb-20">
        <h1 class="font-bold text-4xl my-20">Inscription</h1>
        <div class="flex">

            <!-- PARTIE GAUCHE -->
            <div class="*:m-2">
                <p>Prénom</p>
                <label class="input input-bordered flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4 opacity-70"><path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" /></svg>
                    <input type="text" class="grow" placeholder="Prénom" v-model="compte.comptePrenom" id="inputPrenom" />
                </label>
                <p>Nom de famille</p>
                <label class="input input-bordered flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4 opacity-70"><path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" /></svg>
                    <input type="text" class="grow" placeholder="Nom de famille" v-model="compte.compteNom" id="inputNom" />
                </label>
                <p>Date de naissance</p>
                <label class="input input-bordered flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4 opacity-70">
                        <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
                    </svg>
                    <input type="date" class="grow" placeholder="Date de naissance" v-model="compte.dateDeNaissance" id="inputDateDeNaissance" />
                </label>
                <p>Pays de naissance</p>
                <label class="input input-bordered flex items-center gap-2" v-if="listePays">
                    <select class="w-full select-none" v-model="compte.paysDeNaissanceId" id="inputPaysNom">
                        <option disabled selected>Pays de naissance</option>
                        <option v-for="pays in listePays" :value="pays.paysId">{{ pays.paysNom }}</option>
                    </select>
                </label>
            </div>

            <!-- PARTIE DROITE -->
            <div class="*:m-2">
                <p>Nom d'utilisateur (login)</p>
                <label class="input input-bordered flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4 opacity-70"><path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" /></svg>
                    <input type="text" class="grow" placeholder="Nom d'utilisateur" v-model="compte.comptelogin" id="inputLogin"/>
                </label>
                <p>Email</p>
                <label class="input input-bordered flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4 opacity-70">
                        <path
                            d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                        <path
                            d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
                    </svg>
                    <input type="text" class="grow" placeholder="Email" v-model="compte.compteEmail" id="inputEmail" />
                </label>
                <p>Mot de passe</p>
                <label class="input input-bordered flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4 opacity-70">
                            <path fill-rule="evenodd"
                                d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                                clip-rule="evenodd" />
                        </svg>
                        <input type="password" class="grow" value="" placeholder="Mot de passe" @input="onPasswordTyped" v-model="compte.compteMdp" id="inputMdp"/>
                </label>
            </div>
        </div>

        <ul>
            <li :class="styleConditionEmailUnique">Un compte est déjà enregistré à cet e-mail</li>
            <li :class="styleConditionFormatEmail">Le format de l'e-mail n'est pas correct</li>
            <li :class="styleConditionLoginReseigne">Le nom d'utilisateur (login) doit être renseigné</li>
            <li :class="styleConditionPrenomReseigne">Le prénom doit être renseigné</li>
            <li :class="styleConditionPaysReseigne">Votre pays doit être renseigné</li>
            <li :class="styleConditionDateNaissanceReseigne">La date de naissance doit être renseignée, chaque utilisateur doit être majeur</li>
            <li :class="styleConditionUtilisateurMajeur">Vous devez être majeur pour créer un compte</li>
            <VerificationMdpComponent :motDePasse="compte.compteMdp" ref="variablesDeVerificationMdp"/>
        </ul>

        <button class="btn btn-accent m-5" @click="boutonCreationCompte" id="btnCreationCompte">CRÉER LE COMPTE</button>
        <div class="m-5 flex items-center justify-center flex-col *:m-3">
            <p>Vous avez déjà un compte ?</p>
            <RouterLink :to="{name: 'login'}" class="btn btn-secondary">SE CONNECTER</RouterLink>
        </div>
    </div>
</template>