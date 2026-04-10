import Sidebar from './Sidebar';
import TopBar from './TopBar';
import { theme } from '../styles/theme';

export default function MainLayout({ children, active, isActive }) {
  return (
    <div style={{ background: theme.colors.bg, minHeight: '100vh' }}>
      <Sidebar active={active} />
      <TopBar isActive={isActive} />
      <main style={{ marginLeft: '64px', marginTop: '60px', padding: '24px' }}>
        {children}
      </main>
    </div>
  );
}
