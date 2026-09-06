import { renderDom, createElement } from "./utils.ts";
import type { VNode } from "./types.ts";
import { patch } from "./diffingAlgo.ts";
import { useState, setComponentState } from "./hooks.ts";

const rootElement = document.querySelector("#app") as HTMLElement;

let previousNode: VNode | null = null;
let domElement: ChildNode | null = null;

export const renderComponent = (component: Function, root: HTMLElement) => {
    setComponentState(component.name, () => renderComponent(component, root));

    const vNode = component();

    if (previousNode !== null && domElement !== null) {
        //Updates dom
        domElement = patch(previousNode, vNode, domElement);
    } else {
        // First mount
        const currentDomElement = renderDom(vNode);
        domElement = currentDomElement;
        root.appendChild(currentDomElement);
    }

    previousNode = vNode;
};

const App = (count: number) => {
    //Returns Vnode object
    return createElement("h1", null, {}, `Count: ${count}`);
};

export const renderAppWithProps = () => {
    renderComponent(() => App(0), rootElement); // Initial call/mount
    renderComponent(() => App(1), rootElement); // Updation
};

const AppComp = () => {
    const [count, setCount] = useState(0);

    const incrementCount = () => {
        setCount((prev) => prev + 1);
    };

    return createElement(
        "button",
        null,
        {
            onclick: incrementCount,
        },
        `Count: ${count}`,
    );
};

export const renderAppComponent = () => {
    renderComponent(() => AppComp(), rootElement);
};
