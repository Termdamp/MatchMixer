import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Share, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { listenToRoom, startGame, removePlayer } from '../services/gameService'; 

export default function LobbyScreen({ route, navigation }) {
  const { roomCode, name } = route.params;
  const [players, setPlayers] = useState([]);

  // Dynamic Host Check
  const amIHost = players.find(p => p.name === name)?.isHost || false;

  useEffect(() => {
    const unsubscribe = listenToRoom(roomCode, (roomData) => {
      if (roomData) {
        const newPlayerList = roomData.players || [];
        setPlayers(newPlayerList);

        const amIStillHere = newPlayerList.some(p => p.name === name);
        if (!amIStillHere) {
          Alert.alert("Disconnected", "You have left or were removed from the lobby.");
          navigation.navigate('Home');
          return;
        }

        if (roomData.status === 'started') {
          navigation.navigate('Result', { players: newPlayerList, currentUser: name });
        }
      } else {
        Alert.alert("Lobby Closed", "The host has disbanded the lobby.");
        navigation.navigate('Home');
      }
    });

    return () => unsubscribe();
  }, [roomCode]);

  const handleKick = async (playerToKick) => {
    try {
      await removePlayer(roomCode, playerToKick);
    } catch (error) {
      Alert.alert("Error", "Could not remove player.");
    }
  };

  const handleLeave = async () => {
    try {
      await removePlayer(roomCode, name);
      navigation.navigate('Home');
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const handleStartPress = async () => {
    try {
      await startGame(roomCode);
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const shareCode = async () => {
    try {
      await Share.share({ message: `Join my TeamMaker lobby! Code: ${roomCode}` });
    } catch (error) { }
  };

  return (
    <LinearGradient
      colors={['#4c669f', '#3b5998', '#192f6a']} 
      style={styles.container}
    >
      
      {/* --- TOP SECTION (Gradient) --- */}
      <View style={styles.topHeader}>
        {/* Navigation Row */}
        <View style={styles.navRow}>
            <TouchableOpacity onPress={handleLeave} style={styles.iconBtn}>
                <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={shareCode} style={styles.iconBtn}>
                <Ionicons name="share-social-outline" size={24} color="white" />
            </TouchableOpacity>
        </View>

        {/* Room Code Display */}
        <Text style={styles.roomLabel}>ROOM CODE</Text>
        <Text style={styles.roomCode}>{roomCode}</Text>
        <Text style={styles.statusText}>
             {amIHost ? "You are the Host" : "Waiting for host to start..."}
        </Text>
      </View>

      {/* --- BOTTOM SECTION (White Sheet) --- */}
      <View style={styles.bottomSheet}>
        <View style={styles.sheetHeader}>
            <Text style={styles.playerCount}>Players Joined ({players.length})</Text>
        </View>

        <FlatList
          data={players}
          keyExtractor={(item) => item.name}
          contentContainerStyle={{ paddingBottom: 100 }} // Space for button
          renderItem={({ item }) => (
            <View style={styles.playerRow}>
              <View style={styles.playerInfo}>
                 {/* Avatar */}
                <View style={styles.avatar}>
                    <Ionicons name="person" size={20} color="#3b5998" />
                </View>
                
                <View>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Text style={styles.playerName}>{item.name}</Text>
                      {item.isHost && <Ionicons name="star" size={14} color="#FFD700" style={{marginLeft: 5}} />}
                      {item.name === name && <Text style={styles.meTag}>(You)</Text>}
                  </View>
                  <Text style={styles.playerScore}>Skill Score: {item.score}</Text>
                </View>
              </View>

              {/* Kick Button (Host Only) */}
              {amIHost && item.name !== name && (
                <TouchableOpacity onPress={() => handleKick(item.name)} style={styles.kickBtn}>
                  <Ionicons name="trash-outline" size={20} color="#ff4444" />
                </TouchableOpacity>
              )}
            </View>
          )}
        />

        {/* --- START BUTTON (Floating at Bottom) --- */}
        {/* --- FLOATING FOOTER --- */}
        {amIHost ? (
          <View style={styles.footer}>
            <TouchableOpacity style={styles.startBtn} onPress={handleStartPress}>
               <Text style={styles.startText}>Start Team Division</Text>
               <Ionicons name="arrow-forward-circle" size={24} color="white" style={{marginLeft: 10}} />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.footer}>
              <View style={styles.waitingBadge}>
                 <ActivityIndicator size="small" color="#fff" />
                 {/* UPDATED TEXT HERE */}
                 <Text style={styles.waitingText}>Waiting for host to start division</Text>
              </View>
          </View>
        )}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  
  // --- TOP HEADER ---
  topHeader: {
    height: '35%', // Top 35% of screen
    paddingTop: 50,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  navRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  iconBtn: {
    padding: 10,
    backgroundColor: 'rgba(255,255,255,0.2)', // Glass effect
    borderRadius: 50,
  },
  roomLabel: {
    color: 'rgba(255,255,255,0.7)',
    letterSpacing: 2,
    fontSize: 12,
    fontWeight: 'bold',
  },
  roomCode: {
    color: 'white',
    fontSize: 50,
    fontWeight: '900', // Extra bold
    letterSpacing: 5,
    marginBottom: 5,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 10,
  },
  statusText: {
    color: '#aaccff',
    fontSize: 16,
    fontStyle: 'italic',
  },

  // --- BOTTOM SHEET ---
  bottomSheet: {
    flex: 1, // Fills the rest of the screen
    backgroundColor: '#f5f7fa',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 25,
    elevation: 20, // Strong shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.1,
  },
  sheetHeader: {
    marginBottom: 15,
    paddingLeft: 5,
  },
  playerCount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },

  // --- PLAYER ROWS ---
  playerRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    padding: 15, 
    backgroundColor: 'white', 
    marginBottom: 12, 
    borderRadius: 16,
    // Soft Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2
  },
  playerInfo: { flexDirection: 'row', alignItems: 'center' },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e3f2fd', // Light Blue circle
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  playerName: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  meTag: { fontSize: 12, color: '#4CAF50', marginLeft: 5, fontWeight: 'bold' },
  playerScore: { fontSize: 13, color: '#888', marginTop: 2 },
  
  kickBtn: {
    padding: 8,
    backgroundColor: '#fff0f0',
    borderRadius: 10,
  },

  // --- FOOTER BUTTONS ---
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
  },
  startBtn: { 
      backgroundColor: '#4CAF50', 
      padding: 18, 
      borderRadius: 15, 
      flexDirection: 'row', 
      justifyContent: 'center', 
      alignItems: 'center',
      shadowColor: "#4CAF50",
      shadowOffset: { width: 0, height: 5 },
      shadowOpacity: 0.4,
      shadowRadius: 10,
      elevation: 8,
  },
  startText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  
  waitingBadge: {
      backgroundColor: '#333',
      padding: 15,
      borderRadius: 50,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
      paddingHorizontal: 30,
  },
  waitingText: { color: 'white', marginLeft: 10, fontWeight: '600' }
});