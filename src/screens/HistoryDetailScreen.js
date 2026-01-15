import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
// 1. Import Clipboard
import * as Clipboard from 'expo-clipboard';

export default function HistoryDetailScreen({ route, navigation }) {
  const { gameData } = route.params;

  // --- 2. COPY FUNCTION ---
  const copyToClipboard = async () => {
    // Create text for Past Match
    let text = `📜 PAST MATCH RECORD 📜\n`;
    text += `📅 Date: ${gameData.date}\n\n`;
    
    text += `🟢 TEAM A (Score: ${gameData.scoreA})\n`;
    gameData.teamA.forEach(p => text += `• ${p.name} (${p.score})\n`);
    
    text += `\n🔵 TEAM B (Score: ${gameData.scoreB})\n`;
    gameData.teamB.forEach(p => text += `• ${p.name} (${p.score})\n`);

    if (gameData.bench && gameData.bench.length > 0) {
        text += `\n⚠️ BENCH\n`;
        gameData.bench.forEach(p => text += `• ${p.name}\n`);
    }

    text += `\n- Retrieved from Match Mixer History`;

    await Clipboard.setStringAsync(text);
    Alert.alert("Copied!", "Match history copied to clipboard.");
  };

  const renderPlayer = ({ item }) => (
    <View style={styles.playerRow}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Ionicons name="person-circle" size={30} color="#555" style={{marginRight: 8}} />
            <Text style={styles.name}>{item.name}</Text>
        </View>
        <Text style={styles.score}>{item.score}</Text>
    </View>
  );

  return (
    <LinearGradient colors={['#4c669f', '#3b5998', '#192f6a']} style={styles.container}>
      
      {/* --- HEADER --- */}
      <View style={styles.header}>
        {/* Back Button (Left) */}
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
             <Ionicons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Match Record</Text>

        {/* Copy Button (Right) */}
        <TouchableOpacity onPress={copyToClipboard} style={styles.iconBtn}>
             <Ionicons name="copy-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>
      
      <Text style={styles.dateLabel}>{gameData.date}</Text>

      <ScrollView contentContainerStyle={{ paddingBottom: 50 }}>
        <View style={styles.teamsWrapper}>
            
            {/* TEAM A */}
            <View style={styles.teamCard}>
                <View style={[styles.cardHeader, { backgroundColor: '#4CAF50' }]}>
                    <Text style={styles.teamName}>Team A</Text>
                    <Text style={styles.totalScore}>Total: {gameData.scoreA}</Text>
                </View>
                <FlatList data={gameData.teamA} renderItem={renderPlayer} scrollEnabled={false} />
            </View>

            <View style={styles.vsBadge}><Text style={styles.vsText}>VS</Text></View>

            {/* TEAM B */}
            <View style={styles.teamCard}>
                <View style={[styles.cardHeader, { backgroundColor: '#2196F3' }]}>
                    <Text style={styles.teamName}>Team B</Text>
                    <Text style={styles.totalScore}>Total: {gameData.scoreB}</Text>
                </View>
                <FlatList data={gameData.teamB} renderItem={renderPlayer} scrollEnabled={false} />
            </View>
        </View>

        {/* BENCH */}
        {gameData.bench && gameData.bench.length > 0 && (
          <View style={styles.benchCard}>
            <Text style={styles.benchTitle}>Standby / Bench</Text>
            <FlatList data={gameData.bench} renderItem={renderPlayer} scrollEnabled={false} />
          </View>
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 50 },
  
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 10 
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: 'white' },
  iconBtn: { padding: 5 },
  
  dateLabel: { 
    textAlign: 'center', 
    color: '#ccc', 
    fontSize: 14, 
    marginBottom: 20, 
    fontStyle: 'italic' 
  },
  
  teamsWrapper: { gap: 20, marginTop: 10 },
  teamCard: { backgroundColor: 'white', borderRadius: 16, overflow: 'hidden' },
  cardHeader: { padding: 15, flexDirection: 'row', justifyContent: 'space-between' },
  teamName: { fontSize: 20, fontWeight: 'bold', color: 'white' },
  totalScore: { color: 'white', fontWeight: '600' },
  
  playerRow: { flexDirection: 'row', justifyContent: 'space-between', padding: 15, borderBottomWidth: 1, borderColor: '#f0f0f0' },
  name: { fontSize: 16, color: '#333' },
  score: { fontWeight: 'bold', color: '#888' },

  vsBadge: { alignSelf: 'center', backgroundColor: 'white', width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginVertical: -10, zIndex: 10, borderWidth: 2, borderColor: '#eee' },
  vsText: { fontWeight: '900', color: '#999', fontSize: 12 },

  benchCard: { marginTop: 20, backgroundColor: '#FFF3E0', borderRadius: 12, padding: 10 },
  benchTitle: { color: '#E65100', fontWeight: 'bold', marginBottom: 10, marginLeft: 10 }
});