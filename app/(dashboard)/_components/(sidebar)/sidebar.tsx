import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import {
  Bell
} from "lucide-react"
import { SidebarRoutes } from "./sidebar-routes"
export const SideBar = () => {
  return (
    <div className="hidden border-r bg-muted/40 md:block backdrop-blur-sm duration-1000 animate-in slide-in-from-left-12">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Logo />
          <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
            <Bell className="h-4 w-4" />
            <span className="sr-only">Toggle notifications</span>
          </Button>
        </div>
        <div className="flex-1">
          <SidebarRoutes />
        </div>
      </div>
    </div>
  )
}