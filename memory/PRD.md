# Flappy Fish - Product Requirements Document

## Original Problem Statement
Build a "Flappy Bird" clone named "Flappy Fish" as a React Native mobile application with monetization through Google AdMob ads.

## Core Features
1. **Gameplay:** Tap-to-swim mechanics through coral obstacles
2. **Monetization:** Google AdMob (Banner, Interstitial, Rewarded, App Open ads)
3. **Customization:** 8 unlockable fish skins
4. **Power-ups:** Bubble Shield, Slow Motion, Coin Magnet, Double Coins
5. **Cloud Sync:** FastAPI/MongoDB backend for progress saving
6. **Leaderboard:** Global high score competition
7. **Achievements:** 20+ unlockable achievements
8. **Daily Rewards:** Streak bonuses and daily challenges
9. **Push Notifications:** Streak reminders

## Tech Stack
- **Frontend:** React Native, Expo (EAS Build)
- **Backend:** FastAPI, MongoDB
- **Ads:** react-native-google-mobile-ads
- **State:** React Context API

## Project Structure
```
/app/
├── backend/
│   └── server.py
└── flappy-fish746com/
    ├── src/
    │   ├── components/
    │   ├── constants/
    │   ├── context/
    │   ├── data/
    │   └── screens/
    ├── website/
    │   ├── .well-known/assetlinks.json
    │   ├── index.html
    │   ├── privacy-policy.html
    │   └── ads.txt
    ├── app.json
    ├── eas.json
    └── package.json
```

## What's Been Implemented ✅

### Session: February 2026
- [x] Fixed ad initialization (removed testDeviceIdentifiers blocker)
- [x] Added 1-second SDK initialization delay
- [x] Improved ad error logging
- [x] Built preview APK for testing
- [x] Enabled ProGuard for production builds
- [x] Generated AAB with version code 2
- [x] Deobfuscation/mapping file included in AAB

### Previous Sessions
- [x] Core Flappy Fish gameplay
- [x] All ad types (Banner, Interstitial, Rewarded, App Open)
- [x] 8 fish skins with unlock system
- [x] 4 power-ups
- [x] Cloud sync backend
- [x] Global leaderboard
- [x] Achievements system
- [x] Daily rewards & streaks
- [x] Push notifications
- [x] Static promotional website
- [x] Privacy policy page
- [x] ads.txt for AdMob verification
- [x] Deep link configuration (pending SHA-256)
- [x] IAP/Shop removal (per user request)

## Current Build Info
| Field | Value |
|-------|-------|
| Version Name | 1.0.0 |
| Version Code | 2 |
| Package | com.flappyfish.game |
| Latest AAB | https://expo.dev/artifacts/eas/oYegpqEVEF8PGuxSk4KtYP.aab |

## Pending Tasks

### P1 - In Progress
- [ ] Deploy website to GitHub Pages (for privacy policy URL)
- [ ] Complete Google Play Store submission
- [ ] Verify ads working in production

### P2 - Blocked
- [ ] Finalize deep links (needs SHA-256 from Play Console after upload)

### P3 - Future/Backlog
- [ ] Add Google Analytics to website
- [ ] Onboarding/Tutorial for new players
- [ ] Social sharing features

## API Endpoints
- `POST /api/gamedata/` - Create/update user game data
- `GET /api/gamedata/{user_id}/` - Get user's game data
- `GET /api/leaderboard/` - Get top players

## Database Schema
**Collection:** `game_data`
- `user_id: string`
- `username: string`
- `high_score: int`
- `coins: int`
- `unlocked_skins: list`
- `unlocked_achievements: list`
- `updated_at: datetime`

## AdMob Configuration
- **App ID:** ca-app-pub-9210526164379066~4938293330
- **Banner:** ca-app-pub-9210526164379066/2829853361
- **Interstitial:** ca-app-pub-9210526164379066/1429141788
- **Rewarded:** ca-app-pub-9210526164379066/7004902096
- **App Open:** ca-app-pub-9210526164379066/3250641298
