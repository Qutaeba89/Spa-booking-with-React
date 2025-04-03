import React from 'react'
import Calendar from 'react-calendar'

function BookingCalendar() {

    function isMonday({ date }: { date: Date}) {
        if(date.getDay() == 1) {
            return true;
        }
        return false;

    }
  return(
    <>
       <Calendar tileDisabled={isMonday} />
    </>
   );
}



export default BookingCalendar;
