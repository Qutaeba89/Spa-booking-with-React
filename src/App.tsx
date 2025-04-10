import BookingCalendar from './components/calendar/bookingCalendar'
import BookingForm from './components/bookingForm/bookingForm';
import PackageButtons from './components/packageButtons/packageButtons';
import React, { useEffect, useState } from 'react';
import './App.css';

//Interface som innehåller nödvändig information för en dag i kalendern. 
export interface Day {
  date: string;
  availableTimes: number;
  packageType: 'hot' | 'cold';
}

//Huvudkomponenten.
function App() {

  //Variabler för en användares val samt tillgängliga bokningar från databasen.
  const [packageChoice, setPackageChoice] = useState(null);
  const [chosenDate, setChosenDate] = useState(undefined);
  const [bookings, setBookings] = useState<Day[]>([]);

  //Funktion som hämtar bokningar från databasen och grupperar bokningarna efter datum och behandling.
  const fetchBookings = async () => {
    try {
      const res = await fetch("http://localhost:3001/booking");
      const data = await res.json();
      const grouped: { [key: string]: number } = {};

      //Loopar igenom varje bokning och skapar en nyckel baserat på datum och behandling (för att räkna antalet bokningar per kombination).
      data.forEach((booking: any) => {
        const date = booking.bookedDate;
        const key = `${date}|${booking.packageType}`;
        grouped[key] = (grouped[key] || 0) + 1;
      });

      //Konverterar de grupperade bokningarna till en lista med datum, lediga tider och behandlingstyp.
      const formattedBookings = Object.entries(grouped).map(([key, count]) => {
        const [date, packageType] = key.split('|') as [string, 'hot' | 'cold'];
        return {
          date,
          availableTimes: 3 - count,
          packageType,
        };
      });

      //Uppdaterar bokningslistan i state med de formaterade bokningarna.
      setBookings(formattedBookings);

    } catch (err) {
      console.error("Kunde inte hämta bokningar:", err);
    }
  };

  //Funktionen fetchBookings körs en gång vid uppstart.
  useEffect(() => {
    fetchBookings();
  }, []);

  //Renderar gränssnittet på sidan med header, kalender, bokningsformulär och footer.
  return (

    <div className='app'>
      <div className='spa-pic'>

      {/* Header. */}
      <header className='header-bar'>
        <div className='header-content'>
          <span className='header-title'>Spa med Spa</span>
          {/* <img src='/candle.gif' className='candle' alt="img" /> */}
        </div>
      </header>

      {/* Huvudinnehåll (val av behandling, kalender och bokningsformulär). */}
      <main className='main-container'>
        <span className='blink'>Just nu Tisdag har vi 15% rabbat boka nu!</span>
        <div className='booking-layout-wrapper'>
          <div className='booking-layout-calendar'>
            <BookingCalendar
              packageChoice={packageChoice}
              chosenDate={chosenDate}
              setChosenDate={setChosenDate}
              bookings={bookings}
            />
            <PackageButtons packageChoice={packageChoice} setPackageChoice={setPackageChoice} />
          </div>

          <div className='booking-section'>
            <BookingForm
              packageChoice={packageChoice}
              chosenDate={chosenDate}
              onBooked={fetchBookings}
            />
          </div>
        </div>
      </main>


      {/* Footer. */}

    </div>
    <footer className='footer'>
        <span className='footer-title'>För frågor eller om Ni vill avboka er tid, vänligen kontakta oss per telefon på 010-155 53 35.</span>
        <br />
        <span className='footer-title'> © 2025 Spa med Spa</span>
      </footer>
    </div>
  );
}

export default App;
