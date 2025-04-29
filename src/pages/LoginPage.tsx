import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/use-toast";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const from = location.state?.from || "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please enter both email and password.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const success = await login(email, password);
      if (success) {
        navigate(from);
        toast({ title: "Login successful", description: "Welcome back!" });
      } else {
        toast({
          title: "Login failed",
          description: "Invalid email or password. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Login error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-[calc(100vh-160px)] flex flex-col md:flex-row bg-white">
        {/* Left Content */}
        <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-24">
  <div className="max-w-md w-full mx-auto border border-gray-300 rounded-xl p-6 shadow-sm bg-white">
    <img src="public\images\bikes\dephyr_logo.jpg" alt="Logo" className="mx-auto h-14" />
    <h2 className="mt-6 text-3xl font-bold text-gray-900 text-center">
      Need a Convenient Car Subscription?
    </h2>
    <p className="text-sm text-gray-600 text-center mt-2">
      Sign in to manage your subscriptions, or{" "}
      <Link to="/signup" className="text-orange-500 font-medium hover:underline">
        create a new account
      </Link>
    </p>

    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email address
        </label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Checkbox
            id="remember-me"
            checked={rememberMe}
            onCheckedChange={(checked) => setRememberMe(checked === true)}
          />
          <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
            Remember me
          </label>
        </div>
        <div className="text-sm">
          <a href="#" className="text-orange-500 hover:underline">
            Forgot password?
          </a>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full bg-orange-500 hover:bg-orange-600 text-black font-semibold"
        disabled={isLoading}
      >
        {isLoading ? "Signing in..." : "Sign in"}
      </Button>
    </form>

    <div className="mt-6 text-center text-gray-500 text-sm">Or sign in using:</div>

    <div className="mt-4 grid grid-cols-2 gap-4">
      <Button
        variant="outline"
        className="w-full"
        onClick={() => alert("Google login not implemented")}
      >
        Google
      </Button>
      <Button
        variant="outline"
        className="w-full"
        onClick={() => alert("Phone login not implemented")}
      >
        Phone
      </Button>
    </div>
  </div>
</div>


        {/* Right Image */}
        <div className="hidden md:flex md:w-1/2 items-center justify-center bg-white p-6">
          <img
            src="/images/bikes/pngwing.com.png"
            alt="Car and Bike"
            className="max-w-full h-auto"
          />
        </div>
      </div>

      <Footer />
    </>
  );
};

export default LoginPage;
