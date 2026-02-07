const { Client } = require("@googlemaps/google-maps-services-js");
const polyline = require("@googlemaps/polyline-codec");

const client = new Client({});

/**
 * ✅ THIS IS THE FUNCTION YOUR CONTROLLER EXPECTS
 */
async function getNavigationRoutes(origin, destination) {
  const res = await client.directions({
    params: {
      origin,
      destination,
      alternatives: true,
      key: process.env.GOOGLE_MAPS_API_KEY,
    },
  });

  const routes = res.data.routes.map((route, index) => {
    const leg = route.legs[0];

    const decodedPath = polyline.decode(route.overview_polyline.points)
      .map(([lat, lng]) => ({ lat, lng }));

    return {
      routeId: `route-${index}`,
      summary: route.summary || "Suggested Route",
      distanceText: leg.distance.text,
      durationText: leg.duration.text,
      path: decodedPath,

      // placeholders (backend intelligence hooks)
      sensoryScore: Math.floor(Math.random() * 10) + 1,
      sensoryFlags: [],
    };
  });

  return routes;
}

/**
 * ✅ NAMED EXPORT (IMPORTANT)
 */
module.exports = {
  getNavigationRoutes,
};
