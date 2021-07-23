const router = require("express").Router();
const AuthController = require("../controller/Auth.controller")

router.post("/login", AuthController.customerLogin);

router.post("/register", AuthController.registerCustomer);

module.exports = router;
