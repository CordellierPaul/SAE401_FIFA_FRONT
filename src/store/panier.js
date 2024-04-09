import { defineStore } from "pinia";
import { useStorage } from '@vueuse/core';


const usePanierStore = defineStore("panier", {
    state: () => ({
        nombreProduits: useStorage("nombreProduits", 0),
        prixSousTotal : useStorage("prixSousTotal", 0),
        produits: useStorage("produits", []),
        variantes: useStorage("variantes", []),
        stocks: useStorage("stocks", []),
        quantites: useStorage("quantites", []),
        images:useStorage("images", []),
        coloris:useStorage("coloris", []),
    }),
    actions: {
        add(produit, variante, stk, image, col) {
            if(this.stocks.includes(stk))
                return this.augmenteQuantite(stk)
            this.nombreProduits++
            this.produits.push(produit)
            this.variantes.push(variante)
            this.stocks.push(stk)
            this.quantites.push(1)
            this.images.push(image)
            this.coloris.push(col)
            this.prixSousTotal = parseFloat(this.prixSousTotal)+ parseFloat((variante.varianteProduitPrix * (1- variante.varianteProduitPromo)).toFixed(2))
        },
        augmenteQuantite(stk){
            let index = this.stocks.indexOf(stk)
            this.nombreProduits++
            this.quantites[index]++
            this.prixSousTotal =parseFloat(this.prixSousTotal)+ parseFloat((this.variantes[index].varianteProduitPrix * (1- this.variantes[index].varianteProduitPromo)).toFixed(2))
        },
        baisseQuantite(stk) {
            let index = this.stocks.indexOf(stk)
            if(this.quantites[index] == 1)
                return this.supprimeProduit(stk)
            this.nombreProduits--
            this.quantites[index]--
            this.prixSousTotal = parseFloat(this.prixSousTotal)- parseFloat((this.variantes[index].varianteProduitPrix * (1- this.variantes[index].varianteProduitPromo)).toFixed(2))
        },
        supprimeProduit(stk) {            
            let index = this.stocks.indexOf(stk)
            this.nombreProduits-= this.quantites[index]
            this.prixSousTotal = parseFloat(this.prixSousTotal)- parseFloat((this.variantes[index].varianteProduitPrix * (1- this.variantes[index].varianteProduitPromo)).toFixed(2)*this.quantites[index])       
            this.produits.splice(index, 1)
            this.variantes.splice(index, 1)
            this.quantites.splice(index, 1)
            this.images.splice(index, 1)
            this.stocks.splice(index, 1)
            this.coloris.splice(index, 1)
        },
        augmentationPossible(stk){
            let index = this.stocks.indexOf(stk)
            if(index != -1 && this.quantites[index] == stk.quantiteStockee)
                return false
            return true;
        },
        reset(){
            this.nombreProduits = 0
            this.produits = []
            this.variantes= []
            this.stocks = []
            this.quantites =[]
            this.images =[]
            this.coloris = []
            this.prixSousTotal = 0
        }
    },
    getters: {
        count: (state) => state.nombreProduits,
        getProduits: (state) => state.produits,
        getVariantes: (state) => state.variantes,
        getQuantites: (state) => state.quantites,
        getStocks: (state) => state.stocks,
        getImages: (state) => state.images,
        getColoris: (state) => state.coloris,
        sousTotal: (state) => parseFloat(state.prixSousTotal).toFixed(2),
    }
})

export default usePanierStore