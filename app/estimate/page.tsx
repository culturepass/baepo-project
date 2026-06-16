"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";

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
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <section className="mx-auto max-w-3xl rounded-2xl bg-white p-8 shadow">
        <h1 className="mb-2 text-3xl font-bold">AI 견적 자동화</h1>
        <p className="mb-6 text-gray-600">
          고객 문의 내용을 입력하면 AI가 페이지, 기능, 견적, 회신 초안을 생성합니다.
        </p>

        <div className="grid gap-4">
          <input
            className="rounded-xl border px-4 py-3"
            placeholder="고객명"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />

          <input
            className="rounded-xl border px-4 py-3"
            placeholder="연락처 또는 이메일"
            value={customerContact}
            onChange={(e) => setCustomerContact(e.target.value)}
          />

          <textarea
            className="min-h-48 rounded-xl border px-4 py-3"
            placeholder="고객 문의 내용을 붙여넣으세요."
            value={inquiry}
            onChange={(e) => setInquiry(e.target.value)}
          />

          <button
            onClick={createEstimate}
            disabled={loading}
            className="rounded-xl bg-blue-600 py-3 font-bold text-white disabled:bg-gray-400"
          >
            {loading ? "AI 분석 중..." : "AI 견적 분석 저장"}
          </button>
        </div>
      </section>
    </main>
  );
}