import React from 'react';

const FindShowsPage = ({currentCity}) => {
  const [musicData, setMusicData] = React.useState([]);

    const [loading, setLoading] = React.useState(false)

 
    React.useEffect(() => {
      const api = async () => {
        try {
          setLoading(true)
    
          const eventsCall = await fetch(`http://localhost:8000/ticketmaster-events?city=${currentCity}`);
          if (!eventsCall.ok) {
            throw new Error(`HTTP error! status: ${eventsCall.status}`);
          }
    
          const eventsData = await eventsCall.json();
          const events = eventsData._embedded?.events || [];
    
          const musicLoop = await Promise.all(events.map(async (show) => {
            const artistName = show._embedded?.attractions?.[0]?.name || "";
            const thumbnail = show.images.find((img) => img.width <= 320 && !img.fallback);
    
            let spotifyImage = "";
            if (artistName) {
              try {
                const artistCall = await fetch(`http://localhost:8000/spotify-artist-search?artist_name=${encodeURIComponent(artistName)}`);
                const artistResponse = await artistCall.json();
                const artistJson = artistResponse.artists.items[0] || {};
                spotifyImage = artistJson.images?.find(img => img.width <= 320)?.url || "";
              } catch (err) {
                console.error(`Error fetching Spotify image for ${artistName}`, err);
              }
            }

            // console.log(show)
    
            return {
              showName: show.name,
              date: show.dates.start.localDate,
              time: show.dates.start.localTime,
              thumbnail: spotifyImage || thumbnail?.url || '',
              link: show.url,
              venue: show._embedded.venues[0].name,
              artistName: show._embedded.attractions[0],
            };
          }));
    
          setMusicData(musicLoop);
        } catch (error) {
          console.error("Failed to fetch events:", error);
          setMusicData([]);
        } finally {
          setLoading(false)
        }
      };
    
      api();
    }, [currentCity]);
    
  


  const handleAddToMyShows = async (show) => {

      const artist = show.artistName.name
      try {
        const artistCall = await fetch(`http://localhost:8000/spotify-artist-search?artist_name=${artist}`);
        const artistResponse = await artistCall.json();
    
        const artistJson = artistResponse.artists.items[0] || []

        const spotifyArtistImage = artistJson.images.find(img => img.width <= 165)?.url
        

        const findShowInfo = {
          "artist_name": artist,
          "image_url": spotifyArtistImage,
          "date": show.date,
          "time": show.time,
          "venue_name": show.venue,
          "cost": 0
        }

        console.log("showInfo", findShowInfo)


        try {
          const addShowResponse = await fetch(`http://localhost:8000/add-show`, {
            method: "POST",
            body: JSON.stringify(findShowInfo),
            headers: {
              "Content-Type": "application/json",
            },
          });
      
          if (!addShowResponse.ok) {
            throw new Error("Failed to add show");
          }
      
          const data = await addShowResponse.json();
          console.log("Added show:", data);
      
        } catch (error) {
          console.error("Error submitting or fetching shows:", error);
        }
      
    
        return;
      } catch (err) {
        console.error("Error fetching venues:", err);
        return []; 
      }    
    
  }

  const UpcomingShow = ({ show }) => {
        
    return (
        <>
      <div className="show-content">
        <img className={show.thumbnail ? 'thumbnail' : 'thumbnail-fallback'} alt='Thumbnail'
        src={(show.thumbnail) ? show.thumbnail : require("../images/cassette-tape_431-430-min.png")} />
        <div className='show-content-info'>
        <h3>{show.showName}</h3>
        <p>{show.date} {(show.time !== "") ? show.time : null} | {(show.venue !== "") ?show.venue: null }</p>

        </div>
        
        <div className='find-shows-buttons'>
          <a href={show.link}>BUY TICKETS</a>
          <button onClick={() => handleAddToMyShows(show)}>ADD TO MY SHOWS</button>
        
        </div>
        
        </div>
        </>
        
        
     
    );
  };


        


  return (
    <>
    <div className="find-shows-block">
    <h1>Find Upcoming Shows in {currentCity}</h1>
      {loading ? <p className='loading-message'>Finding shows near you ...</p> : 
      musicData.map((show, index) => (
        <UpcomingShow key={index} show={show} />
      ))}
    </div>
    </>
   
  );
};

export default FindShowsPage;
