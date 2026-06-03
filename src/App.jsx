import { createBrowserRouter, RouterProvider } from "react-router";

import { useCtx } from "./context/context";

import StartPage from "./pages/StartPage.jsx";
import QuestionPage from "./pages/QuestionPage.jsx";
import DiplomaPage from "./pages/DiplomaPage.jsx";
import LastQuestionPage from "./pages/LastQuestionPage.jsx";

//-----------------------------------------------------------
const routs = createBrowserRouter([
  {
    path: "/",
    element: <StartPage />,
  },
  {
    path: "/questions",
    element: <QuestionPage />,
  },
  {
    path: "/diploma",
    element: <DiplomaPage />,
  },
  {
    path: "/last",
    element: <LastQuestionPage />,
  },
]);

//-----------------------------------------------------------
//-----------------------------------------------------------
const App = () => {


  //-----------------------------------------------------------
  return <RouterProvider router={routs} />;
};

export default App;
