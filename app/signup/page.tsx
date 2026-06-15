"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function signup() {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert("회원가입 실패: " + error.message);
      return;
    }

    alert("회원가입 완료. 이메일 인증이 필요할 수 있습니다.");
    setEmail("");
    setPassword("");
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-20">
      <section className="mx-auto max-w-md rounded-2xl bg-white p-8 shadow">
        <h1 className="mb-6 text-3xl font-bold">회원가입</h1>

        <input
          className="mb-4 w-full rounded-xl border px-4 py-3"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="mb-4 w-full rounded-xl border px-4 py-3"
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={signup}
          className="w-full rounded-xl bg-blue-600 py-3 font-bold text-white"
        >
          가입하기
        </button>
      </section>
    </main>
  );
}