# Spa med Spa — Booking System

A spa treatment booking system built with React, TypeScript, and Vite, backed by a local JSON
server. Users can book treatments, pick a time slot, see availability on a color-coded calendar,
and get an instant price calculation.

Built as a group project with 4 students. My focus was on the booking form, calendar, and pricing
logic.

## Features

- Choose a treatment ("hot" or "cold")
- Visual calendar schedule with color-coded availability (green / yellow / red)
- Validated booking form (name, email, time, number of people)
- Automatic price calculation based on selections
- Bookings persisted to `db.json` via `json-server`
- Public holidays fetched from an external API to block bookings on those dates

## Tech stack

Vite, TypeScript, React, `json-server` (local persistence), [sholiday.faboul.se](https://sholiday.faboul.se) (holiday API).

## Getting started

**Prerequisites:** Node.js 18+, npm.

```bash
git clone https://github.com/Qutaeba89/Spa-booking-with-React.git
cd Spa-booking-with-React
npm install
```

Run the JSON server and the dev server in **separate terminals**:

```bash
npm run server   # json-server on :3001
npm run dev      # Vite dev server
```

## Project structure

```
src/
  App.tsx
  components/
    bookingForm/bookingForm.tsx      # form + validation + pricing
    calendar/bookingCalendar.tsx      # color-coded availability calendar
    packageButtons/packageButtons.tsx # treatment selection
```

## Scripts

```bash
npm run dev      # dev server
npm run build    # production build
npm run lint     # eslint
npm run server   # local JSON persistence server
```
