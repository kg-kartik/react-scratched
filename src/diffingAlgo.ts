
import type {VNode} from "./types.ts"
import {renderDom} from "./utils.ts" 

export const patch = (oldNode:VNode,newNode:VNode,domNode:HTMLElement) => {
    //type change
    if(oldNode.type !== newNode.type){
        const newElement = renderDom(newNode);

        domNode.replaceWith(newElement);

        return;
    }

    //props changes
    const oldNodeProps = Object.keys(oldNode.props);
    const newNodeProps = Object.keys(newNode.props);

    //prop there in oldNode but not in newNode or value is different
    oldNodeProps.forEach((prop) => {
        if(prop in newNodeProps){
            if(oldNode.props[prop] !== newNode.props[prop]){
                (domNode as any)[prop] = newNode.props[prop];
            }
        }else{
            domNode.removeAttribute(prop);
        }
    })

    //prop there in newNode but not in oldNode
    newNodeProps.forEach((prop) => {
        if(!(prop in oldNodeProps)){
            (domNode as any)[prop] = newNode.props[prop]
        }
    })

    // Same number of children
    const maxChildren = Math.max(oldNode.children.length,newNode.children.length);

    for(let index = 0;index< maxChildren;index++){
        const oldChild = oldNode.children[index];
        const newChild = newNode.children[index];
        const hasOldChild = oldChild !== undefined;
        const hasNewChild = newChild !== undefined;

        // both child exists - patch
        if(typeof oldChild === 'object' && typeof newChild === 'object'){
            const childElement = domNode.childNodes[index];
            if(childElement instanceof HTMLElement){
                patch(oldChild, newChild, childElement)
            }
        }

        //children text change
        if(typeof newChild === 'string' && typeof oldChild === 'string' && oldChild !== newChild){
            domNode.childNodes[index].textContent = newNode.children[index] as string;
        }

        // remove child
        if(hasOldChild && !hasNewChild){
            domNode.childNodes[newNode.children.length].remove();
            index -= 1;
        }

        //add child
        if(hasNewChild && !hasOldChild){
            if(typeof newChild === 'object'){
                const newChildElement = renderDom(newChild);
                domNode.appendChild(newChildElement);
            }
            if(typeof newChild === 'string'){
                domNode.appendChild(document.createTextNode(newChild))
            }
        }

    }
}