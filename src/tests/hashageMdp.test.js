import { expect, test } from "vitest"
import { encrypter, verifierMotDePasse } from "../composable/hashageMdp.js"

const motsDePasse = [
    "ezaaeaefaza",
    "f4ze84fre7ger6g436rer4",
    "@afrzejgoi\/:hzeuifh//",
    "huifrhgiurhejezhil",
    "GiganteSQUEMotDDePase\fiuhg\i46546846487443sqd",
    "GiganfdsfezfotDDePase\fiuhg\i4654684648fezfezfzGiganteSQUEefzefzefezf7443sqd",
    "jeo89/rel\\sd\fgu\rzei",
    "hfiez"
]

var encryption

motsDePasse.forEach(motDePasse => {
    
    test("test taille de l'encryption : " + motDePasse, () => {
        encryption = encrypter(motDePasse)
        console.log(encryption);
        expect(motDePasse.length).toBeLessThanOrEqual(128)
    })

    test("test vérification mot de passe : " + motDePasse, () => {
        expect(verifierMotDePasse(motDePasse, encryption)).toBe(true)
    })
});