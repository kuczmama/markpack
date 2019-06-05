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
import {
    reduceCounter
} from "./reducers/counter-reducer";

const MarkactRoot = function(id) {
    self = this;
    self.id = id;
    self.state = {...initialState
    };
    self.services = getCoreServices(self.dispatch);


    self.reduce = function(state, action) {
        return reducerChain(state, action)
            .apply(reduceInitialLoading)
            .apply(reduceCounter)
            .result();
    };

    self.reduceEffects = function(effects) {
        effects.map(effect => self.services.map(service => service(effect)))
    };

    self.dispatch = function(action) {
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

    self.render = function() {
        let RootPageContent = RootPage(self.dispatch);
        renderAt(RootPageContent({...self.state
        }), self.id);
    }
    self.dispatch("init");
}