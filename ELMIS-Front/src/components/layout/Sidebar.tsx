import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  Users,
  Clock,
  Megaphone,
  BarChart3,
  Menu,
  X,
  Star,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/authStore';
import { cn } from '@/lib/utils';

interface SidebarItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: ('admin' | 'operator')[];
}

const sidebarItems: SidebarItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    roles: ['admin', 'operator'],
  },
  {
    title: 'Books',
    href: '/books',
    icon: BookOpen,
    roles: ['admin', 'operator'],
  },
  {
    title: 'Employees',
    href: '/employees',
    icon: Users,
    roles: ['admin'],
  },
  {
    title: 'Rentals',
    href: '/rentals',
    icon: Clock,
    roles: ['admin', 'operator'],
  },
  {
    title: 'Reviews',
    href: '/reviews',
    icon: Star,
    roles: ['admin', 'operator'],
  },
  {
    title: 'Announcements',
    href: '/announcements',
    icon: Megaphone,
    roles: ['admin'],
  },
  {
    title: 'Reports',
    href: '/reports',
    icon: BarChart3,
    roles: ['admin'],
  },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useAuthStore();
  const location = useLocation();

  const filteredItems = sidebarItems.filter(item => 
    user && item.roles.includes(user.role)
  );

  const toggleSidebar = () => setCollapsed(!collapsed);

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ 
        x: 0, 
        opacity: 1,
        width: collapsed ? 80 : 256
      }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className={cn(
        "relative h-screen border-r border-border/40 glass backdrop-blur-xl flex flex-col",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Toggle Button */}
      <div className="flex justify-end p-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="hover-glow"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 pb-4">
        <ul className="space-y-2">
          {filteredItems.map((item, index) => {
            const isActive = location.pathname === item.href;
            
            return (
              <motion.li
                key={item.href}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <NavLink
                  to={item.href}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 group",
                      isActive
                        ? "bg-primary text-primary-foreground glow-primary"
                        : "hover:bg-secondary/80 hover-glow"
                    )
                  }
                >
                  <item.icon className={cn(
                    "h-5 w-5 transition-all duration-200",
                    isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"
                  )} />
                  
                  <AnimatePresence>
                    {!collapsed && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.2 }}
                        className="font-medium"
                      >
                        {item.title}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </NavLink>
              </motion.li>
            );
          })}
        </ul>
      </nav>

      {/* User Info */}
      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4 border-t border-border/40"
          >
            <div className="flex items-center space-x-3 p-2 rounded-lg bg-secondary/20">
              <div className="h-8 w-8 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-bold">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user?.name}</p>
                <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.aside>
  );
}