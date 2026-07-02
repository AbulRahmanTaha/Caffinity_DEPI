import React, { useState, useEffect } from "react";
import { useUser } from "../contexts/UserContext";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "../components/ui/Button";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useUser();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError("Email is required");
      return false;
    }
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address");
      return false;
    }
    setEmailError(null);
    return true;
  };

  const validatePassword = (password: string): boolean => {
    if (!password) {
      setPasswordError("Password is required");
      return false;
    }
    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return false;
    }
    setPasswordError(null);
    return true;
  };

  const handleEmailBlur = () => {
    validateEmail(email);
  };

  const handlePasswordBlur = () => {
    validatePassword(password);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (!isEmailValid || !isPasswordValid) {
      return;
    }

    setLoading(true);
    try {
      await login({ email, password });
      navigate("/account", { viewTransition: true });
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "An error occurred during login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <title>Login</title>

      <div className="container mx-auto px-6 py-20 flex justify-center">
        <div className="w-full max-w-md">
          <div className="bg-white p-8 shadow-md rounded-lg">
            <h1 className="font-heading text-3xl text-center mb-6">Login</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) validateEmail(e.target.value);
                  }}
                  onBlur={handleEmailBlur}
                  required
                  className={`w-full px-4 py-3 border rounded-md ${emailError ? "border-red-500" : "border-brand-gray"
                    }`}
                />
                {emailError && (
                  <p className="text-red-500 text-sm mt-1">{emailError}</p>
                )}
              </div>
              <div>
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (passwordError) validatePassword(e.target.value);
                  }}
                  onBlur={handlePasswordBlur}
                  required
                  className={`w-full px-4 py-3 border rounded-md ${passwordError ? "border-red-500" : "border-brand-gray"
                    }`}
                />
                {passwordError && (
                  <p className="text-red-500 text-sm mt-1">{passwordError}</p>
                )}
              </div>
              {error && <p className="text-brand-red text-sm">{error}</p>}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </Button>
            </form>
            <div className="flex flex-col space-y-4 mt-6">
              <p className="text-center text-sm text-brand-black/70">
                Don't have an account?{" "}
                <Link to="/signup" className="text-brand-yellow underline" viewTransition>
                  Sign up
                </Link>
              </p>
              <div className="text-center">
                <Link to="/forget-password" className="text-sm text-brand-black/70 hover:text-brand-yellow underline transition-colors" viewTransition>
                  Forget your password?
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
