"use client";
import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "@/components/ui/collapsible";
import {
  ArrowRight,
  AudioWaveform,
  BadgeCheck,
  Bell,
  BookOpen,
  Bot,
  ChevronRight,
  ChevronsUpDown,
  Command,
  CreditCard,
  DollarSign,
  Folder,
  Forward,
  Frame,
  GalleryVerticalEnd,
  GraduationCap,
  Key,
  LayoutDashboard,
  LogOut,
  Map,
  MessagesSquare,
  MoreHorizontal,
  Package,
  PieChart,
  Plus,
  Settings2,
  ShoppingCart,
  Sparkles,
  SquareTerminal,
  Trash2,
  User,
  UserCog,
  Users
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Logo from "@/components/logo";
import { useUserSession } from "@/store/auth";
import UserMenu from "./user-menu";

const sidebarLinks = {
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise"
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup"
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free"
    }
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Overview",
          url: "/dashboard/overview"
        }
      ]
    },
    {
      title: "Student Management",
      url: "/dashboard/students",
      icon: Users,
      items: [
        {
          title: "Student Directory",
          url: "/dashboard/students"
        },
        {
          title: "Fees",
          url: "/dashboard/students/fees"
        },
        {
          title: "Student Ids",
          url: "/dashboard/students/ids"
        },
        {
          title: "Attendance",
          url: "/dashboard/students/attendance"
        }
      ]
    },
    {
      title: "Academics",
      url: "/dashboard/academics",
      icon: GraduationCap,
      items: [
        {
          title: "Classes and Sections",
          url: "/dashboard/academics/classes"
        },
        {
          title: "Subjects",
          url: "/dashboard/academics/subjects"
        },
        {
          title: "Departments",
          url: "/dashboard/academics/departments"
        },
        {
          title: "TimeTable",
          url: "/dashboard/academics/timetable"
        },
        {
          title: "Examinations",
          url: "/dashboard/academics/examinations"
        },
        {
          title: "Assignments",
          url: "/dashboard/academics/assignements"
        },
        {
          title: "Report Cards",
          url: "/dashboard/academics/report"
        }
      ]
    },
    {
      title: "Staff Management",
      url: "#",
      icon: UserCog,
      items: [
        {
          title: "General",
          url: "#"
        },
        {
          title: "Team",
          url: "#"
        },
        {
          title: "Billing",
          url: "#"
        },
        {
          title: "Limits",
          url: "#"
        }
      ]
    },
    {
      title: "Users",
      url: "/user",
      icon: Users,
      items: [
        {
          title: "Parent",
          url: "/dashboard/users/parents"
        },
        {
          title: "Teacher",
          url: "/dashboard/users/teachers"
        },
        {
          title: "Secretary",
          url: "/dashboard/users/secretary"
        }
      ]
    },
    {
      title: "Communication",
      url: "/",
      icon: MessagesSquare,
      items: [
        {
          title: "General",
          url: "/communication/"
        },
        {
          title: "Team",
          url: "/communication/"
        },
        {
          title: "Billing",
          url: "/communication/"
        },
        {
          title: "Limits",
          url: "#"
        }
      ]
    },
    {
      title: "Finance",
      url: "#",
      icon: DollarSign,
      items: [
        {
          title: "General",
          url: "/finance/"
        },
        {
          title: "Team",
          url: "/finance/"
        },
        {
          title: "Billing",
          url: "/finance/"
        },
        {
          title: "Limits",
          url: "/finance/"
        }
      ]
    },

    {
      title: "Ressources",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#"
        },
        {
          title: "Team",
          url: "#"
        },
        {
          title: "Billing",
          url: "#"
        },
        {
          title: "Limits",
          url: "#"
        }
      ]
    },
    {
      title: "Reports & Analytics",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#"
        },
        {
          title: "Team",
          url: "#"
        },
        {
          title: "Billing",
          url: "#"
        },
        {
          title: "Limits",
          url: "#"
        }
      ]
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#"
        },
        {
          title: "Team",
          url: "#"
        },
        {
          title: "Billing",
          url: "#"
        },
        {
          title: "Limits",
          url: "#"
        }
      ]
    },
    {
      title: "Admin only",
      url: "/dashboard/admin",
      icon: Key,
      items: [
        {
          title: "Contacts",
          url: "/dashboard/admin/contacts"
        }
      ]
    }
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart
    },
    {
      name: "Travel",
      url: "#",
      icon: Map
    }
  ]
};
export default function AppSidebar() {
  const [activeTeam, setActiveTeam] = React.useState(sidebarLinks.teams[0]);
  const { user: data } = useUserSession();
  const user = {
    name: data?.name,
    email: data?.email,
    avatar: data?.image ?? "/avatars/shadcn.jpg"
  };
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Logo />

                  <ChevronsUpDown className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                align="start"
                side="bottom"
                sideOffset={4}
              >
                <DropdownMenuLabel className="text-xs text-muted-foreground">
                  Teams
                </DropdownMenuLabel>
                {sidebarLinks.teams.map((team, index) => (
                  <DropdownMenuItem
                    key={team.name}
                    onClick={() => setActiveTeam(team)}
                    className="gap-2 p-2"
                  >
                    <div className="flex size-6 items-center justify-center rounded-sm border">
                      <team.logo className="size-4 shrink-0" />
                    </div>
                    {team.name}
                    <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem className="gap-2 p-2">
                  <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                    <Plus className="size-4" />
                  </div>
                  <div className="font-medium text-muted-foreground">
                    Add team
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Enseignants</SidebarGroupLabel>
          <SidebarMenu>
            {sidebarLinks.navMain.map((item) => (
              <Collapsible
                key={item.title}
                asChild
                defaultOpen={item.isActive}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={item.title}>
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items?.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton asChild>
                            <a href={subItem.url}>
                              <span>{subItem.title}</span>
                            </a>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            ))}
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
          <SidebarGroupLabel>Elèves</SidebarGroupLabel>
          <SidebarMenu>
            {sidebarLinks.projects.map((item) => {
              const Icon = item.icon;
              return (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <Icon />
                      <span>{item.name}</span>
                    </a>
                  </SidebarMenuButton>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <SidebarMenuAction showOnHover>
                        <MoreHorizontal />
                        <span className="sr-only">More</span>
                      </SidebarMenuAction>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="w-48 rounded-lg"
                      side="bottom"
                      align="end"
                    >
                      <DropdownMenuItem>
                        <Folder className="text-muted-foreground" />
                        <span>View Project</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Forward className="text-muted-foreground" />
                        <span>Share Project</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Trash2 className="text-muted-foreground" />
                        <span>Delete Project</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </SidebarMenuItem>
              );
            })}
            <SidebarMenuItem>
              <SidebarMenuButton className="text-sidebar-foreground/70">
                <MoreHorizontal className="text-sidebar-foreground/70" />
                <span>Cours</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <UserMenu />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
