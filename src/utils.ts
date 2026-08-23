import type {VNode,Child} from "./types.ts";

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
  element.children.forEach((child:Child) => {
    if (typeof child === 'string') {
      currentElement.appendChild(document.createTextNode(child));
    } else if (typeof child === 'object' && child.type) {
      renderDom(child, currentElement);
    }
  });
  
  return currentElement;
}
