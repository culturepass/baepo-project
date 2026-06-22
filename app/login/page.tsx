"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function login() {
    if (!email.trim()) {
      alert("이메일을 입력하세요.");
      return;
    }

    if (!password.trim()) {
      alert("비밀번호를 입력하세요.");
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert("로그인 실패: " + error.message);
      return;
    }

    alert("로그인 성공");
    window.location.href = "/estimates";
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-100 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link href="/">
            <h1 className="text-2xl font-black tracking-tight text-blue-600">
              BAEPO
            </h1>
          </Link>

          <Link
            href="/signup"
            className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700"
          >
            회원가입
          </Link>
        </div>
      </header>

      <section className="flex min-h-[calc(100vh-81px)] items-center justify-center px-6 py-16">
        <div className="w-full max-w-md rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
          <div className="mb-8 text-center">
            <p className="mb-3 inline-flex rounded-full bg-blue-50 px-4 py-2 text-sm font-bold text-blue-700">
              Welcome Back
            </p>

            <h1 className="text-3xl font-bold text-gray-900">
              로그인
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              BAEPO 견적 CRM을 이용하려면 로그인하세요.
            </p>
          </div>

          <div className="grid gap-4">
            <div>
              <label className="mb-2 block text-sm font-bold text-gray-700">
                이메일
              </label>

              <input
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-blue-500"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-gray-700">
                비밀번호
              </label>

              <input
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-blue-500"
                type="password"
                placeholder="비밀번호"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              onClick={login}
              className="mt-2 rounded-xl bg-blue-600 py-3 font-bold text-white hover:bg-blue-700"
            >
              로그인
            </button>
          </div>

          <p className="mt-6 text-center text-sm text-gray-500">
            계정이 없나요?{" "}
            <Link
              href="/signup"
              className="font-bold text-blue-600 hover:underline"
            >
              회원가입
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}