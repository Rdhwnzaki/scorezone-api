const express = require("express");

const scoreController = require("../controller/score");
const router = express.Router();

router.post("/", scoreController.create);
router.get("/", scoreController.findAll);
router.patch("/:id", scoreController.update);
router.delete("/:id", scoreController.delete);

module.exports = router;