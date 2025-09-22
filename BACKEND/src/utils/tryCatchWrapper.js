// src/utils/tryCatchWrapper.js
/**
 * Wrap async route handlers to forward errors to express error handler
 */
function tryCatchWrapper(fn) {
  return function (req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

module.exports = tryCatchWrapper;
