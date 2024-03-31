import { Router } from 'expo-router';
import { Portal, FAB } from 'react-native-paper';

export function FloatingMenu({
  setIsMenuOpen,
  isMenuOpen,
  pathname,
  router,
}: {
  setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isMenuOpen: boolean;
  pathname: string;
  router: Router;
}) {
  return (
    <Portal>
      <FAB.Group
        open={isMenuOpen}
        onStateChange={({ open }) => setIsMenuOpen(open)}
        visible
        icon={isMenuOpen ? 'dots-horizontal' : 'menu'}
        actions={[
          {
            icon: 'handshake-outline',
            label: 'On loan',
            onPress: () =>
              pathname !== '/home' ? router.navigate('/home') : null,
          },
          {
            icon: 'clipboard-list-outline',
            label: 'My things',
            onPress: () =>
              pathname !== '/inventory' ? router.navigate('/inventory') : null,
          },
          {
            icon: 'account-supervisor-outline',
            label: 'Borrowers',
            onPress: () =>
              pathname !== '/borrowers' ? router.navigate('/borrowers') : null,
          },
          {
            icon: 'cog-outline',
            label: 'Settings',
            onPress: () =>
              pathname !== '/settings' ? router.navigate('/settings') : null,
          },
        ]}
      />
    </Portal>
  );
}
