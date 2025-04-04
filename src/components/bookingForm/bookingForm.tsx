import React, { useState } from 'react'
import './bookingForm.css'
import './animatedButtons.css'

function BookingForm() {

    const [numOfGuests, setNumOfGuests] = useState<number>(0);
    const [selectedTimeslot, setSelectedTimeslot] = useState<string | null>(null);
    const timeslotInfo: { [key: string]: string } = {
        Sunrise: "06:00 - 10:00",
        Day: "12:00 - 16:00",
        Sunset: "18:00 - 22:00"
    };

    function priceCalc({ packageType, numOfGuests }: { packageType: String, numOfGuests: number}) {
        return (350 + numOfGuests * (packageType == "hot" ? 700 : 500))
    }

    return(
        <div className='booking-form'>
            <h1>Booking Form</h1>
                <form>
                    <div className='input-group'>
                        <input type="text" placeholder='Namn' />
                        <input type="text" placeholder='Email' />
                    </div>
                    <span>Varm Behandling</span>
                    <div className='button-group'>
                        {['Sunrise', 'Day', 'Sunset'].map((timeslot) =>
                            <div key={timeslot} className='timeslot-container'>
                                <button
                                key={timeslot}
                                type='button'
                                className={selectedTimeslot === timeslot ? 'selected' : ''}
                                onClick={() => setSelectedTimeslot(timeslot)}
                                >
                                    <span>{timeslot}</span>
                                    <span className='timeslot-info'>{timeslotInfo[timeslot]}</span>
                                </button>
                            </div>
                        )}
                    </div>
                    <select 
                        name="nrOfPeople" 
                        id=""
                        onChange={(e) => setNumOfGuests(Number(e.target.value))}
                    >
                        <option value="" disabled selected>Antal Personer</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                    </select>
                    <span>Pris: {numOfGuests !== 0 ? (priceCalc({ packageType: "hot", numOfGuests })) + " kr" : ''} </span>
                    <button>Boka</button>
                </form>
        </div>
    );
}



export default BookingForm;