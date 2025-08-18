"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { register as registerApi } from "@/lib/auth";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { login as loginApiClient } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const {
    register: f,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    setError(null);
    try {
      await registerApi(values);
      // Auto-login after successful registration
      await loginApiClient({ username: values.email, password: values.password });
      toast.success("Account created");
      router.push("/dashboard");
    } catch (e: unknown) {
      const err = e as { detail?: string; message?: string };
      setError(err?.detail || err?.message || "Registration failed");
      toast.error(err?.detail || err?.message || "Registration failed");
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Register</CardTitle>
          <CardDescription>Create your account to access the dashboard.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" autoComplete="email" {...f("email")} />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" autoComplete="new-password" {...f("password")} />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="name">Name (optional)</Label>
              <Input id="name" type="text" autoComplete="name" {...f("name")} />
            </div>
            {error && <p className="text-destructive text-sm">{error}</p>}
            <Button className="w-full" disabled={isSubmitting} type="submit">
              {isSubmitting ? "Creating..." : "Create account"}
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground">
            Already have an account? {" "}
            <Link className="underline" href="/auth/login">Login</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
