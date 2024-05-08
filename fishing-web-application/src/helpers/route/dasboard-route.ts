import { AccountTypeIcon } from "@/icons/account-type-icon"
import { MembersIcon } from "@/icons/member-icon"
import { BookmarkIcon } from "@/icons/sidebar-icons/bookmark-icon"
import { DashboardIcon } from "@/icons/sidebar-icons/dashboard-icon"
import { FishIcon } from "@/icons/sidebar-icons/fish-icon"
import { HomeIcon } from "@/icons/sidebar-icons/home-icon"
import { MapIcon } from "@/icons/sidebar-icons/map-icon"
import { UserRole} from "@prisma/client"

type RouteType = {
    href: string
    title: string
    icon: React.JSX.ElementType
    role: UserRole[]
    access: {[index: string]:any}
}

const dashboard: RouteType = {
    href: "/dashboard",
    title: "Dashboard",
    icon: DashboardIcon,
    role:  ["OPERATOR", "USER", "INSPECTOR"],
    access: {
        
    }
}

const logBook: RouteType = {
    href: "/logbook",
    title: "Logbook",
    icon: BookmarkIcon,
    role:  ["USER"],
    access: {
        accessToLogbook: true
    }
}

const authority : RouteType = {
    href: "/authority",
    title: "Authority",
    icon: HomeIcon,
    role:  ["OPERATOR", "INSPECTOR"],
    access: {
        accessToAuthority: true
    }
}

const catches : RouteType = {
    href: "/catch",
    title: "Catch",
    icon: FishIcon,
    role:  ["OPERATOR", "INSPECTOR"],
    access: {
        accessToLogbook: true
    }
}

const member : RouteType = {
    href: "/member",
    title: "Member",
    icon: MembersIcon,
    role:  ["OPERATOR", "INSPECTOR"],
    access: {
        accessToLogbook: true
    }
}

const map : RouteType = {
    href: "/map",
    title: "Map",
    icon: MapIcon,
    role:  ["OPERATOR", "INSPECTOR", "USER"],
    access:{}
}


export const defaultRoutes: RouteType[] = [
    dashboard,
]

export const mainMenuRoutes: RouteType[] = [
    logBook, authority, catches, member, map
]