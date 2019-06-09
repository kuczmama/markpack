import {ReductionWithEffect} from "../reducers.js";
import {State} from "../../state.js";

export type NavigationAction = Visit | LinkClick

export interface HistoryPush {
  effectType: "history-push",
  location: string
}

export function historyPush(location: string) : HistoryPush {
    return {
        effectType: "history-push",
        location
    }
}

export interface HistoryReplace {
  effectType: "history-replace",
  location: string
}

export function historyReplace(location: string) : HistoryReplace {
    return {
        effectType: "history-replace",
        location
    }
}

export interface Visit {
  type: 'visit',
  noHistory?: boolean,
  location: Location
}

export function visit(location: Location) : Visit {
    return {
        type: "visit",
        location
    };
}

export interface LinkClick {
  type: 'link-click',
  location: string
}

export function linkClick(location: string) : LinkClick {
    return {
        type: 'link-click',
        location
    }
}

export function inferBasePath(): string {
  let tags = document.getElementsByTagName("BASE");
  if (tags.length === 0) return "/";

  let parts = (tags[tags.length - 1] as HTMLBaseElement).href.split("/");
  return "/" + parts.slice(3).join("/");
}


export function visitDispatcher(dispatch) {
    return ((event) => {
        let anchorElement = event.target;

        while (anchorElement.parentElement != null && anchorElement.tagName != "A") {
            anchorElement = anchorElement.parentElement;
        }

        let {
            pathname,
            search,
            hash
        } = anchorElement;

        if (pathname[0] !== '/') pathname = '/' + pathname;

        let basePath = inferBasePath();
        if (pathname.slice(0, basePath.length) === basePath) {
            pathname = "/" + pathname.slice(basePath.length);
        }

        let path = [pathname, search, hash].join("");
        dispatch(linkClick(path));
        event.preventDefault();
    });
}

export function navigationReducer(route: (state: State, location: Location) => ReductionWithEffect<State>) {
  return (state: State, action: NavigationAction): ReductionWithEffect<State> => {
    if(state.initialLoad) {
      route(state, window.location); // initial load
    }
    let effects = [];

    switch (action.type) {
      case 'visit':
        let reduction = route(state, action.location);
        if(reduction.effects) {
          effects = effects.concat(reduction.effects);
        }
        state = reduction.state;
        break;

      case 'link-click':
        effects = effects.concat(historyPush(action.location));
        break;
    }

    return {state, effects};
  }
}

export function withNavigation(dispatch) {
    history.pushState = (f => function pushState() {
        var ret = f.apply(this, arguments);
        window.dispatchEvent(new Event('pushState'));
        window.dispatchEvent(new Event('locationchange'));
        return ret;
    })(history.pushState);

    history.replaceState = (f => function replaceState() {
        var ret = f.apply(this, arguments);
        window.dispatchEvent(new Event('replaceState'));
        window.dispatchEvent(new Event('locationchange'));
        return ret;
    })(history.replaceState);

    window.addEventListener('popstate', () => {
        window.dispatchEvent(new Event('locationchange'))
    });

    window.addEventListener('locationchange', function() {
        dispatch(visit(location));
    });

    return (effect) => {
        switch (effect.effectType) {
            case 'history-replace':
                history.replaceState({}, null, effect.location);
                break;

            case 'history-push':
                history.pushState({}, null, effect.location);
                break;
        }
    }
}
