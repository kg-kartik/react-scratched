import type { Child, Props, VNode, Key } from "./types.ts";
import { patch } from "./diffingAlgo.ts";

// Creates a Virtual DOM object
export const createElement = (
    type: string,
    key: Key,
    props: Props,
    ...children: Child[]
): VNode => {
    return {
        type,
        key,
        props,
        children,
    };
};

// Renders a Virtual DOM object into Real DOM node
export const renderDom = (
    element: Child,
    parentElement: HTMLElement | null = null,
): ChildNode => {
    if (typeof element === "string") {
        return document.createTextNode(element);
    }

    const currentElement = document.createElement(element.type);

    // Updates props
    patchProps(currentElement, element.props, {});

    // Append to parent
    if (parentElement) {
        parentElement.appendChild(currentElement);
    }

    // Process children
    element.children.forEach((child: Child) => {
        if (typeof child === "string") {
            currentElement.appendChild(document.createTextNode(child));
        } else if (typeof child === "object" && child.type) {
            renderDom(child, currentElement);
        }
    });

    return currentElement;
};

// Updates props

export const patchProps = (
    domNode: HTMLElement,
    newNodeProps: Props,
    oldNodeProps: Props,
) => {
    Object.keys(oldNodeProps).forEach((oldProp) => {
        if (!(oldProp in newNodeProps)) {
            // Event listeners handling
            if (oldProp.startsWith("on")) {
                const eventName = oldProp.substring(2).toLowerCase();
                const eventFunction = oldNodeProps[oldProp];
                if (typeof eventFunction !== "function") {
                    console.error("Invalid event listener");
                    return;
                }
                // Removes event listner
                domNode.removeEventListener(eventName, eventFunction);
            } else if (oldProp === "style") {
                // Removes inline styles
                domNode.style.cssText = "";
            } else if (oldProp === "className") {
                // Removes the required prop
                domNode.removeAttribute("class");
            } else if (typeof oldNodeProps[oldProp] === "boolean") {
                (domNode as any)[oldProp] = false;
            } else {
                // Removes attributes by default
                domNode.removeAttribute(oldProp);
            }
        }
    });

    // Prop in newNode but not in oldNode or value got updated - Add/update the prop
    Object.keys(newNodeProps).forEach((prop) => {
        if (oldNodeProps[prop] !== newNodeProps[prop]) {
            if (prop.startsWith("on")) {
                const eventName = prop.substring(2).toLowerCase();
                const eventFunction = newNodeProps[prop];
                const oldEventFunction = oldNodeProps[prop];

                if (typeof oldEventFunction === "function") {
                    // Removes old event listener
                    domNode.removeEventListener(eventName, oldEventFunction);
                }

                if (typeof eventFunction !== "function") {
                    console.error("Invalid event listener");
                    return;
                }
                // Adds event listner
                domNode.addEventListener(eventName, eventFunction);
            } else if (prop === "style") {
                const stylesObject = newNodeProps[prop];

                if (typeof stylesObject == "object") {
                    // Removes inline styles for old object
                    domNode.style.cssText = "";

                    // Adds inline styles to the dom
                    Object.keys(stylesObject).forEach((style) => {
                        domNode.style.setProperty(
                            style,
                            newNodeProps[prop][style],
                        );
                    });
                }
            } else if (prop === "className") {
                // Sets class attribute for new node
                domNode.setAttribute("class", newNodeProps[prop]);
            } else if (typeof newNodeProps[prop] === "boolean") {
                const value = Boolean(newNodeProps[prop]);
                (domNode as any)[prop] = value;
            } else {
                domNode.setAttribute(prop, newNodeProps[prop]);
            }
        }
    });
};

// Reconcilling children with keys (assuming all child nodes to be VNode object)
export const reconcileKeyedChildren = (
    oldNode: VNode,
    newNode: VNode,
    domNode: HTMLElement,
) => {
    const keysMap: Map<VNode["key"], { oldChild: VNode; domChild: ChildNode }> =
        new Map();

    oldNode.children.forEach((oldChild, index) => {
        if (typeof oldChild === "object" && oldChild?.key !== null) {
            keysMap.set(oldChild.key, {
                oldChild,
                domChild: domNode.childNodes[index],
            });
        }
    });

    newNode.children.forEach((newChild, index) => {
        if (typeof newChild !== "object" || newChild?.key === null) {
            return domNode;
        }

        const match = keysMap.get(newChild?.key);

        if (match?.domChild instanceof HTMLElement) {
            // Patches old child
            patch(match.oldChild, newChild, match.domChild);

            // Inserts the patched dom element before the current iterating node
            domNode.insertBefore(match.domChild, domNode.childNodes[index]);

            //deleting consumed key
            keysMap.delete(newChild.key);
        } else {
            // Key in new child but not in old child
            const newChildElement = renderDom(newChild);
            domNode.insertBefore(newChildElement, domNode.childNodes[index]);
        }
    });

    // Keys still left in old child - those nodes no longer exist so need to be deleted
    keysMap.forEach(({ domChild }) => {
        domChild?.remove();
    });

    return domNode;
};
