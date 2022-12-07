module.exports = {
    getIndex: (req,res) => {
        try {
            res.render('journal.ejs')
        } catch(err) {
        console.log(err)
        }
    }
}