const feedbackStore = [];

exports.storeFeedback = ({ routeId, comfortable, stressPoints }) => {
  feedbackStore.push({
    routeId,
    comfortable,
    stressPoints,
    time: Date.now(),
  });
};

exports.getAllFeedback = () => feedbackStore;
