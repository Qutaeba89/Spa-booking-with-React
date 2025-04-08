import React, { useState, useEffect } from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css';
import './bookingCalendar.css'

function BookingCalendar({ packageChoice, chosenDate, setChosenDate }: { packageChoice: string | null, chosenDate: Date, setChosenDate }) {
     const [redDays, setRedDays] = useState<string[]>([]);

    //  Mock-data.
    // const bookings: Day[] = [
    //     {date: '2025-04-03', availableTimes: 0},
    //     {date: '2025-04-10', availableTimes: 1},
    //     {date: '2025-04-17', availableTimes: 2},
    //     {date: '2025-04-24', availableTimes: 3},
    // ];

    
    
     function isRedDay() {
         useEffect(() => {
             const redDaysFromApi = async () => {
                try {
                const year = new Date().getFullYear();
                const response = await fetch(`http://sholiday.faboul.se/dagar/v2.1/${year}`);
                const data = await response.json();

                if (data.dagar) {
                    const redDays = data.dagar
                    .filter((day: any) => day.helgdag)
                    .map((day: any) => day.datum);

                    setRedDays(redDays);
                    console.log(redDays);
                }
            } catch (error) {
                console.error("Fel vid hämtning av helgdagar:", error);
            }
        };

        redDaysFromApi();
        
    }, []);
    }
    const [bookings, setBookings] = useState<Day[]>([]);

useEffect(() => {
  const fetchBookings = async () => {
    try {
      const res = await fetch("http://localhost:3001/booking");
      const data = await res.json();

      const grouped: { [key: string]: number } = {};
      data.forEach((booking: any) => {
        const date = booking.bookedDate.split("T")[0];
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

  fetchBookings();
}, []);

    function checkDay(date: Date, redDays: string[]) {
        const dateToString = date.toLocaleDateString("sv-SE");
        const isMonday = date.getDay() === 1;
        const isHoliday = redDays.includes(dateToString);
        return isMonday || isHoliday;
      }
    

 function tileDisabling({ date, view }: { date: Date, view: string }) {
        if (view === "month") {
           
            return checkDay(date, redDays);
        }
        return false;
       
    }

//Interface för en dag.
interface Day {
    date: string;
    availableTimes: number;
}

    function colorDay({ date, view }: { date: Date, view: string }) {
        if (view !== "month" || checkDay(date, redDays)) return;

      

        const dateString = date.toISOString().split('T')[0];
       
        const booking = bookings.find(b => b.date === dateString);



        if (!booking) 
            return 'greenDay';
        
        if (booking.availableTimes === 0) 
            return 'redDay';
        
        if (booking.availableTimes < 3) 
            return 'yellowDay';
        
        return 'greenDay';
    }

    isRedDay();

  return(
    <>
       <Calendar 
            minDate={new Date()}
            tileClassName={colorDay}
            tileDisabled={tileDisabling}
            onChange={setChosenDate}
        />
    </>
   );
}



export default BookingCalendar;
