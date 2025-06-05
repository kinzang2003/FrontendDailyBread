export default function Verification({ code, error, onCodeChange, onVerify }) {
  return (
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
            onChange={(e) => onCodeChange(e, index)}
          />
        ))}
      </div>
      <button
        onClick={onVerify}
        className="w-full bg-primary text-white py-2 rounded hover:bg-primary-light mt-4"
      >
        Verify
      </button>
    </div>
  );
}
