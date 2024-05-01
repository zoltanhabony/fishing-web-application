import { Avatar } from '@nextui-org/react'
import Image from 'next/image'

interface UserCardProps {
    imgUrl: string
    firstName: string
    lastName: string
    userRole: string
}

export const UserCard = (props: UserCardProps) => {
    return (
        

<div className="w-full bg-default-50 rounded-xl shadow">
    <div className="flex flex-col items-center justify-center p-4 min-h-[200px]"> 
    <Avatar
            name={props.firstName + props.lastName}
            isBordered
            color="default"
            src={props.imgUrl}
            className="h-[70px] w-[70px]"
          />
        <h4 className="pt-3 font-medium text-gray-900 dark:text-white">{props.firstName + " " + props.lastName}</h4>
        <span className="text-xs text-gray-500 dark:text-gray-400">{props.userRole}</span>
    </div>
</div>
)
} 