# APEX Racing

Ein browserbasiertes 3D-Grand-Prix-Rennen mit modelliertem Sportwagen, fünf auswählbaren Strecken, Startampel und Multiplayer-Räumen.

## Starten

Die Seite und die öffentliche Rennliste werden vom Node-Server bereitgestellt. Im Projektordner starten:

```sh
npm start
```

Danach `http://localhost:8000` im Browser öffnen. Für 3D und Multiplayer ist eine Internetverbindung erforderlich. Für öffentliche Rennen muss der Node-Server erreichbar sein; die eigentlichen Rennverbindungen laufen weiterhin über PeerJS.

Die Tests für den öffentlichen Rennkatalog laufen mit `npm test`.

## Online stellen

1. Das Projekt zu GitHub pushen.
2. Bei [Render](https://render.com) mit GitHub anmelden.
3. Im Render-Dashboard **New → Blueprint** wählen und dieses GitHub-Repository verbinden.
4. Render erkennt `render.yaml`. **Apply** startet die Bereitstellung.
5. Nach dem Start die angezeigte `onrender.com`-Adresse teilen. Für öffentliche Rennen müssen alle Spieler dieselbe Adresse verwenden; die GitHub-Pages-Adresse startet den Node-Server nicht.

Der kostenlose Render-Dienst kann nach längerer Inaktivität pausieren und beim nächsten Aufruf kurz zum Aufwachen brauchen.

## Gemeinsam fahren

1. Einen Namen eingeben und **Raum erstellen** wählen.
2. Den sechsstelligen Raumcode mit den Mitfahrern teilen.
3. Die anderen öffnen dieselbe Seite, geben den Code ein und wählen **Beitreten**.
4. Der Ersteller wählt eine Strecke und 3, 5 oder 10 Runden und startet das Rennen. Zur Auswahl stehen ein verlängerter Club-Rundkurs, ein Leichtathletik-Oval sowie die drei verlängerten, fiktiven Formel-1-Strecken Alpine GP, Coastal GP und Forest GP. Die Strecken sind etwa 3 bis 5 km lang. Nach der Startampel fahren alle gleichzeitig; bis zu acht Fahrer können teilnehmen.

Im Rennraum kann der Host **Öffentliches Rennen** aktivieren. Dann erscheint der Raum im Lobby-Reiter **Laufende Rennen** und kann dort direkt ausgewählt werden. Nicht öffentliche Räume bleiben nur per Einladungscode erreichbar. Verwaiste Einträge laufen automatisch ab.

Die Mitspieler verbinden sich über PeerJS und den öffentlichen PeerServer. Das Rennen läuft direkt in den Browsern; der Raum-Ersteller verteilt die Fahrzeugpositionen und die gewählte Strecke. **↑** gibt Gas, **↓** bremst und **← / →** lenken. Bei einem Aufprall auf die Leitplanke verliert der Wagen Tempo, prallt ab und nimmt sichtbaren Schaden. **R** setzt das Auto zurück, ohne den Rundenstand zu verändern.

Das Rennen startet bei **0/Rundenanzahl**; die erste Vorwärtsüberquerung der Start-/Ziellinie zählt als Runde 1. Jede weitere Vorwärtsüberquerung zählt eine Runde, rückwärts wird eine abgezogen. Checkpoints gibt es nicht. **R** setzt das Auto auf die Strecke hinter die Ziellinie zurück, damit Zurücksetzen keine zusätzlichen Runden ermöglicht. Im Multiplayer erkennt der Rennleiter Zusammenstöße: Das langsamere Auto scheidet aus dem Rennen aus.
