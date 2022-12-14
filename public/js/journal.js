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

function deleteJournal() {
    console.log('hey')
}