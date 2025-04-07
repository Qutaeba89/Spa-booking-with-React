import BookingCalendar from './components/calendar/bookingCalendar'
import BookingForm from './components/bookingForm/bookingForm';
import PackageButtons from './components/packageButtons/packageButtons';
import React, { useState } from 'react';
import './App.css';

function App() {
	const [packageChoice, setPackageChoice] = useState(null);
	return(
		<div className='app'>
         <header className='header-bar'>
            <div className='header-content'>
               <span className='header-title'>Spa med Spa</span>
               <img src='/candle.gif' className='candle'/>
            </div>
            
         </header>

			   <div className='calender'>
				   <PackageButtons packageChoice={packageChoice} setPackageChoice={setPackageChoice} />
				   <BookingCalendar packageChoice={packageChoice} />
				   <BookingForm packageChoice={packageChoice} />
		      </div>

         <footer className='footer'>
            <span className='footer-title'>För frågor eller om Ni vill avboka er tid, vänligen kontakta oss per telefon på 010-155 53 35.</span>
            <br />
            <span className='footer-title'> © 2025 Spa med Spa</span>
         </footer>
		</div>
      
	);
}

export default App;
