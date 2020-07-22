const jwt = require("jsonwebtoken");

const constants = require("../config/constants.js");

module.exports = (req, res, next) => {
    // add code here to verify users are logged in
    const token = req.headers.authorization;
    console.log(req.headers.authorization)

    const secret = constants.jwtSecret;

    if (token) {
        jwt.verify(token, secret, (error, decodedToken) => {
            if (error) {
                // the token is invalid
                res.status(401).json({ you: "cannot pass!" });
            } else {
                req.decodedToken = decodedToken;

                next();
            }
        });
    } else {
        res.status(401).json({ message: "please provide credentials to access this resource" });
    }
};