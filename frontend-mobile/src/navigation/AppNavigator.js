import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native'; // not needed
import useAuthStore from '../store/authStore';

import LoginScreen          from '../screens/LoginScreen';
import RegisterScreen       from '../screens/RegisterScreen';
import AddCaseScreen        from '../screens/AddCaseScreen';
import CaseDetail           from '../screens/CaseDetail';
import BottomTabNavigator   from './BottomTabNavigator';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { token } = useAuthStore();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {token ? (
        // ✅ Logged in — show app screens
        <>
          <Stack.Screen name="Dashboard"  component={BottomTabNavigator} />
          <Stack.Screen name="AddCase"    component={AddCaseScreen} />
          <Stack.Screen name="CaseDetail" component={CaseDetail} />
        </>
      ) : (
        // ✅ Not logged in — show auth screens
        <>
          <Stack.Screen name="Login"          component={LoginScreen} />
          <Stack.Screen name="Register"       component={RegisterScreen} />
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}