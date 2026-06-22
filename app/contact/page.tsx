"use client";

import { useState } from "react";
import AppLayout from "../../components/AppLayout";
import { supabase } from "../../lib/supabase";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function submitContact() {
    if (!name.trim()) {
      alert("이름을 입력하세요.");
      return;
    }

    if (!email.trim()) {
      alert("이메일을 입력하세요.");
      return;
    }

    if (!message.trim()) {
      alert("문의 내용을 입력하세요.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.from("contacts").insert([
      {
        name,
        email,
        message,
      },
    ]);

    setLoading(false);

    if (error) {
      alert("문의 등록 실패 : " + error.message);
      return;
    }

    alert("문의가 등록되었습니다.");

    setName("");
    setEmail("");
    setMessage("");
  }

  return (
    <AppLayout>
      <section className="p-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8">
            <p className="mb-2 text-sm font-bold text-blue-600">
              Contact
            </p>

            <h1 className="text-3xl font-bold text-gray-900">
              문의하기
            </h1>

            <p className="mt-2 text-gray-600">
              고객 문의를 접수하고 관리자 페이지에서 확인할 수 있습니다.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900">
                문의 등록
              </h2>

              <div className="mt-6 grid gap-4">
                <div>
                  <label className="mb-2 block text-sm font-bold text-gray-700">
                    이름
                  </label>

                  <input
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-blue-500"
                    placeholder="홍길동"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-gray-700">
                    이메일
                  </label>

                  <input
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-blue-500"
                    placeholder="client@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-gray-700">
                    문의 내용
                  </label>

                  <textarea
                    className="min-h-48 w-full resize-none rounded-xl border border-gray-200 px-4 py-3 leading-7 outline-none focus:border-blue-500"
                    placeholder="문의 내용을 입력해주세요."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>

                <button
                  onClick={submitContact}
                  disabled={loading}
                  className="rounded-xl bg-blue-600 py-3 font-bold text-white hover:bg-blue-700 disabled:bg-gray-400"
                >
                  {loading ? "등록 중..." : "문의 등록"}
                </button>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900">
                  안내사항
                </h2>

                <ul className="mt-5 space-y-3 text-sm leading-6 text-gray-600">
                  <li>• 문의 내용은 관리자 페이지에서 확인 가능합니다.</li>
                  <li>• 이메일 주소를 정확히 입력해주세요.</li>
                  <li>• 프로젝트 규모와 예산을 함께 작성하면 좋습니다.</li>
                  <li>• 참고 사이트가 있으면 함께 기재해주세요.</li>
                </ul>
              </div>

              <div className="rounded-2xl border border-blue-100 bg-blue-50 p-6">
                <p className="text-sm font-bold text-blue-700">
                  빠른 상담
                </p>

                <p className="mt-2 text-sm leading-6 text-blue-800">
                  홈페이지 제작, 쇼핑몰, 관리자 시스템,
                  AI 자동화 등 다양한 프로젝트 문의가 가능합니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </AppLayout>
  );
}