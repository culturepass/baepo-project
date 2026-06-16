"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabase";

type Estimate = {
  id: number;
  customer_name: string | null;
  customer_contact: string | null;
  inquiry: string;
  summary: string | null;
  pages: string | null;
  features: string | null;
  estimated_price: string | null;
  reply_message: string | null;
  status: string | null;
  created_at: string;
};

const STATUS_OPTIONS = [
  "신규",
  "검토중",
  "견적발송",
  "계약진행",
  "수주완료",
  "보류",
];

export default function EstimatesPage() {
  const [estimates, setEstimates] = useState<Estimate[]>([]);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("전체");

  const filteredEstimates = estimates.filter((item) => {
    const keyword = searchText.toLowerCase();

    const matchesSearch =
      (item.customer_name || "").toLowerCase().includes(keyword) ||
      (item.customer_contact || "").toLowerCase().includes(keyword) ||
      item.inquiry.toLowerCase().includes(keyword);

    const matchesStatus =
      statusFilter === "전체" || item.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  async function getEstimates() {
    const { data, error } = await supabase
      .from("estimates")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      alert("견적 목록 불러오기 실패: " + error.message);
      return;
    }

    setEstimates(data || []);
  }

  async function updateStatus(id: number, status: string) {
    const { error } = await supabase
      .from("estimates")
      .update({ status })
      .eq("id", id);

    if (error) {
      alert("상태 변경 실패: " + error.message);
      return;
    }

    alert("상태가 변경되었습니다.");
    getEstimates();
  }

  async function copyReply(message: string | null) {
    if (!message) return;
    await navigator.clipboard.writeText(message);
    alert("회신 초안이 복사되었습니다.");
  }

  useEffect(() => {
    getEstimates();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <section className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">견적 CRM 대시보드</h1>
            <p className="mt-2 text-gray-600">
              고객 문의, 예상 견적, 회신 초안을 한 곳에서 관리합니다.
            </p>
          </div>

          <a
            href="/estimate"
            className="rounded-xl bg-blue-600 px-5 py-3 font-bold text-white"
          >
            새 견적 작성
          </a>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-4">
          <div className="rounded-2xl bg-white p-5 shadow">
            <p className="text-sm text-gray-500">총 견적</p>
            <p className="mt-2 text-3xl font-bold">{estimates.length}</p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow">
            <p className="text-sm text-gray-500">신규</p>
            <p className="mt-2 text-3xl font-bold">
              {estimates.filter((item) => item.status === "신규").length}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow">
            <p className="text-sm text-gray-500">검토중</p>
            <p className="mt-2 text-3xl font-bold">
              {estimates.filter((item) => item.status === "검토중").length}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow">
            <p className="text-sm text-gray-500">견적발송</p>
            <p className="mt-2 text-3xl font-bold">
              {estimates.filter((item) => item.status === "견적발송").length}
            </p>
          </div>
        </div>

        <div className="mb-8 grid gap-4 rounded-2xl bg-white p-5 shadow md:grid-cols-2">
          <input
            className="rounded-xl border px-4 py-3"
            placeholder="고객명, 연락처, 문의 내용 검색"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />

          <select
            className="rounded-xl border px-4 py-3"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="전체">전체 상태</option>
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-6">
          {filteredEstimates.map((item) => (
            <article
              key={item.id}
              className="rounded-2xl border bg-white p-6 shadow-sm"
            >
              <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                  <select
                    className="mb-3 rounded-full border bg-blue-50 px-3 py-2 text-sm font-bold text-blue-700"
                    value={item.status || "신규"}
                    onChange={(e) => updateStatus(item.id, e.target.value)}
                  >
                    {STATUS_OPTIONS.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>

                  <h2 className="text-2xl font-bold">
                    {item.customer_name || "고객명 없음"}
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    {item.customer_contact || "연락처 없음"}
                  </p>
                </div>

                <p className="text-sm text-gray-400">
                  {new Date(item.created_at).toLocaleString()}
                </p>
              </div>

              <div className="mb-5 rounded-xl bg-gray-50 p-4 text-sm text-gray-700">
                <b>원문 문의</b>
                <p className="mt-2 whitespace-pre-wrap">{item.inquiry}</p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-xl border p-4">
                  <p className="mb-2 text-sm font-bold text-gray-500">요약</p>
                  <p>{item.summary || "-"}</p>
                </div>

                <div className="rounded-xl border p-4">
                  <p className="mb-2 text-sm font-bold text-gray-500">
                    예상 견적
                  </p>
                  <p className="font-bold text-blue-700">
                    {item.estimated_price || "-"}
                  </p>
                </div>

                <div className="rounded-xl border p-4">
                  <p className="mb-2 text-sm font-bold text-gray-500">
                    필요 페이지
                  </p>
                  <p>{item.pages || "-"}</p>
                </div>

                <div className="rounded-xl border p-4">
                  <p className="mb-2 text-sm font-bold text-gray-500">
                    필요 기능
                  </p>
                  <p>{item.features || "-"}</p>
                </div>
              </div>

              <div className="mt-5 rounded-xl border p-4">
                <p className="mb-2 text-sm font-bold text-gray-500">
                  고객 회신 초안
                </p>
                <p className="whitespace-pre-wrap text-gray-700">
                  {item.reply_message || "-"}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Link
                    href={`/estimates/${item.id}`}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-bold hover:bg-gray-100"
                  >
                    상세보기
                  </Link>

                  <button
                    onClick={() => copyReply(item.reply_message)}
                    className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-bold text-white"
                  >
                    회신 초안 복사
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}