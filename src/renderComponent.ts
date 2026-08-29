
import {createElement} from "./main.ts"
import {renderDom} from "./utils.ts"
import type {VNode} from "./types.ts";
import {patch} from "./diffingAlgo.ts";

const App = () => {
    // returns Vnode
    return createElement("h1",null,{},"Hello");
}

const rootElement = document.createElement("div");
rootElement.setAttribute("id","root");

let previousNode: VNode | null = null;
let domElement: HTMLElement | null = null;

const renderComponent = (component:Function,root:HTMLElement) => {
    const vNode = component();
    
    if(previousNode !== null && domElement !== null) {
        //update dom
        patch(previousNode,vNode,domElement);
    }
    else{
        // first mount
        const currentDomElement = renderDom(vNode);
        domElement = currentDomElement;
        root.appendChild(currentDomElement);
    }

    previousNode = vNode;
}

renderComponent(App,rootElement); // initial call / mount
renderComponent(App,rootElement); //update