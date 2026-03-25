/**
 * asyncHandler — wraps async route handlers to forward errors to
 * Express's global error middleware via `next(err)`.
 *
 * Usage:
 *   router.get("/", asyncHandler(async (req, res) => { ... }));
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((err) => next(err));
};
