const express = require("express");

const clubController = require("../controller/club");
const router = express.Router();

router.post("/", clubController.create);
router.get("/", clubController.findAll);
router.patch("/:id", clubController.update);
router.delete("/:id", clubController.delete);

module.exports = router;