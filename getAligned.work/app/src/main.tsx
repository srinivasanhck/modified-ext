import { lazy } from "react";
import ReactDOM from "react-dom/client";
import { createHashRouter, RouterProvider } from "react-router-dom";
import "./scss/base.scss";

const PopupPage = lazy(() => import("./pages/Popup"));
const SideBarPage = lazy(() => import("./pages/SideBar"));
const AnalyticPage = lazy(() => import("./pages/Analytic"));
const OuterSidebar=lazy(()=>import("./pages/OuterSidebar"));
const LandingPage= lazy(()=> import("./pages/LandingPage"));
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
  direction: 'ltr',
  components: {
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontFamily: 'Poppins'
        },
      },
    },
 },
});


const router = createHashRouter([
  {
    path: "/popup",
    element: <PopupPage />,
  },
  {
    path: "/sidebar",
    element: <SideBarPage />,
  },
  {
    path: "/analytic-page",
    element: <AnalyticPage />,
  },
  {
    path: "/outer-sidebar",
    element: <OuterSidebar />
  },
  {
    path: "/landing-page",
    element: <LandingPage />
  },
 
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
     <ThemeProvider theme={theme}>
    <RouterProvider router={router} />
     </ThemeProvider>
);
