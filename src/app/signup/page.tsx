"use client";

import { useState } from "react";
import { signUp } from "@aws-amplify/auth";
import { useRouter } from "next/navigation";
import { Amplify } from "aws-amplify";
import outputs from "@amplify_outputs";

Amplify.configure(outputs);

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState<"email" | "password">("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Optimistically proceed to password step — real user check happens in signUp()
    setStep("password");
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    try {
      await signUp({
        username: email,
        password,
        options: {
          userAttributes: {
            email,
          },
        },
      });

      // Cognito sends email automatically — no extra config needed
      alert("Check your email to verify your account.");
      router.push(`/confirmSignup?email=${encodeURIComponent(email)}`);
    } catch (err: any) {
      if (err.name === "UsernameExistsException") {
        setError("Email already exists. Try logging in instead.");
      } else {
        setError(err.message || "Signup failed");
      }
    }
  };

  return (
    <main className="max-w-sm mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Sign Up</h1>

      {step === "email" && (
        <form onSubmit={handleEmailSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
            Continue
          </button>
        </form>
      )}

      {step === "password" && (
        <form onSubmit={handleSignupSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="Create password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
          <input
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
          <button type="submit" className="w-full bg-green-600 text-white py-2 rounded">
            Sign Up
          </button>
        </form>
      )}

      {error && <p className="mt-4 text-red-600">{error}</p>}
    </main>
  );
}
