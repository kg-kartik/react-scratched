import { renderDom } from "./utils.ts";

import type { ComponentDetails } from "./types.ts";
import { patch } from "./diffingAlgo.ts";
import { setCurrentComponentState } from "./hooks.ts";

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
