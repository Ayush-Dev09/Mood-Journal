// routes/therapyRoutes.js
const express = require("express");
const router = express.Router();

const { therapyChat } = require("../controllers/therapyController");

router.post("/", therapyChat);

module.exports = router;
