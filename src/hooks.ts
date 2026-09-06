const componentState: Record<string, any[]> = {};
let currentComponent = "";
let hookIndex = 0;
let rerender: Function = () => {};

export const useState = <T>(
    initValue: T,
): [T, (value: T | ((value: T) => T)) => void] => {
    if (!componentState[currentComponent]) {
        componentState[currentComponent] = [];
    }

    const state = componentState[currentComponent];

    if (state[hookIndex] === undefined) {
        state[hookIndex] = initValue;
    }

    const currentIndex = hookIndex;

    const valueSetter = (value: T | ((value: T) => T)) => {
        if (typeof value === "function") {
            // Calls the update function
            state[currentIndex] = (value as (value: T) => T)(
                state[currentIndex],
            );
        } else if (state[currentIndex] !== value) {
            // Sets value only when changed
            state[currentIndex] = value;
        }
        rerender();
    };

    const value = state[currentIndex];

    hookIndex++;

    return [value, valueSetter] as const;
};

// Sets the current component state at the time of rendering
export const setComponentState = (
    component: string,
    rerenderFunc: Function,
) => {
    currentComponent = component;
    hookIndex = 0;
    rerender = rerenderFunc;
};
