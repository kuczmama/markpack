function add() {
    return {
        type: "add"
    }
}function subtract() {
    return {
        type: "subtract"
    }
}let reduceCounter = (state, action) => {
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
function m(nodeName, attributes, ...args) {
    let children = args.length ? [].concat(...args) : null;
    return {
        nodeName,
        attributes,
        children
    }
}function render(vnode) {
    if (vnode.split) return document.createTextNode(vnode);
    let n = document.createElement(vnode.nodeName);
    let as = vnode.attributes || {};
    for (let k in as) {
        if (typeof as[k] === "function") {
            n[k] = as[k];
        } else {
            n.setAttribute(k, as[k]);
        }
    }
    (vnode.children || []).map(c => n.appendChild(render(c)));
    return n;
}function renderAt(vnode, id) {
    let app = document.getElementById(id);
    if (app.firstChild) app.removeChild(app.firstChild);
    app.appendChild(render(vnode));
};function get(url, success) {
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.onload = function() {
        if (request.status === 0 || request.status >= 200 && request.status < 400) {
            var resp = request.responseText;

            success(resp);
        }
    };
    request.send();
}
const initialState = {
    welcomeMessage: "Welcome to Mark Act!!",
    count: 0,
}
function RootPage(dispatch) {
    return (state) => {
        return m('div', {}, state.welcomeMessage,
            m('div', {}, String(state.count),
                m('div', {},
                    m('button', {
                        style: 'background-color: #00ff00; color: #ffffff; width: 100px; border-radius: 1rem; text-align: center; display: inline-block;',
                        onclick: () => dispatch(add())
                    }, "Add"),
                    m('button', {
                        style: 'background-color: #ff0000; color: #ffffff; width: 100px; border-radius: 1rem; text-align: center; display: inline-block;',
                        onclick: () => dispatch(subtract())
                    }, "subtract")
                ),
            )
        );
    }
}
function getCoreServices() {
    return [];
}
function m(nodeName, attributes, ...args) {
    let children = args.length ? [].concat(...args) : null;
    return {
        nodeName,
        attributes,
        children
    }
}function render(vnode) {
    if (vnode.split) return document.createTextNode(vnode);
    let n = document.createElement(vnode.nodeName);
    let as = vnode.attributes || {};
    for (let k in as) {
        if (typeof as[k] === "function") {
            n[k] = as[k];
        } else {
            n.setAttribute(k, as[k]);
        }
    }
    (vnode.children || []).map(c => n.appendChild(render(c)));
    return n;
}function renderAt(vnode, id) {
    let app = document.getElementById(id);
    if (app.firstChild) app.removeChild(app.firstChild);
    app.appendChild(render(vnode));
};function get(url, success) {
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.onload = function() {
        if (request.status === 0 || request.status >= 200 && request.status < 400) {
            var resp = request.responseText;

            success(resp);
        }
    };
    request.send();
}
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
}function reducerChain(state, action, effect) {
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
const reduceInitialLoading = (state, action) => {
    let effect = null;
    return {
        state: state,
        effect: effect
    };
};
let self = null;class MarkactRoot {
    constructor(id) {
        self = this;
        self.id = id;
        self.state = {...initialState
        };
        self.services = getCoreServices(self.dispatch);
        self.dispatch("init");
    }


    reduce(state, action) {
        return reducerChain(state, action)
            .apply(reduceInitialLoading)
            .apply(reduceCounter)
            .result();
    };

    reduceEffects(effects) {
        effects.map(effect => self.services.map(service => service(effect)))
    };

    dispatch(action) {
        console.log("action", action);

        console.log("self", self);
        console.log("state", self.state);

        let oldState = {...self.state
        };
        let reduction = self.reduce(oldState, action);
        if (reduction.effect) {
            self.reduceEffects(reduction.effects);
        }

        self.state = reduction.state;
        self.render();
    };

    render() {
        let RootPageContent = RootPage(self.dispatch);
        renderAt(RootPageContent({...self.state
        }), self.id);
    }
}