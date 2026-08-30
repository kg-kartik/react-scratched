import type { Child, Props, VNode, Key } from "./types.ts";
import { patch } from "./diffingAlgo.ts";

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

export const renderDom = (
    element: Child,
    parentElement: HTMLElement | null = null,
): ChildNode => {
    if (typeof element === "string") {
        return document.createTextNode(element);
    }

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
    element.children.forEach((child: Child) => {
        if (typeof child === "string") {
            currentElement.appendChild(document.createTextNode(child));
        } else if (typeof child === "object" && child.type) {
            renderDom(child, currentElement);
        }
    });

    return currentElement;
};

// keys Map (assuming all child nodes to be VNode object)
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
            //Patch old child
            patch(match.oldChild, newChild, match.domChild);

            // Inserts the patched dom element before the current iterating node
            domNode.insertBefore(match.domChild, domNode.childNodes[index]);

            //deleting consumed key
            keysMap.delete(newChild.key);
        } else {
            // key in new child but not in old child
            const newChildElement = renderDom(newChild);
            domNode.insertBefore(newChildElement, domNode.childNodes[index]);
        }
    });

    //Keys still left in old child - those nodes no longer exist so need to be deleted
    keysMap.forEach(({ domChild }) => {
        domChild?.remove();
    });

    return domNode;
};
