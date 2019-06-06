
export function reducerChain(state, action, effects = []) {
    const chainer = {
        apply: (reducer) => {
            let reduction = reducer(state, action);
            if(reduction.effects){
                effects = effects.concat(reduction.effects);
            }
            state = reduction.state;
            return chainer;
        },

        result: () => {
            return {
                state,
                effects
            };
        }
    };

    return chainer;
}