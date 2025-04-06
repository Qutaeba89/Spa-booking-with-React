import BookingCalendar from './components/calendar/bookingCalendar'
import BookingForm from './components/bookingForm/bookingForm';
import './App.css'

function App() {
  return(
    <>  
      <header className='header-bar'>
         <span className='header-title'>Spa med Spa</span>
         <img src='/candle.gif' className='candle'/>
      </header>
      <BookingCalendar />
      <BookingForm />
    </>
   );
}



export default App;
