import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';

export default function HistoryScreen({ navigation }) {
  const [history, setHistory] = useState([]);

  // Load history every time screen opens
  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, [])
  );

  const loadHistory = async () => {
    try {
      const data = await AsyncStorage.getItem('matchHistory');
      if (data) setHistory(JSON.parse(data));
    } catch (error) {}
  };

  const clearHistory = async () => {
    Alert.alert("Clear History", "Are you sure?", [
        { text: "Cancel", style: "cancel" },
        { text: "Clear", style: "destructive", onPress: async () => {
            await AsyncStorage.removeItem('matchHistory');
            setHistory([]);
        }}
    ]);
  };

  return (
    <LinearGradient colors={['#4c669f', '#3b5998', '#192f6a']} style={styles.container}>
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>Match History</Text>
        <TouchableOpacity onPress={clearHistory}>
            <Ionicons name="trash-outline" size={24} color="#ff4444" />
        </TouchableOpacity>
      </View>

      {/* List */}
      {history.length === 0 ? (
        <View style={styles.emptyContainer}>
            <Ionicons name="time-outline" size={80} color="rgba(255,255,255,0.5)" />
            <Text style={styles.emptyText}>No matches played yet.</Text>
        </View>
      ) : (
        <FlatList
          data={history}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity 
                style={styles.card}
                // NAVIGATE TO DETAIL SCREEN ON CLICK
                onPress={() => navigation.navigate('HistoryDetail', { gameData: item })}
            >
              <View style={styles.cardHeader}>
                  <Text style={styles.date}>{item.date}</Text>
                  <Ionicons name="chevron-forward" size={20} color="#ccc" />
              </View>
              
              <View style={styles.scoreRow}>
                  <View style={styles.teamBadge}>
                      <Text style={styles.teamLabel}>Team A</Text>
                      <Text style={styles.teamScore}>{item.scoreA}</Text>
                  </View>
                  <Text style={styles.vs}>VS</Text>
                  <View style={styles.teamBadge}>
                      <Text style={styles.teamLabel}>Team B</Text>
                      <Text style={styles.teamScore}>{item.scoreB}</Text>
                  </View>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { marginTop: 40, marginBottom: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', color: 'white' },
  backBtn: { padding: 5 },
  
  card: { backgroundColor: 'white', borderRadius: 15, padding: 15, marginBottom: 15 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10, borderBottomWidth: 1, borderBottomColor: '#eee', paddingBottom: 5 },
  date: { color: '#666', fontSize: 12, fontWeight: 'bold' },
  
  scoreRow: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
  teamBadge: { alignItems: 'center' },
  teamLabel: { fontSize: 12, color: '#888' },
  teamScore: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  vs: { fontSize: 16, fontWeight: '900', color: '#ddd' },

  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: 'rgba(255,255,255,0.7)', marginTop: 10, fontSize: 16 }
});