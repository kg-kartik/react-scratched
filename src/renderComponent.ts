import { renderDom, createElement } from "./utils.ts";

import type { ComponentDetails } from "./types.ts";
import { patch } from "./diffingAlgo.ts";
import { useState, setCurrentComponentState } from "./hooks.ts";

const rootElement = document.querySelector("#app") as HTMLElement;

// Stores component details
let componentStore = new Map<Function, ComponentDetails>();

export const renderComponent = (component: Function, root: HTMLElement) => {
    let currentComponentDetails = componentStore.get(component);

    if (!currentComponentDetails) {
        // Adds initial component details
        currentComponentDetails = {
            hookValues: [],
            component,
            domNode: null,
            vNode: null,
            rerender: () => {
                if (currentComponentDetails) {
                    renderComponent(currentComponentDetails.component, root);
                }
            },
        };

        // Sets current component details for the particular component instance
        componentStore.set(component, currentComponentDetails);
    }

    setCurrentComponentState(currentComponentDetails);

    // Returns the new virtual dom node for the component rendered
    const newVNode = component();

    const { vNode, domNode } = currentComponentDetails;

    if (vNode !== null && domNode !== null) {
        // Updates dom
        currentComponentDetails.domNode = patch(vNode, newVNode, domNode);
    } else {
        // First mount
        currentComponentDetails.domNode = renderDom(newVNode);
        root.appendChild(currentComponentDetails.domNode);
    }

    currentComponentDetails.vNode = newVNode;
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
    const [name, setName] = useState("Kartik");

    const incrementCount = () => {
        setCount((prev) => prev + 1);
    };

    const updateName = () => {
        setName("kg");
    };

    return createElement(
        "div",
        null,
        {},
        createElement(
            "button",
            null,
            {
                onclick: incrementCount,
            },
            `Count: ${count}`,
        ),
        createElement(
            "button",
            null,
            {
                onclick: updateName,
            },
            `${name}`,
        ),
    );
};

const CopyComp = () => {
    return AppComp();
};

export const renderAppComponent = () => {
    renderComponent(AppComp, rootElement);
};

export const renderCopyComponent = () => {
    renderComponent(CopyComp, rootElement);
};
