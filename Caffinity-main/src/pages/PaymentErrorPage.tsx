import { Link } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';

const PaymentErrorPage = () => {
  return (
    <>
      <title>Caffinity - Payment Error</title>

      <div className="min-h-[calc(100vh-80px)] bg-brand-gray-light flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-red-600" />
          </div>

          <h1 className="font-heading text-3xl mb-4 text-brand-black">Payment Failed</h1>

          <p className="text-gray-600 mb-8">
            We couldn't process your payment. Your order has not been placed and you haven't been charged. Please try again or use a different payment method.
          </p>

          <div className="space-y-4">
            <Link to="/cart" className="block w-full" viewTransition>
              <Button className="w-full">
                Return to Cart
              </Button>
            </Link>

            <Link to="/" className="block w-full text-brand-black/70 hover:text-brand-black text-sm font-medium transition-colors" viewTransition>
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentErrorPage;
