const express = require("express");
const router = express.Router();

// ✅ THIS LINE MUST EXIST
const ctrl = require("../controllers/navigation.controller");

// ROUTES
router.post("/routes", ctrl.routes);
router.post("/reroute", ctrl.reroute);
router.post("/feedback", ctrl.feedback);

module.exports = router;
