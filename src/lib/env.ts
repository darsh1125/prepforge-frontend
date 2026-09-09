export function getPublicApiUrl(): string {
  const value = process.env.NEXT_PUBLIC_API_URL;
  if (value && value.trim().length > 0) {
    return value.replace(/\/$/, "");
  }
  return "http://localhost:5000";
}
