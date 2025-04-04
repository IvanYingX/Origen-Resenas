"use client";

import { useEffect, useState } from "react";
import { signIn, getCurrentUser, AuthUser } from "@aws-amplify/auth";
import { useRouter } from "next/navigation";
import { Amplify } from "aws-amplify";
import outputs from "@amplify_outputs";
import UserAlreadyLoggedIn from "@/components/UserAlreadyLoggedIn";
Amplify.configure(outputs);

export default function LoginPage() {
    // If the user is already logged in, redirect to the home page
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await signIn({ username: email, password });
      router.push("/"); // Redirect to home page or dashboard
    } catch (err: any) {
      if (err.name === "UserNotConfirmedException") {
        setError("Please confirm your email before logging in.");
        // Optionally: redirect to /confirmSignup?email=email
      } else if (err.name === "NotAuthorizedException") {
        setError("Incorrect email or password.");
      } else if (err.name === "UserNotFoundException") {
        setError("No account found with this email.");
      } else {
        setError(err.message || "Login failed.");
      }
    }
  };

  useEffect(() => {
    async function checkUser() {
      try {
        const authUser = await getCurrentUser();
        setUser(authUser);
      } catch {
        
      } finally {
        setLoading(false);
      }
    }

    checkUser();
  }, [router]);
  
  return (
    <>
    {user ? <UserAlreadyLoggedIn user={user} onLogout={() => setUser(null)} /> : (
      <main className="max-w-sm mx-auto p-4">
        {loading ? <div>Loading...</div> : (
          <>
            <h1 className="text-xl font-bold mb-4">Login</h1>
            <form onSubmit={handleLogin} className="space-y-4">
              <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
            Log In
          </button>
            {error && <p className="text-red-600">{error}</p>}
          </form>
        </>
      )}
    </main>
    )}
    </>
  );
}
