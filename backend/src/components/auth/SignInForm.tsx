import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import axios from "axios";
import toast from "react-hot-toast";

export default function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const navigate = useNavigate();

  const validateFields = () => {
    const newErrors: { email?: string; password?: string } = {};

    // Email validations
    if (!email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!email.includes("@")) {
      newErrors.email = "Email must include '@'.";
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    // Password validations
    if (!password.trim()) {
      newErrors.password = "Password is required.";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!validateFields()) return;

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password },
        { withCredentials: true }
      );

      const user = res.data.user;
      const role = user.role.toLowerCase();
      if (!["admin", "editor"].includes(role)) {
        setTimeout(() => {
        navigate("/user/dashboard");
      }, 900);
        return;
      }

      localStorage.setItem("user", JSON.stringify(user));
      toast.success("Login successful!");
      console.log(" Login Success:", user);
      console.log("Redirecting to /");
      navigate("/");
     
    } catch (err: any) {
      const backendMsg =
        err.response?.data?.message || "Invalid login response. Try again.";

      if (
        backendMsg.toLowerCase().includes("password") ||
        backendMsg.toLowerCase().includes("credential")
      ) {
        setErrors({ password: "Invalid email or password" });
      } else if (backendMsg.toLowerCase().includes("user not found")) {
        setErrors({ email: "No account found with this email" });
        toast.error("User not found. Please sign up first.");
      } else if (backendMsg.toLowerCase().includes("email")) {
        setErrors({ email: backendMsg });
        toast.error(backendMsg);
      } else {
        setErrors({ password: backendMsg });
        toast.error(backendMsg);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen pt-20 pb-20 space-y-8">
      {/* Back link */}
      <div className="w-full max-w-md">
        <Link
          to="/"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon className="size-5" />
          Back to dashboard
        </Link>
      </div>

      {/* Sign in form */}
      <div className="w-full max-w-md">
        <div className="flex flex-col justify-center w-full mx-auto">
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign In
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your email and password to sign in!
            </p>
          </div>

          <form onSubmit={handleLogin} noValidate>
            <div className="space-y-6">
              {/* Email */}
              <div>
                <Label>
                  Email <span className="text-error-500">*</span>
                </Label>
                <Input
                  placeholder="info@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="text"
                  className={errors.email ? "border-red-500 ring-1 ring-red-500" : ""}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <Label>
                  Password <span className="text-error-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    placeholder="Enter your password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={errors.password ? "border-red-500 ring-1 ring-red-500" : ""}
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                  >
                    {showPassword ? (
                      <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                    ) : (
                      <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                    )}
                  </span>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
              </div>

              {/* Sign in button */}
              <div>
                <Button className="w-full" size="sm" type="submit">
                  Sign in
                </Button>
              </div>
            </div>
          </form>

          {/* Bottom links: Sign Up (left) + Forgot Password (right) */}
          <div className="mt-5 flex justify-between items-center text-sm">
            <p className="font-normal text-gray-700 dark:text-gray-400">
              Don&apos;t have an account?{" "}
              <Link
                to="/signup"
                className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
              >
                Sign Up
              </Link>
            </p>

            <Link
              to="/forgot-password"
              className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
            >
              Forgot password?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
