import { Spinner } from "@/components/ui/states";

export default function Loading() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-5">
      <Spinner className="h-8 w-8" />
      <p className="eyebrow text-muted">Loading</p>
    </div>
  );
}
