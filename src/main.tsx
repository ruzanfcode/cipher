
  import { createRoot } from "react-dom/client";
  import { Provider } from "react-redux";
  import { HashRouter  } from "react-router";
  import { store } from "./app/store";
  import App from "./app/App";
  import "./styles/index.css";

  createRoot(document.getElementById("root")!).render(
    <Provider store={store}>
      <HashRouter>
        <App />
      </HashRouter>
    </Provider>
  );
  