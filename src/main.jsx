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
import Login from './pages/Login';

import { Employee, Security, ChangePassword, ContactRecords } from './pages';
import store, { persistor } from '@/store/configureStore';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import {
  PrivateRoute,
  RedirectIfSupervisor,
  RedirectIfLoggedIn,
} from '@/ProtectedRoute';

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: (
        <PrivateRoute>
          <App />
        </PrivateRoute>
      ),
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
          path: '/contactRecords',
          element: <ContactRecords />,
        },
        {
          path: '/employee',
          element: (
            <RedirectIfSupervisor>
              <Employee />
            </RedirectIfSupervisor>
          ),
        },
        {
          path: '/employee/changePassword',
          element: <ChangePassword />,
        },
        {
          path: '/security',
          element: <Security />,
        },
      ],
    },
    {
      path: '/login',
      element: (
        <RedirectIfLoggedIn>
          <Login />
        </RedirectIfLoggedIn>
      ),
    },
  ],
  {
    basename: import.meta.env.VITE_BASENAME,
  },
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <CurrentPageProvider>
        <LayoutProvider>
          <RouterProvider router={router} />
        </LayoutProvider>
      </CurrentPageProvider>
    </PersistGate>
  </Provider>,
);
