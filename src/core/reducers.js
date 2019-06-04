function sequence(first, next) {
    if (!first) return next;
    if (!next) return first;

    if (first.effectType === "sequenced") {
        return {...first,
            effects: first.effects.concat([next])
        };
    }
    return {
        effectType: 'sequenced',
        effects: [first, next]
    };
}


function reducerChain(state, action, effect) {
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