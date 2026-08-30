import { renderDom, createElement } from "./utils.ts";
import type { VNode } from "./types.ts";
import { patch } from "./diffingAlgo.ts";

const rootElement = document.querySelector("#app") as HTMLElement;

let previousNode: VNode | null = null;
let domElement: ChildNode | null = null;

export const renderComponent = (component: Function, root: HTMLElement) => {
    const vNode = component();

    if (previousNode !== null && domElement !== null) {
        //update dom
        domElement = patch(previousNode, vNode, domElement);
    } else {
        // first mount
        const currentDomElement = renderDom(vNode);
        domElement = currentDomElement;
        root.appendChild(currentDomElement);
    }

    previousNode = vNode;
};

const App = (count: number) => {
    // return Vnode object
    return createElement("h1", null, {}, `Count: ${count}`);
};

export const renderAppWithProps = () => {
    renderComponent(() => App(0), rootElement); // initial call / mount
    renderComponent(() => App(1), rootElement); //update
};
