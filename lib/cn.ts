import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind class strings while letting later classes win over earlier
 * ones. Same convention as shadcn/ui — `cn(base, override)` is the rule.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
