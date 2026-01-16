"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Mail, Lock, Loader2, AlertCircle, ArrowLeft, Globe, Eye, EyeOff } from "lucide-react";

const languages = [
  { code: "th", label: "ไทย", flag: "🇹🇭" },
  { code: "en", label: "English", flag: "🇺🇸" },
];

const dict = {
  th: {
    back: "กลับสู่หน้าหลัก",
    title: "ยินดีต้อนรับกลับ!",
    subtitle: "กรอกอีเมลเพื่อเข้าใช้งานบัญชีของคุณ",
    passwordTab: "รหัสผ่าน",
    magicLinkTab: "Magic Link",
    emailLabel: "อีเมล",
    passwordLabel: "รหัสผ่าน",
    forgotPassword: "ลืมรหัสผ่าน?",
    login: "เข้าสู่ระบบ",
    loggingIn: "กำลังเข้าสู่ระบบ...",
    orContinueWith: "หรือทำต่อด้วย",
    google: "Google",
    noAccount: "ยังไม่มีบัญชี?",
    register: "สมัครสมาชิก",
    termsPrefix: "เมื่อคลิกทำต่อ คุณยอมรับ",
    terms: "ข้อกำหนดการใช้งาน",
    privacyPrefix: "และ",
    privacy: "นโยบายความเป็นส่วนตัว",
    idleLogout: "คุณถูกออกจากระบบเนื่องจากไม่มีการใช้งาน กรุณาเข้าสู่ระบบอีกครั้ง",
  },
  en: {
    back: "Back to Home",
    title: "Welcome back",
    subtitle: "Enter your email to sign in to your account",
    passwordTab: "Password",
    magicLinkTab: "Magic Link",
    emailLabel: "Email",
    passwordLabel: "Password",
    forgotPassword: "Forgot password?",
    login: "Sign In",
    loggingIn: "Signing in...",
    orContinueWith: "OR CONTINUE WITH",
    google: "Google",
    noAccount: "Don't have an account?",
    register: "Sign up",
    termsPrefix: "By continuing, you agree to our",
    terms: "Terms of Service",
    privacyPrefix: "and",
    privacy: "Privacy Policy",
    idleLogout: "You were logged out due to inactivity. Please sign in again.",
  },
};

export function LoginForm() {
  const [currentLang, setCurrentLang] = useState<"th" | "en">("th");
  const [showPassword, setShowPassword] = useState(false);
  const [loginMethod, setLoginMethod] = useState<"password" | "magic">("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  const reason = searchParams.get("reason");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      // Get the user data from Supabase to check metadata
      const { data: { user } } = await supabase.auth.getUser();
      const onboardingComplete = user?.user_metadata?.onboarding_complete === true;
      
      localStorage.setItem("show_welcome_toast", "true");
      
      if (onboardingComplete) {
        // Sync local storage for faster UI checks later
        localStorage.setItem("onboarding_complete", "true");
        if (user?.user_metadata?.onboarding_info) {
          localStorage.setItem("onboarding_data", JSON.stringify(user.user_metadata.onboarding_info));
        }
        router.push("/dashboard");
      } else {
        router.push("/onboarding");
      }
      router.refresh();
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const t = dict[currentLang];

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background relative selection:bg-primary/20 font-sans">
      {/* Back Button */}
      <Link 
        href="/" 
        className="absolute top-8 left-8 flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group"
      >
        <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center group-hover:bg-muted transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </div>
        <span className="hidden sm:inline">{t.back}</span>
      </Link>

      {/* Language Switcher */}
      <div className="absolute top-8 right-8">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-muted font-medium transition-colors">
              <Globe className="h-[18px] w-[18px] text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40 p-2 rounded-2xl border-border/50 shadow-2xl backdrop-blur-lg">
            {languages.map((lang) => (
              <DropdownMenuItem
                key={lang.code}
                onClick={() => setCurrentLang(lang.code as "th" | "en")}
                className={`rounded-xl px-3 py-2 text-sm font-medium transition-colors cursor-pointer ${currentLang === lang.code ? "bg-primary/10 text-primary" : "hover:bg-muted"}`}
              >
                <span className="mr-2 text-base">{lang.flag}</span>
                {lang.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="w-full max-w-[400px] flex flex-col items-center">
        {/* Avatar/Icon */}
        <div className="mb-3 relative">
          <div className="w-14 h-14 rounded-full bg-[#E8D5C4] flex items-center justify-center overflow-hidden border-2 border-background shadow-lg">
             <span className="text-2xl">🧘</span>
          </div>
        </div>

        {/* Title Group */}
        <div className="text-center mb-5">
          <h1 className="text-2xl font-bold text-foreground mb-1 tracking-tight">{t.title}</h1>
          <p className="text-[#71717A] text-sm">{t.subtitle}</p>
        </div>

        {/* Login Method Tabs */}
        <div className="w-full p-1 bg-[#F4F4F5] dark:bg-muted/50 rounded-xl flex mb-4">
          <button
            onClick={() => setLoginMethod("password")}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
              loginMethod === "password" 
                ? "bg-white dark:bg-background text-foreground shadow-sm" 
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.passwordTab}
          </button>
          <button
            onClick={() => setLoginMethod("magic")}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
              loginMethod === "magic" 
                ? "bg-white dark:bg-background text-foreground shadow-sm" 
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.magicLinkTab}
          </button>
        </div>

        {/* Idle Logout Warning */}
        {reason === "idle" && (
          <div className="w-full p-3 mb-4 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-400 flex items-center gap-2 text-sm border border-amber-500/20">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {t.idleLogout}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="w-full p-3 mb-4 rounded-lg bg-destructive/10 text-destructive flex items-center gap-2 text-sm animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="w-full space-y-3">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-foreground ml-0.5" htmlFor="email">
              {t.emailLabel}
            </label>
            <input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-10 px-4 rounded-xl border border-input bg-background/50 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              required
            />
          </div>

          {loginMethod === "password" && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-foreground ml-0.5" htmlFor="password">
                  {t.passwordLabel}
                </label>
                <Link href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors">
                  {t.forgotPassword}
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-10 px-4 pr-10 rounded-xl border border-input bg-background/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full bg-primary hover:bg-primary/90 text-white h-11 rounded-full text-sm font-bold shadow-lg shadow-primary/20 transition-all duration-300 active:scale-[0.98] mt-2" 
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                {t.loggingIn}
              </>
            ) : (
              t.login
            )}
          </Button>
        </form>

        {/* Separator */}
        <div className="w-full flex items-center gap-3 my-5">
          <div className="h-[1px] flex-1 bg-border" />
          <span className="text-[11px] font-bold text-muted-foreground tracking-widest uppercase truncate">
            {t.orContinueWith}
          </span>
          <div className="h-[1px] flex-1 bg-border" />
        </div>

        {/* Google Login */}
        <Button
          variant="outline"
          className="w-full h-12 rounded-full gap-3 border-border bg-[#F4F4F5]/50 hover:bg-[#F4F4F5] dark:hover:bg-muted text-base font-semibold transition-all duration-300"
          onClick={handleGoogleLogin}
          disabled={loading}
        >
          <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          {t.google}
        </Button>

        {/* Footer */}
        <div className="mt-6 text-center space-y-3">
          <p className="text-[#71717A] text-[15px]">
            {t.noAccount}{" "}
            <Link href="/register" className="text-primary hover:underline font-bold transition-all">
              {t.register}
            </Link>
          </p>
          
          <p className="text-[12px] text-[#A1A1AA] max-w-[320px] mx-auto leading-relaxed">
            {t.termsPrefix} <Link href="#" className="underline hover:text-foreground transition-colors">{t.terms}</Link> {t.privacyPrefix} <Link href="#" className="underline hover:text-foreground transition-colors">{t.privacy}</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
