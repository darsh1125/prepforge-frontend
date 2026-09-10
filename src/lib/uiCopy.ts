export function humanStatus(status: string): string {
  const labels: Record<string, string> = { queued: "Queued", crawling_company: "Researching the company", researching_interview: "Researching interview signals", extracting_requirements: "Analyzing the job description", generating_questions: "Generating interview questions", checking_coverage: "Checking requirement coverage", filling_gaps: "Filling coverage gaps", generating_flashcards: "Creating flashcards", building_schedule: "Building your study schedule", validating: "Running final checks", completed: "Ready to review", completed_with_warnings: "Ready with research notes", failed: "Generation failed" };
  return labels[status] ?? status.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function humanError(code: string, fallback: string): string {
  const messages: Record<string, string> = { AUTH_INVALID_CREDENTIALS: "Email or password is incorrect.", INVALID_CREDENTIALS: "Email or password is incorrect.", SESSION_EXPIRED: "Your session has expired. Please sign in again.", KIT_VERSION_CONFLICT: "This kit changed in another tab. Refresh to load the latest version.", GENERATION_ALREADY_IN_PROGRESS: "Generation is already running for this kit.", ROLE_EXTRACTION_REQUIRED: "Analyze the job description before continuing.", PRACTICE_STATE_UPDATE_FAILED: "Could not save your confidence. Please try again." };
  return messages[code] ?? fallback;
}
