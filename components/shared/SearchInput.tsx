"use client";

import qs from "query-string";
import { useEffect, useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

import { SearchIcon } from "lucide-react";
import { Input } from "../ui/input";

function SearchInput() {
  const [value, setValue] = useState("");
  const debouncedValue = useDebounce(value);

  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentCategoryId = searchParams.get("categoryId");

  useEffect(() => {
    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: {
          categoryId: currentCategoryId,
          title: debouncedValue,
        },
      },
      { skipEmptyString: true, skipNull: true }
    );

    router.push(url);
  }, [currentCategoryId, debouncedValue, pathname, router]);

  return (
    <div className="relative">
      <SearchIcon className="h-4 w-4 absolute top-3 left-3 text-slate-600" />
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full md:w-[300px] pl-9 rounded-full bg-slate-100 focus-visible:ring-slate-200"
        placeholder="Search for a course..."
      />
    </div>
  );
}

export default SearchInput;
