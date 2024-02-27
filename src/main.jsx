import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import { LayoutProvider } from './context/LayoutContext';
import App from '@/App';
import Home from '@/pages/Home';
import User from '@/pages/User';
import Users from '@/pages/Users';

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <App />,
      children: [
        {
          path: '/',
          element: <Home />,
        },
        {
          path: '/user/:id',
          element: <User />,
        },
        {
          path: '/users',
          element: <Users />,
        },
        {
          path: '/employee',
          element: <Home />,
        },
      ],
    },
  ],
  {
    basename: import.meta.env.VITE_BASENAME,
  },
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <LayoutProvider>
    <RouterProvider router={router} />
  </LayoutProvider>,
);
