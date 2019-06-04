import {
    m,
    renderAt
} from "./markact";

function app() {
    return m('div', {},
        "This works really well!!!",
        m('img', {
        src: 'https://previews.123rf.com/images/alexgorka/alexgorka1809/alexgorka180900030/108027925-yay-vector-lettering-.jpg',
            width: '500px',
            height: '400px',
        }),
        m('img', {
            src: 'https://previews.123rf.com/images/alexgorka/alexgorka1809/alexgorka180900030/108027925-yay-vector-lettering-.jpg',
            width: '500px',
            height: '400px',
        })
    );
};



var tid = setInterval(function() {
    if (document.readyState !== 'complete') return;
    clearInterval(tid);
    renderAt(app(), "app");
}, 100);