"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  const titles: Record<string, string> = {
    "/estimates": "견적 CRM",
    "/estimate": "새 견적 작성",
    "/board": "게시판",
    "/admin": "문의 관리",
  };

  const descriptions: Record<string, string> = {
    "/estimates": "고객 문의와 견적 상태를 한 곳에서 관리합니다.",
    "/estimate": "문의 내용을 기반으로 AI 견적을 생성합니다.",
    "/board": "게시글과 내부 자료를 관리합니다.",
    "/admin": "문의 및 관리자 기능을 확인합니다.",
  };

  const currentTitle = titles[pathname] || "BAEPO";
  const currentDescription =
    descriptions[pathname] || "웹에이전시용 AI 견적 자동화 CRM";

  return (
    <header className="border-b border-gray-100 bg-white px-8 py-5">
      <div className="flex items-center justify-between gap-6">
        <div>
          <p className="text-sm font-bold text-blue-600">
            BAEPO Dashboard
          </p>

          <h1 className="mt-1 text-2xl font-bold text-gray-900">
            {currentTitle}
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            {currentDescription}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/estimate"
            className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700"
          >
            + 새 견적
          </Link>

          <div className="rounded-full bg-gray-100 px-4 py-2 text-sm font-bold text-gray-700">
            HYUNSOO HAN
          </div>
        </div>
      </div>
    </header>
  );
}