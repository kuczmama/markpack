import {requestAjax} from "../core/services/ajax-service.js";

export function add() {
    return {
        type: "add"
    }
}

export function subtract() {
    return {
        type: "subtract"
    }
}

export const reduceCounter = (state, action) => {
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