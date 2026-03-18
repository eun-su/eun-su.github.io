"use client";

import { useEffect } from "react";

export function usePageTheme(pageName: string) {
  useEffect(() => {
    document.body.setAttribute("data-page", pageName);

    return () => {
      document.body.removeAttribute("data-page");
    };
  }, [pageName]);
}