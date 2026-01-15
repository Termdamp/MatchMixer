import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function HomeScreen({ navigation }) {
  return (
    // Root: The Gradient covers the whole screen (Bottom background)
    <LinearGradient
      colors={['#4c669f', '#3b5998', '#192f6a']} 
      style={styles.container}
    >
      
      {/* --- TOP SECTION (The Stylish White Curve) --- */}
      <View style={styles.topHeader}>
        
        {/* Profile Button (Top Right) */}
        <TouchableOpacity 
           style={styles.profileBtn} 
           onPress={() => navigation.navigate('Profile')}
        >
           <Ionicons name="person-circle-outline" size={35} color="#333" />
        </TouchableOpacity>

        {/* --- PREMIUM LOGO --- */}
        <View style={styles.logoContainer}>
            {/* Outer Ring (Glass Effect) */}
            <View style={styles.logoRing}>
               {/* Inner Circle (Solid White) */}
               <View style={styles.logoCircle}>
                  <Ionicons name="people" size={60} color="#4CAF50" />
               </View>
            </View>
        </View>
        
        <Text style={styles.title}>Match Mixer</Text>
        <Text style={styles.subtitle}>Fair Teams, No Arguments.</Text>
      </View>


      {/* --- BOTTOM SECTION (Buttons & Signature) --- */}
      <View style={styles.bottomContent}>
        
        {/* Button 1: Create */}
        <TouchableOpacity 
          style={[styles.button, styles.createBtn]} 
          onPress={() => navigation.navigate('Input', { mode: 'create' })}
        >
          <Ionicons name="add-circle-outline" size={24} color="white" style={styles.btnIcon} />
          <Text style={styles.btnText}>Create Team Division</Text>
        </TouchableOpacity>

        {/* Button 2: Join */}
        <TouchableOpacity 
          style={[styles.button, styles.joinBtn]} 
          onPress={() => navigation.navigate('Input', { mode: 'join' })}
        >
          <Ionicons name="enter-outline" size={24} color="white" style={styles.btnIcon} />
          <Text style={styles.btnText}>Join Existing Team</Text>
        </TouchableOpacity>
        {/* --- NEW BUTTON: OFFLINE MODE --- */}
        <TouchableOpacity 
          style={[styles.button, styles.offlineBtn]} 
          onPress={() => navigation.navigate('OfflineInput')}
        >
          <Ionicons name="phone-portrait-outline" size={24} color="white" style={styles.btnIcon} />
          <Text style={styles.btnText}>Offline</Text>
        </TouchableOpacity>

        {/* Signature */}
        <View style={styles.footerContainer}>
          <Text style={styles.madeBy}>Developed By</Text>
          <Text style={styles.signature}>
            YASH RAJ
          </Text>
        </View>

      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  // --- TOP HEADER STYLES ---
  topHeader: {
    flex: 0.45, // Takes top 45% of screen
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    // The Curve Magic:
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
    // Shadow for depth
    elevation: 10, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    zIndex: 1, 
  },

  // Profile Icon Positioning
  profileBtn: {
    position: 'absolute',
    top: 50,    // Adjusted for status bar
    right: 25,  // Distance from right edge
    padding: 5,
    zIndex: 10,
  },
  
  // --- LOGO STYLES ---
  logoContainer: {
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoRing: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f0f0f0', // Light grey ring
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  logoCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'white', // Solid white center
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
  },
  
  title: { fontSize: 36, fontWeight: 'bold', color: '#333', marginBottom: 5 },
  subtitle: { fontSize: 16, color: '#666' },

  // --- BOTTOM CONTENT STYLES ---
  bottomContent: {
    flex: 0.55, // Takes remaining 55%
    padding: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },

  button: {
    width: '100%',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
  },
  
  createBtn: { backgroundColor: '#4CAF50' }, 
  joinBtn: { backgroundColor: '#2196F3' },   
  btnIcon: { marginRight: 10 }, 
  btnText: { color: 'white', fontSize: 18, fontWeight: 'bold' },

  footerContainer: {
    position: 'absolute',
    bottom: 30,
    alignItems: 'center',
  },
  madeBy: {
    fontSize: 12,
    color: '#ccc', // Light gray so it shows on blue
    marginBottom: 5,
    letterSpacing: 2,
    textTransform: 'uppercase'
  },
  offlineBtn: { backgroundColor: '#607D8B' },
  signature: {
    fontSize: 28,
    fontWeight: '900',
    color: 'white',
    letterSpacing: 5,
    textTransform: 'uppercase',
    fontStyle: 'italic'
  }
});