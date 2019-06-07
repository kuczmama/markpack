import {State} from "../state";
import {GlobalAction, ReductionWithEffect} from "../core/reducers";

export const reduceInitialLoading = (state: State, action: GlobalAction): ReductionWithEffect<State> => {
    return {
        state
    };
};