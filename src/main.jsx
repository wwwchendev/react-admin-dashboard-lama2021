import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import { LayoutProvider } from './context/LayoutContext';
import { CurrentPageProvider } from './context/CurrentPageContext';
import App from '@/App';
import Home from '@/pages/Home';
import User from '@/pages/User';
import Users from '@/pages/Users';
import Products from './pages/Products';
import { NewUser } from './pages/NewUser';
import Product from './pages/Product';
import NewProduct from './pages/NewProduct';

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
          path: '/users',
          element: <Users />,
        },
        {
          path: '/user/:id',
          element: <User />,
        },
        {
          path: '/newUser',
          element: <NewUser />,
        },
        {
          path: '/products',
          element: <Products />,
        },
        {
          path: '/product/:id',
          element: <Product />,
        },
        {
          path: '/newProduct',
          element: <NewProduct />,
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
  <CurrentPageProvider>
    <LayoutProvider>
      <RouterProvider router={router} />
    </LayoutProvider>
  </CurrentPageProvider>,
);
