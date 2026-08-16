import type {Child,Props,VNode} from "./types.ts";

export const createElement = (type:string,props:Props,...children:Child[]):VNode => {
  return {
    type,
    props,
    children
  } 
}

const element = createElement(
  "div",
  {id:"app"},
  createElement("h1", {}, "Hello, world!"),
  createElement("p", {}, "This is a paragraph.")
);

console.log(JSON.stringify(element, null, 2));

export const renderDom = (element:VNode, parentElement: HTMLElement | null = null) => {
  const currentElement = document.createElement(element.type);
  
  // Apply props [Naive cases handlign]
  Object.entries(element.props).forEach(([key, value]) => {
    (currentElement as any)[key] = value;
  });
  
  // Append to parent
  if (parentElement) {
    parentElement.appendChild(currentElement);
  }
  
  // Process children
  element.children.forEach((child) => {
    if (typeof child === 'string') {
      currentElement.appendChild(document.createTextNode(child));
    } else if (typeof child === 'object' && child.type) {
      renderDom(child, currentElement);
    }
  });
  
  return currentElement;
}

console.log(renderDom(element));