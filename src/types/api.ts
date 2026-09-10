export type HealthResponse = {
  status: string;
};

export type ApiErrorBody = {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
};

export type RequirementKind = "technical" | "behavioural" | "domain";
export type RequirementPriority = "must" | "nice";
export type QuestionCategory =
  | "technical"
  | "behavioural"
  | "system-design"
  | "company-fit";

export type Source = {
  company: string;
  company_url: string;
  role: string;
  location: string;
  jd_chars: number;
  researched_at: string;
  pages_used: string[];
};

export type CompanyBrief = {
  summary: string;
  what_they_do: string;
  sources: string[];
};

export type Requirement = {
  id: string;
  text: string;
  kind: RequirementKind;
  priority: RequirementPriority;
};

export type Role = {
  title: string;
  seniority: string;
  responsibilities: string[];
  requirements: Requirement[];
};

export type Question = {
  id: string;
  requirement_ids: string[];
  category: QuestionCategory;
  prompt: string;
  answer_outline: string;
  difficulty: number;
};

export type Flashcard = {
  id: string;
  front: string;
  back: string;
  requirement_ids: string[];
};

export type ScheduleDay = {
  day: number;
  focus: string;
  question_ids: string[];
  minutes: number;
};

export type Schedule = {
  days_available: number;
  days: ScheduleDay[];
};

export type Coverage = {
  uncovered_requirement_ids: string[];
  passes: number;
};

/** Evaluator Appendix A kit. Backend remains the source of truth. */
export type InterviewKit = {
  source: Source;
  company_brief: CompanyBrief;
  role: Role;
  questions: Question[];
  flashcards: Flashcard[];
  schedule: Schedule;
  coverage: Coverage;
};

export type CreateKitInput = {
  jd: string;
  company_url: string;
  days: number;
};

export type SafeUser = { id: string; email: string };
export type KitRecord = {
  id: string;
  input: CreateKitInput;
  status: string;
  progress: { stage: string; percent: number; message: string };
  warnings: { code: string; message: string }[];
  kit: InterviewKit | null;
  createdAt: string;
  updatedAt: string;
  research?: {
    interview?: InterviewResearchResult;
  } | null;
};

export type InterviewResearchResult = {
  queries: string[];
  sources: { sourceId: string; title: string; url: string; domain: string; sourceType: string; authority: string; snippet: string; relevanceScore: number }[];
  warnings: { code: string; message: string; url?: string }[];
  metadata: { sourceCount: number; successfulFetches: number; failedFetches: number };
};
