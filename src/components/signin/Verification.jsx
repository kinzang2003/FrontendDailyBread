import React, { useRef } from 'react';

export default function Verification({ code, error, onCodeChange, onVerify }) {
  // Create an array of refs for each input field
  const inputRefs = useRef([]);

  // Function to handle input change and auto-advance focus
  const handleInputChange = (e, index) => {
    const value = e.target.value;
    // Only allow single digit input
    if (value.length > 1) {
      return;
    }

    onCodeChange(e, index); // Update the parent's state

    // If a digit is entered and it's not the last input, move focus to the next input
    if (value.length === 1 && index < code.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Function to handle backspace/delete for navigation
  const handleKeyDown = (e, index) => {
    // If backspace is pressed and the current input is empty, move focus to the previous input
    if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-80">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Enter Verification Code
      </h2>
      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
      <div className="flex justify-between gap-2 mb-4"> {/* Added gap for spacing */}
        {code.map((val, index) => (
          <input
            key={index}
            type="text"
            maxLength="1"
            className="w-10 h-10 p-2 text-center text-xl font-bold shadow-md rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={val}
            onChange={(e) => handleInputChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            ref={(el) => (inputRefs.current[index] = el)} // Assign ref to the input
            autoFocus={index === 0} // Auto-focus the first input on mount
          />
        ))}
      </div>
      <button
        onClick={onVerify}
        className="w-full bg-primary text-white py-2 rounded hover:bg-primary-light"
      >
        Verify
      </button>
    </div>
  );
}
