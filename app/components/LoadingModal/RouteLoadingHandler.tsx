"use client";

import { useRouteLoading } from "@/hooks/useRouteLoading";
import LoadingModal from "./LoadingModal";

export default function RouteLoadingHandler() {
  const isLoading = useRouteLoading();
  return isLoading ? <LoadingModal /> : null;
}
