import React, { useEffect, useState } from 'react'
import { format } from 'date-fns';
import './bookingForm.css'
import './animatedButtons.css'
import { Day } from '../../App';

//Komponent för bokningsformuläret. Inparametrar:
// - packageChoice: vald behandling ('hot', 'cold' eller 'null').
// - chosenDate: valt datum (Date-objekt eller undefined).
// - onBooked: funktion som uppdaterar kalendern efter en bokning. 
function BookingForm({ packageChoice, chosenDate, onBooked }: { packageChoice: string | null, chosenDate?: Date, onBooked: () => void }) {

    //Variabler som lagras i en bokning.
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [numOfGuests, setNumOfGuests] = useState<number>(1);
    const [selectedTimeslot, setSelectedTimeslot] = useState<string | null>(null);
    const [bookedTimeslots, setBookedTimeslots] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    //Objekt som kopplar behandlingarna till olika tider.
    const timeslotInfo: { [key: string]: string } = {
        Sunrise: "06:00 - 10:00",
        Day: "12:00 - 16:00",
        Sunset: "18:00 - 22:00"
    };


    //Funktion som beräknar priset för en bokning.
    useEffect(() => {
        if (chosenDate) {
            const formattedDate = format(chosenDate, 'yyyy-MM-dd');
            fetch(`http://localhost:3001/booking?date=${formattedDate}`)
                .then(result => result.json())
                .then(data => {
                    setBookedTimeslots(data
                        .filter((booking: {packageType: string, bookedDate: string}) => booking.packageType === packageChoice && booking.bookedDate === formattedDate)
                        .map((booking: {timeslot: string}) => booking.timeslot)
                    )
                })
                .catch(err => console.error('error when fetching bookings: ', err));
        }
    }, [chosenDate, packageChoice])


    function priceCalc({ packageType, numOfAdults, numOfKids }: { packageType: String, numOfAdults: number, numOfKids: number }) {

        const price = 350 + numOfAdults * (packageType == "hot" ? 700 : 500) + numOfKids * (packageType == "hot" ? 700 : 500) * 0.5;
        
        if (chosenDate?.getDay() === 2) {
            return price * 0.85;
            console.log("Tisdagsrabatt");
        }
        return price;
    }

    //Funktion som returnerar svenska strängar beroende på behandling.
    function getPackageLabel(choice: string | null) {
        if (choice === 'hot') return 'Varm';
        if (choice === 'cold') return 'Kall';
        return '';
    }

    //Funktion som hanterar datan som skickas i bokningsformuläret. Tar in ett event-objekt. 
    function fromSubmit(e: React.FormEvent) {

        //Förhindrar att sidan laddas om.
        e.preventDefault();

        if (!email.includes("@") || email.length < 5) {
            alert("Ange en giltig e-postadress.");
            return;
        }
        if (!chosenDate || !selectedTimeslot || !packageChoice) {
            alert("Vänligen fyll i alla fält och välj datum, tid och paket.");
            return;
        }

        //Objekt som skickas till databasen. Innehåller information om bokningen.
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

        //Skickar en bokning till databasen ('POST') och återställer formuläret.
        fetch('http://localhost:3001/booking', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bookingData),
        })
            .then(res => res.json())
            .then(data => {
                alert('Bokning sparad!');
                console.log('Saved booking:', data);
                //Återställning av bokningsfälten.
                setName('');
                setEmail('');
                setNumOfGuests(0);
                setSelectedTimeslot(null);
            })
            .then(() => {
                onBooked();
            })
            .catch(err => {
                alert("Något gick fel!")
            })
            .finally(() => setLoading(false));
    }

    //Rendering av bokningsformuläret.
    return (
        <div className='booking-form'>

            <h1>Booking Form</h1>

            {/* Formulär som kallar på fromSubmit vid bokning. */}
            <form onSubmit={fromSubmit}>

                {/* Inputfät för namn och epost. */}
                <div className='input-group'>
                    <input type="text" placeholder="Namn" value={name} onChange={(e) => setName(e.target.value)} required />
                    <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>

                {/* Visar behandling och datum. */}
                <span>{getPackageLabel(packageChoice)} behandling, {chosenDate ? chosenDate.toLocaleDateString() : ''} </span>

                {/* Visar knappar för att välja en tid. Uppdaterar state för en markerad tid. */}
                <div className='button-group'>
                    {['Sunrise', 'Day', 'Sunset'].map((timeslot) =>
                        <div key={timeslot} className='timeslot-container'>
                            <button
                                key={timeslot}
                                type='button'
                                className={bookedTimeslots.includes(timeslot) ? 'booked' : (selectedTimeslot === timeslot ? 'selected' : '')}
                                onClick={() => setSelectedTimeslot(timeslot)}
                                disabled={bookedTimeslots.includes(timeslot)}
                                style={bookedTimeslots.includes(timeslot) ? { backgroundColor: 'grey', cursor: 'not-allowed' } : {}}
                            >
                                <span className='timeslot-Name'>{bookedTimeslots.includes(timeslot) ? 'Booked' : timeslot}</span>
                                <span className='timeslot-info'>{timeslotInfo[timeslot]}</span>
                            </button>
                        </div>
                    )}
                </div>
                
                {/* Dropdown för att välja antalet personer i bokningen. */}
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
                    </select>
                </div>
                
                {/* Visar priset. */}
                <span>Pris: {numOfGuests !== 0 && packageChoice ? (priceCalc({ packageType: packageChoice, numOfGuests })) + " kr" : ''} </span>

                {/* Submit-knapp som skickar bokningsformuläret (om allting är ifyllt). */}
                <button className='package-btn-boka' type='submit' disabled={loading}>
                        {loading ? <span className="spinner"></span> : 'Boka'}
                </button>            
            </form>
        </div>
    );
}

export default BookingForm;