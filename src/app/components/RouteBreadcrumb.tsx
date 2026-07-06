import React from "react";
import { useLocation } from "react-router";

import { BreadcrumbBar } from "@/app/components/BreadcrumbBar";
import { useAppSelector } from "@/app/store/hooks";
import { PRODUCTS, SBUS } from "@/data/mockData";

/**
 * RouteBreadcrumb — automatically renders a BreadcrumbBar based on the
 * current route. Returns null on top-level pages (no breadcrumb needed).
 *
 * Label resolution:
 *  /comparison        → "Comparison"
 *  /aggregate         → "Aggregate Analysis"
 *  /product/:id       → product name looked up from PRODUCTS
 *  /sbu/:id           → SBU name looked up from SBUS
 *  everything else    → no bar rendered
 */
export function RouteBreadcrumb() {
  const { pathname } = useLocation();
  const isLoggedIn   = useAppSelector(s => s.auth.isLoggedIn);
  const role         = useAppSelector(s => s.auth.role);

  if (!isLoggedIn || !role) return null;

  const label = getLabel(pathname);
  if (!label) return null;

  return <BreadcrumbBar label={label} />;
}

function getLabel(path: string): string | null {
  if (path === "/comparison") return "Comparison";
  if (path === "/aggregate")  return "Aggregate Analysis";

  const productMatch = path.match(/^\/product\/(\d+)/);
  if (productMatch) return PRODUCTS.find(p => p.id === Number(productMatch[1]))?.name ?? null;

  const sbuMatch = path.match(/^\/sbu\/(\d+)/);
  if (sbuMatch) return SBUS.find(s => s.id === Number(sbuMatch[1]))?.name ?? null;

  return null;
}
