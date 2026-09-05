const componentState: Record<string, any[]> = {};
let currentComponent = "";
let hookIndex = 0;
let rerender:Function = () => {};

export const useState = <T>(initValue: T):[T,(value:T) => void] => {
    if (!componentState[currentComponent]) {
        componentState[currentComponent] = [];
    }

    const state = componentState[currentComponent];

    if (state[hookIndex] === undefined) {
        state[hookIndex] = initValue;
    }

    const currentIndex = hookIndex;

    const valueSetter = (value: T) => {
        //updating only if the value changed
        if(state[currentIndex] !== value){
            state[currentIndex] = value;
        }
        rerender();
    };

    const value = state[currentIndex];

    hookIndex++;

    return [value, valueSetter] as const;
};

// Sets the current component state at the time of rendering
export const setComponentState = (component:string,rerenderFunc:Function) => {
    currentComponent = component;
    hookIndex = 0;
    rerender = rerenderFunc;
}