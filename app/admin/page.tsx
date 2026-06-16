"use client";

import { useEffect, useState } from "react";
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
    const { data } = await supabase
      .from("contacts")
      .select("*")
      .order("id", { ascending: false });

    setContacts(data || []);
  }

  useEffect(() => {
    checkAdmin();
  }, []);

  if (loading) {
    return <main className="p-10">확인 중...</main>;
  }

  if (!isAdmin) {
    return (
      <main className="min-h-screen bg-gray-50 px-6 py-20">
        <section className="mx-auto max-w-md rounded-2xl bg-white p-8 shadow">
          <h1 className="mb-4 text-2xl font-bold">접근 권한 없음</h1>
          <p className="text-gray-600">
            관리자 권한이 있는 계정만 접근할 수 있습니다.
          </p>
          <a
            href="/login"
            className="mt-6 inline-block rounded-xl bg-blue-600 px-5 py-3 font-bold text-white"
          >
            로그인하기
          </a>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 px-6 py-12">
      <section className="mx-auto max-w-5xl rounded-2xl bg-white p-8 shadow">
        <h1 className="mb-8 text-3xl font-bold">관리자 페이지</h1>

        <h2 className="mb-4 text-2xl font-bold">문의 목록</h2>

        <div className="grid gap-4">
          {contacts.map((contact) => (
            <div key={contact.id} className="rounded-xl border p-5">
              <p className="font-bold">{contact.name}</p>
              <p className="text-gray-600">{contact.email}</p>
              <p className="mt-3">{contact.message}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}