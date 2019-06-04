import {
    m,
    render,
    renderAt
} from "../src/core/markact";
import {
    add,
    subtract,
} from "../src/reducers/counter-reducer";


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