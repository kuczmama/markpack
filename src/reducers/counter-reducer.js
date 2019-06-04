function add() {
    return {
        type: "add"
    }
}

function subtract() {
    return {
        type: "subtract"
    }
}

let reduceCounter = (state, action) => {
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