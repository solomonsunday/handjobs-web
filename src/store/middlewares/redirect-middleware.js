const redirectMiddleware =
  ({ getState, dispatch }) =>
  (next) =>
  (action) => {
    next(action);
  };

export default redirectMiddleware;
