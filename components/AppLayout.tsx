"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Header from "./Header";
import Sidebar from "./Sidebar";

type Props = {
  children: React.ReactNode;
};

export default function AppLayout({ children }: Props) {
  const pathname = usePathname();

  const menus = [
    { name: "CRM", href: "/estimates" },
    { name: "견적작성", href: "/estimate" },
    { name: "게시판", href: "/board" },
    { name: "관리자", href: "/admin" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 lg:flex">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="border-b border-gray-100 bg-white px-5 py-4 lg:hidden">
          <div className="mb-4 flex items-center justify-between">
            <Link href="/estimates">
              <h1 className="text-xl font-black tracking-tight text-blue-600">
                BAEPO
              </h1>
            </Link>

            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
              v1
            </span>
          </div>

          <nav className="flex gap-2 overflow-x-auto">
            {menus.map((menu) => {
              const active =
                pathname === menu.href ||
                pathname.startsWith(`${menu.href}/`);

              return (
                <Link
                  key={menu.href}
                  href={menu.href}
                  className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold ${
                    active
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {menu.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="hidden lg:block">
          <Header />
        </div>

        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}