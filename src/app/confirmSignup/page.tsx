import { Suspense } from "react";
import ConfirmSignupPage from "@/components/UserAlreadyLoggedIn/ConfirmSignup";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading confirmation page...</div>}>
      <ConfirmSignupPage />
    </Suspense>
  );
}