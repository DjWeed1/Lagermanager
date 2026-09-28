# Lagermanager

Mobile Lager-/Inventarverwaltung mit Expo, React Native und Firebase. Die App verwendet Firebase Authentication für Benutzerkonten und Firestore für Räume und Boxen.

## Sicherheit

- Firestore-Zugriffe sind auf den angemeldeten Benutzer begrenzt.
- `rooms` und `boxes` müssen eine `userId` besitzen, die der Firebase-UID des angemeldeten Benutzers entspricht.
- Die Regeln liegen in `firestore.rules` und werden über die Firebase CLI deployt.
- Keine privaten Firebase-Service-Account-Schlüssel in die App oder das Repository eintragen.

## Firebase

Siehe [`firebase_setup.md`](firebase_setup.md) für Einrichtung und Deployment der Firestore Rules.

## Änderungsprotokoll

- **28.09.2026, 03:xx Europe/Vienna — Security / Documentation:** Firestore-Owner-Regeln ergänzt, Setup von dauerhaftem Testmodus weg dokumentiert und Deployment der Rules beschrieben.
