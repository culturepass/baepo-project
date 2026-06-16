"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "../../../lib/supabase";

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

export default function EstimateDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [estimate, setEstimate] = useState<Estimate | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEstimate() {
      const { data, error } = await supabase
        .from("estimates")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("견적 상세 조회 오류:", error.message);
      }

      setEstimate(data);
      setLoading(false);
    }

    if (id) fetchEstimate();
  }, [id]);

  if (loading) {
    return <main className="p-8">견적 정보를 불러오는 중...</main>;
  }

  if (!estimate) {
    return (
      <main className="p-8">
        <p className="mb-4">견적 정보를 찾을 수 없습니다.</p>
        <Link href="/estimates" className="text-blue-600 underline">
          견적 목록으로 돌아가기
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto p-8">
      <Link href="/estimates" className="text-sm text-blue-600 underline">
        ← 견적 목록으로
      </Link>

      <section className="mt-6 bg-white border rounded-xl p-6 shadow-sm">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold">견적 상세</h1>
            <p className="text-sm text-gray-500 mt-1">
              등록일: {new Date(estimate.created_at).toLocaleString("ko-KR")}
            </p>
          </div>

          <span className="px-3 py-1 rounded-full bg-gray-100 text-sm">
            {estimate.status || "신규"}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Info label="고객명" value={estimate.customer_name} />
          <Info label="연락처" value={estimate.customer_contact} />
          <Info label="예상 견적" value={estimate.estimated_price} />
          <Info label="페이지 구성" value={estimate.pages} />
        </div>

        <Block title="문의 내용" content={estimate.inquiry} />
        <Block title="AI 요약" content={estimate.summary} />
        <Block title="필요 기능" content={estimate.features} />
        <Block title="회신 초안" content={estimate.reply_message} />
      </section>
    </main>
  );
}

function Info({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="border rounded-lg p-4 bg-gray-50">
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className="font-medium whitespace-pre-wrap">{value || "-"}</p>
    </div>
  );
}

function Block({ title, content }: { title: string; content: string | null }) {
  return (
    <div className="mb-6">
      <h2 className="font-semibold mb-2">{title}</h2>
      <div className="border rounded-lg p-4 bg-gray-50 text-sm leading-6 whitespace-pre-wrap">
        {content || "-"}
      </div>
    </div>
  );
}