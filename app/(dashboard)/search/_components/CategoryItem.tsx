"use client";

import qs from "query-string";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { IconType } from "react-icons";

type Props = {
  label: string;
  value?: string;
  icon?: IconType;
};
function CategoryItem({ label, value, icon: Icon }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentCategoryId = searchParams.get("categoryId");
  const currentTitle = searchParams.get("title");

  const isSelected = currentCategoryId === value;

  const onClick = () => {
    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: {
          title: currentTitle,
          categoryId: isSelected ? null : value,
        },
      },
      { skipNull: true, skipEmptyString: true }
    );

    router.push(url);
  };

  return (
    <button
      onClick={onClick}
      className={`flex items-center text-sm gap-x-1 border border-slate-200 hover:border-sky-700 py-2 px-3 rounded-full transition ${
        isSelected && "text-sky-800 !border-sky-700 bg-sky-200/20"
      }`}
      type="button"
      data-cy="category-item"
    >
      {Icon && <Icon size={20} />}
      <p className="truncate">{label}</p>
    </button>
  );
}

export default CategoryItem;
