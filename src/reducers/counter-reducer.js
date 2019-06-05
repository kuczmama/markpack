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
    let effect = null;
    switch (action.type) {
        case "add":
            state = {...state
            };
            state.count++;
            break;

        case "subtract":
            state = {...state
            };
            state.count--;
            break;
    }

    return {
        state: state,
        effect: effect
    };
};