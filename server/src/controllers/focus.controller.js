import { createFocusSession } from "../services/focus/focus.service.js";

export const postFocusSession = async (req, res) => {
  const session = await createFocusSession({
    ...req.body,
    user: req.user._id
  });

  res.status(201).json({ session });
};

