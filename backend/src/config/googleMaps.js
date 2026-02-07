const axios = require("axios");

const BASE_URL = "https://maps.googleapis.com/maps/api";

async function getDirections(origin, destination) {
  const response = await axios.get(`${BASE_URL}/directions/json`, {
    params: {
      origin,
      destination,
      alternatives: true,
      key: process.env.GOOGLE_MAPS_API_KEY,
    },
  });

  if (response.data.status !== "OK") {
    throw new Error(`Google Maps error: ${response.data.status}`);
  }

  return response.data.routes;
}

module.exports = { getDirections };
