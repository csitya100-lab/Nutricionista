import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Calendar as CalendarIcon, 
  Settings, 
  LogOut,
  Flower,
  MessageCircle,
  Menu
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onNavigate: (tab: string) => void;
  onLogout: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, onNavigate, onLogout }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Visão Geral', icon: LayoutDashboard },
    { id: 'patients', label: 'Pacientes', icon: Users },
    { id: 'calendar', label: 'Agenda', icon: CalendarIcon },
    { id: 'messages', label: 'Mensagens', icon: MessageCircle },
  ];

  return (
    <div className="flex h-screen bg-rose-50 overflow-hidden">
      {/* Sidebar - Desktop */}
      <aside className={`
        hidden md:flex flex-col w-64 h-full 
        bg-gradient-to-b from-[#722F37] via-[#903c4c] to-[#fda4af] 
        text-white shadow-xl transition-all duration-300
      `}>
        <div className="p-6 flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-full">
            <Flower size={28} className="text-rose-100" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">Maíra Penna</h1>
            <p className="text-xs text-rose-200 uppercase tracking-wider">Nutrição Feminina</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                ${activeTab === item.id 
                  ? 'bg-white/20 text-white shadow-lg backdrop-blur-sm font-semibold' 
                  : 'text-rose-100 hover:bg-white/10 hover:text-white'}
              `}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 mt-auto">
          <button 
            onClick={() => onNavigate('settings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'settings' ? 'bg-white/20 text-white font-semibold' : 'text-rose-100 hover:bg-white/10'}`}
          >
            <Settings size={20} />
            <span>Configurações</span>
          </button>
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-rose-200 hover:text-white mt-1 transition-colors"
          >
            <LogOut size={20} />
            <span>Sair</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header & Content Wrapper */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden bg-wine-600 text-white p-4 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2">
            <Flower size={24} />
            <span className="font-bold">Maíra Penna Nutri</span>
          </div>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            <Menu size={24} />
          </button>
        </header>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-14 left-0 w-full bg-wine-700 z-50 p-4 shadow-xl text-white">
            <nav className="space-y-2">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 rounded-lg"
                >
                  <item.icon size={20} />
                  <span>{item.label}</span>
                </button>
              ))}
               <button
                  onClick={() => {
                    onNavigate('settings');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 rounded-lg border-t border-white/10 mt-2"
                >
                  <Settings size={20} />
                  <span>Configurações</span>
                </button>
                <button
                  onClick={onLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-rose-200 hover:text-white"
                >
                  <LogOut size={20} />
                  <span>Sair</span>
                </button>
            </nav>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};