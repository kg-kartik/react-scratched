import type { Child } from "./types.ts";
import { renderDom } from "./utils.ts";
import { reconcileKeyedChildren } from "./utils.ts";

// Compares old node and new node to update the existing DOM
export const patch = (
    oldNode: Child,
    newNode: Child,
    domNode: ChildNode,
): ChildNode => {
    // Textnode <-> Textnode
    if (typeof oldNode === "string" && typeof newNode === "string") {
        if (oldNode !== newNode) {
            domNode.textContent = newNode;
        }
        return domNode;
    }

    // Textnode <-> Vnode
    if (typeof oldNode === "string" && typeof newNode === "object") {
        const newElement = renderDom(newNode);
        domNode.replaceWith(newElement);
        return newElement;
    }

    // Vnode <-> Textnode
    if (typeof oldNode === "object" && typeof newNode === "string") {
        const textElement = document.createTextNode(newNode);
        domNode.replaceWith(textElement);
        return textElement;
    }

    // Narrows down types for VNode Objects

    if (!(domNode instanceof HTMLElement)) return domNode;

    if (typeof oldNode !== "object" || typeof newNode !== "object")
        return domNode;

    // Types change
    if (oldNode?.type !== newNode?.type) {
        const newElement = renderDom(newNode);

        domNode.replaceWith(newElement);

        return newElement;
    }

    // Props changes
    const oldNodeProps = Object.keys(oldNode.props);
    const newNodeProps = Object.keys(newNode.props);

    // Prop in oldNode but not in newNode or value is different
    oldNodeProps.forEach((prop) => {
        if (prop in newNode.props) {
            if (oldNode.props[prop] !== newNode.props[prop]) {
                domNode.setAttribute(prop, newNode.props[prop]);
            }
        } else {
            domNode.removeAttribute(prop);
        }
    });

    // Prop in newNode but not in oldNode
    newNodeProps.forEach((prop) => {
        if (!(prop in oldNode.props)) {
            (domNode as any)[prop] = newNode.props[prop];
        }
    });

    const hasKeyedChildren = newNode.children.some(
        (child) => typeof child === "object" && child.key !== null,
    );

    if (hasKeyedChildren) {
        return reconcileKeyedChildren(oldNode, newNode, domNode);
    }

    // Positional reconcillation
    const maxChildren = Math.max(
        oldNode.children.length,
        newNode.children.length,
    );

    for (let index = 0; index < maxChildren; index++) {
        const oldChild = oldNode.children[index];
        const newChild = newNode.children[index];
        const hasOldChild = oldChild !== undefined;
        const hasNewChild = newChild !== undefined;

        // Both child exists - patch
        if (typeof oldChild === "object" && typeof newChild === "object") {
            const childElement = domNode.childNodes[index];
            if (childElement instanceof HTMLElement) {
                patch(oldChild, newChild, childElement);
            }
        }

        // Children text change
        if (
            typeof newChild === "string" &&
            typeof oldChild === "string" &&
            oldChild !== newChild
        ) {
            domNode.childNodes[index].textContent = newNode.children[
                index
            ] as string;
        }

        // Removes child
        if (hasOldChild && !hasNewChild) {
            domNode.childNodes[newNode.children.length].remove();
            index -= 1;
        }

        // Adds child
        if (hasNewChild && !hasOldChild) {
            if (typeof newChild === "object") {
                const newChildElement = renderDom(newChild);
                domNode.appendChild(newChildElement);
            }
            if (typeof newChild === "string") {
                domNode.appendChild(document.createTextNode(newChild));
            }
        }
    }
    return domNode;
};
