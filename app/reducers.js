import { combineReducers } from 'redux-immutable';
import { fromJS } from 'immutable';
import { LOCATION_CHANGE } from 'react-router-redux';

// Поддержка ImmutableJS в react-router-redux
function routeReducer(state = fromJS({ locationBeforeTransitions: null }), action) {
  switch (action.type) {
    case LOCATION_CHANGE:
      return state.merge({
        locationBeforeTransitions: action.payload,
      });
    default:
      return state;
  }
}

const reducers = combineReducers({
  route: routeReducer,
});

export default reducers;
