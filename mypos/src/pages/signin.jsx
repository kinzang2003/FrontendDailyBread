import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "./../assets/logo.svg";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState(["", "", "", ""]);
  const [step, setStep] = useState("SignIn");
  const [error, setError] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();

  // Mock user (replace with API call)
  const validUser = {
    email: "devk@gmail.com",
    password: "password1234",
  };

  const validateEmail = (email) => /^\S+@\S+\.\S+$/.test(email.trim());

  const handleSignIn = () => {
    setError("");
    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }
    if (!validateEmail(email)) {
      setError("Invalid email format.");
      return;
    }
    if (email === validUser.email && password === validUser.password) {
      console.log("Authentication successful");
      navigate("/dashboard");
    } else {
      setError("Invalid credentials.");
    }
  };

  const handleForgotPassword = () => {
    setError("");
    if (!validateEmail(email)) {
      setError("Please enter a valid email.");
      return;
    }
    console.log("Sending reset link to", email);
    setStep("verify");
  };

  const handleVerifyCode = () => {
    if (code.join("") !== "1234") {
      setError("Invalid verification code.");
    } else {
      setError("");
      setStep("reset");
    }
  };

  const handleResetPassword = () => {
    setError("");
    if (!newPassword || !confirmPassword) {
      setError("All password fields are required.");
      return;
    }
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    console.log("Password reset successfully");
    setStep("SignIn");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <img src={Logo} alt="Logo" className="w-32 mb-6" />

      {step === "SignIn" && (
        <div className="bg-white p-6 rounded-lg shadow-md w-80">
          <h2 className="text-2xl font-bold mb-4 text-center">Sign In</h2>
          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded mb-3"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded mb-3"
          />
          <button
            onClick={handleSignIn}
            className="w-full bg-primary text-white py-2 rounded hover:bg-primary-light"
          >
            Next
          </button>
          <p
            className="text-primary text-sm mt-3 text-end cursor-pointer"
            onClick={() => setStep("forgot-password")}
          >
            Forgot Password?
          </p>
        </div>
      )}

      {step === "forgot-password" && (
        <div className="bg-white p-6 rounded-lg shadow-md w-80">
          <h2 className="text-2xl font-bold mb-4 text-center">
            Forgot Password
          </h2>
          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded mb-3"
          />
          <button
            onClick={handleForgotPassword}
            className="w-full bg-primary text-white py-2 rounded hover:bg-primary-light"
          >
            Confirm Email
          </button>
        </div>
      )}

      {step === "verify" && (
        <div className="bg-white p-6 rounded-lg shadow-md w-80">
          <h2 className="text-2xl font-bold mb-4 text-center">
            Enter Verification Code
          </h2>
          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
          <div className="flex justify-between">
            {code.map((val, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                className="w-12 p-2 text-center border rounded"
                value={val}
                onChange={(e) => {
                  let newCode = [...code];
                  newCode[index] = e.target.value;
                  setCode(newCode);
                }}
              />
            ))}
          </div>
          <button
            onClick={handleVerifyCode}
            className="w-full bg-primary text-white py-2 rounded hover:bg-primary-light mt-4"
          >
            Verify
          </button>
        </div>
      )}

      {step === "reset" && (
        <div className="bg-white p-6 rounded-lg shadow-md w-80">
          <h2 className="text-2xl font-bold mb-4 text-center">
            Reset Password
          </h2>
          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-2 border rounded mb-3"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-2 border rounded mb-3"
          />
          <button
            onClick={handleResetPassword}
            className="w-full bg-primary text-white py-2 rounded hover:bg-primary-light"
          >
            Reset Password
          </button>
        </div>
      )}
    </div>
  );
}
