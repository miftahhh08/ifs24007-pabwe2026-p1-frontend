import { apiRequest } from "@/helpers/apiHelper";
import type {
  ChatReply, ChatStatus, GlucoseAdded, GlucoseContext, GlucoseLog, IdentifyResult,
  LabelResult, RiskInput, RiskResult,
} from "@/types";

export const calcLabel = (sugarPerServingG: number, servingsPerPack: number, consumedServings: number) =>
  apiRequest<LabelResult>("/api/label", { method: "POST", body: { sugarPerServingG, servingsPerPack, consumedServings } });

export const assessRisk = (input: RiskInput) =>
  apiRequest<RiskResult>("/api/risk", { method: "POST", body: input });

export const addGlucose = (value: number, context: GlucoseContext) =>
  apiRequest<GlucoseAdded>("/api/glucose", { method: "POST", body: { value, context } });

export const getGlucose = () => apiRequest<GlucoseLog[]>("/api/glucose");

export const deleteGlucose = (id: number) =>
  apiRequest<{ deleted: boolean }>(`/api/glucose/${id}`, { method: "DELETE" });

export const sendChat = (message: string) =>
  apiRequest<ChatReply>("/api/chat", { method: "POST", body: { message } });

export const identifyPhoto = (image: string, mediaType: string, filename = "", hint = "") =>
  apiRequest<IdentifyResult>("/api/foods/identify", { method: "POST", body: { image, mediaType, filename, hint } });

export const DEFAULT_CHAT_SUGGESTIONS = [
  "Berapa batas konsumsi gula sehari?",
  "Apa saja gejala diabetes?",
  "Berapa kandungan gula es teh manis?",
  "Bagaimana tips mencegah diabetes?",
];

export const getChatStatus = async (): Promise<ChatStatus> => {
  try {
    const raw = await apiRequest<{
      enabled?: boolean;
      provider?: string | null;
      mode?: "cloud" | "local" | "rules" | "ai";
      suggestions?: string[];
    }>("/api/ai/status");

    const isAi = raw.mode === "cloud" || raw.mode === "ai" || (Boolean(raw.provider) && raw.provider !== "local");
    return {
      mode: isAi ? "ai" : "rules",
      provider: raw.provider && raw.provider !== "local" ? raw.provider : null,
      suggestions: Array.isArray(raw.suggestions) && raw.suggestions.length > 0 ? raw.suggestions : DEFAULT_CHAT_SUGGESTIONS,
    };
  } catch {
    try {
      return await apiRequest<ChatStatus>("/api/chat/status");
    } catch {
      return {
        mode: "rules",
        provider: null,
        suggestions: DEFAULT_CHAT_SUGGESTIONS,
      };
    }
  }
};
