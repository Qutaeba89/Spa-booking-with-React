import React, { useState, useEffect } from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css';
import './bookingCalendar.css'
import { format } from 'date-fns';
import { Day } from '../../App';

//Komponent för kalendern. Inparametrar:
// - packageChoice: vald behandling ('hot', 'cold' eller 'null').
// - chosenDate: valt datum (Date-objekt eller undefined).
// - setChosenDate: funktion som uppdaterar valt datum.
// - bookings: lista med Day-interfaces som innehåller data om bokningar. 
function BookingCalendar({ packageChoice, chosenDate, setChosenDate, bookings }: { packageChoice: string | null, chosenDate?: Date, setChosenDate, bookings: Day[] }) {

  //Lista som innehåller röda dagar (helgdagar).
  const [redDays, setRedDays] = useState<string[]>([]);

    
    useEffect(() => {
      //Funktion som hämtar röda dagar för kalendern från ett API.
      const redDaysFromApi = async () => {
        try {
          //Nuvarande år.
          const year = new Date().getFullYear();
          //Hämtar röda dagar från API. 
          const response = await fetch(`http://sholiday.faboul.se/dagar/v2.1/${year}`);
          //Konverterar till ett JavaScript-objekt.
          const data = await response.json();

          if (data.dagar) {
            const redDays = data.dagar
              //Filterar endast röda dagar.
              .filter((day: any) => day.helgdag)
              //Extraherar datumsträngen.
              .map((day: any) => day.datum);

            //Uppdaterar listan.
            setRedDays(redDays);

            console.log(redDays);

          }
        } catch (error) {
          console.error("Fel vid hämtning av helgdagar:", error);
        }
      };

      redDaysFromApi();

      //Funktionen körs en gång vid uppstart ([]).
    }, []);
  
  //Funktion som returnerar true om en dag är en måndag eller röd dag. Inparametrar:
  // - date: ett Date-objekt.
  // - redDays: lista med röda dagar som strängar.  
  function checkDay(date: Date, redDays: string[]) {
    //Konverterar datumet till en sträng.
    const dateToString = date.toLocaleDateString("sv-SE");
    //Kollar om måndag.
    const isMonday = date.getDay() === 1;
    //Kollar om datumet finns i listan med röda dagar.
    const isHoliday = redDays.includes(dateToString);
    return isMonday || isHoliday;
  }

  //Funktion som används för att kunna inaktivera måndagar och helgdagar (i månadsvyn). Inparametrar:
  // - date: ett Date-objekt.
  // - view: kalendervyn (sträng).
  function tileDisabling({ date, view }: { date: Date, view: string }) {
    if (view === "month") {
      return checkDay(date, redDays);
    }
    return false;

  }

  //Funktion som färglägger dagarna beroende på bokningstider. Inparametrar:
  // - date: ett Date-objekt.
  // - view: kalendervyn (sträng).
  function colorDay({ date, view }: { date: Date, view: string }) {

    //Ingen färgläggning om inte månadsvy eller för måndagar/röda dagar.
    if (view !== "month" || checkDay(date, redDays)) return;

    //Formatterar datumet till en sträng.
    const dateString = format(date, 'yyyy-MM-dd')

    console.log('dateString: ', dateString)

    //Hittar bokningar som matchar både datum och behandling.
    const booking = bookings.find(
      b => b.date === dateString && b.packageType === packageChoice
    );    

    //Returnerar färger för dagarna.
    if (!booking)
      return 'green-day';
    if (booking.availableTimes === 0)
      return 'red-day';
    if (booking.availableTimes < (packageChoice === 'relax' ? 2 : 3))
      return 'yellow-day';
    return 'green-day';
  }

  //Rendering av kalendern.
  return (
    <>
      <Calendar
        //Förhindrar val av tidigare datum.
        minDate={new Date()}
        //Färgläggning.
        tileClassName={colorDay}
        //Inaktiverade datum.
        tileDisabled={tileDisabling}
        //Uppdaterar datum när användaren väljer en dag.
        onChange={setChosenDate}
      />
    </>
  );
}

export default BookingCalendar;
