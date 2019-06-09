import {reduceCounter} from "./reducers/counter-reducer.js";
import {reducerChain} from "./core/reducers.js";
import {getCoreServices} from "./core/services/services.js";
import {reduceInitialLoading} from "./reducers/initial-loading-reducer.js";
import {RootPage} from "./views/root-page.js";
import {renderAt} from "./core/markact.js";
import {initialState, State} from "./state.js";
import {navigationReducer} from "./core/services/navigation-service.js";
import {routerReducer} from "./reducers/router-reducer.js";

(window as any).MarkactRoot = function(id: string) {
  let self = this;
  self.id = id;
  self.state = {...initialState};
  let reduceNavigation = navigationReducer(routerReducer);

  self.reduce = function(state: State, action) {
    return reducerChain(state, action)
      .apply(reduceNavigation)
      .apply(reduceInitialLoading)
      .apply(reduceCounter)
      .result();
  };

  self.reduceEffects = function(effects) {
    effects.map(effect => self.services.map(service => service(effect)))
  };

  self.dispatch = function(action) {
    let startTimings = Date.now();
    console.log("action", action);

    let oldState = {...self.state
    };
    let reduction = self.reduce(oldState, action);
    if (reduction.effects) {
      self.reduceEffects(reduction.effects);
    }

    self.state = reduction.state;
    console.log("new state", self.state);
    let startRenderTime = Date.now();
    self.render();
    let renderTime = Date.now() - startRenderTime;
    console.log("rendered in", renderTime, "ms");
    console.log("completed in", Date.now() - startTimings, "ms");
    if (renderTime > 50) {
      console.warn("Slow action:  ", renderTime + "ms", action);
    }
  };
  self.services = getCoreServices(self.dispatch);


  self.render = function() {
    let RootPageContent = RootPage(self.dispatch);
    renderAt(RootPageContent({...self.state
    }), self.id);
  };
  self.dispatch("init");
};
