import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { auth } from '../firebaseConfig';
import { logoutUser } from '../services/authService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

export default function ProfileScreen({ navigation }) {
  const user = auth.currentUser;
  const [matchesPlayed, setMatchesPlayed] = useState(0);

  // Load Match Count
  useFocusEffect(
    React.useCallback(() => {
      const loadStats = async () => {
        try {
          const count = await AsyncStorage.getItem('matchesPlayed');
          if (count) {
            setMatchesPlayed(count);
          }
        } catch (error) {}
      };
      loadStats();
    }, [])
  );

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <LinearGradient
      colors={['#4c669f', '#3b5998', '#192f6a']} 
      style={styles.container}
    >
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>

      <Text style={styles.headerTitle}>My Profile</Text>

      <View style={styles.card}>
        
        {/* Avatar */}
        <View style={styles.avatarContainer}>
            <LinearGradient
              colors={['#FF00CC', '#333399']} 
              style={styles.avatarGradient}
            >
               <Ionicons name="person" size={55} color="white" />
            </LinearGradient>
            <View style={styles.editBadge}>
                <Ionicons name="pencil" size={14} color="white" />
            </View>
        </View>

        <Text style={styles.username}>
            {user?.displayName ? user.displayName : "Guest User"}
        </Text>
        <Text style={styles.email}>
            {user?.email ? user.email : "Anonymous Account"}
        </Text>

        <View style={styles.statusBadge}>
            <Text style={styles.statusText}>{user?.isAnonymous ? "GUEST" : "VERIFIED MEMBER"}</Text>
        </View>

        <View style={styles.divider} />

        {/* --- STATS ROW (Matches + History) --- */}
        <View style={styles.statsRow}>
            
            {/* 1. Matches Count */}
            <View style={styles.stat}>
                <Text style={styles.statNum}>{matchesPlayed}</Text>
                <Text style={styles.statLabel}>Matches Played</Text>
            </View>
            
            {/* Vertical Divider */}
            <View style={{width: 1, height: 40, backgroundColor: '#eee'}} />

            {/* 2. History Button (Clickable) */}
            <TouchableOpacity 
                style={styles.stat} 
                onPress={() => navigation.navigate('History')}
            >
                <View style={styles.iconCircle}>
                    <Ionicons name="time" size={24} color="white" />
                </View>
                <Text style={styles.statLabel}>View History</Text>
            </TouchableOpacity>

        </View>

      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={24} color="#ff4444" style={{marginRight: 10}} />
        <Text style={styles.logoutText}>Sign Out</Text>
      </TouchableOpacity>

    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, alignItems: 'center' },
  backBtn: { position: 'absolute', top: 50, left: 20, zIndex: 10 },
  headerTitle: { marginTop: 45, fontSize: 24, fontWeight: 'bold', color: 'white', marginBottom: 30 },

  card: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    marginBottom: 30,
  },
  
  avatarContainer: { marginBottom: 15 },
  avatarGradient: {
    width: 110,
    height: 110,
    borderRadius: 55, 
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#FF00CC',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 5,
    backgroundColor: '#333',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },

  username: { fontSize: 24, fontWeight: 'bold', color: '#333', marginTop: 5 },
  email: { fontSize: 14, color: '#888', marginTop: 2 },
  
  statusBadge: {
      marginTop: 10,
      backgroundColor: '#f0f0f0',
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 10,
  },
  statusText: { fontSize: 10, fontWeight: 'bold', color: '#666', letterSpacing: 1 },

  divider: { width: '100%', height: 1, backgroundColor: '#eee', marginVertical: 20 },

  // --- STATS ROW STYLES ---
  statsRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    width: '100%', 
    alignItems: 'center' 
  },
  stat: { 
    alignItems: 'center',
    width: '45%' // Ensure they take up equal space
  },
  statNum: { fontSize: 28, fontWeight: 'bold', color: '#3b5998' },
  statLabel: { fontSize: 12, color: '#999', marginTop: 5, fontWeight: '600' },
  
  // Icon Circle for History
  iconCircle: {
      width: 45,
      height: 45,
      borderRadius: 22.5,
      backgroundColor: '#4CAF50', // Green button
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 3,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.2
  },

  logoutBtn: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    alignItems: 'center',
    elevation: 5,
  },
  logoutText: { color: '#ff4444', fontWeight: 'bold', fontSize: 16 }
});