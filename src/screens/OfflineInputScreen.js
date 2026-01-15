import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function OfflineInputScreen({ navigation }) {
  const [name, setName] = useState('');
  const [score, setScore] = useState('');
  const [players, setPlayers] = useState([]);

  const addPlayer = () => {
    if (!name || !score) {
      Alert.alert("Missing Info", "Enter both Name and Score.");
      return;
    }
    const scoreNum = parseInt(score);
    if (isNaN(scoreNum) || scoreNum < 1 || scoreNum > 10) {
      Alert.alert("Invalid Score", "Score must be 1-10.");
      return;
    }

    // Add to list
    const newPlayer = {
      id: Date.now().toString(),
      name: name,
      score: scoreNum,
      isHost: false // Doesn't matter in offline, but keeps structure consistent
    };

    setPlayers([...players, newPlayer]);
    setName(''); // Clear inputs
    setScore('');
    Keyboard.dismiss();
  };

  const removePlayer = (id) => {
    setPlayers(players.filter(p => p.id !== id));
  };

  const handleGenerate = () => {
    if (players.length < 2) {
      Alert.alert("Not Enough Players", "You need at least 2 players to split teams.");
      return;
    }
    // Navigate to Result (Reuse the existing screen!)
    navigation.navigate('Result', { 
        players: players, 
        currentUser: "Host" // Just a dummy name so nothing crashes
    });
  };

  return (
    <LinearGradient colors={['#4c669f', '#3b5998', '#192f6a']} style={styles.container}>
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>Offline Mode</Text>
      </View>

      {/* --- INPUT AREA --- */}
      <View style={styles.inputCard}>
        <View style={styles.row}>
            <View style={[styles.inputContainer, { flex: 2, marginRight: 10 }]}>
                <Ionicons name="person" size={18} color="#666" style={{marginRight: 5}} />
                <TextInput 
                    placeholder="Name" 
                    value={name} 
                    onChangeText={setName} 
                    style={styles.input} 
                />
            </View>
            <View style={[styles.inputContainer, { flex: 1 }]}>
                <Ionicons name="trophy" size={18} color="#666" style={{marginRight: 5}} />
                <TextInput 
                    placeholder="1-10" 
                    value={score} 
                    onChangeText={setScore} 
                    keyboardType="numeric" 
                    style={styles.input} 
                />
            </View>
        </View>
        
        <TouchableOpacity style={styles.addBtn} onPress={addPlayer}>
            <Text style={styles.addBtnText}>+ Add Player</Text>
        </TouchableOpacity>
      </View>

      {/* --- PLAYER LIST --- */}
      <FlatList
        data={players}
        keyExtractor={item => item.id}
        style={{ width: '100%', marginTop: 20 }}
        renderItem={({ item }) => (
            <View style={styles.playerRow}>
                <Text style={styles.pName}>{item.name}</Text>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={styles.pScore}>Skill: {item.score}</Text>
                    <TouchableOpacity onPress={() => removePlayer(item.id)} style={{marginLeft: 15}}>
                        <Ionicons name="close-circle" size={24} color="#ff4444" />
                    </TouchableOpacity>
                </View>
            </View>
        )}
      />

      {/* --- GENERATE BUTTON --- */}
      {players.length > 0 && (
          <View style={styles.footer}>
             <Text style={styles.countText}>Total Players: {players.length}</Text>
             <TouchableOpacity style={styles.generateBtn} onPress={handleGenerate}>
                 <Text style={styles.genText}>Create Teams</Text>
                 <Ionicons name="arrow-forward-circle" size={24} color="white" style={{marginLeft: 10}} />
             </TouchableOpacity>
          </View>
      )}

    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 50 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  backBtn: { marginRight: 15 },
  title: { fontSize: 24, fontWeight: 'bold', color: 'white' },

  inputCard: { backgroundColor: 'white', padding: 15, borderRadius: 15, width: '100%' },
  row: { flexDirection: 'row', marginBottom: 10 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f0f0f0', borderRadius: 8, paddingHorizontal: 10, height: 45 },
  input: { flex: 1, fontSize: 16 },
  
  addBtn: { backgroundColor: '#3b5998', padding: 12, borderRadius: 10, alignItems: 'center' },
  addBtnText: { color: 'white', fontWeight: 'bold' },

  playerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.9)', padding: 15, borderRadius: 10, marginBottom: 8 },
  pName: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  pScore: { color: '#666' },

  footer: { marginTop: 10, paddingBottom: 20 },
  countText: { color: '#ccc', textAlign: 'center', marginBottom: 10 },
  generateBtn: { backgroundColor: '#4CAF50', padding: 18, borderRadius: 15, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  genText: { color: 'white', fontSize: 18, fontWeight: 'bold' }
});