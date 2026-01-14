import type { Metadata } from "next";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "เข้าสู่ระบบ",
  description: "เข้าสู่ระบบเพื่อใช้งาน Mai Lon Student Super App",
};

export default function LoginPage() {
  return <LoginForm />;
}
