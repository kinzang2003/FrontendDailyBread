import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { icons } from "../assets/constants/icons";
import { login } from "../auth/auth";
import SignInForm from "../components/signin/SignIn";
import ForgotPasswordForm from "../components/signin/ForgotPassword";
import VerificationForm from "../components/signin/Verification";
import ResetPasswordForm from "../components/signin/ResetPassword";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [step, setStep] = useState("SignIn");
  const [error, setError] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();
  const [recaptchaToken, setRecaptchaToken] = useState("");
  const validUsers = [
    { email: "devk@gmail.com", password: "password1234", role: "admin" },
    { email: "user@gmail.com", password: "password1234", role: "user" },
  ];

  const validateEmail = (email) => /^\S+@\S+\.\S+$/.test(email.trim());

  const handleSignIn = async () => {
    setError("");
    if (!email || !password)
      return setError("Email and password are required.");
    if (!validateEmail(email)) return setError("Invalid email format.");
    if (!recaptchaToken) return setError("Please complete the reCAPTCHA.");
    // const user = validUsers.find(
    //   (u) => u.email === email && u.password === password
    // );

    const user = await fetch(
      `http://localhost:8765/USERSERVICE/api/auth/login`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, recaptchaToken }),
      }
    );
    const userData = await user.json();
    console.log(userData, " User Data");
    // console.log(user.json(), " User");

    // if (userData) {
    //   // localStorage.setItem("token", userData.jwt);
    //   localStorage.setItem("user", JSON.stringify(userData.user));
    //   console.log(userData.user.authorities[0].authority, " User Dat1a");
    //   if ("admin" === "admin") {
    //     console.log("hello");
    //     navigate("/dashboard");
    //   } else if (userData.user.authorities[0].authority === "cashier") {
    //     console.log(userData.user.authorities[0].authority);
    //     navigate("/long");
    //   }
    // } else {
    //   alert(userData.message || "Invalid credentials");
    // }
    if (user.ok && userData?.user) {
      localStorage.setItem("user", JSON.stringify(userData.user));
      const role = userData.user.authorities[0].authority;
      if (role === "admin") {
        navigate("/dashboard");
      } else if (role === "cashier") {
        navigate("/product");
      } else {
        setError("Unauthorized role.");
      }
    }
  };

  const handleForgotPassword = async () => {
    setError("");
    if (!validateEmail(email)) return setError("Please enter a valid email.");
    console.log("Sending reset link to", email);
    const res = await fetch(
      "http://localhost:8765/USERSERVICE/api/forgot-password",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      }
    );
    if (!res.ok) {
      const errorData = await res.text();
      console.error("Error sending reset link:", errorData);
      return setError(errorData.message || "Failed to send reset link.");
    }
    const data = await res.text();
    console.log("Reset link sent successfully:", data);
    setStep("verify");
  };

  const handleCodeChange = (e, index) => {
    let newCode = [...code];
    newCode[index] = e.target.value;
    setCode(newCode);
  };

  const handleVerifyCode = async () => {
    // if (code.join("") !== "1234") return setError("Invalid verification code.");
    const res = await fetch(
      "http://localhost:8765/USERSERVICE/api/verify-otp",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp: code.join("") }),
      }
    );
    if (!res.ok) {
      const errorData = await res.text();
      console.error("Error verifying code:", errorData);
      return setError(errorData.message || "Failed to verify code.");
    }
    const data = await res.text();
    console.log("Code verified successfully:", data);

    setError("");
    setStep("reset");
  };

  const handleResetPassword = async () => {
    setError("");
    if (!newPassword || !confirmPassword)
      return setError("All password fields are required.");
    if (newPassword.length < 6)
      return setError("Password must be at least 6 characters.");
    if (newPassword !== confirmPassword)
      return setError("Passwords do not match.");

    const res = await fetch(
      "http://localhost:8765/USERSERVICE/api/reset-password",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password: newPassword, confirmPassword }),
      }
    );
    if (!res.ok) {
      const errorData = await res.text();
      console.error("Error resetting password:", errorData);
      return setError(errorData.message || "Failed to reset password.");
    }
    const data = await res.text();
    console.log("Password reset successfully:", data);

    // console.log("Password reset successfully");
    setStep("SignIn");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <img src={icons.logo} alt="Logo" className="w-32 mb-6" />
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
    </div>
  );
}
