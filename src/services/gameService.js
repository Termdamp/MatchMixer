import { db } from '../firebaseConfig';
import { ref, set, get, child, update, onValue, off, remove } from "firebase/database";

// Helper: Generate Code
const generateRoomCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// 1. Create Lobby
export const createLobby = async (playerName, playerScore) => {
  const roomCode = generateRoomCode();
  const newRoomRef = ref(db, 'rooms/' + roomCode);

  await set(newRoomRef, {
    host: playerName,
    isOpen: true,
    status: 'waiting',
    players: [
      { name: playerName, score: parseInt(playerScore), isHost: true }
    ]
  });

  return roomCode;
};

// 2. Join Lobby
export const joinLobby = async (roomCode, playerName, playerScore) => {
  const roomRef = ref(db);
  const snapshot = await get(child(roomRef, `rooms/${roomCode}`));

  if (snapshot.exists()) {
    const roomData = snapshot.val();
    if (!roomData.isOpen) throw new Error("Game has already started!");

    const currentPlayers = roomData.players || [];
    const updatedPlayers = [
      ...currentPlayers, 
      { name: playerName, score: parseInt(playerScore), isHost: false }
    ];

    await update(ref(db, 'rooms/' + roomCode), {
      players: updatedPlayers
    });
    return true;
  } else {
    throw new Error("Room does not exist!");
  }
};

// 3. Listen to Room
export const listenToRoom = (roomCode, onUpdate) => {
  const roomRef = ref(db, 'rooms/' + roomCode);
  const unsubscribe = onValue(roomRef, (snapshot) => {
    if (snapshot.exists()) {
      onUpdate(snapshot.val());
    } else {
      onUpdate(null); // Room was deleted
    }
  });
  return () => off(roomRef);
};

// 4. Start Game
export const startGame = async (roomCode) => {
  await update(ref(db, 'rooms/' + roomCode), {
    status: 'started',
    isOpen: false 
  });
};

// src/services/gameService.js (Partial update - replace the bottom part)

// ... (keep createLobby, joinLobby, listenToRoom, startGame as they were) ...

// 5. Remove Player & Handle Host Migration
export const removePlayer = async (roomCode, playerNameToRemove) => {
  const roomRef = ref(db, 'rooms/' + roomCode);
  const snapshot = await get(roomRef);

  if (snapshot.exists()) {
    const roomData = snapshot.val();
    const currentPlayers = roomData.players || [];

    // Find the player object before we remove them
    const playerLeaving = currentPlayers.find(p => p.name === playerNameToRemove);

    // 1. Remove the player
    const newPlayerList = currentPlayers.filter(p => p.name !== playerNameToRemove);

    // 2. CHECK: Is the room now empty?
    if (newPlayerList.length === 0) {
      // If no one is left, destroy the room to save space
      await remove(roomRef); 
      return;
    }

    // 3. HOST MIGRATION: If the person leaving was the Host...
    if (playerLeaving && playerLeaving.isHost) {
      // The first person in the remaining list becomes the new Host
      newPlayerList[0].isHost = true;
    }

    // 4. Save the updated list
    await update(roomRef, {
      players: newPlayerList
    });
  }
};