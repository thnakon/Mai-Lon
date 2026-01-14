import type { Metadata } from "next";
import { RegisterForm } from "./register-form";

export const metadata: Metadata = {
  title: "สมัครสมาชิก",
  description: "สมัครสมาชิกเพื่อใช้งาน Mai Lon Student Super App",
};

export default function RegisterPage() {
  return <RegisterForm />;
}
