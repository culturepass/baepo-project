"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { supabase } from "../../../lib/supabase";
import AppLayout from "../../../components/AppLayout";
import StatusBadge from "../../../components/StatusBadge";

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

type EstimateNote = {
  id: number;
  estimate_id: number;
  memo: string;
  created_at: string;
};

export default function EstimateDetailPage() {
  const params = useParams();
  const estimateId = Number(params.id);

  const [estimate, setEstimate] = useState<Estimate | null>(null);
  const [notes, setNotes] = useState<EstimateNote[]>([]);
  const [memo, setMemo] = useState("");
  const [loading, setLoading] = useState(true);
  const [memoLoading, setMemoLoading] = useState(false);
  const [memoError, setMemoError] = useState("");

  async function getEstimate() {
    const { data, error } = await supabase
      .from("estimates")
      .select("*")
      .eq("id", estimateId)
      .single();

    if (error) {
      alert("견적 상세 불러오기 실패: " + error.message);
      setLoading(false);
      return;
    }

    setEstimate(data);
    setLoading(false);
  }

  async function getNotes() {
    const { data, error } = await supabase
      .from("estimate_notes")
      .select("*")
      .eq("estimate_id", estimateId)
      .order("id", { ascending: false });

    if (error) {
      setMemoError(
        "메모 테이블 또는 권한 설정이 필요합니다. Supabase에서 estimate_notes 테이블을 생성해주세요."
      );
      setNotes([]);
      return;
    }

    setMemoError("");
    setNotes(data || []);
  }

  async function saveMemo() {
    if (!memo.trim()) {
      alert("메모 내용을 입력하세요.");
      return;
    }

    setMemoLoading(true);

    const { error } = await supabase.from("estimate_notes").insert([
      {
        estimate_id: estimateId,
        memo,
      },
    ]);

    if (error) {
      alert("메모 저장 실패: " + error.message);
      setMemoLoading(false);
      return;
    }

    setMemo("");
    await getNotes();
    setMemoLoading(false);
  }

  async function copyReply(message: string | null) {
    if (!message) return;

    await navigator.clipboard.writeText(message);
    alert("회신 초안이 복사되었습니다.");
  }

  useEffect(() => {
    if (!estimateId) return;

    getEstimate();
    getNotes();
  }, [estimateId]);

  if (loading) {
    return (
      <AppLayout>
        <section className="p-8">
          <div className="mx-auto max-w-6xl rounded-2xl border border-gray-100 bg-white p-10 text-center text-gray-500 shadow-sm">
            견적 상세 정보를 불러오는 중입니다.
          </div>
        </section>
      </AppLayout>
    );
  }

  if (!estimate) {
    return (
      <AppLayout>
        <section className="p-8">
          <div className="mx-auto max-w-6xl rounded-2xl border border-gray-100 bg-white p-10 text-center shadow-sm">
            <h1 className="text-xl font-bold text-gray-900">
              견적 정보를 찾을 수 없습니다.
            </h1>

            <Link
              href="/estimates"
              className="mt-6 inline-flex rounded-xl bg-gray-900 px-5 py-3 text-sm font-bold text-white"
            >
              목록으로 돌아가기
            </Link>
          </div>
        </section>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <section className="p-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="mb-3 flex items-center gap-3">
                <Link
                  href="/estimates"
                  className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-bold text-gray-600 hover:bg-gray-100"
                >
                  ← 목록
                </Link>

                <StatusBadge status={estimate.status} />
              </div>

              <p className="mb-2 text-sm font-bold text-blue-600">
                Estimate Detail
              </p>

              <h1 className="text-3xl font-bold text-gray-900">
                {estimate.customer_name || "고객명 없음"}
              </h1>

              <p className="mt-2 text-gray-500">
                {estimate.customer_contact || "연락처 없음"}
              </p>
            </div>

            <div className="text-left md:text-right">
              <p className="text-sm text-gray-400">견적 번호 #{estimate.id}</p>
              <p className="mt-1 text-sm text-gray-400">
                {new Date(estimate.created_at).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="mb-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <p className="text-sm font-bold text-gray-400">예상 견적</p>
              <p className="mt-3 text-2xl font-bold text-blue-700">
                {estimate.estimated_price || "-"}
              </p>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <p className="text-sm font-bold text-gray-400">필요 페이지</p>
              <p className="mt-3 text-sm leading-6 text-gray-700">
                {estimate.pages || "-"}
              </p>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <p className="text-sm font-bold text-gray-400">필요 기능</p>
              <p className="mt-3 text-sm leading-6 text-gray-700">
                {estimate.features || "-"}
              </p>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-6">
              <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900">원문 문의</h2>

                <p className="mt-4 whitespace-pre-wrap rounded-xl bg-gray-50 p-5 text-sm leading-7 text-gray-700">
                  {estimate.inquiry || "-"}
                </p>
              </div>

              <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900">
                  AI 분석 요약
                </h2>

                <p className="mt-4 whitespace-pre-wrap rounded-xl bg-blue-50 p-5 text-sm leading-7 text-gray-700">
                  {estimate.summary || "-"}
                </p>
              </div>

              <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900">고객 메모</h2>

                {memoError && (
                  <div className="mt-4 rounded-xl border border-yellow-200 bg-yellow-50 p-4 text-sm leading-6 text-yellow-800">
                    {memoError}
                  </div>
                )}

                <textarea
                  className="mt-4 min-h-32 w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm leading-6 outline-none focus:border-blue-500"
                  placeholder="상담 내용, 확인 사항, 다음 연락 일정 등을 입력하세요."
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
                />

                <button
                  onClick={saveMemo}
                  disabled={memoLoading}
                  className="mt-3 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-700 disabled:bg-gray-400"
                >
                  {memoLoading ? "저장 중..." : "메모 저장"}
                </button>

                <div className="mt-6 space-y-3">
                  {notes.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-gray-200 p-5 text-center text-sm text-gray-400">
                      등록된 메모가 없습니다.
                    </div>
                  ) : (
                    notes.map((note) => (
                      <div
                        key={note.id}
                        className="rounded-xl border border-gray-100 bg-gray-50 p-4"
                      >
                        <p className="whitespace-pre-wrap text-sm leading-6 text-gray-700">
                          {note.memo}
                        </p>

                        <p className="mt-3 text-xs text-gray-400">
                          {new Date(note.created_at).toLocaleString()}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900">
                  고객 회신 초안
                </h2>

                <p className="mt-4 whitespace-pre-wrap rounded-xl bg-gray-50 p-5 text-sm leading-7 text-gray-700">
                  {estimate.reply_message || "-"}
                </p>

                <button
                  onClick={() => copyReply(estimate.reply_message)}
                  className="mt-5 w-full rounded-xl bg-gray-900 px-5 py-3 text-sm font-bold text-white hover:bg-black"
                >
                  회신 초안 복사
                </button>
              </div>

              <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900">다음 작업</h2>

                <div className="mt-4 space-y-3 text-sm text-gray-600">
                  <div className="rounded-xl border border-gray-100 p-4">
                    고객 요구사항 확인
                  </div>

                  <div className="rounded-xl border border-gray-100 p-4">
                    상세 범위 산정
                  </div>

                  <div className="rounded-xl border border-gray-100 p-4">
                    견적서 PDF 생성
                  </div>

                  <div className="rounded-xl border border-gray-100 p-4">
                    이메일 발송
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </AppLayout>
  );
}