import { createBrowserRouter, Navigate } from "react-router-dom";
import { RoleTypes } from "src/api/types/models/User";
import { RequireAuth } from "src/components/utils/router/RequireAuth";
import { CertificateGiftPage, CertificatePage, HomePage, LoginPage, MenuPage, NotFoundPage, OrdersPage, SignupPage, CurierPage } from "src/pages";
import { GoodsPage } from "src/pages/GoodsPage";
export const RouterPaths = {
  Profile: "/",
  Login: "/login",
  Signup: "/signup",
  Menu: "/menu",
  Goods: "/goods",
  Curiers: "/curiers",
  Order: "/order",
  OrderHistory: "/order/history",
  Certificates: "/certificate",
  CertificateGift: "/certificate/users",
}

type IRouteLink = {
  path: string,
  title: string,
}

export const AdminLinks: IRouteLink[] = [
  {path: RouterPaths.Profile, title: "Главная"},
  {path: RouterPaths.Certificates, title: "Сертификаты"},
  {path: RouterPaths.Goods, title: "Блюда"},
  {path: RouterPaths.Curiers, title: "Курьеры"},
  {path: RouterPaths.OrderHistory, title: "Все заказы"}
]

export const UserLinks: IRouteLink[] = [
  {path: RouterPaths.Profile, title: "Главная"},
  {path: RouterPaths.Menu, title: "Меню"},
  {path: RouterPaths.OrderHistory, title: "История"},
  {path: RouterPaths.Certificates, title: "Сертификаты"}
]


export const router = createBrowserRouter([
  {
    path: RouterPaths.Profile,
    element: (
      <RequireAuth>
        <HomePage />
      </RequireAuth>
    ),
  },
  {
    path: RouterPaths.Login,
    element: <LoginPage />,
  },
  {
    path: RouterPaths.Signup,
    element: <SignupPage />,
  },
  {
    path: RouterPaths.Menu,
    element: (
      <RequireAuth>
        <MenuPage />
      </RequireAuth>
    ),
  },
  {
    path: RouterPaths.Goods,
    element: (
      <RequireAuth role={RoleTypes.Admin}>
        <GoodsPage />
      </RequireAuth>
    ),
  },
  {
    path: RouterPaths.Curiers,
    element: (
      <RequireAuth role={RoleTypes.Admin}>
        <CurierPage />
      </RequireAuth>
    ),
  },
  {
    path: RouterPaths.Order,
    children: [
      {
        path: RouterPaths.OrderHistory.split(`${RouterPaths.Order}/`)[1],
        element: (
          <RequireAuth>
            <OrdersPage />
          </RequireAuth>
        )
      },
      {
        path: "*",
        element: <Navigate replace to={RouterPaths.OrderHistory} />
      },
      {
        index: true,
        element: <Navigate replace to={RouterPaths.OrderHistory} />
      }
    ]
  },
  {
    path: RouterPaths.Certificates,
    children: [
      {
        index: true,
        element: (
          <RequireAuth>
            <CertificatePage />
          </RequireAuth>
        )
      },
      {
        path: RouterPaths.CertificateGift.split(`${RouterPaths.Certificates}/`)[1],
        element: (
          <RequireAuth>
            <CertificateGiftPage />
          </RequireAuth>
        )
      },
    ]
  },
  {
    path: "*",
    element: <NotFoundPage />
  }
])