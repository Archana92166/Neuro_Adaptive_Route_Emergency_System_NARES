exports.computeSegmentStress = ({ traffic, poiDensity, turns, roadType }) => {
  const roadStressMap = {
    highway: 1,
    arterial: 0.6,
    residential: 0.3
  };

  return (
    0.35 * traffic +
    0.30 * poiDensity +
    0.20 * turns +
    0.15 * (roadStressMap[roadType] || 0.5)
  );
};

exports.labelStress = (score) => {
  if (score < 0.4) return "calm";
  if (score < 0.7) return "moderate";
  return "stressed";
};
