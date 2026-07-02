import { useEffect, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { CheckCircle, XCircle } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useUser } from '../contexts/UserContext';
import { orderService } from '../services/api';

const OrderConfirmationPage = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');

  const { clearCart } = useCart();
  const { token } = useUser();
  const [isLoading, setIsLoading] = useState(!!sessionId);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    if (sessionId && token) {
      const verifyOrder = async () => {
        try {
          await orderService.verifyOrder(token, sessionId);
          clearCart();
        } catch (err: any) {
          if (err.response?.status === 404) {
            setError("Order not found or session invalid.");
          } else {
            setError("We couldn't verify your order at this time. Please check your account for details.");
          }
        } finally {
          setIsLoading(false);
        }
      };

      verifyOrder();
    } else {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId, token]);

  const orderId = location.state?.orderId;

  if (isLoading) {
    return (
      <div className="container mx-auto px-6 py-20 text-center flex flex-col items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-black mb-6"></div>
        <h1 className="font-heading text-2xl">Verifying your order...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-6 py-20 text-center flex flex-col items-center justify-center min-h-[60vh]">
        <XCircle className="h-24 w-24 text-red-500 mb-6" />
        <h1 className="font-heading text-4xl mb-4">Verification Issue</h1>
        <p className="text-lg text-brand-black/70 mb-8 max-w-md mx-auto">
          {error}
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild to="/contact">
            Contact Support
          </Button>
          <Button asChild to="/account" variant="outline">
            View Orders
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <title>Order Placed !</title>

      <div className="container mx-auto px-6 py-20 text-center flex flex-col items-center justify-center min-h-[60vh]">
        <CheckCircle className="h-24 w-24 text-green-500 mb-6" />
        <h1 className="font-heading text-4xl mb-4">Thank You For Your Order!</h1>
        <p className="text-lg text-brand-black/70 mb-2 max-w-md mx-auto">
          Your payment was successful and your order is being prepared. You will receive a confirmation email shortly.
        </p>
        {orderId && <p className="text-sm text-brand-black/60 mb-8">Order ID: #{orderId}</p>}
        <div className="flex gap-4 justify-center mt-6">
          <Button asChild to="/collections">
            Continue Shopping
          </Button>
          <Button asChild to="/account" variant="outline">
            View Orders
          </Button>
        </div>
      </div>
    </>
  );
};

export default OrderConfirmationPage;
