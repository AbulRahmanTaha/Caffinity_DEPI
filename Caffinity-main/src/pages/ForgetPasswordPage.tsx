import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { useUser } from "../contexts/UserContext";

const ForgetPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { forgetPassword } = useUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);
    try {
      await forgetPassword(email);
      setMessage("If an account exists with this email, a password reset link has been sent.");
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <title>Forget Password</title>

      <div className="container mx-auto px-6 py-20 flex justify-center">
        <div className="w-full max-w-md">
          <div className="bg-white p-8 shadow-md rounded-lg">
            <h1 className="font-heading text-3xl text-center mb-6">Reset Password</h1>
            <p className="text-center text-sm text-brand-black/70 mb-6">
              Enter the email address associated with your account and we'll send you a link to reset your password.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-brand-gray rounded-md mt-1"
                />
              </div>

              {error && <p className="text-brand-red text-sm">{error}</p>}
              {message && <p className="text-green-600 text-sm">{message}</p>}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Sending..." : "Send Reset Link"}
              </Button>
            </form>

            <div className="text-center mt-6">
              <Link to="/login" className="text-sm text-brand-black/70 hover:text-brand-yellow underline transition-colors">
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgetPasswordPage;
