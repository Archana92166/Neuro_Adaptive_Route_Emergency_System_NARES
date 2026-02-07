const { getNavigationRoutes } = require("../services/route.service");
const { shouldSuggestReroute } = require("../services/reroute.service");
const { storeFeedback } = require("../services/feedback.service");

// ✅ ROUTES CONTROLLER
exports.routes = async (req, res) => {
  try {
    const { origin, destination } = req.body;

    if (!origin || !destination) {
      return res.status(400).json({ error: "Origin and destination required" });
    }

    const routes = await getNavigationRoutes(origin, destination);
    res.json({ routes });
  } catch (err) {
    console.error("Navigation error:", err.message);
    res.status(500).json({ error: "Failed to fetch routes" });
  }
};

// ✅ REROUTE CONTROLLER
exports.reroute = (req, res) => {
  const { currentRouteStress, alternativeRouteStress } = req.body;

  res.json({
    suggestReroute: shouldSuggestReroute(
      currentRouteStress,
      alternativeRouteStress
    ),
  });
};

// ✅ FEEDBACK CONTROLLER (THIS WAS MISSING OR MISWIRED)
exports.feedback = (req, res) => {
  storeFeedback(req.body);
  res.json({ status: "saved" });
};
