const jwt = require('jsonwebtoken');

class AuthJwt {
    async authJwt(req, res, next) {
        try {
            if(req.cookies && req.cookies.usertokken) {
                jwt.verify(req.cookies.usertokken, 'MREW333SGYTY', (err, data) => {
                    if(!err){
                        req.user = data;
                        console.log('Req.user ===>', req.user);
                        //console.log(req.user);
                        next();
                    } else {
                        console.log(err);
                    }
                })
            }else {
                next();
            }
        }catch(err) {
            // console.log(err);
            throw err;
        }
    }
}

module.exports = new AuthJwt();