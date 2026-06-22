"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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
      <header className="border-b border-gray-100 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link href="/">
            <h1 className="text-2xl font-black tracking-tight text-blue-600">
              BAEPO
            </h1>
          </Link>

          <nav className="hidden items-center gap-6 text-sm font-bold text-gray-600 md:flex">
            <Link href="/estimates" className="hover:text-blue-600">
              견적 CRM
            </Link>
            <Link href="/estimate" className="hover:text-blue-600">
              새 견적
            </Link>
            <Link href="/board" className="hover:text-blue-600">
              게시판
            </Link>
            <Link href="/contact" className="hover:text-blue-600">
              문의하기
            </Link>
            <Link href="/admin" className="hover:text-blue-600">
              관리자
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            {email ? (
              <>
                <span className="hidden rounded-full bg-gray-100 px-4 py-2 text-sm font-bold text-gray-700 md:inline-flex">
                  {email}
                </span>

                <button
                  onClick={logout}
                  className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-bold text-white hover:bg-black"
                >
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-100"
                >
                  로그인
                </Link>

                <Link
                  href="/signup"
                  className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700"
                >
                  회원가입
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <section className="mx-auto grid min-h-[calc(100vh-81px)] max-w-7xl items-center gap-10 px-6 py-16 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="mb-4 inline-flex rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-bold text-blue-700">
            AI Estimate CRM for Web Agency
          </p>

          <h2 className="text-5xl font-black leading-tight tracking-tight text-gray-900">
            웹에이전시 견적 업무를
            <br />
            AI와 CRM으로 자동화합니다.
          </h2>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-600">
            고객 문의를 입력하면 AI가 예상 페이지, 기능, 견적 범위,
            회신 초안을 생성하고 CRM에 저장합니다.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/estimates"
              className="rounded-xl bg-blue-600 px-6 py-4 text-sm font-bold text-white hover:bg-blue-700"
            >
              견적 CRM 열기
            </Link>

            <Link
              href="/estimate"
              className="rounded-xl border border-gray-200 bg-white px-6 py-4 text-sm font-bold text-gray-700 hover:bg-gray-100"
            >
              새 견적 작성
            </Link>
          </div>
        </div>

        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-blue-600">
                BAEPO Workflow
              </p>

              <h3 className="mt-1 text-2xl font-bold text-gray-900">
                견적 자동화 흐름
              </h3>
            </div>

            <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-700">
              LIVE
            </span>
          </div>

          <div className="space-y-3">
            {[
              "고객 문의 입력",
              "AI 분석",
              "예상 페이지 생성",
              "기능 범위 산정",
              "견적 범위 생성",
              "회신 초안 작성",
              "CRM 저장 및 상태 관리",
            ].map((item, index) => (
              <div
                key={item}
                className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-gray-50 p-4"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                  {index + 1}
                </div>

                <p className="text-sm font-bold text-gray-700">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}