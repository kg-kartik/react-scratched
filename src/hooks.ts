import type { ComponentDetails } from "./types.ts";

let currentComponent: ComponentDetails | null = null;
let hookIndex = 0;

export const useState = <T>(
    initValue: T,
): [T, (value: T | ((value: T) => T)) => void] => {
    if (!currentComponent) {
        throw new Error("useState should be used inside component");
    }

    const currComponent = currentComponent;
    const { hookValues } = currComponent;

    // Sets initial hook value
    if (hookValues[hookIndex] === undefined) {
        hookValues[hookIndex] = initValue;
    }

    const currentIndex = hookIndex;

    const valueSetter = (value: T | ((value: T) => T)) => {
        if (typeof value === "function") {
            // Calls the update function
            hookValues[currentIndex] = (value as (value: T) => T)(
                hookValues[currentIndex],
            );
        } else if (hookValues[currentIndex] !== value) {
            // Sets value only when changed
            hookValues[currentIndex] = value;
        }

        // Triggers component rerendering
        currComponent?.rerender();
    };

    const value = hookValues[currentIndex];

    // Increments the hookIndex for next hook call
    hookIndex++;

    return [value, valueSetter] as const;
};

// Sets the current component state at the time of rendering
export const setCurrentComponentState = (
    component: ComponentDetails | null,
) => {
    currentComponent = component;
    hookIndex = 0;
};
