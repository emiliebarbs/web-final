import React from "react";
import UpcomingShowDisplay from "./upcomingShows";
import SetlistFm from "./setlist";

const MainHome = () => {

    const [shows, setShows] = React.useState([]);
    const [totalSpent, setTotalSpent] = React.useState(null);

    React.useEffect(() => {
      const fetchTotalSpent = async () => {
        try {
          const res = await fetch("http://localhost:8000/budgets/total-spent");
          const data = await res.json();
          setTotalSpent(data.total_ticket_spent);
        } catch (err) {
          console.error("Failed to fetch total spent:", err);
        }
      };
    
      fetchTotalSpent();
    }, []);
    

  React.useEffect(() => {
    const getShows = async () => {
      try {
        const res = await fetch('http://localhost:8000/shows');
        const data = await res.json();
        setShows(data);
      } catch (err) {
        console.error("Failed to fetch shows:", err);
      }
    };

    getShows();
  }, []);

        const today = new Date();

        const futureShows = shows
          .map((show) => ({
            ...show,
            showDate: new Date(`${show.date}T${show.time || "00:00"}`),
          }))
          .filter((show) => show.showDate >= today);
      
        const upcomingShow = futureShows.length > 0
          ? futureShows.reduce((closest, current) =>
              current.showDate < closest.showDate ? current : closest
            )
          : null;

          let daysTillShow = null;

      if (upcomingShow) {
        const upcomingShowDate = new Date(upcomingShow.date + "T12:00:00");
        const diffTime = upcomingShowDate - today;
        daysTillShow = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      } else {
        console.log("No upcoming shows available yet.");
      }

  
    return (
        <div className="home-container">
            <div className="home-show-list">
                <UpcomingShowDisplay 
                showInformationList={shows}
                />
            </div>
            <div className="widget-squares">
                <div className="widgets">
                    <div className="home-widget-square"> 
                        <div className="budget-widget">
                        <h2>${totalSpent}</h2>
                        <p>Total Spent on Concert Tickets </p>
                        </div>
                    </div>  
                    <div className="home-widget-square"> 
                      <p className="calendar-widget">
                      {daysTillShow !== null
                        ? `Get Ready For ${upcomingShow.artist_name} in ${daysTillShow} days!`
                        : "No upcoming shows"}
                    </p>

                    </div> 
                </div>
                <div className="home-widget-long">
                    <SetlistFm 
                    shows={shows}/>
                </div>
            </div>
            

            
        </div>
        
    
        
    )
}




export default MainHome;