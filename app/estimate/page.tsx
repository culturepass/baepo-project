"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabase";
import AppLayout from "../../components/AppLayout";

type EstimateResult = {
  summary: string;
  pages: string;
  features: string;
  estimated_price: string;
  reply_message: string;
};

export default function EstimatePage() {
  const [customerName, setCustomerName] = useState("");
  const [customerContact, setCustomerContact] = useState("");
  const [inquiry, setInquiry] = useState("");
  const [loading, setLoading] = useState(false);

  async function createEstimate() {
    try {
      const { data: userData } = await supabase.auth.getUser();
      const userEmail = userData.user?.email;

      if (!userEmail) {
        alert("로그인 후 이용 가능합니다.");
        window.location.href = "/login";
        return;
      }

      if (!inquiry.trim()) {
        alert("문의 내용을 입력하세요.");
        return;
      }

      setLoading(true);

      const aiResponse = await fetch("/api/estimate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inquiry }),
      });

      const aiData = await aiResponse.json();

      if (!aiResponse.ok) {
        alert("AI 분석 실패: " + aiData.error);
        return;
      }

      let result: EstimateResult;

      try {
        result = JSON.parse(aiData.result);
      } catch {
        alert("AI 응답 형식 오류: " + aiData.result);
        return;
      }

      const { error } = await supabase.from("estimates").insert([
        {
          customer_name: customerName,
          customer_contact: customerContact,
          inquiry,
          summary: result.summary,
          pages: result.pages,
          features: result.features,
          estimated_price: result.estimated_price,
          reply_message: result.reply_message,
          user_email: userEmail,
          status: "신규",
        },
      ]);

      if (error) {
        alert("저장 실패: " + error.message);
        return;
      }

      alert("AI 견적 분석 저장 완료");
      setCustomerName("");
      setCustomerContact("");
      setInquiry("");
    } catch (error) {
      alert(
        "처리 중 오류: " +
          (error instanceof Error ? error.message : "알 수 없는 오류")
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppLayout>
      <section className="p-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
            <div>
              <Link
                href="/estimates"
                className="mb-4 inline-flex rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-bold text-gray-600 hover:bg-gray-100"
              >
                ← 견적 목록
              </Link>

              <p className="mb-2 text-sm font-bold text-blue-600">
                AI Estimate
              </p>

              <h1 className="text-3xl font-bold text-gray-900">
                새 견적 작성
              </h1>

              <p className="mt-2 text-gray-600">
                고객 문의 내용을 입력하면 AI가 예상 페이지, 기능, 견적, 회신 초안을 생성합니다.
              </p>
            </div>

            <div className="rounded-2xl border border-blue-100 bg-blue-50 px-5 py-4 text-sm font-bold text-blue-700">
              AI 분석 + CRM 저장
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900">
                고객 문의 정보
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                고객명과 연락처는 선택 입력이며, 문의 내용은 필수입니다.
              </p>

              <div className="mt-6 grid gap-4">
                <div>
                  <label className="mb-2 block text-sm font-bold text-gray-700">
                    고객명
                  </label>
                  <input
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-blue-500"
                    placeholder="예: 홍길동 / 업체명"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-gray-700">
                    연락처 또는 이메일
                  </label>
                  <input
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-blue-500"
                    placeholder="예: 010-0000-0000 / client@example.com"
                    value={customerContact}
                    onChange={(e) => setCustomerContact(e.target.value)}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-gray-700">
                    문의 내용 <span className="text-blue-600">*</span>
                  </label>
                  <textarea
                    className="min-h-72 w-full resize-none rounded-xl border border-gray-200 px-4 py-3 leading-7 outline-none focus:border-blue-500"
                    placeholder="고객이 보낸 문의 내용을 그대로 붙여넣으세요."
                    value={inquiry}
                    onChange={(e) => setInquiry(e.target.value)}
                  />
                </div>

                <button
                  onClick={createEstimate}
                  disabled={loading}
                  className="rounded-xl bg-blue-600 py-4 font-bold text-white hover:bg-blue-700 disabled:bg-gray-400"
                >
                  {loading ? "AI 분석 중..." : "AI 견적 분석 저장"}
                </button>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900">
                  생성 결과
                </h2>

                <div className="mt-5 space-y-3 text-sm text-gray-600">
                  <div className="rounded-xl bg-gray-50 p-4">AI 요약</div>
                  <div className="rounded-xl bg-gray-50 p-4">예상 페이지</div>
                  <div className="rounded-xl bg-gray-50 p-4">필요 기능</div>
                  <div className="rounded-xl bg-gray-50 p-4">예상 견적</div>
                  <div className="rounded-xl bg-gray-50 p-4">
                    고객 회신 초안
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900">
                  작성 팁
                </h2>

                <ul className="mt-5 space-y-3 text-sm leading-6 text-gray-600">
                  <li>· 고객이 원하는 메뉴와 기능을 최대한 그대로 입력하세요.</li>
                  <li>· 예산, 일정, 참고사이트가 있으면 함께 넣는 것이 좋습니다.</li>
                  <li>· 쇼핑몰, 회원, 게시판, 관리자 같은 키워드는 견적 정확도에 도움이 됩니다.</li>
                  <li>· 저장 후 견적 CRM 목록에서 상태 관리와 상세 확인이 가능합니다.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </AppLayout>
  );
}