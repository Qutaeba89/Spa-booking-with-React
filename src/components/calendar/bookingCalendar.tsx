import React, { useState, useEffect } from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css';
import './bookingCalendar.css'
import { format } from 'date-fns';
import { Day } from '../../App';

function BookingCalendar({ packageChoice, chosenDate, setChosenDate, bookings }: { packageChoice: string | null, chosenDate?: Date, setChosenDate, bookings: Day[] }) {
  const [redDays, setRedDays] = useState<string[]>([]);

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
          }
        } catch (error) {
          console.error("Fel vid hämtning av helgdagar:", error);
        }
      };

      redDaysFromApi();

    }, []);
  }

  //Interface för en dag.
  

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


  function colorDay({ date, view }: { date: Date, view: string }) {
    if (view !== "month" || checkDay(date, redDays)) return;



    const dateString = format(date, 'yyyy-MM-dd')
    

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

  return (
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
