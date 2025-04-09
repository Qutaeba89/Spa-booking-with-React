import React, { useState } from 'react'
import { format } from 'date-fns';
import './bookingForm.css'
import './animatedButtons.css'
import { Day } from '../../App';

function BookingForm({ packageChoice, chosenDate, onBooked }: { packageChoice: string | null, chosenDate?: Date, onBooked: () => void }) {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [numOfGuests, setNumOfGuests] = useState<number>(1);
    const [selectedTimeslot, setSelectedTimeslot] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);


    const timeslotInfo: { [key: string]: string } = {
        Sunrise: "06:00 - 10:00",
        Day: "12:00 - 16:00",
        Sunset: "18:00 - 22:00"
    };

    function priceCalc({ packageType, numOfGuests }: { packageType: String, numOfGuests: number }) {
        return (350 + numOfGuests * (packageType == "hot" ? 700 : 500))
    }
    function getPackageLabel(choice: string | null) {
        if (choice === 'hot') return 'Varm';
        if (choice === 'cold') return 'Kall';
        return '';
    }
    function fromSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!chosenDate || !selectedTimeslot || !packageChoice) {
            alert("Vänligen fyll i alla fält och välj datum, tid och paket.");
            return;
        }

        const bookingData = {
            name: name,
            email: email,
            timeslot: selectedTimeslot,
            nrOfPeople: numOfGuests,
            totalPrice: priceCalc({ packageType: 'hot', numOfGuests }),
            packageType: packageChoice,
            bookedDate: chosenDate ? format(chosenDate, 'yyyy-MM-dd') : null
        };

        setLoading(true);

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
                onBooked();
            })
            .catch(err => {
                alert("Något gick fel!")
            })
            .finally(() => setLoading(false));
    }

    return (
        <div className='booking-form'>
            <h1>Booking Form</h1>
            <form onSubmit={fromSubmit}>

                <div className='input-group'>
                    <input type="text" placeholder="Namn" value={name} onChange={(e) => setName(e.target.value)} required />
                    <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <span>{getPackageLabel(packageChoice)} Behandling {chosenDate ? chosenDate.toLocaleDateString() : ''} </span>
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
                        <option value="" disabled hidden>Antal Personer</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        {/* <option value="5">5</option> */}
                    </select>
                </div>
                <span>Pris: {numOfGuests !== 0 && packageChoice ? (priceCalc({ packageType: packageChoice, numOfGuests })) + " kr" : ''} </span>
                <button className='package-btn-boka' type='submit' disabled={loading}>
                        {loading ? <span className="spinner"></span> : 'Boka'}
                </button>            </form>
        </div>
    );
}



export default BookingForm;