
  import { createRoot } from "react-dom/client";
  import { BrowserRouter } from "react-router";
  import { HashRouter  } from "react-router";
  import { Provider } from "react-redux";
  import { store } from "./app/store";
  import App from "./app/App";
  import "./styles/index.css";

  createRoot(document.getElementById("root")!).render(
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  );
  