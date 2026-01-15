# Match Mixer 🏆

**Fair Teams, No Arguments.**

I built Match Mixer because splitting teams for cricket, football, or gaming sessions usually ends in an argument. This app takes the names and skill levels of every player and uses an algorithm to split them into two perfectly balanced teams.

It works both online (multiplayer lobbies) and offline (single device).

## What it does

* **Fair Sorting:** You rate players (1-10). The app does the math to make sure Team A and Team B have equal total skill.
* **Online Lobbies:** One person hosts, and friends join using a 4-digit Room Code.
* **Offline Mode:** Bad internet at the turf? Use "One Phone Mode" to add players manually and generate teams instantly.
* **Match History:** The app saves every game you generate locally. You can go back and see lineups from last week.
* **Guest & Login:** Sign up to save your stats, or use "Guest Mode" to jump straight in without an email.
* **Shareable:** One-click copy button that formats the team list perfectly for WhatsApp groups.

## Tech Stack

* **Frontend:** React Native (Expo)
* **Backend:** Firebase Realtime Database (for live lobbies)
* **Auth:** Firebase Authentication (Email/Pass + Anonymous)
* **Local Data:** AsyncStorage (for history and settings)

## How to Run

1.  **Clone the repo**
    ```bash
    git clone [https://github.com/YOUR_USERNAME/match-mixer.git](https://github.com/YOUR_USERNAME/match-mixer.git)
    cd match-mixer
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Setup Firebase**
    * You will need a `firebaseConfig.js` file in the `src` folder.
    * Create a project on Firebase console, enable **Auth** and **Realtime Database**, and paste your keys there.

4.  **Start the app**
    ```bash
    npx expo start
    ```

## Building the APK (Android)

To make the installable file for your phone:

```bash
eas build -p android --profile preview

Developer
Yash Raj