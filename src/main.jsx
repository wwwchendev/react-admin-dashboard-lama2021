import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import App from '@/App';
import Home from '@/pages/Home';
import { LayoutProvider } from './context/LayoutContext';

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
