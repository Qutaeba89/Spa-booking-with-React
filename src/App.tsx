import BookingCalendar from './components/calendar/bookingCalendar'
import BookingForm from './components/bookingForm/bookingForm';
import PackageButtons from './components/packageButtons/packageButtons';
import React, { useEffect, useState } from 'react';
import './App.css';

export interface Day {
  date: string;
  availableTimes: number;
}

function App() {
  const [packageChoice, setPackageChoice] = useState(null);
  const [chosenDate, setChosenDate] = useState(undefined);


  const [bookings, setBookings] = useState<Day[]>([]);

  const fetchBookings = async () => {
    try {
      const res = await fetch("http://localhost:3001/booking");
      const data = await res.json();

      const grouped: { [key: string]: number } = {};
      data.forEach((booking: any) => {
        const date = booking.bookedDate;
        grouped[date] = (grouped[date] || 0) + 1;
      });

      const formattedBookings = Object.entries(grouped).map(([date, count]) => ({
        date,
        availableTimes: 3 - count, // 3 slots per dag
      }));

      setBookings(formattedBookings);
    } catch (err) {
      console.error("Kunde inte hämta bokningar:", err);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (

    <div className='app'>

      <header className='header-bar'>
        <div className='header-content'>
          <span className='header-title'>Spa med Spa</span>
          <img src='/candle.gif' className='candle' />
        </div>
      </header>

      <main className='main-container'>
        <PackageButtons packageChoice={packageChoice} setPackageChoice={setPackageChoice} />

        <div className='booking-section'>
          <BookingCalendar packageChoice={packageChoice} chosenDate={chosenDate} setChosenDate={setChosenDate} bookings={bookings} />
        <BookingForm packageChoice={packageChoice} chosenDate={chosenDate} onBooked={fetchBookings} />
        </div>
      </main>

      <footer className='footer'>
        <span className='footer-title'>För frågor eller om Ni vill avboka er tid, vänligen kontakta oss per telefon på 010-155 53 35.</span>
        <br />
        <span className='footer-title'> © 2025 Spa med Spa</span>
      </footer>
    </div>
  );
}

export default App;
