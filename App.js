import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { onAuthStateChanged } from 'firebase/auth'; // Listener
import { auth } from './src/firebaseConfig';

// Import Screens
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import InputScreen from './src/screens/InputScreen';
import LobbyScreen from './src/screens/LobbyScreen';
import ResultScreen from './src/screens/ResultScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import HistoryDetailScreen from './src/screens/HistoryDetailScreen';
import OfflineInputScreen from './src/screens/OfflineInputScreen';

const Stack = createStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Listen for login/logout events
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) return null; // Or a loading spinner

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          // --- AUTHENTICATED STACK (App) ---
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Input" component={InputScreen} />
            <Stack.Screen name="Lobby" component={LobbyScreen} />
            <Stack.Screen name="Result" component={ResultScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="History" component={HistoryScreen} />
            <Stack.Screen name="HistoryDetail" component={HistoryDetailScreen} />
            <Stack.Screen name="OfflineInput" component={OfflineInputScreen} />
          </>
        ) : (
          // --- GUEST STACK (Login) ---
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}