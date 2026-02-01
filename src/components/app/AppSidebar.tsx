import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  LayoutDashboard, 
  Users2, 
  Sparkles, 
  RefreshCw, 
  Settings, 
  Bot,
  ChevronLeft,
  ChevronRight,
  Pickaxe
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent,
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton,
  SidebarHeader,
  SidebarFooter,
  useSidebar
} from '@/components/ui/sidebar';

const mainNavItems = [
  { 
    title: 'Dashboard', 
    path: '/app/dashboard', 
    icon: LayoutDashboard,
    translationKey: 'nav.dashboard'
  },
  { 
    title: 'Doublons', 
    path: '/app/duplicates', 
    icon: Users2,
    translationKey: 'nav.duplicates'
  },
  { 
    title: 'Enrichissement', 
    path: '/app/enrichment', 
    icon: Sparkles,
    translationKey: 'nav.enrichment'
  },
  { 
    title: 'Réactivation', 
    path: '/app/reactivation', 
    icon: RefreshCw,
    translationKey: 'nav.reactivation'
  },
];

const bottomNavItems = [
  { 
    title: 'Paramètres', 
    path: '/app/settings', 
    icon: Settings,
    translationKey: 'nav.settings'
  },
];

export function AppSidebar() {
  const location = useLocation();
  const { t } = useTranslation();
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === 'collapsed';

  const isActive = (path: string) => location.pathname === path;

  return (
    <Sidebar 
      className="border-r border-sidebar-border bg-sidebar"
      collapsible="icon"
    >
      <SidebarHeader className="p-4">
        <Link to="/app/dashboard" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center shrink-0">
            <Pickaxe className="w-5 h-5 text-primary-foreground" />
          </div>
          {!isCollapsed && (
            <span className="font-display text-xl font-bold text-sidebar-foreground">
              Kleant
            </span>
          )}
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.path)}
                    tooltip={isCollapsed ? item.title : undefined}
                  >
                    <Link 
                      to={item.path}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                        isActive(item.path) 
                          ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" 
                          : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                      )}
                    >
                      <item.icon className="w-5 h-5 shrink-0" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Agent Status Mini Card */}
        {!isCollapsed && (
          <div className="mx-2 mt-4 p-3 rounded-lg bg-sidebar-accent/50 border border-sidebar-border">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
              <span className="text-xs font-medium text-sidebar-foreground">Agent IA actif</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-sidebar-foreground/60">
              <Bot className="w-3.5 h-3.5" />
              <span>Dernier scan : 08h00</span>
            </div>
          </div>
        )}
        {isCollapsed && (
          <div className="mx-auto mt-4 w-8 h-8 rounded-lg bg-sidebar-accent/50 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
          </div>
        )}
      </SidebarContent>

      <SidebarFooter className="p-2">
        <SidebarMenu>
          {bottomNavItems.map((item) => (
            <SidebarMenuItem key={item.path}>
              <SidebarMenuButton
                asChild
                isActive={isActive(item.path)}
                tooltip={isCollapsed ? item.title : undefined}
              >
                <Link 
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                    isActive(item.path) 
                      ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" 
                      : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                  )}
                >
                  <item.icon className="w-5 h-5 shrink-0" />
                  {!isCollapsed && <span>{item.title}</span>}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>

        {/* Collapse Toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleSidebar}
          className="mt-2 w-full justify-center text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4 mr-2" />
              <span className="text-xs">Réduire</span>
            </>
          )}
        </Button>

        {/* User Profile */}
        {!isCollapsed && (
          <div className="mt-2 p-3 rounded-lg bg-sidebar-accent/30 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center shrink-0">
              <span className="text-xs font-bold text-primary-foreground">JD</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">Jean Dupont</p>
              <p className="text-xs text-sidebar-foreground/60 truncate">Admin</p>
            </div>
          </div>
        )}
        {isCollapsed && (
          <div className="mx-auto mt-2 w-8 h-8 rounded-full gradient-primary flex items-center justify-center">
            <span className="text-xs font-bold text-primary-foreground">JD</span>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
