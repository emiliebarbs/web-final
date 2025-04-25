import React from "react";
import UpcomingShowDisplay from "./upcomingShows";


const BudgetSummary = () => {

    const [budgets, setBudgets] = React.useState([])
    
    React.useEffect(() => {
        const getBudgets = async () => {
          try {
            const res = await fetch('http://localhost:8000/budgets');
            const data = await res.json();
            setBudgets(data);
          } catch (err) {
            console.error("Failed to fetch budgets:", err);
          }
        };
    
        getBudgets();
      }, []);
    

    
    return (
        <>
        <div className="budget-summary-container">
            <h1>Your Budget Plans</h1>
            {budgets.map((entry) => {
                return (
                    
                    <div className="budget-entry" key={entry.id}>
                        <div className="budget-entry-flex">
                       
                        <img 
                            className={`artist-photo ${!entry.show_url ? 'cassette-default' : ''}`} 
                            src={entry.show_url ? entry.show_url : require("../images/cassette-tape_431-430-min.png")} 
                            alt="Artist thumbnail" 
                         /> 
                     <details open>
                        <summary><strong>{entry.show} on {entry.show_date}</strong></summary>
                        <p className="budget-detail">Total Budget: ${entry.total_budget}</p>
                        <p className="budget-detail">Ticket Price: ${entry.ticket_price}</p>
                        <p className="budget-detail">Food & Drink:  ${entry.food_drink_budget}</p>
                        <p className="budget-detail">Parking: ${entry.parking_budget}</p>
                        <p className="budget-detail">Merch: ${entry.merch_budget}</p>
                    </details>

                        </div>
                        
                        
                        
                    </div>
                   
                )
            })}

        </div>
        
        
        </>
    )
}


const BudgetPlanner = ({show, setBudgetButtonClicked, setBudgetSubmitted
                        
                  
                    }) => {
        
        const [totalBudgetInput, setTotalBudgetInput] = React.useState("")
        const [ticketPriceInput, setTicketPriceInput] = React.useState(show.cost)
        const [foodDrinkInput, setFoodDrinkInput] = React.useState("")
        const [parkingInput, setParkingInput] = React.useState("")
        const [merchInput, setMerchInput] = React.useState("")



        
        const handleTotalBudgetInputChange = (e) => {
            const num = e.currentTarget.value
            setTotalBudgetInput(num)
        }

        const handleTicketPriceChange = (e) => {
            const num = e.currentTarget.value
            setTicketPriceInput(num)
        }

        const handleFoodDrinkInputChange = (e) => {
            const num = e.currentTarget.value
            setFoodDrinkInput(num)
        }

        const handleParkingInputChange = (e) => {
            const num = e.currentTarget.value
            setParkingInput(num)
        }

        const handleMerchInputChange = (e) => {
            const num = e.currentTarget.value
            setMerchInput(num)
        }


        const handleSubmitBudget = async () => {
            const budgetInfo = {
                "show": show.artist_name,
                "show_date": show.date,
                "show_url": show.image_url,
                "total_budget": totalBudgetInput,
                "ticket_price": ticketPriceInput,
                "food_drink_budget": foodDrinkInput,
                "parking_budget": parkingInput,
                "merch_budget": merchInput
            }
            setBudgetSubmitted(true)
            
            try {
                    const addBudget = await fetch(`http://localhost:8000/add-budget`, {
                      method: "POST",
                      body: JSON.stringify(budgetInfo),
                      headers: {
                        "Content-Type": "application/json",
                      },
                    });
                
                    if (!addBudget.ok) {
                      throw new Error("Failed to add show");
                    }
                
                    const data = await addBudget.json();
                    console.log("Added budget:", data);
                
                  } catch (error) {
                    console.error("Error submitting or fetching shows:", error);
                  }
            }



       
        let leftover = (Number(totalBudgetInput) - 
                        Number(ticketPriceInput) - 
                        Number(foodDrinkInput) - 
                        Number(parkingInput) - 
                        Number(merchInput)
                    )


        let leftoverStyle = {}
        if (leftover < 0) {
            leftoverStyle = {
                color: "red"
            }
        }


    return (
        <>
       
        <div className="budget-planner-container">
            <div className="budget-inputs-container">
            <h1>Budget for {show.artist_name}</h1>
                <div className="budget-inputs">
                <br></br>
        <label htmlFor="total-budget-box">Total Budget</label>
                    <input 
                    id="total-budget-box" 
                    className="budget-box" 
                    type="number"
                    value={totalBudgetInput}
                    onChange={handleTotalBudgetInputChange}
                    ></input>

        <br></br>
        <label htmlFor="ticket-price-box">Ticket Price</label>
                    <input 
                    id="ticket-price-box" 
                    className="budget-box" 
                    type="number"
                    value={show.cost}
                    onChange={handleTicketPriceChange}
                    ></input>   

        
        <br></br>
        <label htmlFor="food-drink-box">Food And Drink Budget</label>
                    <input 
                    id="food-drink-box" 
                    className="budget-box" 
                    type="number"
                    value={foodDrinkInput}
                    onChange={handleFoodDrinkInputChange}
                    ></input>  

        
        <br></br>
        <label htmlFor="parking-box">Parking Budget</label>
                    <input 
                    id="parking-box" 
                    className="budget-box" 
                    type="number"
                    value={parkingInput}
                    onChange={handleParkingInputChange}
                    ></input> 

        <br></br>
        <label htmlFor="merch-box">Merch Budget</label>
                    <input 
                    id="merch-box" 
                    className="budget-box" 
                    type="number"
                    value={merchInput}
                    onChange={handleMerchInputChange}
                    ></input> 
                </div>
            
    
        <button 
        className="budget-submit-button"
        onClick={handleSubmitBudget}>SUBMIT BUDGET</button>
    </div>
        

        <div className="total-display">
            <h2>Total Budget</h2>
            {(totalBudgetInput) ?  <h3>${totalBudgetInput}</h3> : 
                <h3>No budget set</h3>}

            <h2>Amount Leftover</h2>
            <h3 style={leftoverStyle}>
                ${leftover}</h3>

        </div>  
        </div>
        
        </>
    )
}



const BudgetPage = () => {
    const [shows, setShows] = React.useState([]);
    const [budgetButtonClicked, setBudgetButtonClicked] = React.useState(false);
    const [workingShow, setWorkingShow] = React.useState({});
    const [budgetSubmitted, setBudgetSubmitted] = React.useState(false);
    const [viewBudgetsClicked, setViewBudgetsClicked] = React.useState(false);
  
    const handleBackToShowsClick = () => {
      setBudgetButtonClicked(false);
      setBudgetSubmitted(false);
      setViewBudgetsClicked(false);
    };
  
    const handleBudgetButtonClick = (entry) => {
      setBudgetButtonClicked(true);
      setWorkingShow(entry);
      setBudgetSubmitted(false);
      setViewBudgetsClicked(false);
    };
  
    const handleViewBudgetsClick = () => {
      setViewBudgetsClicked(true);
      setBudgetButtonClicked(false);
      setBudgetSubmitted(false);
    };
  
    React.useEffect(() => {
      const getShows = async () => {
        try {
          const res = await fetch("http://localhost:8000/shows");
          const data = await res.json();
          setShows(data);
        } catch (err) {
          console.error("Failed to fetch shows:", err);
        }
      };
      getShows();
    }, []);
  
    let content;
  
    if (viewBudgetsClicked || budgetSubmitted) {
      content = <BudgetSummary />;
    } else if (budgetButtonClicked) {
      content = (
        <BudgetPlanner
          show={workingShow}
          setBudgetButtonClicked={setBudgetButtonClicked}
          setBudgetSubmitted={setBudgetSubmitted}
        />
      );
    } else {
      content = (
        <UpcomingShowDisplay
          showInformationList={shows}
          showBudget={true}
          handleBudgetButtonClick={handleBudgetButtonClick}
        />
      );
    }
  
    return (
      <>
        <div className="main-budget-container">
            {content}
  
            <div className="budget-buttons">
            <button
                className="back-to-shows-button"
                onClick={handleBackToShowsClick}
            >
                Back to Shows
            </button>

            <button className="see-budgets-button" onClick={handleViewBudgetsClick}>
                View Budgets
            </button>


            </div>
        </div>
       
      </>
    );
  };
  




export default BudgetPage;