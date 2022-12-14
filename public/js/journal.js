let rating = document.querySelectorAll('#icon')
let deleteBtn = document.querySelectorAll('.del')

Array.from(rating).forEach( (el) => {
    el.addEventListener('click', getRating)
})

Array.from(deleteBtn).forEach( (el) => {
    el.addEventListener('click', deleteJournal)
})

function getRating() {
    console.log(el)
}

async function deleteJournal() {
    const journalId = this.parentNode.dataset.id 
    console.log(journalId)
    try {
        const response = await fetch('journal/deleteSession', {
            method: 'delete',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({
                'journalIdFromJSFile': journalId
            })
        })
        const data = await response.json()
        console.log(data)
        location.reload()
    } catch(err) {
        console.log(err)
    }
}