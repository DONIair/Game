# APEX Racing

Ein browserbasiertes 3D-Grand-Prix-Rennen mit modelliertem Sportwagen, fünf auswählbaren Strecken, Startampel und Multiplayer-Räumen.

## Starten

Die Seite braucht einen lokalen Webserver, da Three.js als ES-Modul geladen wird. Im Projektordner zum Beispiel:

```sh
python3 -m http.server 8000
```

Danach `http://localhost:8000` im Browser öffnen. Für 3D und Multiplayer ist eine Internetverbindung erforderlich.

## Gemeinsam fahren

1. Einen Namen eingeben und **Raum erstellen** wählen.
2. Den sechsstelligen Raumcode mit den Mitfahrern teilen.
3. Die anderen öffnen dieselbe Seite, geben den Code ein und wählen **Beitreten**.
4. Der Ersteller wählt eine Strecke und 3, 5 oder 10 Runden und startet das Rennen. Zur Auswahl stehen ein verlängerter Club-Rundkurs, ein Leichtathletik-Oval sowie die drei verlängerten, fiktiven Formel-1-Strecken Alpine GP, Coastal GP und Forest GP. Die Strecken sind etwa 3 bis 5 km lang. Nach der Startampel fahren alle gleichzeitig; bis zu acht Fahrer können teilnehmen.

Die Mitspieler verbinden sich über PeerJS und den öffentlichen PeerServer. Das Rennen läuft direkt in den Browsern; der Raum-Ersteller verteilt die Fahrzeugpositionen und die gewählte Strecke. **↑** gibt Gas, **↓** bremst und **← / →** lenken. Bei einem Aufprall auf die Leitplanke verliert der Wagen Tempo, prallt ab und nimmt sichtbaren Schaden. **R** setzt ihn zurück.

Jede Vorwärtsüberquerung der Start-/Ziellinie zählt eine Runde; eine Rückwärtsüberquerung zieht eine Runde ab. Checkpoints gibt es nicht. Im Multiplayer erkennt der Rennleiter Zusammenstöße: Das langsamere Auto scheidet aus dem Rennen aus.
