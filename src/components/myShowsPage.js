import React from "react"
import UpcomingShowDisplay from "./upcomingShows"
const MyShowsPage = ({addShowsClicked, setAddShowsClicked,
                    showInformationList, setShowInformationList
}) => {
    
    

    const [artistInput, setArtistInput] = React.useState("")
    const [dateInput, setDateInput] = React.useState("")
    const [timeInput, setTimeInput] = React.useState("")
    const [venueInput, setVenueInput] = React.useState("")
    const [costInput, setCostInput] = React.useState("")
    const [venueOptions, setVenueOptions] = React.useState([]) 
    const [artistOptions, setArtistOptions] = React.useState([]) 

    const [venueInfo, setVenueInfo] = React.useState({}) 
    const [artistInfo, setArtistInfo] = React.useState({}) 

    const [editState, setEditState] = React.useState(false)
    const [editId, setEditId] = React.useState("") 
    const [artistImage, setArtistImage] = React.useState("") 


 

    //TODO -- create on click new widget that will show most frequently played songs


    const clickAddShows = () => {
        setAddShowsClicked(true)
    }

    const handleDateTextChange = (e) => {
        const text = e.currentTarget.value
            setDateInput(text)
    }

    const handleTimeTextChange = (e) => {
        const text = e.currentTarget.value
            setTimeInput(text)
    }

    const handleCostTextChange = (e) => {
        const text = e.currentTarget.value
        setCostInput(text)
    }

    const callTicketmasterVenues = async (venueInput) => {
        try {
          const venueCall = await fetch(`http://localhost:8000/ticketmaster-venues?venue_keyword=${venueInput}`);
          const venueResponse = await venueCall.json();
      
          const venueOptions = venueResponse._embedded?.venues || []
          return venueOptions;
        } catch (err) {
          console.error("Error fetching venues:", err);
          return []; 
        }
      };
      
    
    const handleVenueSearch = async (e) => {
        const text = e.currentTarget.value
            setVenueInput(text)
        
        const venues = await callTicketmasterVenues(text)
        setVenueOptions(venues)

    }

    const handleVenueClick = (venueObject) => {
        setVenueInput(venueObject.name)
        setVenueOptions([])
        setVenueInfo(venueObject)
    }

    
    const VenueDropDowns = ({venueInput, venueOptions}) => {
        if (!venueInput || venueInput.trim() === "" || venueOptions.length === 0) {
            return null; 
          }
        
        return (
            <>
            <div className="venue-scroll-container">
            {venueOptions.map((choice, index) => 
            <div 
            className="venue-option" 
            key={index} >
            <p onClick={() => handleVenueClick(choice)}>{choice.name}</p>
            </div>
                )}
            </div>
            </>
        )
    }



    const ArtistDropDowns = ({artistInput, artistOptions}) => {
        if (!artistInput || artistInput.trim() === "" || artistOptions.length === 0) {
            return null; 
          }
        return (
            <>
            <div className="artist-scroll-container">
            {artistOptions.map((choice, index) => 
            <div 
            className="artist-option" 
            key={index} >
            <p onClick={() => handleArtistClick(choice)}>{choice.name}</p>
            </div>
                )}
            </div>
            
            
            </>
        )
    }

    const callSpotifyArtists = async (artistInput) => {
        try {
          const artistCall = await fetch(`http://localhost:8000/spotify-artist-search?artist_name=${artistInput}`);
          const artistResponse = await artistCall.json();
      
          const artistOptions = artistResponse.artists.items || []
          return artistOptions;
        } catch (err) {
          console.error("Error fetching venues:", err);
          return []; 
        }
      };
      
    
    const handleArtistSearch = async (e) => {
        const text = e.currentTarget.value
            setArtistInput(text)
        
        const artists = await callSpotifyArtists(text)
        setArtistOptions(artists)

    }

    const handleArtistClick = (artistObject) => {
        setArtistInput(artistObject.name)
        setArtistOptions([])
        setArtistInfo(artistObject)
    }

    const handleEditButtonClick = async (entry) => {
        setArtistInput(entry.artist_name)
        setDateInput(entry.date)
        setTimeInput(entry.time)
        setVenueInput(entry.venue_name)
        setCostInput(entry.cost)
        setAddShowsClicked(true)

        setEditState(true)
        setEditId(entry.id)
        setArtistImage(entry.artistImageURL)

        
        
        // TODO: add updates to DB based on edits


    }

    const handleDeleteButtonClick = async (entry) => {
        try {
            const deleteRow = await fetch(`http://localhost:8000/delete-show?show_id=${entry.id}`);
            const deleteResponse = await deleteRow.json();

            if (deleteResponse === false) {
                console.log("Issue deleting")
                return
            }

            const getShowResponse = await fetch(`http://localhost:8000/shows`);
            const dbData = await getShowResponse.json();
            setShowInformationList(dbData);
        }
        catch (error) {
            console.error("Error submitting or fetching shows:", error);

    }
}

    


    const handleShowSubmit = async (artistInfo, venueInfo) => {
        setAddShowsClicked(false);

        
        if (!artistInfo?.name && !venueInfo?.name && !dateInput && !timeInput && !costInput) {
            console.log("No inputs submitted");
            return
          }

          console.log("made it before edit state!")
          if (editState) {

            console.log("i made it to edit state")
            const editShowInfo = {
              "artist_name": artistInput,
              "image_url": artistImage,
              "date": dateInput,
              "time": timeInput,
              "venue_name": venueInput,
              "cost": costInput
            }

            try {
              const editRow = await fetch(`http://localhost:8000/edit-show?show_id=${editId}`, 
                {
                  method: "POST",
                  body: JSON.stringify(editShowInfo),
                  headers: {
                    "Content-Type": "application/json",
                  }
                },
              );
              const editResponse = await editRow.json();
              console.log("i made it past edit call")
  
              if (!editResponse) {
                  console.log("Issue editing", editResponse)
                  return
              }

              console.log("editResponse", editResponse)
  
            }
            catch (error) {
              console.error("Error editing shows:", error);
            }
          } else {

            const artistImageURL = artistInfo.images.find(img => img.width <= 165)?.url;
      
        const showInfo = {
          artist_name: artistInfo.name,
          image_url: artistImageURL,
          date: dateInput,
          time: timeInput,
          venue_name: venueInfo.name,
          cost: costInput,
        };
      
        try {
        
          const addShowResponse = await fetch(`http://localhost:8000/add-show`, {
            method: "POST",
            body: JSON.stringify(showInfo),
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

          }

  
        try {

          const getShowResponse = await fetch(`http://localhost:8000/shows`);
          const dbData = await getShowResponse.json();
          setShowInformationList(dbData)
      
          setArtistInput("")
          setDateInput("")
          setTimeInput("")
          setVenueInput("")
          setCostInput("")
          setEditState(false)

        } catch (error) {
          console.error("Error editing fetching shows:", error);
         }
    }
          
  

      React.useEffect(() => {
        const get_shows = async () => {
          try {
            const getShowResponse = await fetch(`http://localhost:8000/shows`);
            const dbData = await getShowResponse.json();
            setShowInformationList(dbData);
          } catch (error) {
            console.error("Failed to fetch shows:", error);
          }
        };
      
        get_shows();
      }, []);
      

   



    if (addShowsClicked) {
        return (
            <div className="my-shows-input-container">
                <div className="input-popup">

                    <h1>Add Your Next Show:</h1>

                    <label htmlFor="artist-box">Artist Name</label>
                    <input 
                    id="artist-box" 
                    className="input-box" 
                    type="text"
                    value={artistInput}
                    onChange={handleArtistSearch}></input>
                    <ArtistDropDowns
                    artistInput={artistInput}
                    artistOptions={artistOptions} />


                    <br></br>
                    <div className="date-time-input">
                        <div>
                        <label htmlFor="date-box">Date of Show</label>
                        <input 
                        id="date-box" 
                        className="input-box" 
                        type="date"
                        value={dateInput}
                        onChange={handleDateTextChange}></input>
                        </div>
                        
                        <div> 
                        <label htmlFor="time-box">Time of Show</label>
                        <input 
                        id="time-box" 
                        className="input-box" 
                        type="time"
                        value={timeInput}
                        onChange={handleTimeTextChange}></input>
                        </div>
                    </div>
                    


                    <br></br>
                    <label htmlFor="venue-box">Venue</label>
                    <input 
                    id="venue-box" 
                    className="input-box" 
                    type="text"
                    value={venueInput}
                    onChange={handleVenueSearch}></input>
                    <VenueDropDowns
                    venueInput={venueInput}
                    venueOptions={venueOptions} />


                    <br></br>
                    <label htmlFor="cost-box">Cost $</label>
                    <input 
                    id="cost-box" 
                    className="input-box" 
                    type="number"
                    value={costInput}
                    onChange={handleCostTextChange}></input>
                    
                    <br></br>
                    <button 
                    onClick={() => handleShowSubmit(artistInfo, venueInfo)}>SUBMIT</button>
                </div>

            </div>
            
        )
    }

    else {
        
        return (
            <div className="my-shows-page-container">
            {showInformationList ?
           <UpcomingShowDisplay 
           showInformationList={showInformationList}
           handleDeleteButtonClick={handleDeleteButtonClick}
           handleEditButtonClick={handleEditButtonClick}
           showActions={true}/>:
            <h3>It doesn't look like you have any upcoming shows... </h3>}
       

            <div className="add-shows-button">
                <button onClick={() => clickAddShows()}>Add Shows</button>
            </div>
    
            </div>
        )

    }
    
    

        
        



}




export default MyShowsPage;