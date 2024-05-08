import React from "react";
import ReactDOM from "react-dom/client";
import Home from "./Home.tsx";
import Animate from "./Animate.tsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/animate",
    element: <Animate startXPosition={20} imgSrc="https://em-content.zobj.net/source/facebook/355/megaphone_1f4e3.png" />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
