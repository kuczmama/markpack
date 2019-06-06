import {
    m,
    render,
    renderAt
} from "../core/markact.js";
import {
    add,
    subtract,
} from "../reducers/counter-reducer.js";


export function RootPage(dispatch) {
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