"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { create, getById } from "@/lib/crud";

export default function AuthCallbackHandler() {
  const router = useRouter();

  useEffect(() => {
    const checkAndCreateUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      try {
        await getById("users", user.id);
      } catch {
        const newUser = {
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name || user.email,
          created_at: new Date().toISOString(),
        };

        await create("users", newUser);
      }

      localStorage.setItem("id", user.id);
      router.push("/");
    };

    checkAndCreateUser();
  }, [router]);

  return <div className="h-full"></div>;
}
