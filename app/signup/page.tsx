"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabase";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function signup() {
    if (!email.trim()) {
      alert("이메일을 입력하세요.");
      return;
    }

    if (!password.trim()) {
      alert("비밀번호를 입력하세요.");
      return;
    }

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
    window.location.href = "/login";
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
            href="/login"
            className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-100"
          >
            로그인
          </Link>
        </div>
      </header>

      <section className="flex min-h-[calc(100vh-81px)] items-center justify-center px-6 py-16">
        <div className="w-full max-w-md rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
          <div className="mb-8 text-center">
            <p className="mb-3 inline-flex rounded-full bg-blue-50 px-4 py-2 text-sm font-bold text-blue-700">
              Start BAEPO
            </p>

            <h1 className="text-3xl font-bold text-gray-900">
              회원가입
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              AI 견적 자동화 CRM을 시작할 계정을 생성하세요.
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
              onClick={signup}
              className="mt-2 rounded-xl bg-blue-600 py-3 font-bold text-white hover:bg-blue-700"
            >
              가입하기
            </button>
          </div>

          <p className="mt-6 text-center text-sm text-gray-500">
            이미 계정이 있나요?{" "}
            <Link
              href="/login"
              className="font-bold text-blue-600 hover:underline"
            >
              로그인
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}