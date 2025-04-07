import BookingCalendar from './components/calendar/bookingCalendar'
import BookingForm from './components/bookingForm/bookingForm';
import PackageButtons from './components/packageButtons/packageButtons';
import React, { useState } from 'react';
import './App.css';

function App() {
	const [packageChoice, setPackageChoice] = useState(null);
	return(
		<>
      <header className='header-bar'>
         <span className='header-title'>Spa med Spa</span>
         <img src='/candle.gif' className='candle'/>
      </header>
			<div className='calender'>
				<PackageButtons packageChoice={packageChoice} setPackageChoice={setPackageChoice} />
				<BookingCalendar packageChoice={packageChoice} />
				<BookingForm packageChoice={packageChoice} />
			</div>
		</>
	);
}



export default App;
