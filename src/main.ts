import "./style.css";
import { renderComponent } from "./renderComponent.ts";
import App from "./App.ts";

const rootElement = document.querySelector("#app") as HTMLElement;

if (rootElement) {
    renderComponent(App, rootElement);
}
