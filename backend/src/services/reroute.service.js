exports.shouldSuggestReroute = (current, alternative) => {
  return alternative < current - 0.15;
};
