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
- [x] Built preview APK for testing - Test ads confirmed working
- [x] Enabled ProGuard for production builds
- [x] Generated AAB with version code 3
- [x] Deobfuscation/mapping file included in AAB
- [x] Data deletion endpoint added to backend
- [x] Website deployed to GitHub Pages
- [x] DNS configured via Cloudflare
- [x] SSL/HTTPS enabled
- [x] Deep links configured with SHA-256 fingerprint

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
- [x] IAP/Shop removal (per user request)

## Current Build Info
| Field | Value |
|-------|-------|
| Version Name | 1.0.0 |
| Version Code | 3 |
| Package | com.flappyfish.game |
| Latest AAB | https://expo.dev/artifacts/eas/wxkjKZsfwnU1JVyf3nELw4.aab |

## Live URLs
| URL | Purpose |
|-----|---------|
| https://flappyfish746.com | Landing page |
| https://flappyfish746.com/privacy-policy.html | Privacy policy |
| https://flappyfish746.com/.well-known/assetlinks.json | Deep links |

## Status: READY FOR PLAY STORE SUBMISSION ✅

### Completed Steps:
- [x] Privacy policy URL added
- [x] Data safety form completed
- [x] Ads declaration completed
- [x] Content rating completed
- [x] Target audience set
- [x] AAB uploaded
- [x] Store listing complete
- [x] Deep links configured
- [x] Website live with HTTPS

## API Endpoints
- `POST /api/gamedata/` - Create/update user game data
- `GET /api/gamedata/{user_id}/` - Get user's game data
- `GET /api/leaderboard/` - Get top players
- `GET /api/user/delete-request` - Data deletion page
- `POST /api/user/delete-request` - Request data deletion
- `DELETE /api/user/{user_id}/data` - Delete user data

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

## Deep Links Configuration
- **SHA-256:** 91:D1:46:2A:E0:0C:6C:8E:72:13:BE:17:61:50:5F:FD:3B:DE:6E:18:9E:EE:9D:19:D9:CB:8E:14:56:D6:35:9E
- **Package:** com.flappyfish.game

## Future Tasks (Backlog)
- [x] Add Google Analytics to website ✅ (Measurement ID: G-98YGZNQEYM)
- [ ] Onboarding/Tutorial for new players
- [ ] Social sharing features
- [ ] Monitor production ads after Play Store approval
