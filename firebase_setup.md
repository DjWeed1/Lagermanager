# Firebase Setup Anleitung

Für den Lagermanager wird ein Firebase-Projekt mit E-Mail/Passwort-Authentifizierung und Firestore benötigt.

## 1. Projekt erstellen
1. Öffne die Firebase Console.
2. Erstelle ein Projekt, z. B. `Lagermanager`.
3. Erstelle eine Web-App und übernimm die Projektkonfiguration in `src/config/firebase.ts`.

Die Firebase-Web-Konfiguration ist kein Ersatz für Firestore-Sicherheitsregeln. Zugangsschutz erfolgt über Authentication und die Rules in `firestore.rules`.

## 2. Authentication aktivieren
1. Öffne **Authentication**.
2. Aktiviere **E-Mail/Passwort**.
3. Lege einen Testbenutzer an oder registriere dich über die App.

## 3. Firestore einrichten
1. Öffne **Firestore Database**.
2. Erstelle die Datenbank in der gewünschten Region.
3. Verwende **nicht dauerhaft den Testmodus**.
4. Veröffentliche die mitgelieferte `firestore.rules` im Firebase-Projekt.

Die Regeln beschränken `rooms` und `boxes` auf den angemeldeten Benutzer, dessen UID im Dokument als `userId` gespeichert ist. Nicht angemeldete Zugriffe werden abgewiesen.

### Firebase CLI (empfohlen)

Nach Installation und Anmeldung mit der Firebase CLI:

```bash
firebase init firestore
firebase deploy --only firestore:rules
```

Wenn bereits eine lokale Firebase-Konfiguration vorhanden ist, verwende das bestehende Projekt und überschreibe die Rules nicht versehentlich mit einer anderen Projekt-ID.

## 4. Wichtige Hinweise

- Keine Service-Account-Schlüssel in das Repository committen.
- Firebase-Konfigurationen nur mit den vorgesehenen öffentlichen Client-Werten verwenden; private Server-Schlüssel gehören nicht in die App.
- Vor einem produktiven Einsatz die Firestore Rules im Firebase Emulator bzw. mit einem Testprojekt prüfen.

### Änderungsprotokoll

- **28.09.2026, 03:xx Europe/Vienna — Security:** Firestore von implizitem Testmodus auf dokumentierte, benutzerbezogene Zugriffskontrolle vorbereitet; `firestore.rules` ergänzt und Deployment beschrieben.
