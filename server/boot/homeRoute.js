module.exports = (app) => {
    const CommonResponse = require('../util/CommonResponse')
    const loan = app.models.loan;
    const pack = app.models.pack;
    const host = app.models.host;
    const investor = app.models.investor;
    const transaction = app.models.transaction;

    app.get('/api/informationHome', (req, res) => {
        var numBorrower, listTransaction, listInvestor, numInvestors, listLoan;
        host.count()
            .then(numBorrowers => {
                numBorrower = numBorrowers;
                console.log(numBorrowers)
                return investor.count()
            })
            .then(numInvestor => {
                numInvestors = numInvestor;
                return transaction.count();
            })
            .then(numTransaction => {
                listTransaction = numTransaction;
                return investor.find({ fields: { name: true, avatar: true, lended_money: true } })
            })
            .then(investors => {
                listInvestor = investors;
                return loan.find();
            })
            .then(loans => {
                var data = {
                    total_money: 10000,
                    total_borrower: numBorrower,
                    total_investor: numInvestors,
                    total_transaction: listTransaction,
                    list_investor: listInvestor,
                    listLoan: loans
                }
                var response = new CommonResponse("success", "", data)
                console.log("response", response)
                res.json(response)
            })
            .catch(err => {
                var response = new CommonResponse("error", "", err)
                console.log("response", response)
                res.json(response)
            })
    })
    app.post('/abc', (req, res) => {
        var id = req.body.id;
        console.log(id)
        host.find({ 'where': { 'id': id } }, { fields: { 'id': true, 'email': false } })
            .then(host => {
                var response = new CommonResponse("success", "", host)
                console.log("response", response)
                res.json(response)
            })
            .catch(err => {
                var response = new CommonResponse("error", "", err)
                console.log("response", response)
                res.json(response)
            })
    })
}