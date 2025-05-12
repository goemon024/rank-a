"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export const useRouteLoading = () => {
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    setLoading(true);

    const timer = setTimeout(() => {
      setLoading(false);
    }, 500); // 500ms以内に完了しても "反応してる" 感が出る

    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  return loading;
};
