const express = require("express");
const cors = require("cors");
require("dotenv").config();

const navigationRoutes = require("./routes/navigation.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/navigation", navigationRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ NeuroNav backend running on port ${PORT}`);
});

console.log("API KEY:", process.env.GOOGLE_MAPS_API_KEY);
