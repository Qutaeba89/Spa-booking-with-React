import React from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css';
import './bookingCalendar.css'

//Interface för en dag.
interface Day {
    date: string;
    availableTimes: number;
}

//Mock-data.
const bookings: Day[] = [
    {date: '2025-04-03', availableTimes: 0},
    {date: '2025-04-10', availableTimes: 1},
    {date: '2025-04-17', availableTimes: 2},
    {date: '2025-04-24', availableTimes: 3},
];

function BookingCalendar({ packageChoice }: { packageChoice: string | null }) {

    function isMonday({ date, view }: { date: Date, view: string}) {
        if(date.getDay() === 1 && view === 'month') {
            return true;
        }
        return false;

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


    function isRedDay() {

    }




  return(
    <>
       <Calendar 
            minDate={new Date()}
            tileDisabled={isMonday}
            tileClassName={colorDay}
        />
    </>
   );
}



export default BookingCalendar;
