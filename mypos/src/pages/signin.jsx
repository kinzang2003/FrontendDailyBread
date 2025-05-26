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
  const [code, setCode] = useState(["", "", "", ""]);
  const [step, setStep] = useState("SignIn");
  const [error, setError] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();

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

    // const user = validUsers.find(
    //   (u) => u.email === email && u.password === password
    // );

    const user = await fetch(
      `http://localhost:8765/USERSERVICE/api/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      }
    );
    const userData = await user.json();
    console.log(userData, " User Data");
    // console.log(user.json(), " User");

    if (userData.jwt) {
      localStorage.setItem("token", userData.jwt);
      localStorage.setItem("user", JSON.stringify(userData.user));
      console.log(userData.user.authorities[0].authority, " User Dat1a");
      if ("admin" === "admin") {
        console.log("hello");
        navigate("/dashboard");
      } else if (userData.user.authorities[0].authority === "cashier") {
        console.log(userData.user.authorities[0].authority);
        navigate("/long");
      }
    } else {
      alert(userData.message || "Invalid credentials");
    }
  };

  const handleForgotPassword = () => {
    setError("");
    if (!validateEmail(email)) return setError("Please enter a valid email.");
    console.log("Sending reset link to", email);
    setStep("verify");
  };

  const handleCodeChange = (e, index) => {
    let newCode = [...code];
    newCode[index] = e.target.value;
    setCode(newCode);
  };

  const handleVerifyCode = () => {
    if (code.join("") !== "1234") return setError("Invalid verification code.");
    setError("");
    setStep("reset");
  };

  const handleResetPassword = () => {
    setError("");
    if (!newPassword || !confirmPassword)
      return setError("All password fields are required.");
    if (newPassword.length < 6)
      return setError("Password must be at least 6 characters.");
    if (newPassword !== confirmPassword)
      return setError("Passwords do not match.");
    console.log("Password reset successfully");
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
