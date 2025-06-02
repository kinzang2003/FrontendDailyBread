import ReCAPTCHA from "react-google-recaptcha";
// const site_key = process.env.REACT_APP_RECAPTCHA_SITE_KEY;
const site_key = "6LfDl1MrAAAAANa0ljPvs-9Ub6eUc6ztT5E9sKyL";
export default function SignIn({
  email,
  password,
  error,
  onEmailChange,
  onPasswordChange,
  onSignIn,
  onForgot,
  onCaptchaChange,
}) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-80">
      <h2 className="text-2xl font-bold mb-4 text-center">Sign In</h2>
      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={onEmailChange}
        className="w-full p-2 border rounded mb-3"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={onPasswordChange}
        className="w-full p-2 border rounded mb-3"
      />
      <ReCAPTCHA
        sitekey={site_key}
        className="mb-3"
        onChange={onCaptchaChange}
      />
      <button
        onClick={onSignIn}
        className="w-full bg-primary text-white py-2 rounded hover:bg-primary-light"
      >
        Next
      </button>
      <p
        className="text-primary text-sm mt-3 text-end cursor-pointer"
        onClick={onForgot}
      >
        Forgot Password?
      </p>
    </div>
  );
}
