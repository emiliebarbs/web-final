const Sidebar = ({setHomeClicked,
                setMyShowsClicked, setFindShowsClicked, 
                setCalendarClicked, setBudgetClicked }) => {

    const clickHome = () => {
        setHomeClicked(true)
        setMyShowsClicked(false)
        setFindShowsClicked(false)
        setCalendarClicked(false)
        setBudgetClicked(false)

    }


    const clickAccount = () => {
        console.log("TODO: add functionality")
    }

    const clickMyShows = () => {
        setMyShowsClicked(true)
        setHomeClicked(false)
        setFindShowsClicked(false)
        setCalendarClicked(false)
        setBudgetClicked(false)
    }

    const clickFindShows = () => {
        setFindShowsClicked(true)
        setHomeClicked(false)
        setMyShowsClicked(false)
        setCalendarClicked(false)
        setBudgetClicked(false)
    }

    const clickCalendar = () => {
        setCalendarClicked(true)
        setHomeClicked(false)
        setMyShowsClicked(false)
        setFindShowsClicked(false)
        setBudgetClicked(false)
    }

    const clickBudget = () => {
        setBudgetClicked(true)
        setHomeClicked(false)
        setMyShowsClicked(false)
        setFindShowsClicked(false)
        setCalendarClicked(false)
    }





    
    return (
        <>
        <div className="sidebar">
        <div className="sidebar-tab" onClick={() => clickHome()}><h3>Home</h3></div>
        <div className="sidebar-tab" onClick={() => clickAccount()}><h3>Account</h3></div>
        <div className="sidebar-tab" onClick={() => clickMyShows()}><h3>My Shows</h3></div>
        <div className="sidebar-tab" onClick={() => clickFindShows()}><h3>Find Shows</h3></div>
        <div className="sidebar-tab" onClick={() => clickCalendar()}><h3>Calendar</h3></div>
        <div className="sidebar-tab" onClick={() => clickBudget()}><h3>Budget</h3></div>
        
        </div>
        </>
    )
   
}


export default Sidebar;