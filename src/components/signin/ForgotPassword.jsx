export default function ForgotPassword({
  email,
  error, // This prop now correctly receives error messages from SignIn.jsx's toast system
  onEmailChange,
  onConfirm,
}) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-80">
      <h2 className="text-2xl font-bold mb-4 text-center">Forgot Password</h2>
      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={onEmailChange}
        className="w-full p-2 border rounded mb-3"
      />
      <button
        onClick={onConfirm}
        className="w-full bg-primary text-white py-2 rounded hover:bg-primary-light"
      >
        Confirm Email
      </button>
    </div>
  );
}
