import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../components/RootLayout";
import HomePage from "../pages/HomePage";
import CollectionsPage from "../pages/CollectionsPage";
import ProductDetailPage from "../pages/ProductDetailPage";
import CartPage from "../pages/CartPage";
import ContactPage from "../pages/ContactPage";
import AccountPage from "../pages/AccountPage";
import CheckoutPaymentPage from "../pages/CheckoutPaymentPage";
import LoginPage from "../pages/LoginPage";
import OrderConfirmationPage from "../pages/OrderConfirmationPage";
import SignUpPage from "../pages/SignUpPage";
import ForgetPasswordPage from "../pages/ForgetPasswordPage";
import ProtectedRoute from "./ProtectedRoute";
import RouteErrorPage from "../pages/RouteErrorPage";
import HotDrinksPage from "../pages/HotDrinksPage";
import ColdDrinksPage from "../pages/ColdDrinksPage";
import PaymentErrorPage from "../pages/PaymentErrorPage";
import ReviewsPage from "../pages/ReviewsPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <RouteErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "collections", element: <CollectionsPage /> },
      { path: "products/:id", element: <ProductDetailPage /> },
      { path: "cart", element: <CartPage /> },
      { path: "hotdrinks", element: <HotDrinksPage /> },
      { path: "colddrinks", element: <ColdDrinksPage /> },
      { path: "contact", element: <ContactPage /> },
      { path: "login", element: <LoginPage /> },
      { path: "signup", element: <SignUpPage /> },
      { path: "forget-password", element: <ForgetPasswordPage /> },
      {
        element: <ProtectedRoute />,
        children: [
          { path: "checkout/payment", element: <CheckoutPaymentPage /> },
          { path: "order-confirmation", element: <OrderConfirmationPage /> },
          { path: "payment-error", element: <PaymentErrorPage /> },
          { path: "reviews", element: <ReviewsPage /> },
          { path: "account", element: <AccountPage /> },
        ],
      },
    ],
  },
]);
