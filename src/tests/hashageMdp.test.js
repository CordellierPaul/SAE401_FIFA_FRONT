import { expect, test } from "vitest"
import { encrypter, verifierMotDePasse } from "../composable/hashageMdp.js"

const motsDePasse = [
    "GiganteSQUEMotDDePaseiuhg46546846487443sqd",
    "GiganfdsfezfotDDePa!!!!$£hg%ù6546848fezfdz!/.:/,ezfzGiSQUEefzefàéëdëÊf7443sqd",
    "f4ze84fre7ger6g436rer4",
    "@afrzejgoi:hzeuifh//",
    "huDePa!!!!$£hg%ifrhgiàéëdëÊurhejeil",
    "ezaaeaefaza",
    "jeo89/relsdguzei",
    "hfiez"
]

var encryption

motsDePasse.forEach(motDePasse => {
    
    test("test taille du chiffrement, qui doit être moins de 128 caractères : " + motDePasse, () => {
        encryption = encrypter(motDePasse)
        expect(motDePasse.length).toBeLessThanOrEqual(128)
    })

    test("test vérification du chiffrement et du déchiffrement du mot de passe : " + motDePasse, () => {
        expect(verifierMotDePasse(motDePasse, encryption)).toBe(true)
    })
});