# Flappy Fish - Product Requirements Document

## Original Problem Statement
Build a "Flappy Bird" clone named "Flappy Fish" as a React Native mobile application for Android, with monetization through Google AdMob ads.

## Core Requirements
1. **Core Gameplay**: Tap-to-swim mechanics
2. **Monetization**: Banner, Interstitial, Rewarded ads via Google AdMob
3. **Features**: Power-ups, unlockable skins, cloud data sync (FastAPI/MongoDB), leaderboard, achievements, daily rewards, notifications, best taps streak
4. **Platform**: React Native (Expo) for Google Play, Amazon Appstore, and Samsung Galaxy Store
5. **Promotional Website**: Custom landing page with deep linking

## Architecture
```
/app/
├── backend/
│   └── server.py (FastAPI + MongoDB)
└── flappy-fish746com/
    ├── src/
    │   ├── components/ (BannerAdComponent, LeaderboardModal, LegalModal, StartScreen, TutorialModal)
    │   ├── context/ (AdsContext, CloudSyncContext, NotificationsContext)
    │   └── screens/ (FlappyFishGame)
    ├── website/ (index.html, privacy-policy.html, terms-of-service.html, data-deletion.html)
    ├── App.js
    └── app.json
```

## Completed Features
- [x] Core tap-to-swim gameplay mechanics
- [x] 8 unlockable fish skins
- [x] Power-ups (Bubble Shield, Slow Motion, Coin Magnet, Double Coins)
- [x] Global leaderboard with MongoDB backend
- [x] 15+ achievements system
- [x] Daily rewards with streak tracking
- [x] Banner, Interstitial, Rewarded ads (AdMob)
- [x] Cloud data sync
- [x] Push notifications (streak reminders, daily challenges)
- [x] "Welcome Back" re-engagement system
- [x] Interactive tutorial for new players
- [x] In-app Legal Modal (Terms, Privacy)
- [x] Adaptive & Collapsible Banner Ads
- [x] Promo video and banner images
- [x] Promotional website with Desktop-to-Mobile QR conversion (Updated Dec 2025)

## Pending Issues

### P0 - Google Play Policy Violation: Interruptive Interstitial Ads
- **Status**: IN PROGRESS
- **Problem**: Interstitial ads triggering unexpectedly
- **Solution**: Modify AdsContext.js to only show interstitials AFTER Game Over screen, before retry
- **Files**: `/app/flappy-fish746com/src/context/AdsContext.js`, `/app/flappy-fish746com/src/screens/FlappyFishGame.js`

### P1 - Data Deletion Link Validation
- **Status**: USER VERIFICATION PENDING
- **Problem**: Play Store rejected due to invalid data deletion URL
- **Solution**: Created `/app/flappy-fish746com/website/data-deletion.html`, user needs to push to GitHub Pages

### P2 - Google Ads Tag Setup
- **Status**: BLOCKED (awaiting user's Conversion ID)
- **Problem**: Need conversion tracking for ad campaigns

## Upcoming Tasks
- Submit updated AAB (v17+) to Google Play after ad policy fix
- Submit APK to Amazon Appstore (excluding Fire TV devices)

## Future/Backlog
- iOS App Store port
- Social sharing features (share high scores)

## Key Credentials
- Expo Token: `Zz9YeRL2ddPOTT3BV4-rgVjvhKDYFJZhxcMSFqLr`
- Google Play App ID: `com.flappyfish.game`
- Website: `https://flappyfish746.com`

## Database Schema
```javascript
game_data: {
  user_id: string,
  username: string,
  high_score: int,
  coins: int,
  unlocked_skins: list,
  unlocked_achievements: list,
  best_tap_streak: int,
  updated_at: datetime
}
```

## Last Updated
December 8, 2025 - Landing page UI updated with Desktop-to-Mobile QR conversion layout
