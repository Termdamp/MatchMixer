// src/utils/teamBalancer.js

export const balanceTeams = (allPlayers) => {
  
  // --- HELPER FUNCTION: Calculates teams for a specific list of players ---
  const calculateSplit = (players) => {
    // 1. Sort by skill (Highest to Lowest)
    const sorted = [...players].sort((a, b) => b.score - a.score);
    
    const teamA = [];
    const teamB = [];
    let scoreA = 0;
    let scoreB = 0;
    const maxPerTeam = sorted.length / 2;

    // 2. Distribute players
    sorted.forEach((player) => {
      const aFull = teamA.length >= maxPerTeam;
      const bFull = teamB.length >= maxPerTeam;

      // Greedy Logic: Give to the weaker team unless they are full
      if (!aFull && (bFull || scoreA <= scoreB)) {
        teamA.push(player);
        scoreA += player.score;
      } else {
        teamB.push(player);
        scoreB += player.score;
      }
    });

    return { 
      teamA, 
      teamB, 
      scoreA, 
      scoreB, 
      diff: Math.abs(scoreA - scoreB) // How "fair" is this split?
    };
  };

  // --- MAIN LOGIC ---

  // CASE 1: Even Number of Players
  // Just run the calculation once.
  if (allPlayers.length % 2 === 0) {
    const result = calculateSplit(allPlayers);
    return { ...result, bench: [] };
  }

  // CASE 2: Odd Number of Players (The Optimization Loop)
  // We have 5 players. We need to run the simulation 5 times, 
  // removing a different player each time, to find the PERFECT match.
  
  let bestResult = null;
  let lowestDiff = Infinity; // Start with a huge difference
  let bestBenchPlayer = null;

  for (let i = 0; i < allPlayers.length; i++) {
    const candidate = allPlayers[i];
    
    // Create a temporary list excluding THIS candidate
    const remainingPlayers = allPlayers.filter((_, index) => index !== i);
    
    // Run the math for this scenario
    const simulation = calculateSplit(remainingPlayers);

    // Is this scenario fairer than what we found before?
    if (simulation.diff < lowestDiff) {
      lowestDiff = simulation.diff;
      bestResult = simulation;
      bestBenchPlayer = candidate;
    }
  }

  // Return the best scenario found
  return { 
    teamA: bestResult.teamA, 
    teamB: bestResult.teamB, 
    scoreA: bestResult.scoreA, 
    scoreB: bestResult.scoreB, 
    bench: [bestBenchPlayer] 
  };
};