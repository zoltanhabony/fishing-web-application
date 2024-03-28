import { BookmarkIcon } from "@/icons/sidebar-icons/bookmark-icon"
import { DashboardIcon } from "@/icons/sidebar-icons/dashboard-icon"
import { HomeIcon } from "@/icons/sidebar-icons/home-icon"
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
    role:  ["OPERATOR", "USER", "INSPECTOR"],
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


export const defaultRoutes: RouteType[] = [
    dashboard,
]

export const mainMenuRoutes: RouteType[] = [
    logBook, authority
]