const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../../model/index");

const Auth = db.Auths;
const User = db.Sealers;

const Role = db.Roles;
const Logout = db.Logouts;

const config = require("../../config/auth.config");

//Method: POST
//Route: /Login
exports.Login = (req, res) => {
  Auth.findOne({
    where: {
      email: req.body.email,
    },
  })
    .then((user) => {
      if (!user) {
        return res
          .status(404)
          .send({ message: "Login Failed! Please check your input. 1" });
      }
      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!",
        });
      }

      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400, // 24 hours
      });
      var authorities = [];

      user
        .getRoles()
        .then((roles) => {
          for (let i = 0; i < roles.length; i++) {
            authorities.push("ROLE_" + roles[i].name.toUpperCase());

          }
          res.status(200).send({
            id: user.id,
            username: user.username,
            email: user.email,
            roles: authorities,
            accessToken: token,
          });
        })
        .catch((err) => {
          res
            .status(500)
            .send({ message: "Login Failed! Please check your input.2" });
        });
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Login Failed! Please check your input.3" });
    });
};

//Method: POST
//Route: /sealerRegister

exports.postSealerRegister = (req, res) => {
  //validate
  if (!req.body.username && !req.body.email && !req.body.password) {
    res.status(400).send({
      message: "Input fields cannot be Empty!",
    });
    return;
  } else {
    // Create
    let encPass = bcrypt.hashSync(req.body.password, 8);
    const data = {
      password: encPass,
      username: req.body.username,
      email: req.body.email,
    };

    //save
    Auth.create(data)
      .then((user) => {
        // save sealer 
         const profile = {
          name: req.body.username,
          salerId: user.id,
          logo:'',
          phone:'',
          description:''
        };
        User.create(profile)
        // end save sealer 

        Role.findAll({
          where: {
            name: "sealer",
          },
        }).then((roles) => {
          user
            .setRoles(roles)
            .then(() => {
             
              // end save user
              res.status(200).send({
                data: user,
                message: "success",
              });
            })
            .catch(() => {
              res.status(500).send({
                message: "error",
              });
            });
        });
      })
      .catch((err) => {
        res.status(500).send({
          message: "error",
        });
      });


  }
};

//Method: POST
//Route: /UserRegister

exports.postUserRegister = (req, res) => {
  //validate
  if (!req.body.username && !req.body.email && !req.body.password) {
    res.status(400).send({
      message: "Input fields cannot be Empty!",
    });
    return;
  } else {
    // Create
    let encPass = bcrypt.hashSync(req.body.password, 8);
    const data = {
      password: encPass,
      username: req.body.username,
      email: req.body.email,
    };

    //save
    Auth.create(data)
      .then((user) => {
        Role.findAll({
          where: {
            name: "user",
          },
        }).then((roles) => {
          user
            .setRoles(roles)
            .then(() => {
              res.status(200).send({
                data: user,
                message: "success",
              });
            })
            .catch(() => {
              res.status(500).send({
                message: "error",
              });
            });
        });
      })
      .catch((err) => {
        res.status(500).send({
          message: "error",
        });
      });
  }
};

//Method: GET
//Route: /Logout

exports.Logout = (req, res) => {
  const authHeader = req.headers["x-access-token"];

  Logout.create({
    jwtToken: authHeader,
  })
    .then((result) => {
      console.log(result);
      res.status(200).send({
        message: "User has been Logout",
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Something went wrong! Not logout",
      });
    });
};