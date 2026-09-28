# Lagermanager

Expo/React Native inventory-management app with Firebase authentication and a web target.

## Development

```bash
npm ci
npm start
```

For the browser target:

```bash
npm run web
```

## Web validation

The repository now validates the Expo web export in GitHub Actions with `npx expo export --platform web` on pull requests and `main` pushes.

## Security

Firebase authentication and Firestore access should be protected by deployed Firestore Security Rules. Do not use Firebase Firestore test mode for a production deployment.

## Change Log

### 2026-09-28 03:xx Europe/Vienna (CEST) — CI / Web / Security
- Added automated Expo web-export validation.
- Added project documentation and explicit production-security guidance.

> Time is recorded in Europe/Vienna; the repository change was made during this work session.
