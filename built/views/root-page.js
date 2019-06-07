import { add, subtract } from "../reducers/counter-reducer.js";
import { m } from "../core/markact.js";
export function RootPage(dispatch) {
    let dispatcher = {
        add: () => dispatch(add()),
        subtract: () => dispatch(subtract()),
    };
    return (state) => {
        return m('div', {}, state.welcomeMessage, m('div', {}, String(state.count), m('div', {}, m('button', {
            style: 'background-color: #00ff00; color: #ffffff; width: 100px; border-radius: 1rem; text-align: center; display: inline-block;',
            onclick: dispatcher.add
        }, "Add"), m('button', {
            style: 'background-color: #ff0000; color: #ffffff; width: 100px; border-radius: 1rem; text-align: center; display: inline-block;',
            onclick: dispatcher.subtract
        }, "subtract"))));
    };
}
