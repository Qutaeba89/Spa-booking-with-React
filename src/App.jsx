import BookingCalendar from './components/calendar/bookingCalendar'
import BookingForm from './components/bookingForm/bookingForm';
import PackageButtons from './components/packageButtons/packageButtons';
import React, { useState } from 'react';
import './App.css';

function App() {
	const [packageChoice, setPackageChoice] = useState(null);
	const [chosenDate, setChosenDate] = useState(null);


	return(
		<>
      <header className='header-bar'>
         <span className='header-title'>Spa med Spa</span>
         <img src='/candle.gif' className='candle'/>
      </header>
			<div className='calender'>
				<div className='choice'>
				<PackageButtons packageChoice={packageChoice} setPackageChoice={setPackageChoice} />
				</div>
				<div className='booking'>
				<BookingCalendar packageChoice={packageChoice} chosenDate={chosenDate} setChosenDate={setChosenDate} />
				</div>
				<BookingForm packageChoice={packageChoice} chosenDate={chosenDate} />
			</div>
		</>
	);
}



export default App;
