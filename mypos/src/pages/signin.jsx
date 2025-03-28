import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "./../assets/logo.svg";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState(["", "", "", ""]);
  const [step, setStep] = useState("signin");
//   const navigate = useNavigate();

  const handleSignIn = () => {
    console.log("Signing in with", email, password);
  };

  const handleForgotPassword = () => {
    console.log("Sending reset link to", email);
    setStep("verify");
  };

  const handleVerifyCode = () => {
    console.log("Verifying code", code.join(""));
    setStep("reset");
  };

  const handleResetPassword = () => {
    console.log("Password reset successfully");
    setStep("signin");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <img src={Logo} alt="Logo" className="w-32 mb-6" />
      {step === "signin" && (
        <div className="bg-white p-6 rounded-lg shadow-md w-80">
          <h2 className="text-2xl font-bold mb-4 text-center">Sign In</h2>
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
            className="w-full bg-primary text-white py-2 rounded hover:bg-accent"
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
          <h2 className="text-2xl font-bold mb-4 text-center">Forgot Password</h2>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded mb-3"
          />
          <button
            onClick={handleForgotPassword}
            className="w-full bg-primary text-white py-2 rounded hover:bg-accent"
          >
            Confirm Email
          </button>
        </div>
      )}

      {step === "verify" && (
        <div className="bg-white p-6 rounded-lg shadow-md w-80">
          <h2 className="text-2xl font-bold mb-4 text-center">Enter Verification Code</h2>
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
            className="w-full bg-primary text-white py-2 rounded hover:bg-accent mt-4"
          >
            Verify
          </button>
        </div>
      )}

      {step === "reset" && (
        <div className="bg-white p-6 rounded-lg shadow-md w-80">
          <h2 className="text-2xl font-bold mb-4 text-center">Reset Password</h2>
          <input
            type="password"
            placeholder="New Password"
            className="w-full p-2 border rounded mb-3"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full p-2 border rounded mb-3"
          />
          <button
            onClick={handleResetPassword}
            className="w-full bg-primary text-white py-2 rounded hover:bg-accent"
          >
            Reset Password
          </button>
        </div>
      )}
    </div>
  );
}
