import { defineStore } from "pinia";
import { useStorage } from '@vueuse/core'

// Avec useStorage, les éléments du store ne sont pas réinitialisés avec un rafraichissemet de la page

const useCompteStore = defineStore("compte", {
    state: () => ({
        compteId: useStorage("compteId", null),
        utilisateurId: useStorage("utilisateurId", null),
        token: useStorage("token", ""),
        isConnected: useStorage("isConnected", false) 
    }),
    actions: {
        connect(compteId, token) {
            this.compteId = compteId
            
            // TODO ici : trouver userid

            this.token = token
            this.isConnected = true
        },
        disconnect() {
            this.compteId = null
            this.utilisateurId = null
            this.token = ""
            this.isConnected = false
        }
    },
    getters: {
    }
})

export default useCompteStore