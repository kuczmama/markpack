"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function reducerChain(state, action, effects) {
    if (effects === void 0) { effects = []; }
    var chainer = {
        apply: function (reducer) {
            var reduction = reducer(state, action);
            if (reduction.effects) {
                effects = effects.concat(reduction.effects);
            }
            state = reduction.state;
            return chainer;
        },
        result: function () {
            return {
                state: state,
                effects: effects
            };
        }
    };
    return chainer;
}
exports.reducerChain = reducerChain;
