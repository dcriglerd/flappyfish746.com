# Flappy Fish - Product Requirements Document

## Original Problem Statement
Build a "Flappy Bird" clone named "Flappy Fish" as a React Native mobile application for Android, with monetization through Google AdMob ads and distribution across multiple app stores.

## Project Overview
- **App Name:** Flappy Fish
- **Platform:** React Native (Expo) for Android
- **Target Stores:** Google Play Store, Amazon Appstore, Samsung Galaxy Store
- **Backend:** FastAPI + MongoDB

---

## Core Features

### Gameplay
- Tap-to-swim mechanics (Flappy Bird style)
- Obstacle navigation through pipes
- Coin collection system
- Score tracking

### Monetization
- Google AdMob integration (Banner, Interstitial, Rewarded, App Open ads)
- In-app purchases for coins and ad removal

### Features Implemented
- Power-ups (Bubble Shield, Slow Motion, etc.)
- Unlockable fish skins
- Cloud data sync via FastAPI/MongoDB backend
- Global leaderboard
- Achievements system
- Daily rewards with streak tracking
- Push notifications (streak reminders, challenge reminders)
- Best Taps streak counter
- Username/profile system

---

## What's Been Implemented

### Version 1.0.0 (versionCode 7) - February 2026

#### Notification System (Latest)
- **Come Back Re-engagement Notifications:**
  - 48-hour notification: "Your fish misses you!"
  - 72-hour notification: "Bonus coins waiting!" 
  - 7-day notification: "New challenges await!"
  
- **Welcome Back Bonus System:**
  - 3 days away: 50 coins
  - 4 days away: 60 coins
  - 5 days away: 70 coins
  - 6 days away: 80 coins
  - 7+ days away: 100 coins (max)

- **Notification Wiring:**
  - `onAppOpen()` - checks for welcome back bonus
  - `onGameStart()` - cancels come back notifications, reschedules
  - Streak notifications connected to daily rewards context
  - Challenge reminders connected to challenge progress

#### Previous Implementations
- Full game mechanics with physics
- AdMob integration (all ad types)
- User authentication (device-based)
- Cloud sync with FastAPI backend
- Leaderboard system
- Achievements (10+ achievements)
- Daily challenges (3 per day)
- Daily streak rewards
- Multiple fish skins
- Power-up system
- Audio system (sound effects, mute toggle)
- Haptic feedback

---

## Technical Architecture

### Frontend (React Native/Expo)
```
/app/flappy-fish746com/
├── App.js                          # Main app with providers
├── src/
│   ├── screens/
│   │   └── FlappyFishGame.js       # Main game screen
│   ├── components/
│   │   ├── StartScreen.js
│   │   ├── GameOverScreen.js
│   │   ├── SkinsModal.js
│   │   ├── LeaderboardModal.js
│   │   ├── AchievementsModal.js
│   │   ├── DailyRewardsModal.js
│   │   ├── WelcomeBackModal.js     # NEW
│   │   └── NotificationSettings.js
│   ├── context/
│   │   ├── GameContext.js
│   │   ├── AdsContext.js
│   │   ├── AudioContext.js
│   │   ├── CloudSyncContext.js
│   │   ├── AchievementsContext.js
│   │   ├── DailyRewardsContext.js
│   │   └── NotificationsContext.js # UPDATED
│   ├── constants/
│   │   └── config.js
│   └── data/
│       └── dailyRewards.js
├── app.json
└── eas.json
```

### Backend (FastAPI)
```
/app/backend/
└── server.py                       # All API endpoints
```

### Key API Endpoints
- `POST /api/game/sync` - Sync game data
- `GET /api/game/{user_id}` - Get user data
- `GET /api/leaderboard` - Get top players
- `GET /api/user/delete-request` - Data deletion page (GDPR)
- `DELETE /api/user/{user_id}/data` - Delete user data

### Database Schema (MongoDB)
```javascript
// game_data collection
{
  user_id: string,
  username: string,
  high_score: int,
  coins: int,
  unlocked_skins: [string],
  selected_skin: string,
  owned_power_ups: {string: int},
  ads_removed: boolean,
  total_games_played: int,
  total_coins_earned: int,
  unlocked_achievements: [string],
  achievement_stats: object,
  best_tap_streak: int,
  created_at: datetime,
  updated_at: datetime
}
```

---

## Build Information

### Latest Build (v1.0.0, versionCode 7)
- **APK (Preview):** https://expo.dev/artifacts/eas/phiKAQfmY1cMhkdfBE5cnH.apk
- **AAB (Production):** Building... check https://expo.dev/accounts/dcriglerd/projects/flappy-fish746com/builds/41be9a8e-66dd-400f-8ec7-36d1e96a817f

### AdMob Configuration
- App ID: ca-app-pub-9210526164379066~4938293330
- Configured in app.json and config.js

---

## Store Submission Status

### Google Play Store
- **Status:** Closed Testing (13 days remaining as of last update)
- **Testers:** 25 opted-in (requirement: 20)
- **Blocker:** 14-day testing period must complete

### Amazon Appstore
- **Status:** In Progress
- **Assets Ready:** Yes (all icons, screenshots, descriptions, video)
- **APK:** Available

### Samsung Galaxy Store
- **Status:** In Progress
- **Account Type:** Individual (no DUNS required)
- **Assets Ready:** Yes

---

## Website & Deep Links
- **Domain:** flappyfish746.com
- **Hosting:** GitHub Pages
- **Deep Links:** Configured and working
- **Privacy Policy:** Published

---

## Backlog / Future Tasks

### P0 (Critical)
- Complete 14-day Google Play testing period
- Submit to Amazon Appstore
- Submit to Samsung Galaxy Store

### P1 (High Priority)
- Add onboarding/tutorial for new players
- Social sharing features (share high scores)

### P2 (Medium Priority)  
- iOS version for Apple App Store
- More fish skins
- Additional achievements
- Seasonal events

### P3 (Nice to Have)
- Multiplayer mode
- Friend system
- Custom themes

---

## Known Issues
- None currently blocking

## Dependencies
- expo: ~54.0.32
- react-native: 0.81.5
- react-native-google-mobile-ads: ^16.0.1
- expo-notifications: ^0.32.16
- expo-av: ^16.0.8

---

*Last Updated: February 22, 2026*
