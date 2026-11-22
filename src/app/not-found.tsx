import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="py-20 text-center">
      <h1 className="text-2xl font-bold">Not found</h1>
      <p className="mt-2 text-slate-600">This demo record does not exist.</p>
      <div className="mt-6">
        <ButtonLink href="/">Back home</ButtonLink>
      </div>
    </div>
  );
}
