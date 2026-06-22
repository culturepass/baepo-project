"use client";

import { useEffect, useState } from "react";
import AppLayout from "../../components/AppLayout";
import { supabase } from "../../lib/supabase";

type Contact = {
  id: number;
  name: string;
  email: string;
  message: string;
  created_at: string;
};

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>([]);

  async function checkAdmin() {
    const { data: userData } = await supabase.auth.getUser();
    const userEmail = userData.user?.email;

    if (!userEmail) {
      setLoading(false);
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("email", userEmail)
      .single();

    if (profile?.role === "admin") {
      setIsAdmin(true);
      await getContacts();
    }

    setLoading(false);
  }

  async function getContacts() {
    const { data, error } = await supabase
      .from("contacts")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      alert("문의 목록 불러오기 실패: " + error.message);
      return;
    }

    setContacts(data || []);
  }

  useEffect(() => {
    checkAdmin();
  }, []);

  if (loading) {
    return (
      <AppLayout>
        <section className="p-8">
          <div className="mx-auto max-w-6xl rounded-2xl border border-gray-100 bg-white p-10 text-center text-gray-500 shadow-sm">
            관리자 권한을 확인하는 중입니다.
          </div>
        </section>
      </AppLayout>
    );
  }

  if (!isAdmin) {
    return (
      <AppLayout>
        <section className="p-8">
          <div className="mx-auto max-w-xl rounded-2xl border border-gray-100 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-2xl">
              🔒
            </div>

            <h1 className="text-2xl font-bold text-gray-900">
              접근 권한 없음
            </h1>

            <p className="mt-3 text-sm leading-6 text-gray-500">
              관리자 권한이 있는 계정만 접근할 수 있습니다.
              <br />
              관리자 계정으로 로그인 후 다시 시도해주세요.
            </p>

            <a
              href="/login"
              className="mt-6 inline-flex rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-700"
            >
              로그인하기
            </a>
          </div>
        </section>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <section className="p-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="mb-2 text-sm font-bold text-blue-600">
                Admin
              </p>

              <h1 className="text-3xl font-bold text-gray-900">
                문의 관리
              </h1>

              <p className="mt-2 text-gray-600">
                고객이 남긴 문의 내용을 확인하고 후속 대응을 관리합니다.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white px-5 py-4 text-sm text-gray-500 shadow-sm">
              총 문의{" "}
              <span className="font-bold text-gray-900">
                {contacts.length}
              </span>
              건
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900">
              문의 목록
            </h2>

            <div className="mt-6 grid gap-4">
              {contacts.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-gray-200 p-10 text-center text-sm text-gray-400">
                  등록된 문의가 없습니다.
                </div>
              ) : (
                contacts.map((contact) => (
                  <article
                    key={contact.id}
                    className="rounded-2xl border border-gray-100 p-5 transition hover:bg-gray-50"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">
                          {contact.name || "이름 없음"}
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                          {contact.email || "이메일 없음"}
                        </p>
                      </div>

                      <p className="text-xs text-gray-400">
                        {new Date(contact.created_at).toLocaleString()}
                      </p>
                    </div>

                    <p className="mt-4 whitespace-pre-wrap rounded-xl bg-gray-50 p-4 text-sm leading-7 text-gray-700">
                      {contact.message}
                    </p>
                  </article>
                ))
              )}
            </div>
          </div>
        </div>
      </section>
    </AppLayout>
  );
}