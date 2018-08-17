module.exports = function (app) {
    //get User model from the express app
    const UserModel = app.models.account;
    const Investor = app.models.investor;
    const Agency = app.models.agency;
    const AccessToken = app.models.AccessToken;

    app.post('/api/login', (req, res) => {
        var email = req.body.email;
        var password = req.body.password;

        //parse user credentials from request body
        const userCredentials = {
            "email": email,
            "password": password,
            "ttl": 86400
        }
        Agency.find({ where: { email: email } }, (err, rs) => {
            console.log('rs', rs)
            if (err)
                console.log(err)
            else if (rs.length == 0) {
                Investor.login(userCredentials, 'investor', (err, result) => {
                    if (err) {
                        //custom logger
                        console.log(err);
                        res.status(401).json({ "error": "login failed 1" });
                        return;
                    }
                    Investor.findById(result.userId, (err, results) => {
                        res.json({
                            "token": result.id,
                            "ttl": result.ttl,
                            "name": results.name,
                            "type": results.type,
                            "userId": result.userId
                        });
                    })
                });
            } else {
                Agency.login(userCredentials, 'agency', (err, result) => {
                    if (err) {
                        //custom logger
                        console.log(err);
                        res.status(401).json({ "error": "login failed 2" });
                        return;
                    }
                    Agency.findById(result.userId, (err, results) => {
                        res.json({
                            "token": result.id,
                            "ttl": result.ttl,
                            "name": results.name,
                            "type": results.type,
                            "userId": result.userId
                        });
                    })
                });
            }
        })

    });
    app.post('/api/register', (req, res) => {
        const userCredentials = {
            "email": req.body.email,
            "password": req.body.password,
            "type": 2,
            "name": req.body.name
        };
        UserModel.create(userCredentials, (err, result) => {
            if (err) {
                //custom logger
                console.log(err);
                res.status(401).json({ "error": "registed failed" });
                return;
            } else {
                Investor.create(userCredentials, (err, results) => {
                    if (err) {
                        console.log(err)
                    } else {
                        console.log(results)
                        Investor.login({ "email": req.body.email, "password": req.body.password }, (err, resultLogin) => {
                            if (err) {
                                console.log(err)
                            }
                            else { res.json({ token: resultLogin.id, ttl: resultLogin.ttl, userId: resultLogin.userId, created: resultLogin.created, type: 2, name: result.name }) }
                        })
                    }
                }
                )
            }
        })

    })
    app.post('/api/agency/register', (req, res) => {
        const userCredentials = {
            "email": req.body.email,
            "password": req.body.password,
            "type": 1,
            "name": req.body.name
        };
        UserModel.create(userCredentials, (err, result) => {
            if (err) {
                //custom logger
                console.log(err);
                res.status(401).json({ "error": "registed failed" });
                return;
            } else {
                const userCredentialAgency = {
                    "email": req.body.email,
                    "password": req.body.password,
                    "type": 1,
                    "name": req.body.name,
                    "area": req.body.area
                };
                Agency.create(userCredentialAgency, (err, results) => {
                    if (err) {
                        console.log(err)
                    } else {
                        res.json(results)
                    }
                }
                )
            }
        })

    })
    app.post('/api/logout', (req, res) => {
        var access_token = req.query.access_token;
        if (!access_token) {
            res.status(400).json({ "error": "access token required" });
            return;
        }
        UserModel.logout(access_token, function (err) {
            if (err) {
                console.log({
                    "error": err,
                    "timestamp": new Date().getTime()
                });
                res.status(404).json({ "error": "logout failed" });
                return;
            }

            res.status(200).json({ "message": "Logout successfully!" });
        });

    });
    app.post('/api/checkToken', (req, res) => {
        AccessToken.resolve(req.body.token, function(err, token){
            if(err){
               console.log('err',err);
               res.json(err)
            }else{
               console.log('token',token);
               res.json(token)
            }
         });
    })

}