/**
 * Utility function to handle async Express route handlers
 * Wraps async controller functions to properly catch errors and pass them to Express error middleware
 * @param {Function} fn - The async controller function to wrap
 * @returns {Function} - Express middleware function
 */
export const asyncHandler = (fn) => function(req, res, next) {
  // Use a regular function instead of arrow function to maintain proper 'this' context
  // Execute the async function and catch any errors to pass to Express error middleware
  Promise.resolve(fn(req, res, next)).catch((error) => next(error));
};