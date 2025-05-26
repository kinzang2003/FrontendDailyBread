import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
function parseJwt(token) {
  if (!token) return null;
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");

    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => `%${("00" + c.charCodeAt(0).toString(16)).slice(-2)}`)
        .join("")
    );

    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Invalid JWT", e);
    return null;
  }
}

export default function Activation() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const token = searchParams.get("token");
  const decodedToken = parseJwt(token);
  console.log(decodedToken, "Decoded Token");
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (token) {
      const res = await fetch(
        "http://localhost:8765/USERSERVICE/api/activate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ activationToken: token, password }),
        }
      );
      const data = await res.json();
      console.log(data, " Activation Data");
    } else {
      alert("Invalid token");
    }
  };
  //   useEffect(async () => {

  //     if (token) {
  //       const res = fetch("http://localhost:8765/USERSERVICE/api/activate", {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({ activationToken: token }),
  //       });
  //       const data = await res.json();
  //       console.log(data, " Activation Data");
  //     } else {
  //       alert("Invalid token");
  //     }
  //   }, []);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Account Activation</h1>
      <form
        className="bg-white p-6 rounded shadow-md"
        onSubmit={(e) => handleSubmit(e)}
      >
        <div className="flex items-center mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Email
          </label>
          <p className="text-gray-500 mb-4">
            {decodedToken?.sub || "No email found in token"}
          </p>
        </div>
        <div className="flex items-center mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded mb-4"
            placeholder="Enter your password"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Activate Account
        </button>
      </form>
    </div>
  );
}
