import React from "react"

const Header = ({currentCity, setCurrentCity,
                showCityInput, setShowCityInput

}) => {

    

    
    
    const handleCityClick = () => {
        console.log("click button hit")
        setShowCityInput(true)
        // lower the dropdown -- input cities by search to change the state
    }

    

  

    const CityInput = ({setShowCityInput}) => {
        const [inputText, setInputText] = React.useState("")
        
        const handleCityInputChange = (e) => {
            const text = e.currentTarget.value;
            setInputText(text)
        }

        const handleCityInputClick = () => {
            setCurrentCity(inputText)
            setInputText("")
            console.log("handle city input click??")
            setShowCityInput(false)
        }
        
        return (
            <>
            <input 
            className='city-input'
            type="text" 
            placeholder="Enter new city..."
            value={inputText}
            onChange={handleCityInputChange}></input>
            <button className="city-input-button" onClick={handleCityInputClick}>Enter</button>

            </>
        )

    }


    return (
        <>
        <header>
            <div className="png-title-container">
                <img className='cassette' alt="fun!" src={require("../images/cassette-tape_431-430-min.png")} ></img>
                <h1 className="title">TicketTally</h1>
                <h3 className="title-summary">Your All-In-One Concert Planner</h3>
            </div>
            <div className="selected-city">
                <div><h3>Your City:</h3></div>
                <div className="city-display" >
                    <h4>{currentCity}</h4>
                    </div>
                    {!showCityInput && (
                        <button onClick={handleCityClick}>Change City</button> 
                    )}

                    {showCityInput && (
                        <CityInput setShowCityInput={setShowCityInput} />
                    )}
                
                </div>
        
        </header>

        </>
    )
   
}


export default Header;