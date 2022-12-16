let saveBtn = document.querySelector('.saveEdit')
saveBtn.addEventListener('click', saveEdit)

async function saveEdit() {
    const journalId = this.parentNode.dataset.id 
    console.log(journalId)
    try {
        const response = await fetch('/journal/saveSession', {
            method: 'POST',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({
                'journalIdFromJSFile': journalId
            })
        })
        const data = await response.json()
        console.log(data)
        location.reload()
        return
    } catch(err) {
        console.log(err)
    }
}