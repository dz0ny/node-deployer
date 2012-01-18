var trueFunction = function(deployer) {
  return true;
};

exports.beforeDeploy  = trueFunction;
exports.beforeClone   = trueFunction;
exports.afterClone    = trueFunction;
exports.beforeNPM     = trueFunction;
exports.afterNPM      = trueFunction;
exports.beforeRestart = trueFunction;
exports.onRestart     = trueFunction;
exports.afterRestart  = trueFunction;
exports.afterDeploy   = trueFunction;
