"use client";

import { useEffect, useState } from "react";
import AppLayout from "../../components/AppLayout";
import DashboardCard from "../../components/DashboardCard";
import EstimateCard from "../../components/EstimateCard";
import { supabase } from "../../lib/supabase";

type Estimate = {
  id: number;
  customer_name: string | null;
  customer_contact: string |null;
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
    <AppLayout>
      <section className="p-8">
        <div className="mx-auto max-w-7xl">

          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="mb-2 text-sm font-bold text-blue-600">
                Estimate CRM
              </p>

              <h1 className="text-3xl font-bold text-gray-900">
                견적 CRM 대시보드
              </h1>

              <p className="mt-2 text-gray-600">
                고객 문의, 예상 견적, 회신 초안을 한 곳에서 관리합니다.
              </p>
            </div>

            <a
              href="/estimate"
              className="rounded-xl bg-blue-600 px-5 py-3 font-bold text-white hover:bg-blue-700"
            >
              새 견적 작성
            </a>
          </div>

          <div className="mb-8 grid gap-4 md:grid-cols-4">
            <DashboardCard
              title="총 견적"
              value={estimates.length}
              description="누적 견적 요청"
            />

            <DashboardCard
              title="신규"
              value={
                estimates.filter(
                  (item) => item.status === "신규"
                ).length
              }
              description="새로 접수된 문의"
            />

            <DashboardCard
              title="검토중"
              value={
                estimates.filter(
                  (item) => item.status === "검토중"
                ).length
              }
              description="내부 검토 진행"
            />

            <DashboardCard
              title="견적발송"
              value={
                estimates.filter(
                  (item) => item.status === "견적발송"
                ).length
              }
              description="고객 회신 완료"
            />
          </div>

          <div className="mb-8 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="grid gap-4 md:grid-cols-2">
              <input
                className="rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-blue-500"
                placeholder="고객명, 연락처, 문의 내용 검색"
                value={searchText}
                onChange={(e) =>
                  setSearchText(e.target.value)
                }
              />

              <select
                className="rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-blue-500"
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value)
                }
              >
                <option value="전체">
                  전체 상태
                </option>

                {STATUS_OPTIONS.map((status) => (
                  <option
                    key={status}
                    value={status}
                  >
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-5">
            {filteredEstimates.length === 0 ? (
              <div className="rounded-2xl border border-dashed bg-white p-16 text-center shadow-sm">
                <h2 className="text-xl font-bold text-gray-700">
                  조건에 맞는 견적이 없습니다.
                </h2>

                <p className="mt-2 text-gray-500">
                  새로운 견적을 등록해보세요.
                </p>
              </div>
            ) : (
              filteredEstimates.map((item) => (
                <EstimateCard
                  key={item.id}
                  item={item}
                  statusOptions={STATUS_OPTIONS}
                  onStatusChange={updateStatus}
                  onCopyReply={copyReply}
                />
              ))
            )}
          </div>
        </div>
      </section>
    </AppLayout>
  );
}