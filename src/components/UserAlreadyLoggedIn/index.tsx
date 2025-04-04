// components/UserAlreadyLoggedIn.tsx
"use client";

import { signOut, AuthUser } from "@aws-amplify/auth";
import { useState } from "react";

const UserAlreadyLoggedIn = ({
  user,
  onLogout,
}: {
  user: AuthUser;
  onLogout: () => void;
}) => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut();
      onLogout(); // 🔥 tell parent to update its state
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="p-4">
      <p className="mb-2">User is logged in</p>
      <button
        onClick={handleLogout}
        disabled={isLoggingOut}
        className={`px-4 py-2 rounded text-white ${
          isLoggingOut ? "bg-gray-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"
        }`}
      >
        {isLoggingOut ? "Logging out..." : "Logout"}
      </button>
    </div>
  );
};

export default UserAlreadyLoggedIn;
