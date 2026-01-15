import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createLobby, joinLobby } from '../services/gameService';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { auth } from '../firebaseConfig'; 

export default function InputScreen({ navigation, route }) {
  const { mode } = route.params || { mode: 'create' }; 
  const user = auth.currentUser; 
  
  const [name, setName] = useState('');
  const [score, setScore] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Check if user is "Real" (Not null, not anonymous, has a name)
        const isRealUser = user && !user.isAnonymous && user.displayName;

        if (isRealUser) {
            // --- 1. REAL USER DATA ---
            setName(user.displayName); // Name from Cloud
            const savedAuthScore = await AsyncStorage.getItem('authScore'); // Score from "Real" pocket
            if (savedAuthScore) setScore(savedAuthScore);
        } else {
            // --- 2. GUEST DATA ---
            const savedGuestName = await AsyncStorage.getItem('guestName'); // Name from "Guest" pocket
            const savedGuestScore = await AsyncStorage.getItem('guestScore'); // Score from "Guest" pocket
            
            if (savedGuestName) setName(savedGuestName);
            if (savedGuestScore) setScore(savedGuestScore);
        }
      } catch (error) { }
    };
    loadData();
  }, []);

  const handleAction = async () => {
    if (!name || !score) {
      Alert.alert("Error", "Please fill in Name and Score");
      return;
    }

    const scoreNum = parseInt(score);
    if (isNaN(scoreNum) || scoreNum < 1 || scoreNum > 10) {
      Alert.alert("Invalid Score", "Please enter a skill score between 1 and 10.");
      return;
    }

    setLoading(true);

    try {
      const isRealUser = user && !user.isAnonymous;

      // --- SAVE LOGIC (SEPARATE POCKETS) ---
      if (isRealUser) {
          // Save to "Real" pocket
          await AsyncStorage.setItem('authScore', score); 
          // (We don't save Name here because it's in Firebase)
      } else {
          // Save to "Guest" pocket
          await AsyncStorage.setItem('guestName', name);
          await AsyncStorage.setItem('guestScore', score);
      }

      if (mode === 'create') {
        const newCode = await createLobby(name, score);
        setLoading(false);
        navigation.navigate('Lobby', { roomCode: newCode, name, isHost: true });
      } else {
        if (!roomCode) {
            Alert.alert("Error", "Please enter a Room Code");
            setLoading(false);
            return;
        }
        await joinLobby(roomCode, name, score);
        setLoading(false);
        navigation.navigate('Lobby', { roomCode, name, isHost: false });
      }
    } catch (error) {
      setLoading(false);
      Alert.alert("Oops!", error.message);
    }
  };

  return (
    <LinearGradient
      colors={['#4c669f', '#3b5998', '#192f6a']} 
      style={styles.container}
    >
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={28} color="white" />
      </TouchableOpacity>

      <View style={styles.card}>
        <Text style={styles.headerTitle}>
          {mode === 'create' ? "Create Lobby" : "Join Lobby"}
        </Text>
        <Text style={styles.subTitle}>Enter your details below</Text>

        <View style={styles.inputContainer}>
          <Ionicons name="person-outline" size={20} color="#666" style={styles.icon} />
          <TextInput 
            placeholder="Your Name" 
            style={styles.input} 
            value={name} 
            onChangeText={setName} 
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="trophy-outline" size={20} color="#666" style={styles.icon} />
          <TextInput 
            placeholder="Skill Score (1-10)" 
            style={styles.input} 
            keyboardType="numeric"
            value={score} 
            onChangeText={setScore} 
            placeholderTextColor="#999"
          />
        </View>

        {mode === 'join' && (
          <View style={styles.inputContainer}>
            <Ionicons name="keypad-outline" size={20} color="#666" style={styles.icon} />
            <TextInput 
              placeholder="Room Code (e.g. A4X1)" 
              style={[styles.input, styles.codeInput]} 
              autoCapitalize="characters"
              onChangeText={(text) => setRoomCode(text.toUpperCase())} 
              placeholderTextColor="#999"
            />
          </View>
        )}

        {loading ? (
          <ActivityIndicator size="large" color="#3b5998" style={{marginTop: 20}} />
        ) : (
          <TouchableOpacity style={styles.actionBtn} onPress={handleAction}>
            <Text style={styles.actionBtnText}>
              {mode === 'create' ? "Start & Create" : "Join Now"}
            </Text>
            <Ionicons name="arrow-forward" size={20} color="white" style={{marginLeft: 5}} />
          </TouchableOpacity>
        )}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  backBtn: { position: 'absolute', top: 50, left: 20, zIndex: 10 },
  card: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    width: '100%',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#333', textAlign: 'center', marginBottom: 5 },
  subTitle: { fontSize: 14, color: '#888', textAlign: 'center', marginBottom: 30 },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#eee',
    height: 55,
  },
  icon: { marginRight: 10 },
  input: { flex: 1, fontSize: 16, color: '#333', height: '100%' },
  codeInput: { fontWeight: 'bold', letterSpacing: 2 },
  actionBtn: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 18,
    borderRadius: 12,
    marginTop: 10,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    elevation: 5,
  },
  actionBtnText: { color: 'white', fontSize: 18, fontWeight: 'bold' }
});