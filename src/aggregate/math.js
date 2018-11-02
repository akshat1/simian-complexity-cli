function add(initialValue = 0) {
  let value = initialValue;
  return function (increment = 0) {
    value += increment;
    return value;
  }
}

function weightedAverage() {
  const denominator = add();
  const numerator = add();
  let average = 0;
  return function(value = 0, weight = 0) {
    if (weight) {
      average = numerator(value * weight) / denominator(weight);
    }
    return average;
  }
}

module.exports = {
  add,
  weightedAverage,
};
