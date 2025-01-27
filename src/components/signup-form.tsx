"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  CardFooter,
  Card,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

export function SignUpForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password, password2 }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Ein Fehler ist aufgetreten.");
        return;
      }

      setSuccess("Benutzer erfolgreich registriert!");
      setUsername("");
      setEmail("");
      setPassword("");
      setPassword2("");
      router.push("/signin");
    } catch {
      setError("Serverfehler. Bitte versuchen Sie es später erneut.");
    }
  };

  return (
    <div className="w-full max-w-md">
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-3xl font-bold">Registrieren</CardTitle>
            <CardDescription>Erstelle ein neues Konto</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Benutzername</Label>
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Passwort</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password2">Passwort wiederholen</Label>
              <Input
                id="password2"
                name="password2"
                type="password"
                placeholder="password wiederholen"
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col">
            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
            {success && (
              <p className="text-green-500 text-sm mb-2">{success}</p>
            )}
            <button
              type="submit"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center"
            >
              Registrieren
            </button>
          </CardFooter>
        </Card>
        <div className="mt-4 text-center text-sm">
          Du hast bereits ein Konto?
          <Link className="underline ml-2" href="signin">
            Melde dich hier an
          </Link>
        </div>
      </form>
    </div>
  );
}
