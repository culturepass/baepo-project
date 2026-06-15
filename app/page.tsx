"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Home() {
  const [email, setEmail] = useState<string | null>(null);

  async function getUser() {
    const { data } = await supabase.auth.getUser();
    setEmail(data.user?.email || null);
  }

  async function logout() {
    await supabase.auth.signOut();
    alert("로그아웃 완료");
    window.location.reload();
  }

  useEffect(() => {
    getUser();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="flex items-center justify-between border-b bg-white px-8 py-5">
        <h1 className="text-2xl font-bold">BAEPO</h1>

        <nav className="flex gap-5 text-sm font-semibold">
          <a href="/signup">회원가입</a>
          <a href="/login">로그인</a>
          <a href="/board">게시판</a>
          <a href="/contact">문의하기</a>
          <a href="/admin">관리자</a>
        </nav>
      </header>

      <section className="flex min-h-[80vh] flex-col items-center justify-center px-6 text-center">
        <h2 className="mb-6 text-5xl font-extrabold">
          실제 서비스형 웹사이트
        </h2>

        {email ? (
          <div>
            <p className="mb-4 text-lg text-gray-600">
              로그인 중: {email}
            </p>
            <button
              onClick={logout}
              className="rounded-full bg-red-600 px-6 py-3 font-bold text-white"
            >
              로그아웃
            </button>
          </div>
        ) : (
          <a
            href="/login"
            className="rounded-full bg-blue-600 px-6 py-3 font-bold text-white"
          >
            로그인하기
          </a>
        )}
      </section>
    </main>
  );
}