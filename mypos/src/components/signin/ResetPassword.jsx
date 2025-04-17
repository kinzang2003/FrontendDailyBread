export default function ResetPasswordForm({
  newPassword,
  confirmPassword,
  error,
  onNewPasswordChange,
  onConfirmPasswordChange,
  onReset,
}) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-80">
      <h2 className="text-2xl font-bold mb-4 text-center">Reset Password</h2>
      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
      <input
        type="password"
        placeholder="New Password"
        value={newPassword}
        onChange={onNewPasswordChange}
        className="w-full p-2 border rounded mb-3"
      />
      <input
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={onConfirmPasswordChange}
        className="w-full p-2 border rounded mb-3"
      />
      <button
        onClick={onReset}
        className="w-full bg-primary text-white py-2 rounded hover:bg-primary-light"
      >
        Reset Password
      </button>
    </div>
  );
}
