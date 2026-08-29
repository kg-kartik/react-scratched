import type { Child, Props, VNode, Key } from "./types.ts";
import { renderDom } from "./utils.ts";
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

const element = createElement(
    "div",
    null,
    { id: "app", className: "small" },
    createElement("h1", null, {}, "Hello, world!"),
    createElement("p", null, {}, "This is a paragraph."),
);

console.log(renderDom(element));

const rootNode = document.createElement("h1");

patch(
    {
        type: "h1",
        key: null,
        props: { id: "a" },
        children: ["Hello"],
    },
    {
        type: "h1",
        key: null,
        props: { id: "b" },
        children: ["Hello world"],
    },
    rootNode,
);

console.log(rootNode);
