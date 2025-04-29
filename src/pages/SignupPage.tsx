import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/use-toast";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !phone || !password || !confirmPassword) {
      toast({
        title: "Error",
        description: "All fields are required.",
        variant: "destructive",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    if (!agreedToTerms) {
      toast({
        title: "Error",
        description: "You must agree to the terms and conditions.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const success = await register(name, email, phone, password);

      if (success) {
        navigate("/");
        toast({
          title: "Account created",
          description: "Your account has been created successfully. Welcome!",
        });
      } else {
        toast({
          title: "Registration failed",
          description: "This email may already be in use. Please try another one.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Registration error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-[calc(100vh-160px)] grid grid-cols-1 lg:grid-cols-2">
        {/* Left: Form */}
        <div className="flex flex-col justify-center px-8 py-12 sm:px-12">
          <div className="max-w-md w-full mx-auto">
            <img src="public\images\bikes\dephyr_logo.jpg" alt="Logo" className="h-14 mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Create a new account</h2>
            <p className="text-sm text-gray-600 mb-8">
              Or{" "}
              <Link to="/login" className="text-orange-500 hover:underline">
                sign in to your existing account
              </Link>
            </p>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="Phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Input
                id="confirm-password"
                name="confirm-password"
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={agreedToTerms}
                  onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
                />
                <label htmlFor="terms" className="text-sm text-gray-700">
                  I agree to the{" "}
                  <a href="#" className="text-orange-500 hover:underline">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-orange-500 hover:underline">
                    Privacy Policy
                  </a>
                </label>
              </div>

              <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-black" disabled={isLoading}>
                {isLoading ? "Creating account..." : "Sign up"}
              </Button>
            </form>

            <div className="mt-8 text-center text-sm text-gray-500">
              Or sign up with Google / Phone (not implemented)
            </div>
          </div>
        </div>

        {/* Right: Image */}
        <div className="hidden lg:block">
          <img
            src="public\images\bikes\signup_bg.jpg" // Make sure this image exists in public/images or adjust path
            alt="Signup Visual"
            className="w-90 h-90 object-cover"
          />
        </div>
      </div>

      <Footer />
    </>
  );
};

export default SignupPage;
