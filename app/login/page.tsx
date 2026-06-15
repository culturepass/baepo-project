"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function login() {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert("로그인 실패: " + error.message);
      return;
    }

    alert("로그인 성공");
    window.location.href = "/";
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-20">
      <section className="mx-auto max-w-md rounded-2xl bg-white p-8 shadow">
        <h1 className="mb-6 text-3xl font-bold">로그인</h1>

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
          onClick={login}
          className="w-full rounded-xl bg-blue-600 py-3 font-bold text-white"
        >
          로그인
        </button>
      </section>
    </main>
  );
}