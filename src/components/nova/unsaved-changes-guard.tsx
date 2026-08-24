"use client";

import { useEffect } from "react";

const CONFIRM_MESSAGE = "Tienes datos sin guardar en un formulario. ¿Deseas salir de todas formas?";

export function UnsavedChangesGuard() {
  useEffect(() => {
    let dirtyForm: HTMLFormElement | null = null;

    function markDirty(e: Event) {
      const target = e.target as HTMLElement;
      dirtyForm = target.closest("form");
    }

    function markClean(e: Event) {
      if (e.target === dirtyForm) dirtyForm = null;
    }

    function onBeforeUnload(e: BeforeUnloadEvent) {
      if (!dirtyForm) return;
      e.preventDefault();
      e.returnValue = "";
    }

    function onClickCapture(e: MouseEvent) {
      if (!dirtyForm) return;

      const target = e.target as HTMLElement;
      const link = target.closest("a[href]") as HTMLAnchorElement | null;
      const submitButton = target.closest("button[type='submit'], input[type='submit']") as HTMLElement | null;
      const submitForm = submitButton?.closest("form") ?? null;

      const leavingViaLink =
        link && link.origin === window.location.origin && link.target !== "_blank";
      const leavingViaOtherForm = submitButton && submitForm !== dirtyForm;

      if (leavingViaLink || leavingViaOtherForm) {
        if (!window.confirm(CONFIRM_MESSAGE)) {
          e.preventDefault();
          e.stopPropagation();
        } else {
          dirtyForm = null;
        }
      }
    }

    document.addEventListener("input", markDirty, true);
    document.addEventListener("change", markDirty, true);
    document.addEventListener("submit", markClean, true);
    document.addEventListener("click", onClickCapture, true);
    window.addEventListener("beforeunload", onBeforeUnload);

    return () => {
      document.removeEventListener("input", markDirty, true);
      document.removeEventListener("change", markDirty, true);
      document.removeEventListener("submit", markClean, true);
      document.removeEventListener("click", onClickCapture, true);
      window.removeEventListener("beforeunload", onBeforeUnload);
    };
  }, []);

  return null;
}
