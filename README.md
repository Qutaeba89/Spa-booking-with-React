#  Spa med Spa – Bokningssystem

## Beskrivning
Välkommen till **Spa med Spa** – ett bokningssystem byggt med React, TypeScript och Vite, med en lokal JSON-server som backend. Här kan användare boka behandlingar, välja tider, se tillgänglighet via en färgkodad kalender, och få prisberäkning direkt i formuläret.


Github projects länk:  
(https://github.com/users/adNord/projects/5)


## Techstack
- Vite
- TypeScript
- React
- Json server för att lokalt spara bokningar
-  API för hämtning av helgdagar (sholiday.faboul.se )

## Funktioner 
- Val av behandling ("hot" eller "cold")

- Visuellt schema med kalender

- Färgkodad tillgänglighet (grön/gul/röd)

- Formulär med validering (namn, e-post, tid, antal personer)

- Prisberäkning baserat på val

- Bokningar sparas i db.json via JSON-server

- Helgdagar hämtas från extern API för att blockera bokning


## Steg för installation
1. Klona repot
```
git clone <https://github.com/adNord/spa_grupp2>
```
2. Installera beroenden
```
npm install
```
### (Viktigt att starta i olika terminaler då de inte kan köras i samma!)
3. Starta Json server 
```
npm run server 
```
4. Starta utvecklingsserver 
```
npm run dev
```

