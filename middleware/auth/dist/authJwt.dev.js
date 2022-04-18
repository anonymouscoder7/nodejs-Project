"use strict";

var jwt = require("jsonwebtoken");

var config = require("../../config/auth.config");

var db = require("../../model/index");

var Auth = db.Auths;
var Logout = db.Logouts;

verifyToken = function verifyToken(req, res, next) {
  var token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({
      message: "No token provided!"
    });
  }

  jwt.verify(token, config.secret, function (err, decoded) {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!"
      });
    }

    req.userId = decoded.id;
    next();
  });
};

isLogedOut = function isLogedOut(req, res, next) {
  var token = req.headers["x-access-token"];
  Logout.findOne({
    where: {
      jwtToken: token
    }
  }).then(function (result) {
    if (!result) {
      next();
    } else {
      return res.status(400).send({
        message: "Failed to authorize!"
      });
    }
  })["catch"](function (err) {
    res.send({
      message: "Invalid Token logout!"
    });
    return;
  });
};

isAdmin = function isAdmin(req, res, next) {
  Auth.findByPk(req.userId).then(function (user) {
    user.getRoles().then(function (roles) {
      for (var i = 0; i < roles.length; i++) {
        if (roles[i].name === "admin") {
          next();
          return;
        }
      }

      res.send({
        message: "Require Admin Role!"
      });
      return;
    })["catch"](function (err) {
      res.send({
        message: "Not A Admin!"
      });
    });
  })["catch"](function (err) {
    res.send({
      message: "Role Not Found"
    });
  });
};

isSealer = function isSealer(req, res, next) {
  Auth.findByPk(req.userId).then(function (user) {
    user.getRoles().then(function (roles) {
      for (var i = 0; i < roles.length; i++) {
        if (roles[i].name === "sealer") {
          next();
          return;
        }
      }

      res.status(403).send({
        message: "Require Sealer Role!"
      });
    });
  });
};

isUser = function isUser(req, res, next) {
  Auth.findByPk(req.userId).then(function (user) {
    user.getRoles().then(function (roles) {
      for (var i = 0; i < roles.length; i++) {
        if (roles[i].name === "user") {
          next();
          return;
        }
      }
      res.status(403).send({
        message: "Require user Role!"
      });
    });
  });
};

var authJwt = {
  verifyToken: verifyToken,
  isAdmin: isAdmin,
  isLogedOut: isLogedOut,
  isSealer: isSealer,
  isUser: isUser
};
module.exports = authJwt;