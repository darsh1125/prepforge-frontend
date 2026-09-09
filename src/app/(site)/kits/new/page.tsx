import { NewKitForm } from "@/features/kits/NewKitForm";

export default function NewKitPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Create a kit</h1>
      <p className="text-slate-700">
        Paste a job description, company URL, and how many days you have (1–60). Generation is not
        wired yet.
      </p>
      <NewKitForm />
    </div>
  );
}
