// src/components/signin/SignInForm.jsx
import ReCAPTCHA from "react-google-recaptcha";

// The reCAPTCHA site key for development/testing. Replace with your actual key in production.
const site_key = "6LfDl1MrAAAAANa0ljPvs-9Ub6eUc6ztT5E9sKyL";
// const site_key = "6LfuH1crAAAAAPg-zKE58QNQqIHmQYsX8jYL-lgr";

export default function SignInForm({
  email,
  password,
  error,
  onEmailChange,
  onPasswordChange,
  onSignIn,
  onForgot,
  onCaptchaChange,
  isCaptchaCompleted, // New prop: boolean indicating if reCAPTCHA is completed
}) {
  return (
    // Increased width from w-80 to w-96 to better fit the reCAPTCHA widget
    <div className="bg-white p-6 rounded-lg shadow-md w-96">
      <h2 className="text-2xl font-bold mb-4 text-center">Sign In</h2>
      {/* Display error message if present */}
      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

      {/* Email input field */}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={onEmailChange}
        className="w-full p-2 border rounded mb-3"
      />

      {/* Password input field */}
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={onPasswordChange}
        className="w-full p-2 border rounded mb-3"
      />

      {/* Google reCAPTCHA component */}
      <ReCAPTCHA
        sitekey={site_key}
        className="mb-3"
        onChange={onCaptchaChange} // Callback when reCAPTCHA is completed
      />

      {/* Sign In button - disabled if reCAPTCHA is not completed */}
      <button
        onClick={onSignIn}
        disabled={!isCaptchaCompleted} // Button is disabled if reCAPTCHA is not done
        className={`w-full py-2 rounded text-white ${isCaptchaCompleted
          ? "bg-primary hover:bg-primary-light" // Active styles
          : "bg-gray-400 cursor-not-allowed" // Disabled styles
          }`}
      >
        Next
      </button>

      {/* Forgot Password link */}
      <p
        className="text-primary text-sm mt-3 text-end cursor-pointer"
        onClick={onForgot}
      >
        Forgot Password?
      </p>
    </div>
  );
}
