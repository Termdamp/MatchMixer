import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
// Import the new loginGuest function
import { loginUser, registerUser, loginGuest } from '../services/authService';

export default function LoginScreen({ navigation }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }
    setLoading(true);
    try {
      if (isRegistering) {
        if (!username) {
            Alert.alert("Error", "Please enter a username.");
            setLoading(false);
            return;
        }
        await registerUser(email, password, username);
      } else {
        await loginUser(email, password);
      }
    } catch (error) {
      setLoading(false);
      const cleanMsg = error.message.replace("Firebase: ", "");
      Alert.alert("Auth Error", cleanMsg);
    }
  };

  // --- NEW HANDLER FOR GUEST ---
  const handleGuest = async () => {
    setLoading(true);
    try {
      await loginGuest();
      // App.js will detect the change and switch to Home automatically
    } catch (error) {
      setLoading(false);
      Alert.alert("Error", "Could not sign in as guest.");
    }
  };

  return (
    <LinearGradient colors={['#4c669f', '#3b5998', '#192f6a']} style={styles.container}>
      
      <View style={styles.card}>
        <View style={styles.iconCircle}>
            <Ionicons name="lock-closed" size={40} color="#3b5998" />
        </View>

        <Text style={styles.title}>{isRegistering ? "Create Account" : "Welcome Back"}</Text>

        {isRegistering && (
          <View style={styles.inputBox}>
            <Ionicons name="person" size={20} color="#666" style={{marginRight: 10}} />
            <TextInput 
              placeholder="Username" 
              style={styles.input} 
              value={username} 
              onChangeText={setUsername} 
            />
          </View>
        )}

        <View style={styles.inputBox}>
          <Ionicons name="mail" size={20} color="#666" style={{marginRight: 10}} />
          <TextInput 
            placeholder="Email Address" 
            style={styles.input} 
            value={email} 
            onChangeText={setEmail} 
            
            // --- NEW: AUTOFILL TAGS ---
            keyboardType="email-address"    // Shows '@' on keyboard
            autoCapitalize="none"           // No auto-caps
            autoComplete="email"            // Android Autofill Hint
            textContentType="emailAddress"  // iOS Autofill Hint
          />
        </View>

        <View style={styles.inputBox}>
          <Ionicons name="key" size={20} color="#666" style={{marginRight: 10}} />
          <TextInput 
            placeholder="Password" 
            style={styles.input} 
            value={password} 
            onChangeText={setPassword} 
            secureTextEntry
            
            // --- NEW: AUTOFILL TAGS ---
            autoComplete="password"       // Android Autofill Hint
            textContentType="password"    // iOS Autofill Hint
          />
        </View>

        {loading ? (
           <ActivityIndicator size="large" color="#3b5998" style={{marginTop: 20}} />
        ) : (
           <View style={{width: '100%'}}>
             {/* Main Login Button */}
             <TouchableOpacity style={styles.primaryBtn} onPress={handleAuth}>
               <Text style={styles.btnText}>{isRegistering ? "Sign Up" : "Log In"}</Text>
             </TouchableOpacity>
             
             {/* --- NEW GUEST BUTTON --- */}
             <TouchableOpacity style={styles.guestBtn} onPress={handleGuest}>
               <Text style={styles.guestText}>Try as Guest</Text>
             </TouchableOpacity>
           </View>
        )}

        <TouchableOpacity onPress={() => setIsRegistering(!isRegistering)} style={{marginTop: 20}}>
          <Text style={styles.linkText}>
            {isRegistering ? "Already have an account? Log In" : "New here? Create Account"}
          </Text>
        </TouchableOpacity>

      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  card: { backgroundColor: 'white', borderRadius: 20, padding: 30, alignItems: 'center', elevation: 10 },
  iconCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#e3f2fd', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 20 },
  inputBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f5f5f5', borderRadius: 10, paddingHorizontal: 15, width: '100%', height: 50, marginBottom: 15, borderWidth: 1, borderColor: '#eee' },
  input: { flex: 1, color: '#333' },
  
  primaryBtn: { backgroundColor: '#3b5998', width: '100%', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  btnText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  
  // New Guest Button Styles
  guestBtn: { marginTop: 15, alignItems: 'center', padding: 10 },
  guestText: { color: '#888', fontWeight: 'bold', fontSize: 14, textDecorationLine: 'underline' },

  linkText: { color: '#3b5998', fontWeight: '600' }
});