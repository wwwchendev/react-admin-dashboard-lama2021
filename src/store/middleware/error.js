const error = store => next => action => {
  if (action.type === 'SHOW_ERROR') {
    console.error(action.payload.error);
    next(action);
  } else {
    next(action); //這會將操作傳遞給下一個中間件或 reducer
  }
};
export default error;
