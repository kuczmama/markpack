import {
    reduceInitialLoading
} from "./reducers/initial-loading-reducer";
import {
    reducerChain
} from "./core/reducers"
import {
    m,
    render,
    renderAt
} from "./core/markact"
import {
    getCoreServices
} from './core/services/services';
import {
    RootPage
} from './views/root-page';
import {
    initialState
} from "./state";

let self = null;
class MarkactRoot {
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