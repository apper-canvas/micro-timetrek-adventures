import { Outlet, useLocation, NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Layout = () => {
  const location = useLocation();
  
  const navigationItems = [
    { path: '/home', icon: 'Clock', label: 'Time Machine' },
    { path: '/journal', icon: 'BookOpen', label: 'Journal' },
    { path: '/settings', icon: 'Settings', label: 'Settings' }
  ];

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      {/* Main content area */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
      
      {/* Bottom navigation for mobile/tablet */}
      <nav className="flex-shrink-0 bg-white border-t-2 border-primary/20 z-40">
        <div className="flex justify-around items-center py-2 px-4">
          {navigationItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center p-2 min-h-[48px] rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-primary text-white scale-105'
                    : 'text-surface-600 hover:bg-primary/10 hover:text-primary'
                }`
              }
            >
              {({ isActive }) => (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex flex-col items-center"
                >
                  <ApperIcon 
                    name={item.icon} 
                    size={24} 
                    className={isActive ? 'text-white' : ''}
                  />
                  <span className="text-xs font-medium mt-1 font-sans">
                    {item.label}
                  </span>
                </motion.div>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default Layout;