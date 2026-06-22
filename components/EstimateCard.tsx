import Link from "next/link";
import StatusBadge from "./StatusBadge";

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

type Props = {
  item: Estimate;
  statusOptions: string[];
  onStatusChange: (id: number, status: string) => void;
  onCopyReply: (message: string | null) => void;
};

export default function EstimateCard({
  item,
  statusOptions,
  onStatusChange,
  onCopyReply,
}: Props) {
  return (
    <article className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <StatusBadge status={item.status} />

            <span className="text-xs font-medium text-gray-400">
              #{item.id}
            </span>
          </div>

          <h2 className="mt-3 text-xl font-bold text-gray-900">
            {item.customer_name || "고객명 없음"}
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            {item.customer_contact || "연락처 없음"}
          </p>
        </div>

        <div className="text-left md:text-right">
          <p className="text-xs text-gray-400">
            {new Date(item.created_at).toLocaleString()}
          </p>

          <select
            className="mt-3 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-bold text-gray-700 outline-none focus:border-blue-500"
            value={item.status || "신규"}
            onChange={(e) => onStatusChange(item.id, e.target.value)}
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-5 rounded-xl bg-gray-50 p-4">
        <p className="mb-2 text-xs font-bold text-gray-400">
          AI 요약
        </p>

        <p className="line-clamp-2 text-sm leading-6 text-gray-700">
          {item.summary || item.inquiry || "-"}
        </p>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <div className="rounded-xl border border-gray-100 p-4">
          <p className="text-xs font-bold text-gray-400">
            예상 견적
          </p>

          <p className="mt-2 font-bold text-blue-700">
            {item.estimated_price || "-"}
          </p>
        </div>

        <div className="rounded-xl border border-gray-100 p-4">
          <p className="text-xs font-bold text-gray-400">
            필요 페이지
          </p>

          <p className="mt-2 line-clamp-1 text-sm text-gray-700">
            {item.pages || "-"}
          </p>
        </div>

        <div className="rounded-xl border border-gray-100 p-4">
          <p className="text-xs font-bold text-gray-400">
            필요 기능
          </p>

          <p className="mt-2 line-clamp-1 text-sm text-gray-700">
            {item.features || "-"}
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2 border-t border-gray-100 pt-4">
        <Link
          href={`/estimates/${item.id}`}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-100"
        >
          상세보기
        </Link>

        <button
          onClick={() => onCopyReply(item.reply_message)}
          className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-bold text-white hover:bg-black"
        >
          회신 초안 복사
        </button>
      </div>
    </article>
  );
}