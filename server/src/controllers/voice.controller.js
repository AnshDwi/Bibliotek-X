import { buildVoiceResponse } from "../services/voice/voice.service.js";

export const postVoiceDoubt = async (req, res) => {
  const response = await buildVoiceResponse(req.body);
  res.json(response);
};

