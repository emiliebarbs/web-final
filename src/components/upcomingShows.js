import React from "react";
const UpcomingShowDisplay = ({showInformationList, handleDeleteButtonClick=false,
                                handleEditButtonClick=false, handleBudgetButtonClick=false,
                                 showActions=false, showBudget=false
}) => {

    return (
        <div className="upcoming-shows-container"
        >

            {(!showBudget) ? <h2>Upcoming</h2> : <h2>Budget Planning</h2>}
            {showInformationList.map((entry, index) => {
            
            const formattedDate = new Date(entry.date + "T12:00:00") // had error with dates changing due to time zones
            .toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            });

                
                //   const [hour, minute] = entry.time.split(':');
                //   const dateWithTime = new Date();
                //   dateWithTime.setHours(parseInt(hour), parseInt(minute));
                
                let formattedTime = "TBA"; // fallback if time is missing

                if (entry.time) {
                const [hour, minute] = entry.time.split(':');
                const dateWithTime = new Date();
                dateWithTime.setHours(parseInt(hour), parseInt(minute));

                formattedTime = dateWithTime.toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    hour12: true
                });
                }


                const today = new Date();
                const todayStr = today.toISOString().split("T")[0];
                
                const showDateOnly = new Date(entry.date + "T00:00:00");
                const todayDateOnly = new Date(todayStr + "T00:00:00");
                
                const diffTime = showDateOnly - todayDateOnly;
                const daysTillShow = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                
                  

                return (
                
                <div className="show-entry"
                key={index}>
                <div 
                className="my-shows-artist-block" >
                    <div className="artist-and-info">
                    <img 
                        className={`artist-photo ${!entry.image_url ? 'cassette-default' : ''}`} 
                        src={entry.image_url ? entry.image_url : require("../images/cassette-tape_431-430-min.png")} 
                        alt="Artist thumbnail" 
                        />

                        <div className="artist-show-info">
                            <h3>{entry.artist_name}</h3>
                            <p>{formattedDate} at {formattedTime}</p>
                            <p>Venue: {entry.venue_name}</p>
                            <p>Cost: ${entry.cost}</p>
                        </div>
                    </div>
                    <div className="countdown">
                        <p>{daysTillShow}<br />Days till show</p>

                    </div>
                </div>
                {(showActions) ? 
                 <div className="edit-delete">
                 <button onClick={() => handleEditButtonClick(entry)}>Edit</button>
                 <button onClick={() => handleDeleteButtonClick(entry)}>Delete</button>
             </div> : null
                }
                {(showBudget) ? 
                 <div className="set-budget">
                 <button onClick={() => handleBudgetButtonClick(entry)}>Set Budget</button>
             </div> : null
                }
               
                </div>
                
                
                

                ) })}

        </div>
        
    )
}

export default UpcomingShowDisplay;