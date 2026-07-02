import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { Button } from '../components/ui/Button';
import toast from 'react-hot-toast';
import { useUser } from '../contexts/UserContext';
import { orderService } from '../services/api';

interface CheckoutFormData {
    fullName: string;
    email: string;
    phone: string;
    notes: string;
}

interface FormErrors {
    fullName?: string;
    email?: string;
    phone?: string;
}

const CheckoutPaymentPage = () => {
    const { cartItems, totalPrice, cartCount } = useCart();
    const { user, token } = useUser();
    const [isLoading, setIsLoading] = useState(false);
    const [currency, setCurrency] = useState(cartItems.length != 0 ? cartItems[0].currency : '$');

    const [formData, setFormData] = useState<CheckoutFormData>({
        fullName: `${user?.firstName} ${user?.lastName}` || '',
        email: user?.email || '',
        phone: '',
        notes: '',
    });

    const [errors, setErrors] = useState<FormErrors>({});

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
        setCurrency(cartItems.length != 0 ? cartItems[0].currency : '$')
    }, []);

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.fullName.trim()) {
            newErrors.fullName = 'Full name is required';
        } else if (formData.fullName.trim().length < 3) {
            newErrors.fullName = 'Name must be at least 3 characters';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone number is required';
        } else if (!/^[\d\s\-+()]{8,}$/.test(formData.phone)) {
            newErrors.phone = 'Please enter a valid phone number';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (errors[name as keyof FormErrors]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error("Please fix the errors in the form");
            return;
        }

        if (!token) {
            toast.error("You must be logged in to complete checkout.");
            return;
        }

        setIsLoading(true);

        const items = cartItems.map((item) => ({
            productId: item._id,
            quantity: item.quantity,
        }));

        try {
            const response = await orderService.checkoutSession(token, { items });
            if (response && response.session && response.session.url) {
                window.location.href = response.session.url;
            } else {
                toast.error("Failed to initiate checkout session.");
                setIsLoading(false);
            }
        } catch (error) {
            console.error("Checkout error:", error);
            toast.error("An error occurred during checkout.");
            setIsLoading(false);
        }
    };

    return (
        <>
            <title>Caffinity - Payment</title>

            <div className="bg-brand-gray-light min-h-screen">
                <div className="container mx-auto px-6 py-12">
                    <div className="flex items-center justify-center space-x-4 md:space-x-8 mb-12">
                        <Link to="/cart" className="text-lg md:text-xl uppercase text-brand-black/70 hover:text-brand-black font-semibold">1. My Bag</Link>
                        <div className="flex-grow h-px bg-brand-black"></div>
                        <span className="text-lg md:text-xl uppercase font-semibold">2. Checkout</span>
                    </div>

                    {cartCount === 0 ? (
                        <div className="text-center py-12">
                            <h2 className="font-heading text-2xl mb-4">Your cart is empty</h2>
                            <p className="text-gray-600 mb-6">Add some items to your cart before proceeding to checkout.</p>
                            <Link to="/" viewTransition>
                                <Button>Continue Shopping</Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                            <div className="lg:col-span-2 bg-white p-8 space-y-6 rounded-lg shadow-sm">
                                <h2 className="font-heading text-2xl mb-6">Contact Information</h2>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div>
                                        <label htmlFor="fullName" className="block text-sm font-medium mb-2">
                                            Full Name *
                                        </label>
                                        <input
                                            type="text"
                                            id="fullName"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-black ${errors.fullName ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                            placeholder="Mohamed Ahmed"
                                        />
                                        {errors.fullName && (
                                            <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="email" className="block text-sm font-medium mb-2">
                                                Email *
                                            </label>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-black ${errors.email ? 'border-red-500' : 'border-gray-300'
                                                    }`}
                                                placeholder="john@example.com"
                                            />
                                            {errors.email && (
                                                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label htmlFor="phone" className="block text-sm font-medium mb-2">
                                                Phone *
                                            </label>
                                            <input
                                                type="tel"
                                                id="phone"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-black ${errors.phone ? 'border-red-500' : 'border-gray-300'
                                                    }`}
                                                placeholder="+353 1 234 5678"
                                            />
                                            {errors.phone && (
                                                <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                                            )}
                                        </div>
                                    </div>

                                    <hr className="my-6" />

                                    <div>
                                        <label htmlFor="notes" className="block text-sm font-medium mb-2">
                                            Order Notes (optional)
                                        </label>
                                        <textarea
                                            id="notes"
                                            name="notes"
                                            value={formData.notes}
                                            onChange={handleInputChange}
                                            rows={3}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-black"
                                            placeholder="Special instructions for your order..."
                                        />
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full mt-6"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? 'Processing...' : `Proceed to Payment - ${currency} ${(totalPrice + 3.95).toFixed(2)}`}
                                    </Button>
                                </form>
                            </div>

                            <div className="bg-white p-8 h-fit rounded-lg shadow-sm">
                                <h2 className="font-heading text-2xl mb-6">Order summary</h2>
                                <div className="space-y-4">
                                    <div className="flex justify-between">
                                        <span>Subtotal</span>
                                        <span>{`${currency} ${totalPrice.toFixed(2)}`}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Tax</span>
                                        <span>{currency} 3.95</span>
                                    </div>
                                    <hr className="border-brand-gray-dark my-4" />
                                    <div className="flex justify-between font-bold text-xl">
                                        <span>Total</span>
                                        <span>{`${currency} ${(totalPrice + 3.95).toFixed(2)}`}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default CheckoutPaymentPage;
