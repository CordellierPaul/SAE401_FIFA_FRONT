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
            this.prixSousTotal = (parseFloat(this.prixSousTotal)+ parseFloat(variante.varianteProduitPrix * (1- variante.varianteProduitPromo))).toFixed(2)
        },
        augmenteQuantite(stk){
            let index = this.stocks.indexOf(stk)
            this.nombreProduits++
            this.quantites[index]++
            this.prixSousTotal =(parseFloat(this.prixSousTotal)+ parseFloat(this.variantes[index].varianteProduitPrix * (1- this.variantes[index].varianteProduitPromo))).toFixed(2)
        },
        baisseQuantite(stk) {
            let index = this.stocks.indexOf(stk)
            if(this.quantites[index] == 1)
                return this.supprimeProduit(stk)
            this.nombreProduits--
            this.quantites[index]--
            this.prixSousTotal = (parseFloat(this.prixSousTotal)- parseFloat(this.variantes[index].varianteProduitPrix * (1- this.variantes[index].varianteProduitPromo))).toFixed(2)
        },
        supprimeProduit(stk) {            
            let index = this.stocks.indexOf(stk)
            this.nombreProduits-= this.quantites[index]
            this.prixSousTotal = (parseFloat(this.prixSousTotal)- parseFloat(this.variantes[index].varianteProduitPrix * (1- this.variantes[index].varianteProduitPromo)*this.quantites[index])).toFixed(2)        
            this.produits.splice(index, 1)
            this.variantes.splice(index, 1)
            this.quantites.splice(index, 1)
            this.images.splice(index, 1)
            this.stocks.splice(index, 1)
            this.coloris.splice(index, 1)
        },
        augmentationPossible(stk){
            let index = this.stocks.indexOf(stk)
            console.log(index)
            if(index != -1 && this.quantites[index] == stk.quantiteStockee)
                return false
            return true;
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
        sousTotal: (state) => state.prixSousTotal,
    }
})

export default usePanierStore