module.exports = (app) => {
    const loan = app.models.loan;
    const pack = app.models.pack;
    const host = app.models.host;
    const investor = app.models.investor;

    app.get('/api/informationHome', (req, res) => {
        var numBorrowers;
        host.count()
            .then(numBorrowers => {
                numBorrowers = numBorrowers;
                console.log(numBorrowers)
                res.json(numBorrowers)
            })
            .catch(err=>{
                console.log(err)
                res.json(err);
            })
    })
}