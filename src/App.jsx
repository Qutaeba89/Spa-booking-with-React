import BookingCalendar from './components/calendar/bookingCalendar'
import BookingForm from './components/bookingForm/bookingForm';
import PackageButtons from './components/packageButtons/packageButtons';
import React, { useState } from 'react';

function App() {
	const [packageChoice, setPackageChoice] = useState(null);
	return(
		<>
			<PackageButtons packageChoice={packageChoice} setPackageChoice={setPackageChoice} />
			<BookingCalendar packageChoice={packageChoice} />
			<BookingForm packageChoice={packageChoice} />
		</>
	);
}



export default App;
