const { Router } = require("express");
const { handleUserSignIn, handleUserLogin } = require("../controllers/auth");
const router = Router();

router.post('/register', handleUserSignIn);
router.post('/login', handleUserLogin);

module.exports = router;