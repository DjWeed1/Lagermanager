# Firebase Setup Anleitung

Damit die App funktioniert, benötigst du ein kostenloses Firebase-Projekt. Folge diesen Schritten:

## 1. Projekt erstellen
1.  Gehe auf [console.firebase.google.com](https://console.firebase.google.com/).
2.  Melde dich mit deinem Google-Konto an.
3.  Klicke auf **"Projekt hinzufügen"**.
4.  Nenne es "Lagermanager" und klicke auf "Weiter" (Google Analytics kannst du deaktivieren).
5.  Klicke auf **"Projekt erstellen"**.

## 2. App registrieren & Config kopieren
1.  Klicke im Projekt auf das **Web-Symbol** (`</>`) (unter "Los gehts, füge Firebase zu deiner App hinzu").
2.  Gib der App einen Namen (z.B. "Lagermanager Web") und klicke auf **"App registrieren"**.
3.  Du siehst nun einen Code-Block mit `const firebaseConfig = { ... };`.
4.  **KOPIERE diesen Block** (nur den Teil zwischen den geschweiften Klammern `{ ... }`).
5.  **Sende mir diesen Code** oder füge ihn selbst in `src/config/firebase.ts` ein.

## 3. Authentication aktivieren (WICHTIG)
1.  Gehe im linken Menü auf **"Erstellen"** -> **"Authentication"**.
2.  Klicke auf **"Los gehts"**.
3.  Wähle **"E-Mail/Passwort"** als Anbietermethode.
4.  Aktiviere den Schalter **"Aktivieren"** und klicke auf **"Speichern"**.

## 4. Firestore Datenbank erstellen (WICHTIG)
1.  Gehe im linken Menü auf **"Erstellen"** -> **"Firestore Database"**.
2.  Klicke auf **"Datenbank erstellen"**.
3.  Wähle einen Standort (z.B. `eur3` für Europa) und klicke auf "Weiter".
4.  Wähle **"Im Testmodus starten"** (damit wir sofort loslegen können) und klicke auf **"Erstellen"**.

---
Sobald du mir die Config geschickt hast, trage ich sie für dich ein!
