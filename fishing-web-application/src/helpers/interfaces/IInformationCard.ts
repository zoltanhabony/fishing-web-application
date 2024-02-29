import { SVGProps} from "react"

interface InformationCardProps {
    status?: string
    title?: string
    subtitle?:string
    description?:string
    icon?: SVGProps<SVGSVGElement>
}

export default InformationCardProps