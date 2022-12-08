let rating = document.querySelectorAll('#icon')

Array.from(rating).forEach( (el) => {
    el.addEventListener('click', getRating)
})

function getRating() {
    console.log(el)
}