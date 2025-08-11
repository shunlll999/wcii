import { EVENTS } from "@Shared/constants/event";
import type { onDispachType } from "@Shared/type";

export function useAppDispatch() {
  const navigationController = {
    dispatch: ({ type, payload }: onDispachType) => {
      const customEvent = new CustomEvent(EVENTS.ON_BUILDER_DISPATCH, {
      detail: {
        type,
        payload
      }
    });
    if (window !== undefined) {
      window.document.dispatchEvent(customEvent);
    }
    },
  }

  return {
    navigationController
  }
}
