import { createElement } from "./utils.ts";
import { useState } from "./hooks.ts";

export const App = () => {
    const [count, setCount] = useState(0);

    const incrementCount = () => {
        setCount((prev) => prev + 1);
    };

    const resetCount = () => {
        setCount(0);
    };

    return createElement(
        "div",
        null,
        {
            style: {
                display: "flex",
                gap: "12px",
                "align-items": "center",
                "justify-content": "center",
                padding: "16px 20px",
                "background-color": "#1e293b",
                border: "1px solid #334155",
                "border-radius": "8px",
                "box-shadow": "0 4px 6px -1px rgba(0, 0, 0, 0.2)",
            },
        },
        createElement(
            "button",
            null,
            {
                className: "counter",
                onclick: incrementCount,
                style: {
                    "background-color": "#2563eb",
                    color: "#ffffff",
                    border: "none",
                    "border-radius": "6px",
                    padding: "8px 16px",
                    "font-size": "14px",
                    "font-weight": "600",
                    cursor: "pointer",
                },
            },
            `Count: ${count}`,
        ),
        createElement(
            "button",
            null,
            {
                onclick: resetCount,
                style: {
                    "background-color": "#dc2626",
                    color: "#ffffff",
                    border: "none",
                    "border-radius": "6px",
                    padding: "8px 16px",
                    "font-size": "14px",
                    "font-weight": "600",
                    cursor: "pointer",
                },
            },
            "Reset",
        ),
    );
};

export default App;
