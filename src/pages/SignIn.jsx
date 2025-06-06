import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { icons } from "../assets/constants/icons.js";
import SignInForm from "../components/signin/SignInForm.jsx";
import ForgotPasswordForm from "../components/signin/ForgotPassword.jsx";
import VerificationForm from "../components/signin/Verification.jsx";
import ResetPasswordForm from "../components/signin/ResetPassword.jsx";
import { login as authLogin } from "../auth/auth"; // Import login function for localStorage

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [step, setStep] = useState("SignIn");
  // Unified toast state: { show: boolean, message: string, type: 'success' | 'error' }
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();
  const [recaptchaToken, setRecaptchaToken] = useState("");

  // Helper function to show a toast message
  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: '' });
    }, 3000); // Toast disappears after 3 seconds
  };

  // Simple email validation regex
  const validateEmail = (email) => /^\S+@\S+\.\S+$/.test(email.trim());

  // Handles the sign-in process
  const handleSignIn = async () => {
    setToast({ show: false, message: '', type: '' }); // Clear previous toasts

    // Basic client-side validation
    if (!email || !password) {
      return showToast("Email and password are required.", "error");
    }
    if (!validateEmail(email)) {
      return showToast("Invalid email format.", "error");
    }
    if (!recaptchaToken) {
      return showToast("Please complete the reCAPTCHA.", "error");
    }

    try {
      const response = await fetch(`http://localhost:8765/user/auth/login`, {
        method: "POST",
        credentials: "include", // Still include credentials for cookie handling (if any)
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, recaptchaToken }),
      });

      const userData = await response.json();
      console.log(userData, " User Data");

      if (response.ok && userData?.user) {
        authLogin(userData.user); // Use auth.js login to store in localStorage

        const role = userData.user.authorities[0].authority;

        showToast("Sign In Successful!", "success");

        setTimeout(() => {
          if (role === "admin") {
            navigate("/dashboard");
          } else if (role === "cashier") {
            navigate("/product");
          } else {
            showToast("Unauthorized role.", "error"); // Fallback for unrecognized roles
          }
        }, 3000);
      } else {
        showToast(userData.message || "Invalid credentials.", "error");
      }
    } catch (apiError) {
      console.error("Sign-in API error:", apiError);
      showToast("Failed to connect to the server. Please try again.", "error");
    }
  };

  // Handles the forgot password request
  const handleForgotPassword = async () => {
    setToast({ show: false, message: '', type: '' }); // Clear previous toasts
    if (!validateEmail(email)) {
      return showToast("Please enter a valid email.", "error");
    }
    console.log("Sending reset link to", email);
    try {
      const res = await fetch("http://localhost:8765/user/forgot-password", {
        method: "POST",
        credentials: "include", // Include cookies if backend uses them
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const errorData = await res.text();
        console.error("Error sending reset link:", errorData);
        try {
          const errorObj = JSON.parse(errorData);
          return showToast(errorObj.message || "Failed to send reset link.", "error");
        } catch (e) {
          return showToast(errorData || "Failed to send reset link.", "error");
        }
      }
      const data = await res.text();
      console.log("Reset link sent successfully:", data);
      showToast("Password reset OTP sent to your email.", "success"); // Success toast
      setStep("verify");
    } catch (apiError) {
      console.error("Forgot password API error:", apiError);
      showToast("Failed to connect to the server. Please try again.", "error");
    }
  };

  // Handles changes in the verification code input fields
  const handleCodeChange = (e, index) => {
    let newCode = [...code];
    newCode[index] = e.target.value;
    setCode(newCode);
  };

  // Handles the verification code submission
  const handleVerifyCode = async () => {
    setToast({ show: false, message: '', type: '' }); // Clear previous toasts
    try {
      const res = await fetch("http://localhost:8765/user/verify-otp", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp: code.join("") }),
      });
      if (!res.ok) {
        const errorData = await res.text();
        console.error("Error verifying code:", errorData);
        try {
          const errorObj = JSON.parse(errorData);
          return showToast(errorObj.message || "Failed to verify code.", "error");
        } catch (e) {
          return showToast(errorData || "Failed to verify code.", "error");
        }
      }
      const data = await res.text();
      console.log("Code verified successfully:", data);
      showToast("OTP verified successfully. Please set your new password.", "success");
      setStep("reset");
    } catch (apiError) {
      console.error("Verify code API error:", apiError);
      showToast("Failed to connect to the server. Please try again.", "error");
    }
  };

  // Handles the password reset process
  const handleResetPassword = async () => {
    setToast({ show: false, message: '', type: '' }); // Clear previous toasts
    if (!newPassword || !confirmPassword) {
      return showToast("All password fields are required.", "error");
    }
    if (newPassword.length < 6) {
      return showToast("Password must be at least 6 characters.", "error");
    }
    if (newPassword !== confirmPassword) {
      return showToast("Passwords do not match.", "error");
    }

    try {
      const res = await fetch("http://localhost:8765/user/reset-password", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password: newPassword, confirmPassword }),
      });
      if (!res.ok) {
        const errorData = await res.text();
        console.error("Error resetting password:", errorData);
        try {
          const errorObj = JSON.parse(errorData);
          return showToast(errorObj.message || "Failed to reset password.", "error");
        } catch (e) {
          return showToast(errorData || "Failed to reset password.", "error");
        }
      }
      const data = await res.text();
      console.log("Password reset successfully:", data);
      showToast("Password reset successfully. You can now sign in.", "success");
      setStep("SignIn");
    } catch (apiError) {
      console.error("Reset password API error:", apiError);
      showToast("Failed to connect to the server. Please try again.", "error");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 relative">
      <img src={icons.logo} alt="Logo" className="w-32 mb-6" />
      {step === "SignIn" && (
        <SignInForm
          email={email}
          password={password}
          // Pass error message from toast state if type is error
          error={toast.type === 'error' ? toast.message : ''}
          onEmailChange={(e) => setEmail(e.target.value)}
          onPasswordChange={(e) => setPassword(e.target.value)}
          onSignIn={handleSignIn}
          onForgot={() => setStep("forgot-password")}
          onCaptchaChange={(token) => setRecaptchaToken(token)}
          isCaptchaCompleted={!!recaptchaToken}
        />
      )}
      {step === "forgot-password" && (
        <ForgotPasswordForm
          email={email}
          error={toast.type === 'error' ? toast.message : ''} // Pass error message from toast state
          onEmailChange={(e) => setEmail(e.target.value)}
          onConfirm={handleForgotPassword} // This function now directly uses showToast
        />
      )}
      {step === "verify" && (
        <VerificationForm
          code={code}
          error={toast.type === 'error' ? toast.message : ''} // Pass error message from toast state
          onCodeChange={handleCodeChange}
          onVerify={handleVerifyCode}
        />
      )}
      {step === "reset" && (
        <ResetPasswordForm
          newPassword={newPassword}
          confirmPassword={confirmPassword}
          error={toast.type === 'error' ? toast.message : ''} // Pass error message from toast state
          onNewPasswordChange={(e) => setNewPassword(e.target.value)}
          onConfirmPasswordChange={(e) => setConfirmPassword(e.target.value)}
          onReset={handleResetPassword}
        />
      )}
      {/* Toast Notification (Original Positioning and Styling) */}
      {toast.show && (
        <div className={`fixed bottom-5 right-5 ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white px-4 py-2 rounded-lg shadow-lg z-50`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}
