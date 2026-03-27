import { FocusSession } from "../../models/FocusSession.js";

export const createFocusSession = async (payload) => {
  const focusScore = Math.max(
    0,
    100 - payload.tabSwitches * 8 - payload.inactivityEvents * 7 + payload.pomodoroCompleted * 6
  );

  return FocusSession.create({
    ...payload,
    focusScore
  });
};

