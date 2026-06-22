type Props = {
  title: string;
  value: number;
  description?: string;
};

export default function DashboardCard({
  title,
  value,
  description,
}: Props) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-gray-500">{title}</p>

      <p className="mt-3 text-3xl font-bold text-gray-900">
        {value}
      </p>

      {description && (
        <p className="mt-2 text-xs text-gray-400">
          {description}
        </p>
      )}
    </div>
  );
}