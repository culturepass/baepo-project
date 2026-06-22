type Props = {
  status: string | null;
};

export default function StatusBadge({ status }: Props) {
  const currentStatus = status || "신규";

  const styles = {
    신규: "bg-blue-100 text-blue-700 border-blue-200",
    검토중: "bg-yellow-100 text-yellow-700 border-yellow-200",
    견적발송: "bg-purple-100 text-purple-700 border-purple-200",
    계약진행: "bg-indigo-100 text-indigo-700 border-indigo-200",
    수주완료: "bg-green-100 text-green-700 border-green-200",
    보류: "bg-red-100 text-red-700 border-red-200",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold ${
        styles[currentStatus as keyof typeof styles]
      }`}
    >
      {currentStatus}
    </span>
  );
}