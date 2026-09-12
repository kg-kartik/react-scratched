# react-scratched

**react-scratched** is a mini, basic React built from scratch in around 500 LOC, with the goal of understanding what actually happens under the hood.

It starts with a component returning a JSX element, follows how that becomes a Virtual DOM representation and eventually gets rendered to the DOM, and then looks at what happens when data changes through a hook like **`useState`** , including how reconciliation compares the old and new Virtual DOM and updates only the DOM changes that are needed.

The project is intentionally small, so the entire flow can be followed and debugged without much abstraction getting in the way. With this implementation, we can render our JSX-based [App component](src/App.ts) into the `#app` root DOM node, much like React does. See [src/main.ts](src/main.ts).

> **PS:** Built in VS Code without agentic features or tab suggestions :)

## What's under the hood?

The implementation starts with a simple **Virtual DOM (VNode)** representation.

When a component returns JSX, it is turned into a `createElement()` call, which produces a VNode describing the element:

```ts
{
    type: "h1",
    props: {},
    children: ["Hello"]
}
```

That VNode is then converted into an actual DOM node.

When the component renders again, we get a new VNode. Instead of recreating the DOM from scratch, the previous and new VNodes are compared and the existing DOM is patched with the required changes.

```text
Component
    ↓
  VNode
    ↓
 renderDom()
    ↓
   DOM
    ↓
 state update
    ↓
Component renders again
    ↓
 New VNode
    ↓
   patch(oldVNode, newVNode, domNode)
    ↓
Updated DOM
```

## What we built

* Virtual DOM
* DOM rendering
* VNode diffing and reconciliation
* Keyed children reconciliation
* Props and event listeners
* style and className handling
* Functional components
* useState hook
* Functional state updates
* Component-specific hook state

## Debug it yourself

Since the implementation is small, you can actually follow the complete rendering flow yourself.

Clone the project, run it locally, and start experimenting with the code in `src/`. Add `console.log()` statements inside the component or add a debugger at `renderDom()`, `patch()`, or `useState()` and follow what happens when the component renders and when state changes.

For example, you can watch the flow from:

```text
setState
   ↓
component()
   ↓
new VNode
   ↓
patch()
   ↓
DOM update
```

Try changing the components, adding props, creating multiple states, or playing around with keyed children.

## What's next?

The next step is a basic **Fiber** implementation, where rendering work can be represented as smaller units instead of doing the entire reconciliation in one go.

This project is not intended to be production-ready React. It is a small implementation to make the ideas behind React easier to understand by actually building them.

## Running the project

Install the dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```
