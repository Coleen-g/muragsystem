import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import SplashScreen from './src/screens/SplashScreen';
import useAuthStore from './src/store/authStore';
import useThemeStore from './src/store/themeStore';

export default function App() {
  const [splashDone, setSplashDone] = useState(false);
  const { loadAuth } = useAuthStore();
  const { loadTheme } = useThemeStore(); 

  useEffect(() => {
    loadAuth();
    loadTheme();
  }, []);

  return (
    <>
      <NavigationContainer>
        {splashDone && <AppNavigator />}
      </NavigationContainer>

      {!splashDone && (
        <SplashScreen
          duration={3000}
          onComplete={() => setSplashDone(true)}
        />
      )}
    </>
  );
}