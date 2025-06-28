"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { create, getById } from "@/lib/crud";
import Loading from "@/app/loading";

export default function AuthCallbackHandler() {
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );

  useEffect(() => {
    const checkAndCreateUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (!user || error) {
        setStatus("error");
        return;
      }

      try {
        const existingUser = await getById("users", user.id);
        if (!existingUser) {
          const newUser = {
            id: user.id,
            email: user.email,
            full_name: user.user_metadata?.full_name || user.email,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };

          await create("users", newUser);
        }

        localStorage.setItem("id", user.id);
        setStatus("success");
        setTimeout(() => router.push("/"), 1000);
      } catch (e) {
        console.error("Something went wrong", e);
        setStatus("error");
      }
    };

    checkAndCreateUser();
  }, [router]);

  return (
    // <div className="h-svh flex justify-center items-center">
    //   {status === "loading" && (
    //     <div className="text-4xl animate-pulse">Authenticating...</div>
    //   )}
    //   {status === "success" && (
    //     <div className="text-4xl">Login successful! Redirecting...</div>
    //   )}
    //   {status === "error" && (
    //     <div className="text-4xl">Authentication failed. Please try again.</div>
    //   )}
    // </div>
    <Loading />
  );
}
