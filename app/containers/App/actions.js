import {
  SOME_ACTION,
} from './constants';

export const someAction = (payload) => ({
  type: SOME_ACTION,
  payload,
});
