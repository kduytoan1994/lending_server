module.exports = (app) => {
    const loan = app.models.loan;
    const pack = app.models.pack;
    const host = app.models.host;
    app.post('/api/loan', (req, res) => {
        var interest;
        var total = req.body.amount;
        if (total < 30) {
            interest = 2
        } else if (total < 100) {
            interest = 5
        } else {
            interest = 15
        }
        var payload = {
            hostId: req.body.hostId,
            name: req.body.name,
            amount: req.body.amount,
            called: 0,
            typeHome: req.body.typeHome,
            address: req.body.address,
            descriptions: req.body.descriptions,
            dueDate: req.body.dueDate,
            endDate: req.body.endDate,
            interest: interest
        }
        loan.create(payload, (err, loan) => {
            if (err) {
                console.log(err);
                return;
            }
            var amount1 = Math.floor(0.1 * loan.amount);
            var amount2 = Math.floor(0.3 * loan.amount);
            var ammout3 = loan.amount - amount2 - amount1;
            pack.create({
                loanId: loan.id,
                status: 1,
                amount: amount1
            }, (err, pack1) => {
                if (err)
                    console.log(err)
                else
                    console.log('pack1: ', pack1)
            })
            pack.create({
                loanId: loan.id,
                status: 1,
                amount: amount2
            }, (err, pack2) => {
                if (err)
                    console.log(err)
                else
                    console.log('pack2: ', pack2)
            })
            pack.create({
                loanId: loan.id,
                status: 1,
                amount: ammout3
            }, (err, pack3) => {
                if (err)
                    console.log(err)
                else
                    console.log('pack3: ', pack3)
            })
            res.json({ loan: loan })
        })
    })
    app.post('/api/loan/listLoan', (req, res) => {
        loan.find()
            .then(loans => {
                res.json({list_loans: loans})
            })
            .catch(err => {
                res.json(err)
            })
    })
    app.post('/api/loan_host', (req, res) => {
        var loanTemp;
        loan.findOne({ id: req.body.id })
            .then(loan => {
                loanTemp = loan;
                console.log(loan)
                console.log('hostId', loan.hostId)
                return host.findOne({ id: loan.hostId })
            })
            .then(host => {
                console.log("host", host);
                console.log("loan", loanTemp)
                res.json({
                    id: loanTemp.id,
                    name: loanTemp.name,
                    address: loanTemp.address,
                    type: loanTemp.typeHome,
                    list_photo: loanTemp.photos,
                    host_name: host.name,
                    host_address: host.address,
                    phone_number: host.phoneNumber
                })
            })
            .catch(err => {
                res.json(err)
            })
    })
    app.post('/api/loan/packages', (req, res) => {
        var packageTemp;
        var loanId = req.body.id;
        pack.find({ loanId: loanId })
            .then(packages => {
                packageTemp = packages;
                return loan.findById(loanId)
            })
            .then(loan => {
                res.json({
                    amount: loan.amount,
                    called: loan.called,
                    dueDate: loan.dueDate,
                    endDate: loan.endDate,
                    interest: loan.interest,
                    listPackages: packageTemp
                })
            })
            .catch(err=>{
                res.json(err)
            })
    })
}