const express = require('express')
const router = express.Router()

const app = express()

//Middleware
const validateSignup = require("../../middleware/auth/verifySignUp")
const authJwt = require("../../middleware/auth/authJwt")

//controller
const authController = require("../../controller/auth/auth")

//GET
router.get("/Logout", authController.Logout);

//POST
router.post("/Login", authController.Login);
router.post("/sealerRegister", [validateSignup.checkDuplicateUsernameOrEmail], authController.postSealerRegister);
router.post("/UserRegister", [validateSignup.checkDuplicateUsernameOrEmail], authController.postUserRegister);

module.exports = router
