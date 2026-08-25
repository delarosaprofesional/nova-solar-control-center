"use client";

import { useEffect, type RefObject } from "react";
import { useRouter, useSearchParams } from "next/navigation";

/**
 * For catalog "create" pages reached via a shortcut link from another form
 * (e.g. Compras' "Agregar producto"), this sends the user back to the page
 * named by the `?return_to=` query param once their create-action actually
 * succeeds — but only for a real submission that happened after mount, not
 * for the action's initial `{ error: null }` state.
 *
 * `state` must be the exact object returned by `useActionState` — each
 * completed submission produces a new object reference (even a repeated
 * `{ error: null }`), which is what lets the effect below fire again on a
 * second successful submit. A plain `!state.error` boolean would not: it
 * stays `true` before and after a successful submit, so React would never
 * see it as "changed" and the effect would only ever fire once.
 *
 * Usage:
 *   const submittedRef = useRef(false);
 *   const [state, formAction] = useActionState(async (_prev, formData) => {
 *     submittedRef.current = true;
 *     return createThing(formData);
 *   }, { error: null });
 *   useReturnToOnSuccess(submittedRef, state);
 */
export function useReturnToOnSuccess(
  submittedRef: RefObject<boolean>,
  state: { error: string | null }
) {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!submittedRef.current || state.error) return;
    submittedRef.current = false;
    const returnTo = searchParams.get("return_to");
    if (returnTo && returnTo.startsWith("/")) {
      router.push(returnTo);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);
}
