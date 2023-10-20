import { formatPrice } from "@/lib/format";

type Props = {
  value: number;
  label: string;
  shouldFormat?: boolean;
};

function DataCard({ label, value, shouldFormat }: Props) {
  return (
    <div className="border shadow rounded-md flex flex-col justify-between gap-4 px-3 py-6">
      <p className="text-sm font-medium">{label}</p>
      <p className="text-2xl font-bold">
        {shouldFormat ? formatPrice(value) : value}
      </p>
    </div>
  );
}

export default DataCard;
