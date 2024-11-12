import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import Index from "./pages/index/Index";
import Report from "./pages/report/Report";
import MapPage from "./pages/map/MapPage";


const Router = createBrowserRouter([
    {
      path: '/',
      element: <Index />,
    },
    {
      path: '/report',
      element: <Report />,
    },
    {
      path: '/map',
      element: <MapPage />,
    }
  ]);
  export default Router;