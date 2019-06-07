// A better React and utils -- MarkAct.js

export interface VNode {
  nodeName: keyof HTMLElementTagNameMap
  attributes: { [k: string]: any }
  children: VNode[]
}

export function m(nodeName: keyof HTMLElementTagNameMap, attributes: { [k: string]: any }, ...args): VNode {
  let children = args.length ? [].concat(...args) : null;
  return {
    nodeName,
    attributes,
    children
  }
}

export function render(vnode: VNode | string): HTMLElement | Text {
  if (typeof vnode === 'string') return document.createTextNode(vnode);
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
}

export function renderAt(vnode: VNode, id: string) : void {
  let app = document.getElementById(id);
  if (app.firstChild) app.removeChild(app.firstChild);
  app.appendChild(render(vnode));
}