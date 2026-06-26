// Small helper so lib functions can attach an HTTP status to thrown errors;
// the Express error handler reads `.status` (defaults to 500).
export function httpError(status, message) {
  const err = new Error(message);
  err.status = status;
  return err;
}
