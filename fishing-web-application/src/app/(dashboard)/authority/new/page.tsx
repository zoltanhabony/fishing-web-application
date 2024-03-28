import { FormSections } from "@/components/form-section";
import { CreateAuthorityForm } from "@/components/new-authority-form";
import { Card, CardBody, CardHeader} from "@nextui-org/react";

export default function CreateAuthorityPage () {
    return (
              <div className="w-full mobile:items-center sm:items-start h-max-full flex flex-col p-5 rounded-xl space-y-3">
                <Card className="w-full mobile:w-[450px] flex flex-col justify-center items-center shadow-none bg-transparent">
                  <CardHeader className="mobile:block flex flex-col mobile:justify-between mobile:items-center">
                    <h1 className="text-[30px]">Create New Authority</h1>
                  </CardHeader>
                  <CardBody>
                    <div className="space-y-1">
                      <FormSections
                        title="New Authority"
                        description="The following fields are required. These data will be necessary to identify the associations and to create the digital catch logbook"
                      />
                    </div>
                    <CreateAuthorityForm/>
                  </CardBody>
                </Card>
              </div>
          
    )
}