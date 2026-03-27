"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Zap, Mail, Lock, User, Eye, EyeOff, AlertCircle } from "lucide-react";
import { createSupabaseBrowser } from "@/lib/supabase-browser";

export default function LoginPage({ params }: { params: { locale: string } }) {
  const isFr = params.locale === "fr";
  const router = useRouter();
  const supabase = createSupabaseBrowser();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (mode === "register") {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: name },
            emailRedirectTo: `${window.location.origin}/api/auth/callback?next=/${params.locale}/compte`,
          },
        });
        if (signUpError) throw signUpError;
        setSuccess(
          isFr
            ? "Compte créé ! Vérifie ton email pour confirmer."
            : "Account created! Check your email to confirm."
        );
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
        router.push(`/${params.locale}/compte`);
        router.refresh();
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An error occurred";
      if (message.includes("Invalid login")) {
        setError(isFr ? "Email ou mot de passe incorrect" : "Invalid email or password");
      } else if (message.includes("already registered")) {
        setError(isFr ? "Cet email est déjà utilisé" : "This email is already registered");
      } else if (message.includes("Password should be")) {
        setError(isFr ? "Le mot de passe doit faire au moins 6 caractères" : "Password must be at least 6 characters");
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href={`/${params.locale}`} className="inline-flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-2xl text-gray-900">
              Prono<span className="text-emerald-600">Foot</span>{" "}
              <span className="text-sm font-medium text-emerald-500">AI</span>
            </span>
          </Link>
          <h1 className="mt-6 text-2xl font-extrabold text-gray-900">
            {mode === "login"
              ? (isFr ? "Connexion" : "Log in")
              : (isFr ? "Créer un compte" : "Create account")}
          </h1>
          <p className="mt-2 text-gray-500 text-sm">
            {mode === "login"
              ? (isFr ? "Accède à ton compte PronoFoot AI" : "Access your PronoFoot AI account")
              : (isFr ? "Rejoins PronoFoot AI gratuitement" : "Join PronoFoot AI for free")}
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 space-y-5">

          {/* Google Sign In */}
          <button
            type="button"
            onClick={async () => {
              setError("");
              await supabase.auth.signInWithOAuth({
                provider: "google",
                options: {
                  redirectTo: `${window.location.origin}/api/auth/callback?next=/${params.locale}/compte`,
                },
              });
            }}
            className="w-full flex items-center justify-center gap-3 border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium py-3 rounded-xl transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            {isFr ? "Continuer avec Google" : "Continue with Google"}
          </button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-white text-gray-400">
                {isFr ? "ou par email" : "or with email"}
              </span>
            </div>
          </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}
          {success && (
            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 text-sm text-emerald-700">
              <Zap className="w-4 h-4 flex-shrink-0" />
              {success}
            </div>
          )}

          {mode === "register" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {isFr ? "Nom complet" : "Full name"}
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={isFr ? "Ton nom" : "Your name"}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              {isFr ? "Mot de passe" : "Password"}
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={isFr ? "6 caractères minimum" : "At least 6 characters"}
                required
                minLength={6}
                className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-bold py-3 rounded-xl transition-colors"
          >
            {loading
              ? (isFr ? "Chargement..." : "Loading...")
              : mode === "login"
              ? (isFr ? "Se connecter" : "Log in")
              : (isFr ? "Créer mon compte" : "Create account")}
          </button>
        </form>
        </div>

        {/* Toggle mode */}
        <p className="text-center text-sm text-gray-500 mt-6">
          {mode === "login" ? (
            <>
              {isFr ? "Pas encore de compte ? " : "Don't have an account? "}
              <button
                onClick={() => { setMode("register"); setError(""); setSuccess(""); }}
                className="text-emerald-600 font-semibold hover:underline"
              >
                {isFr ? "Inscris-toi" : "Sign up"}
              </button>
            </>
          ) : (
            <>
              {isFr ? "Déjà un compte ? " : "Already have an account? "}
              <button
                onClick={() => { setMode("login"); setError(""); setSuccess(""); }}
                className="text-emerald-600 font-semibold hover:underline"
              >
                {isFr ? "Connecte-toi" : "Log in"}
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
