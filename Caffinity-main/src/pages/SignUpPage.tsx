import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import toast from "react-hot-toast";
import { authService } from "../services/api";

const SignUpPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);
  const [firstNameError, setFirstNameError] = useState<string | null>(null);
  const [lastNameError, setLastNameError] = useState<string | null>(null);

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
    if (!/(?=.*[a-z])/.test(password)) {
      setPasswordError("Password must contain at least one lowercase letter");
      return false;
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      setPasswordError("Password must contain at least one uppercase letter");
      return false;
    }
    if (!/(?=.*\d)/.test(password)) {
      setPasswordError("Password must contain at least one number");
      return false;
    }
    setPasswordError(null);
    return true;
  };

  const validateConfirmPassword = (confirmPwd: string): boolean => {
    if (!confirmPwd) {
      setConfirmPasswordError("Please confirm your password");
      return false;
    }
    if (confirmPwd !== password) {
      setConfirmPasswordError("Passwords do not match");
      return false;
    }
    setConfirmPasswordError(null);
    return true;
  };

  const validateFirstName = (name: string): boolean => {
    if (!name || name.trim().length === 0) {
      setFirstNameError("First name is required");
      return false;
    }
    if (name.trim().length < 2) {
      setFirstNameError("First name must be at least 2 characters");
      return false;
    }
    if (!/^[a-zA-Z\s]+$/.test(name)) {
      setFirstNameError("First name can only contain letters");
      return false;
    }
    setFirstNameError(null);
    return true;
  };

  const validateLastName = (name: string): boolean => {
    if (!name || name.trim().length === 0) {
      setLastNameError("Last name is required");
      return false;
    }
    if (name.trim().length < 2) {
      setLastNameError("Last name must be at least 2 characters");
      return false;
    }
    if (!/^[a-zA-Z\s]+$/.test(name)) {
      setLastNameError("Last name can only contain letters");
      return false;
    }
    setLastNameError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(false);

    const isFirstNameValid = validateFirstName(firstName);
    const isLastNameValid = validateLastName(lastName);
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    const isConfirmPasswordValid = validateConfirmPassword(confirmPassword);

    if (!isFirstNameValid || !isLastNameValid || !isEmailValid || !isPasswordValid || !isConfirmPasswordValid) {
      return;
    }

    setLoading(true);
    try {
      const response = await authService.signup({
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
      });

      if (response.status === 201) {
        setIsSuccess(true);
        toast.success("Account created successfully!");
        navigate("/login", { viewTransition: true });
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "An error occurred during sign up.";
      toast.error(errorMessage);
      setEmailError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <title>Sing up</title>

      <div className="container mx-auto px-6 py-20 flex justify-center">
        <div className="w-full max-w-md">
          <div className="bg-white p-8 shadow-md rounded-lg">
            <h1 className="font-heading text-3xl text-center mb-6">
              Create Account
            </h1>

            {isSuccess && (
              <div className="text-center text-green-700 bg-green-50 p-4 rounded-md mb-4">
                <p className="font-semibold">Account created successfully!</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName">First Name</label>
                  <input
                    id="firstName"
                    type="text"
                    value={firstName}
                    onChange={(e) => {
                      setFirstName(e.target.value);
                      if (firstNameError) validateFirstName(e.target.value);
                    }}
                    onBlur={() => validateFirstName(firstName)}
                    required
                    className={`w-full px-4 py-3 border rounded-md ${firstNameError ? "border-red-500" : "border-gray-300"
                      }`}
                  />
                  {firstNameError && (
                    <p className="text-red-500 text-sm mt-1">{firstNameError}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    id="lastName"
                    type="text"
                    value={lastName}
                    onChange={(e) => {
                      setLastName(e.target.value);
                      if (lastNameError) validateLastName(e.target.value);
                    }}
                    onBlur={() => validateLastName(lastName)}
                    required
                    className={`w-full px-4 py-3 border rounded-md ${lastNameError ? "border-red-500" : "border-gray-300"
                      }`}
                  />
                  {lastNameError && (
                    <p className="text-red-500 text-sm mt-1">{lastNameError}</p>
                  )}
                </div>
              </div>

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
                  onBlur={() => validateEmail(email)}
                  required
                  className={`w-full px-4 py-3 border rounded-md ${emailError ? "border-red-500" : "border-gray-300"
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
                  onBlur={() => validatePassword(password)}
                  required
                  className={`w-full px-4 py-3 border rounded-md ${passwordError ? "border-red-500" : "border-gray-300"
                    }`}
                />
                {passwordError && (
                  <p className="text-red-500 text-sm mt-1">{passwordError}</p>
                )}
                <p className="text-gray-500 text-xs mt-1">
                  Must be at least 6 characters with uppercase, lowercase, and number
                </p>
              </div>

              <div>
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (confirmPasswordError) validateConfirmPassword(e.target.value);
                  }}
                  onBlur={() => validateConfirmPassword(confirmPassword)}
                  required
                  className={`w-full px-4 py-3 border rounded-md ${confirmPasswordError ? "border-red-500" : "border-gray-300"
                    }`}
                />
                {confirmPasswordError && (
                  <p className="text-red-500 text-sm mt-1">{confirmPasswordError}</p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Creating Account..." : "Sign Up"}
              </Button>
            </form>

            <p className="text-center text-sm mt-4">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-600 underline" viewTransition>
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUpPage;
