const deleteBtn = document.querySelectorAll('.del')

Array.from(deleteBtn).forEach((el) => {
    el.addEventListener('click', deleteSpot)
})

async function deleteSpot() {
    const spotId = this.parentNode.dataset.id 
    console.log(spotId)
    try {
        const response = await fetch('spotList/deleteSpot', {
            method: 'delete',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({
                'spotIdFromJSFile': spotId
            })
        })
        const data = await response.json()
        console.log(data)
        location.reload()
    } catch(err) {
        console.log(err)
    }
}