import React, { useState } from 'react'
import './bookingForm.css'
import './animatedButtons.css'

function BookingForm({ packageChoice, chosenDate }: { packageChoice: string | null, chosenDate }) {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
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
    function fromSubmit(e: React.FormEvent) {
        e.preventDefault();

        const bookingData = {
            name: name,
            email: email,
            timeslot: selectedTimeslot,
            nrOfPeople: numOfGuests,
            totalPrice: priceCalc({ packageType: 'hot', numOfGuests }),
            packageType: packageChoice,
            bookedDate: chosenDate ? chosenDate.toISOString() : null
          };
      
          fetch('http://localhost:3001/booking', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bookingData),
          })
            .then(res => res.json())
            .then(data => {
              alert('Bokning sparad!');
              console.log('Saved booking:', data);
                // reset all fields
              setName('');
              setEmail('');
              setNumOfGuests(0);
              setSelectedTimeslot(null);
        
            });
    }

    return(
        <div className='booking-form'>
            <h1>Booking Form</h1>
                <form onSubmit={fromSubmit}>

                    <div className='input-group'>
                        <input type="text" placeholder="Namn" value={name} onChange={(e) => setName(e.target.value)} required />
                        <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <span>Varm Behandling {chosenDate ? chosenDate.toLocaleDateString() : ''} </span>
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
                    <div className="select-group">
                        <label htmlFor="nrOfPeople">Antal Personer:</label>
                        
                    <select 
                        name="nrOfPeople" 
                        id="nrOfPeople"
                        value={numOfGuests}
                        onChange={(e) => setNumOfGuests(Number(e.target.value))}
                        required
                    >
                        <option value="" disabled selected>Antal Personer</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                    </select>
                    </div>
                    <span>Pris: {numOfGuests !== 0 && packageChoice ? (priceCalc({ packageType: packageChoice, numOfGuests })) + " kr" : ''} </span>
                    <button>Boka</button>
                </form>
        </div>
    );
}



export default BookingForm;