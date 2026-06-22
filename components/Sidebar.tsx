"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const menus = [
    {
      name: "견적 CRM",
      href: "/estimates",
      icon: "📊",
    },
    {
      name: "새 견적",
      href: "/estimate",
      icon: "✍️",
    },
    {
      name: "게시판",
      href: "/board",
      icon: "📝",
    },
    {
      name: "문의 관리",
      href: "/admin",
      icon: "📩",
    },
  ];

  return (
    <aside className="hidden min-h-screen w-64 shrink-0 border-r border-gray-100 bg-white lg:block">
      <div className="border-b border-gray-100 p-6">
        <Link href="/estimates">
          <h1 className="text-2xl font-black tracking-tight text-blue-600">
            BAEPO
          </h1>
        </Link>

        <p className="mt-1 text-sm text-gray-500">
          AI Estimate CRM
        </p>
      </div>

      <nav className="p-4">
        {menus.map((menu) => {
          const active =
            pathname === menu.href ||
            pathname.startsWith(`${menu.href}/`);

          return (
            <Link
              key={menu.href}
              href={menu.href}
              className={`mb-2 flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition ${
                active
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <span className="text-base">{menu.icon}</span>
              <span>{menu.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="absolute bottom-6 w-64 px-4">
        <div className="rounded-2xl bg-gray-50 p-4">
          <p className="text-sm font-bold text-gray-900">
            BAEPO v1
          </p>

          <p className="mt-1 text-xs leading-5 text-gray-500">
            웹에이전시용 AI 견적 자동화 CRM
          </p>
        </div>
      </div>
    </aside>
  );
}