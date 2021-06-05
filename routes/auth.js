const express =require("express")
const router = express.Router();

const {signup, verifyAccount} = require("../controllers/auth")

router.post('/signup', signup)
router.post('/activate', verifyAccount)

module.exports = router;