export type GlobalAction = { type: string };
export type SideEffect = { effectType: string };
export type ReductionWithEffect<State extends Object> = { state: State, effects?: SideEffect[] | void };
export type Reducer <State> = (state: State, action: GlobalAction) => ReductionWithEffect<State>

export interface ReducerChain<S> {
  result: () => { state: S, effects: SideEffect[]}
  apply: (reducer: Reducer<S>) => ReducerChain<S>
}

export function reducerChain<State>(state: State, action: GlobalAction, effects: SideEffect[] = []) : ReducerChain<State> {
    const chainer = {
        apply: (reducer: Reducer<State>) => {
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