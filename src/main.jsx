//context
import { ConfigsProvider } from './context/ConfigsContext';
//redux
import store, { persistor } from '@/store/configureStore';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
//route
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { RequireLogin, RedirectIfLogin, RequireManager } from '@/middleware';
//page
import App from '@/App';
import {
  Login,
  ForgetPassword,
  ResetPassword,
  Employee,
  JobStructure,
  BulletinBoard,
  AddBulletin,
  EditBulletin,
  ContactHistory,
  User,
  Home,
  Product,
  AddProduct,
  EditProduct,
  LoginHistory,
  UpdatePassword,
  ProductCategory,
  News,
  AddNews,
  EditNews,
  Invoice,
  Order,
  AddOrder,
  SingleOrder,
  Logistic,
  SingleLogistic,
} from '@/pages';

//測試元件
// import * as Common from '@/components/common';
// import * as Layout from '@/components/layout';
// console.log('檢視Common', Common);
// console.log('檢視Layout', Layout);

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <App />,
      children: [
        {
          path: '/',
          element: (
            <RequireLogin>
              <Home />
            </RequireLogin>
          ),
        },
        // {
        //   path: '/bulletinBoard',
        //   element: (
        //     <RequireLogin>
        //       <BulletinBoard />
        //     </RequireLogin>
        //   ),
        // },
        // {
        //   path: '/bulletin/create',
        //   element: (
        //     <RequireLogin>
        //       <AddBulletin />
        //     </RequireLogin>
        //   ),
        // },
        // {
        //   path: '/bulletin/edit/:id',
        //   element: (
        //     <RequireLogin>
        //       <EditBulletin />
        //     </RequireLogin>
        //   ),
        // },
        {
          path: '/user',
          element: (
            <RequireLogin>
              <User />
            </RequireLogin>
          ),
        },
        {
          path: '/product',
          element: (
            <RequireLogin>
              <Product />
            </RequireLogin>
          ),
        },
        {
          path: '/product/create',
          element: (
            <RequireLogin>
              <AddProduct />
            </RequireLogin>
          ),
        },
        {
          path: '/product/edit/:id',
          element: (
            <RequireLogin>
              <EditProduct />
            </RequireLogin>
          ),
        },
        {
          path: '/productCategory',
          element: (
            <RequireLogin>
              <ProductCategory />
            </RequireLogin>
          ),
        },
        {
          path: '/news',
          element: (
            <RequireLogin>
              <News />
            </RequireLogin>
          ),
        },
        {
          path: '/news/create',
          element: (
            <RequireLogin>
              <AddNews />
            </RequireLogin>
          ),
        },
        {
          path: '/news/edit/:id',
          element: (
            <RequireLogin>
              <EditNews />
            </RequireLogin>
          ),
        },
        {
          path: '/order',
          element: (
            <RequireLogin>
              <Order />
            </RequireLogin>
          ),
        },
        {
          path: '/order/create',
          element: (
            <RequireLogin>
              <AddOrder />
            </RequireLogin>
          ),
        },
        {
          path: '/order/edit/:id',
          element: (
            <RequireLogin>
              <SingleOrder />
            </RequireLogin>
          ),
        },
        {
          path: '/order/:id',
          element: (
            <RequireLogin>
              <SingleOrder />
            </RequireLogin>
          ),
        },
        {
          path: '/logistic',
          element: (
            <RequireLogin>
              <Logistic />
            </RequireLogin>
          ),
        },
        {
          path: '/logistic/:id',
          element: (
            <RequireLogin>
              <SingleLogistic />
            </RequireLogin>
          ),
        },
        {
          path: '/logistic/edit/:id',
          element: (
            <RequireLogin>
              <SingleLogistic />
            </RequireLogin>
          ),
        },
        {
          path: '/jobStructure',
          element: (
            <RequireLogin>
              <JobStructure />
            </RequireLogin>
          ),
        },
        {
          path: '/contactHistory',
          element: (
            <RequireLogin>
              <ContactHistory />
            </RequireLogin>
          ),
        },
        {
          path: '/employee',
          element: (
            <RequireManager>
              <Employee />
            </RequireManager>
          ),
        },
        {
          path: '/employee/updatePassword',
          element: <UpdatePassword />,
        },
        {
          path: '/loginHistory',
          element: (
            <RequireLogin>
              <LoginHistory />
            </RequireLogin>
          ),
        },
      ],
    },
    {
      path: '/login',
      element: (
        <RedirectIfLogin>
          <Login />
        </RedirectIfLogin>
      ),
    },
    {
      path: '/forgetPassword',
      element: (
        <RedirectIfLogin>
          <ForgetPassword />
        </RedirectIfLogin>
      ),
    },
    {
      path: '/resetPassword',
      element: (
        <RedirectIfLogin>
          <ResetPassword />
        </RedirectIfLogin>
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
      <ConfigsProvider>
        <RouterProvider router={router} />
      </ConfigsProvider>
    </PersistGate>
  </Provider>,
);
