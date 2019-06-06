import {
    sequence
} from "./services/sequence-service.js";

export function reducerChain(state, action, effect) {
    const chainer = {
        apply: (reducer) => {
            let reduction = reducer(state, action);
            effect = sequence(effect, reduction.effect);
            state = reduction.state;
            return chainer;
        },

        result: () => {
            return {
                state,
                effect
            };
        }
    };

    return chainer;
}