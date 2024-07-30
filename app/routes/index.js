const express = require("express");
const clubRoutes = require('./club.js');
const scoreRoutes = require('./score.js')

const router = express.Router();

router.use("/club", clubRoutes);
router.use("/score", scoreRoutes)

module.exports = router;