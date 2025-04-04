import React from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css';

function BookingCalendar({ packageChoice }: { packageChoice: string | null }) {

    function isMonday({ date, view }: { date: Date, view: string}) {
        if(date.getDay() == 1 && view == 'month') {
            return true;
        }
        return false;

    }

    function isRedDay() {

    }




  return(
    <>
       <Calendar 
            minDate={new Date()}
            tileDisabled={isMonday}
        />
    </>
   );
}



export default BookingCalendar;
