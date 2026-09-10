import { apiRequest } from "./client";
import type { CreateKitInput, KitRecord, JDExtractionResult, GeneratedQuestion, CoverageResult, Flashcard, Schedule } from "@/types/api";

export const listKits = () => apiRequest<{ kits: KitRecord[] }>("/api/kits");
export const getKit = (id: string) => apiRequest<{ kit: KitRecord }>(`/api/kits/${id}`);
export const createKit = (input: CreateKitInput) => apiRequest<{ kit: KitRecord }>("/api/kits", { method: "POST", body: input });
export const deleteKit = (id: string) => apiRequest<{ success: boolean }>(`/api/kits/${id}`, { method: "DELETE" });
export const researchInterview = (id: string) => apiRequest<{ research: NonNullable<KitRecord["research"]>["interview"] }>(`/api/kits/${id}/research/interview`, { method: "POST" });
export const extractKit = (id: string) => apiRequest<{ extraction: JDExtractionResult }>(`/api/kits/${id}/extract`, { method: "POST" });
export const generateQuestions = (id: string) => apiRequest<{ questions: GeneratedQuestion[]; warnings: { code: string; message: string }[]; coverage: CoverageResult }>(`/api/kits/${id}/generate/questions`, { method: "POST" });
export const generateFlashcards = (id: string) => apiRequest<{ flashcards: Flashcard[]; warnings: { code: string; message: string }[] }>(`/api/kits/${id}/generate/flashcards`, { method: "POST" });
export const generateSchedule = (id: string) => apiRequest<{ schedule: Schedule }>(`/api/kits/${id}/generate/schedule`, { method: "POST" });
export const generateKit = (id: string) => apiRequest<{ kit: KitRecord }>(`/api/kits/${id}/generate`, { method: "POST" });
