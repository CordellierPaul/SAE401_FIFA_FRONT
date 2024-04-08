export function formatEmailEstBon(email) {
    const regexEmail = /^[\w\-\.]+@([\w-]+\.)+[\w-]{2,}$/

    if (email.match(regexEmail)) {
        return true
    }

    return false
}

export async function emailEstDansLaBaseDeDonnees(email) {

    const response = await fetch("https://apififa2.azurewebsites.net/api/compte/EmailIsInDatabase/" + email, {
        method: "GET",
        mode: "cors"
    })

    return await response.json()
}