import { FormSections } from "@/components/form/form-section";

export default function MemberNotFound() {
    return (
        <div className="space-y-1 p-5">
          <h1 className="text-[30px]">Member</h1>
          <FormSections
            title="Not Found"
            description="The member cannot be found"
          />
        </div>
      );
}