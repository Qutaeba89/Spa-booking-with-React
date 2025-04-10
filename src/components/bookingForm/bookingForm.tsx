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
    const [numOfAdults, setNumOfAdults] = useState<number>(1);
    const [numOfKids, setNumOfKids] = useState<number>(0);
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


    function priceCalc({ packageType, numOfAdults, numOfKids }: { packageType: string, numOfAdults: number, numOfKids: number }) {
        const adultPrice = packageType === "hot" ? 700 : 500;
        const kidPrice = adultPrice * 0.5; // Assuming kids pay half price
        let totalPrice = 350 + (numOfAdults * adultPrice) + (numOfKids * kidPrice);
        if (chosenDate?.getDay() === 2) {
            totalPrice *= 0.85; // 15% discount on Tuesdays
            console.log("Tisdagsrabatt");
        }
        return totalPrice;
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
            nrOfAdults: numOfAdults,
            nrOfKids: numOfKids,
            totalPrice: priceCalc({ packageType: packageChoice, numOfAdults, numOfKids }),
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
                setNumOfAdults(1);
                setNumOfKids(0);
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
                    <label htmlFor="numOfAdult">Antal vuxna:</label>
                    <select
                        name="numOfAdult"
                        id="numOfAdult"
                        value={numOfAdults}
                        onChange={(e) => setNumOfAdults(Number(e.target.value))}
                        required
                    >
                        <option value="" disabled hidden>Antal Vuxna</option>
                        <option value="1">1</option>
                        <option value="2"disabled={numOfKids === 3|| numOfKids === 4 ? true : false}>2</option>
                        <option value="3"disabled={numOfKids === 2 || numOfKids === 3 ? true : false}>3</option>
                        <option value="4"disabled={numOfKids === 1 || numOfKids === 2 || numOfKids === 3  ? true : false}>4</option>
                    </select>
                </div>
                <div className="select-group">
                    <label htmlFor="numOfKids">Antal barn under 12 år:</label>
                    <select
                        name="numOfKids"
                        id="numOfKids"
                        value={numOfKids}
                        onChange={(e) => setNumOfKids(Number(e.target.value))}
                        required
                    >
                        <option value="0">0</option>
                        <option value="1"disabled={numOfAdults === 4 ? true : false}>1</option>
                        <option value="2"disabled={numOfAdults === 3 || numOfAdults === 4  ? true : false}>2</option>
                        <option value="3"disabled={numOfAdults === 2 || numOfAdults === 3 || numOfAdults === 4  ? true : false}>3</option>
                        
                    </select>
                </div>

                
                {/* Visar priset. */}
                <span>Pris: {packageChoice ? Math.round(priceCalc({ packageType: packageChoice, numOfAdults, numOfKids })) + " kr" : ''} 
                    
                </span>
                

                {/* Submit-knapp som skickar bokningsformuläret (om allting är ifyllt). */}
                <button className='package-btn-boka' type='submit' disabled={loading}>
                        {loading ? <span className="spinner"></span> : 'Boka'}
                </button>            
            </form>
        </div>
    );
}

export default BookingForm;