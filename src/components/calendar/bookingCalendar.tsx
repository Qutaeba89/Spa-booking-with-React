import React, { useState, useEffect } from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css';

function BookingCalendar() {
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
            const isWeekend = date.getDay() === 0 || date.getDay() === 6;
            const isHoliday = redDays.includes(dateToString);

            return isMonday || isWeekend || isHoliday; 
        }
        return false;
       
    }
 isRedDay();
   
  return(
    <>
       <Calendar 
            minDate={new Date()}
            tileDisabled={tileDisabling}
        />
    </>
   );
}



export default BookingCalendar;
