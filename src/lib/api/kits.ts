import { apiRequest } from "./client";
import type { CreateKitInput, KitRecord } from "@/types/api";

export const listKits = () => apiRequest<{ kits: KitRecord[] }>("/api/kits");
export const getKit = (id: string) => apiRequest<{ kit: KitRecord }>(`/api/kits/${id}`);
export const createKit = (input: CreateKitInput) => apiRequest<{ kit: KitRecord }>("/api/kits", { method: "POST", body: input });
export const deleteKit = (id: string) => apiRequest<{ success: boolean }>(`/api/kits/${id}`, { method: "DELETE" });
export const researchInterview = (id: string) => apiRequest<{ research: NonNullable<KitRecord["research"]>["interview"] }>(`/api/kits/${id}/research/interview`, { method: "POST" });
