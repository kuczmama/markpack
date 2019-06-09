import {State} from "../state.js";
import {ReductionWithEffect} from "../core/reducers.js";

export const routerReducer = (state: State, location: Location) : ReductionWithEffect<State> => {
  let effects = [];

  if(state.initialLoad) {
    state.initialLoad = false;
  }

  return {state, effects};
};
