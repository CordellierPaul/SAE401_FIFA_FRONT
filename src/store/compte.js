import { defineStore } from "pinia";
import { useStorage } from '@vueuse/core'

// Avec useStorage, les éléments du store ne sont pas réinitialisés avec un rafraichissemet de la page

const useCompteStore = defineStore("compte", {
    state: () => ({
        compteId: useStorage("compteId", null),
        utilisateur: useStorage("utilisateur", null),
        token: useStorage("token", ""),
        isConnected: useStorage("isConnected", false) 
    }),
    actions: {
        connect(compteId, token, utilisateur) {
            this.compteId = compteId
            this.utilisateur = utilisateur
            this.token = token
            this.isConnected = true
        },
        disconnect() {
            this.compteId = null
            this.utilisateur = null
            this.token = ""
            this.isConnected = false
        }
    },
    getters: {
    }
})

export default useCompteStore