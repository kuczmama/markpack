import {
    sequence
} from "../src/core/services/sequence-service";

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