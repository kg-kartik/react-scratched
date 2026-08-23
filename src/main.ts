import type {Child,Props,VNode} from "./types.ts";
import {renderDom} from "./utils.ts"
import {patch} from "./diffingAlgo.ts";

export const createElement = (type:string,props:Props,...children:Child[]):VNode => {
  return {
    type,
    props,
    children
  } 
}

const element = createElement(
  "div",
  {id:"app",className:"small"},
  createElement("h1", {}, "Hello, world!"),
  createElement("p", {}, "This is a paragraph.")
);

console.log(renderDom(element));

const rootNode = document.createElement('h1');

patch({
  type: "h1",
  props: {id:'a'},
  children: ["Hello"]
},{
  type: "h1",
  props: {id:'b'},
  children: ["Hello world"]
},rootNode)

console.log(rootNode)