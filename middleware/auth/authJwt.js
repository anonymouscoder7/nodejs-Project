const jwt = require("jsonwebtoken");
const config = require("../../config/auth.config");
const db = require("../../model/index");
const Auth = db.Auths;
const Logout = db.Logouts;

verifyToken = (req, res, next) => {
    let token = req.headers["x-access-token"];

    if (!token) {
        return res.status(403).send({
            message: "No token provided!",
        });
    }

    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            return res.status(401).send({
                message: "Unauthorized!",
            });
        }
        req.userId = decoded.id;
        next();
    });
};

isLogedOut = (req, res, next) => {
    let token = req.headers["x-access-token"];

    Logout.findOne({ where: { jwtToken: token } })
        .then((result) => {
            if (!result) {
                next();
            } else {
                return res.status(400).send({
                    message: "Failed to authorize!",
                });
            }
        })
        .catch((err) => {
            res.send({
                message: "Invalid Token logout!",
            });
            return;
        });
};

isAdmin = (req, res, next) => {
    Auth.findByPk(req.userId)
        .then((user) => {
            user
                .getRoles()
                .then((roles) => {
                    for (let i = 0; i < roles.length; i++) {
                        if (roles[i].name === "admin") {
                            next();
                            return;
                        }
                    }
                    res.send({
                        message: "Require Admin Role!",
                    });
                    return;
                })
                .catch((err) => {
                    res.send({
                        message: "Not A Admin!",
                    });
                });
        })
        .catch((err) => {
            res.send({
                message: "Role Not Found",
            });
        });
};

isSealer = (req, res, next) => {
    Auth.findByPk(req.userId).then((user) => {
        user.getRoles().then((roles) => {
            for (let i = 0; i < roles.length; i++) {
                if (roles[i].name === "sealer") {
                    next();
                    return;
                }
            }
            res.status(403).send({
                message: "Require Sealer Role!",
            });
        });
    });
};

isUser = (req, res, next) => {
    Auth.findByPk(req.userId).then((user) => {
        user.getRoles().then((roles) => {
            for (let i = 0; i < roles.length; i++) {
                if (roles[i].name === "user") {
                    next();
                    return;
                }
            }
            res.status(403).send({
                message: "Require user Role!",
            });
        });
    });
};

const authJwt = {
    verifyToken: verifyToken,
    isAdmin: isAdmin,
    isLogedOut: isLogedOut,
    isSealer: isSealer,
    isUser: isUser,
};
module.exports = authJwt;
