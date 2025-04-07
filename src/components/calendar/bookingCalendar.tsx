import React, { useState, useEffect } from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css';
import './bookingCalendar.css'

function BookingCalendar({ packageChoice }: { packageChoice: string | null }) {
     const [redDays, setRedDays] = useState<string[]>([]);

     //Mock-data.
    const bookings: Day[] = [
        {date: '2025-04-03', availableTimes: 0},
        {date: '2025-04-10', availableTimes: 1},
        {date: '2025-04-17', availableTimes: 2},
        {date: '2025-04-24', availableTimes: 3},
    ];
    
    
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
    

 function tileDisabling({ date, view }: { date: Date, view: string }) {
        const dateToString = date.toLocaleDateString("sv-SE");

        if (view === "month") {
            const isMonday = date.getDay() === 1; 
            // const isWeekend = date.getDay() === 0 || date.getDay() === 6;
            const isHoliday = redDays.includes(dateToString);

            return isMonday || isHoliday; 
        }
        return false;
       
    }

//Interface för en dag.
interface Day {
    date: string;
    availableTimes: number;
}

    function colorDay({ date, view }: { date: Date, view: string }) {

        if (view != 'month') {
            return;
        }

        let dateString = date.toISOString().split('T')[0];
        let booking!: Day;

        for (let i = 0; i < bookings.length; i++) {
            if (bookings[i].date === dateString) {
                booking = bookings[i];
                break;
            }
        }

        if (!booking) {
            return 'greenDay';
        }
        if (booking.availableTimes === 0) {
            return 'redDay';
        }
        if (booking.availableTimes < 3) {
            return 'yellowDay';
        }
        return 'greenDay';
    }

    isRedDay();

  return(
    <>
       <Calendar 
            minDate={new Date()}
            tileClassName={colorDay}
            tileDisabled={tileDisabling}
        />
    </>
   );
}



export default BookingCalendar;
