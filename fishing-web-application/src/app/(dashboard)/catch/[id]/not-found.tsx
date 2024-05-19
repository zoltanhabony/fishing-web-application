import { FormSections } from "@/components/form/form-section";

export default function CatchNotFound() {
    return (
        <div className="space-y-1 p-5">
          <h1 className="text-[30px]">Catch</h1>
          <FormSections
            title="Not Found"
            description="The catch cannot be found"
          />
        </div>
      );
}

