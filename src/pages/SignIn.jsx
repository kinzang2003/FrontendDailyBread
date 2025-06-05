import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { icons } from "../assets/constants/icons.js"; // Assuming this path is correct
import SignInForm from "../components/signin/SignInForm.jsx";
import ForgotPasswordForm from "../components/signin/ForgotPassword.jsx"; // Assuming this path is correct
import VerificationForm from "../components/signin/Verification.jsx"; // Assuming this path is correct
import ResetPasswordForm from "../components/signin/ResetPassword.jsx"; // Assuming this path is correct

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [step, setStep] = useState("SignIn");
  const [error, setError] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();
  const [recaptchaToken, setRecaptchaToken] = useState(""); // Stores the reCAPTCHA token
  const [showToast, setShowToast] = useState(false); // State to control toast visibility
  const [toastMessage, setToastMessage] = useState(""); // State to store toast message

  // Simple email validation regex
  const validateEmail = (email) => /^\S+@\S+\.\S+$/.test(email.trim());

  // Handles the sign-in process
  const handleSignIn = async () => {
    setError(""); // Clear previous errors

    // Basic client-side validation
    if (!email || !password) {
      return setError("Email and password are required.");
    }
    if (!validateEmail(email)) {
      return setError("Invalid email format.");
    }
    if (!recaptchaToken) {
      return setError("Please complete the reCAPTCHA.");
    }

    try {
      // Make API call to sign in
      const response = await fetch(`http://localhost:8765/user/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, recaptchaToken }),
      });

      const userData = await response.json();
      console.log(userData, " User Data");

      // Check if the sign-in was successful and user data is present
      if (response.ok && userData?.user) {
        localStorage.setItem("user", JSON.stringify(userData.user));
        const role = userData.user.authorities[0].authority;

        // Show success toast
        setToastMessage("Sign In Successful!");
        setShowToast(true);

        // Hide toast after 3 seconds and then navigate
        setTimeout(() => {
          setShowToast(false);
          if (role === "admin") {
            navigate("/dashboard");
          } else if (role === "cashier") {
            navigate("/product");
          } else {
            setError("Unauthorized role."); // Fallback for unrecognized roles
          }
        }, 3000); // 3 seconds
      } else {
        // Handle login errors from the server
        setError(userData.message || "Invalid credentials.");
      }
    } catch (apiError) {
      console.error("Sign-in API error:", apiError);
      setError("Failed to connect to the server. Please try again.");
    }
  };

  // Handles the forgot password request
  const handleForgotPassword = async () => {
    setError("");
    if (!validateEmail(email)) {
      return setError("Please enter a valid email.");
    }
    console.log("Sending reset link to", email);
    try {
      const res = await fetch("http://localhost:8765/user/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const errorData = await res.text(); // Assuming error response is plain text
        console.error("Error sending reset link:", errorData);
        // Attempt to parse JSON if it's an object, otherwise use plain text
        try {
          const errorObj = JSON.parse(errorData);
          return setError(errorObj.message || "Failed to send reset link.");
        } catch (e) {
          return setError(errorData || "Failed to send reset link.");
        }
      }
      const data = await res.text();
      console.log("Reset link sent successfully:", data);
      setStep("verify");
    } catch (apiError) {
      console.error("Forgot password API error:", apiError);
      setError("Failed to connect to the server. Please try again.");
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
    setError("");
    try {
      const res = await fetch("http://localhost:8765/user/verify-otp", {
        method: "POST",
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
          return setError(errorObj.message || "Failed to verify code.");
        } catch (e) {
          return setError(errorData || "Failed to verify code.");
        }
      }
      const data = await res.text();
      console.log("Code verified successfully:", data);
      setError("");
      setStep("reset");
    } catch (apiError) {
      console.error("Verify code API error:", apiError);
      setError("Failed to connect to the server. Please try again.");
    }
  };

  // Handles the password reset process
  const handleResetPassword = async () => {
    setError("");
    if (!newPassword || !confirmPassword) {
      return setError("All password fields are required.");
    }
    if (newPassword.length < 6) {
      return setError("Password must be at least 6 characters.");
    }
    if (newPassword !== confirmPassword) {
      return setError("Passwords do not match.");
    }

    try {
      const res = await fetch("http://localhost:8765/user/reset-password", {
        method: "POST",
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
          return setError(errorObj.message || "Failed to reset password.");
        } catch (e) {
          return setError(errorData || "Failed to reset password.");
        }
      }
      const data = await res.text();
      console.log("Password reset successfully:", data);
      setStep("SignIn");
    } catch (apiError) {
      console.error("Reset password API error:", apiError);
      setError("Failed to connect to the server. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 relative">
      {" "}
      {/* Added relative for toast positioning */}
      <img src={icons.logo} alt="Logo" className="w-32 mb-6" />
      {/* Conditional rendering based on the current step */}
      {step === "SignIn" && (
        <SignInForm
          email={email}
          password={password}
          error={error}
          onEmailChange={(e) => setEmail(e.target.value)}
          onPasswordChange={(e) => setPassword(e.target.value)}
          onSignIn={handleSignIn}
          onForgot={() => setStep("forgot-password")}
          onCaptchaChange={(token) => setRecaptchaToken(token)}
          isCaptchaCompleted={!!recaptchaToken} // Pass boolean value to SignInForm
        />
      )}
      {step === "forgot-password" && (
        <ForgotPasswordForm
          email={email}
          error={error}
          onEmailChange={(e) => setEmail(e.target.value)}
          onConfirm={handleForgotPassword}
        />
      )}
      {step === "verify" && (
        <VerificationForm
          code={code}
          error={error}
          onCodeChange={handleCodeChange}
          onVerify={handleVerifyCode}
        />
      )}
      {step === "reset" && (
        <ResetPasswordForm
          newPassword={newPassword}
          confirmPassword={confirmPassword}
          error={error}
          onNewPasswordChange={(e) => setNewPassword(e.target.value)}
          onConfirmPasswordChange={(e) => setConfirmPassword(e.target.value)}
          onReset={handleResetPassword}
        />
      )}
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-5 right-5 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in-out">
          {toastMessage}
        </div>
      )}
      {/* Basic fade-in-out animation for the toast */}
      <style jsx>{`
        @keyframes fade-in-out {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          10% {
            opacity: 1;
            transform: translateY(0);
          }
          90% {
            opacity: 1;
            transform: translateY(0);
          }
          100% {
            opacity: 0;
            transform: translateY(20px);
          }
        }
        .animate-fade-in-out {
          animation: fade-in-out 3s forwards;
        }
      `}</style>
    </div>
  );
}
