# APEX Racing

Ein browserbasiertes 3D-Autorennen mit Sportwagen, Rundkurs und Multiplayer-Räumen.

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
4. Der Ersteller startet das Rennen. Bis zu acht Fahrer können teilnehmen.

Die Mitspieler verbinden sich über PeerJS und den öffentlichen PeerServer. Das Rennen läuft direkt in den Browsern; der Raum-Ersteller verteilt die Fahrzeugpositionen. Fürs Fahren: **↑** Gas, **↓** Bremse, **← / →** lenken, **R** zurücksetzen.