import {CompleteRequest, requestAjax} from "../core/services/ajax-service.js";
import {ReductionWithEffect} from "../core/reducers.js";
import {State} from "../state.js";

export type CounterAction = Add | Subtract;

export interface Add {
    type: "add"
}

export function add() : Add {
    return {
        type: "add"
    }
}

export interface Subtract {
  type: "subtract"
}

export function subtract() : Subtract {
    return {
        type: "subtract"
    }
}

export const reduceCounter = (state: State, action: CounterAction | CompleteRequest): ReductionWithEffect<State> => {
    let effects = [];
    switch (action.type) {
        case "complete-request":
            state = {...state};
            state.welcomeMessage = action.response;
            break;

        case "add":
            state = {...state};
            state.count++;
            effects = effects.concat(requestAjax(["load-markup-readme"], {url: "https://raw.githubusercontent.com/kuczmama/smark/master/README.md", method: "GET"}));
            break;

        case "subtract":
            state = {...state
            };
            state.count--;
            break;
    }

    return {
        state,
        effects
    };
};