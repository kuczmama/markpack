export function withSequenced(dispatch) {
    return (effect) => {
        switch (effect.effectType) {
            case 'sequenced':
                for (let e of effect.effects) {
                    if (!e) continue;
                    effect$.dispatch(e);
                }
        }
    }
}

export function sequence(first, next) {
    if (!first) return next;
    if (!next) return first;

    if (first.effectType === "sequenced") {
        return {...first,
            effects: first.effects.concat([next])
        }
    }

    return {
        effectType: 'sequenced',
        effects: [first, next]
    };
}


export function sequenceReduction(effect, reduction) {
    effect = sequence(effect, reduction.effect);

    return {
        state: reduction.state,
        effect
    };
}