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
  Users,
  CalendarDays,
  FileText,
  Bus,
  BarChart2,
  Shield,
  ClipboardList
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Logo from "@/components/logo";
import { useUserSession } from "@/store/auth";
import useSchoolStore from "@/store/school";
import UserMenu from "./user-menu";
import { useLevelStore, SchoolLevel } from "@/store/level-store";

type SidebarItem = {
  title: string;
  url: string;
  icon?: any;
  isActive?: boolean;
  items?: { title: string; url: string; levels?: SchoolLevel[] }[];
  levels?: SchoolLevel[];
};

const sidebarLinks: {
  teams: { name: string; logo: any; plan: string }[];
  navMain: SidebarItem[];
  projects: { name: string; url: string; icon: any }[];
} = {
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
      url: "/dashboard",
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
        },
        {
          title: "Student Grades",
          url: "/dashboard/students/grades"
        },
        {
          title: "Student Schedule",
          url: "/dashboard/students/schedule"
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
          title: "Student Grades",
          url: "/demo/academic-system?tab=grades"
        },
        {
          title: "Student Schedule",
          url: "/demo/academic-system?tab=schedule"
        },
        {
          title: "Academic Portal",
          url: "/demo/academic-system"
        },
        {
          title: "Examinations",
          url: "/dashboard/examinations"
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
      title: "Attendance System",
      url: "/dashboard/attendance",
      icon: CalendarDays,
      items: [
        {
          title: "Student Attendance",
          url: "/dashboard/attendance/students"
        },
        {
          title: "Staff Attendance", 
          url: "/dashboard/attendance/staff"
        },
        {
          title: "Biometric System",
          url: "/dashboard/attendance/biometric"
        },
        {
          title: "Attendance Reports",
          url: "/dashboard/attendance/reports"
        },
        {
          title: "Late Arrivals",
          url: "/dashboard/attendance/late"
        },
        {
          title: "Absence Management",
          url: "/dashboard/attendance/absences"
        }
      ]
    },
    {
      title: "Financial Management",
      url: "/dashboard/finance",
      icon: DollarSign,
      items: [
        {
          title: "Fee Management",
          url: "/dashboard/finance"
        },
        {
          title: "Payment Records",
          url: "/dashboard/finance/payments"
        },
        {
          title: "Financial Reports",
          url: "/dashboard/finance/reports"
        },
        {
          title: "Outstanding Fees",
          url: "/dashboard/finance/outstanding"
        }
      ]
    },
    {
      title: "Transport Management",
      url: "/dashboard/transport",
      icon: Bus,
      items: [
        {
          title: "Routes & Vehicles",
          url: "/dashboard/transport"
        },
        {
          title: "Live Tracking",
          url: "/dashboard/transport/tracking"
        },
        {
          title: "Driver Management",
          url: "/dashboard/transport/drivers"
        },
        {
          title: "Maintenance",
          url: "/dashboard/transport/maintenance"
        }
      ]
    },
    {
      title: "Staff Management",
      url: "/dashboard/staff",
      icon: UserCog,
      items: [
        {
          title: "Staff Directory",
          url: "/dashboard/staff"
        },
        {
          title: "Performance Review",
          url: "/dashboard/staff/performance"
        },
        {
          title: "Payroll",
          url: "/dashboard/staff/payroll"
        },
        {
          title: "Leave Management",
          url: "/dashboard/staff/leave"
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
      title: "Communication Hub",
      url: "/dashboard/communication",
      icon: MessagesSquare,
      items: [
        {
          title: "Announcements",
          url: "/dashboard/announcements"
        },
        {
          title: "Notice Board",
          url: "/dashboard/announcements/board"
        },
        {
          title: "Messages",
          url: "/dashboard/communication/messages"
        },
        {
          title: "Notifications",
          url: "/dashboard/communication/notifications"
        }
      ]
    },
    {
      title: "Finance",
      url: "/dashboard/finance",
      icon: DollarSign,
      items: [
        {
          title: "Overview",
          url: "/dashboard/finance"
        },
        {
          title: "Student Fees",
          url: "/dashboard/finance/fees"
        },
        {
          title: "Invoicing",
          url: "/dashboard/finance/invoices"
        },
        {
          title: "Reports",
          url: "/dashboard/finance/reports"
        }
      ]
    },
    {
      title: "Analytics & Reports",
      url: "/dashboard/analytics",
      icon: BarChart2,
      items: [
        {
          title: "Performance Analytics",
          url: "/dashboard/analytics"
        },
        {
          title: "Academic Reports",
          url: "/dashboard/analytics/academic"
        },
        {
          title: "Financial Reports",
          url: "/dashboard/analytics/financial"
        },
        {
          title: "Custom Reports",
          url: "/dashboard/analytics/custom"
        }
      ]
    },
    {
      title: "Resource Management",
      url: "/dashboard/resources",
      icon: BookOpen,
      items: [
        {
          title: "Library",
          url: "/dashboard/resources"
        },
        {
          title: "Inventory",
          url: "/dashboard/resources/inventory"
        },
        {
          title: "Facility Booking",
          url: "/dashboard/resources/facilities"
        },
        {
          title: "Equipment",
          url: "/dashboard/resources/equipment"
        }
      ]
    },
    {
      title: "Security & Access",
      url: "/dashboard/security",
      icon: Shield,
      items: [
        {
          title: "User Roles",
          url: "/dashboard/security/roles"
        },
        {
          title: "Access Control",
          url: "/dashboard/security/access"
        },
        {
          title: "Audit Logs",
          url: "/dashboard/security/logs"
        },
        {
          title: "Data Backup",
          url: "/dashboard/security/backup"
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
      url: "/dashboard/settings",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "/dashboard/settings/general"
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
  const { school } = useSchoolStore();
  const [activeTeam, setActiveTeam] = React.useState(
    school 
      ? { name: school.name, logo: GalleryVerticalEnd, plan: "Enterprise" }
      : sidebarLinks.teams[0]
  );

  // Mettre à jour l'équipe active si l'école change (ex: après hydratation)
  React.useEffect(() => {
    if (school) {
      setActiveTeam({
        name: school.name,
        logo: GalleryVerticalEnd,
        plan: "Enterprise"
      });
    }
  }, [school]);

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
