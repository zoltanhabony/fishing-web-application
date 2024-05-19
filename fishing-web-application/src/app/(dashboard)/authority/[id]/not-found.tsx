import { FormSections } from "@/components/form/form-section";

export default function AuthorityNotFound() {
  return (
    <div className="space-y-1 p-5">
      <h1 className="text-[30px]">Authority</h1>
      <FormSections
        title="Not Found"
        description="The authority cannot be found"
      />
    </div>
  );
}
