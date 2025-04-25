import React from 'react';
import './App.css';
import Header from "./components/header.js"
import Sidebar from './components/sidebar.js';
import MainHome from './components/main-home.js';
import MyShowsPage from './components/myShowsPage.js';
import FindShowsPage from './components/findShowsPage.js';
import ConcertCalendar from './components/calendarPage.js';
import BudgetPage from './components/budgetPage.js';

function App() {

  const [homeClicked, setHomeClicked] = React.useState(true)
  const [myShowsClicked, setMyShowsClicked] = React.useState(false)
  const [findShowsClicked, setFindShowsClicked] = React.useState(false)
  const [calendarClicked, setCalendarClicked] = React.useState(false)
  const [budgetClicked, setBudgetClicked] = React.useState(false)


  const [addShowsClicked, setAddShowsClicked] = React.useState(false)
  const [currentCity, setCurrentCity] = React.useState("Denver")
  const [showCityInput, setShowCityInput] = React.useState(false)
  


  const [showInformationList, setShowInformationList] = React.useState([])
  // TODO: add sorting based on which date is closest

  return (
    <>
     <Header
     currentCity={currentCity}
     setCurrentCity={setCurrentCity}
     showCityInput={showCityInput}
     setShowCityInput={setShowCityInput}

     />
    <div className='main-container'>
    <main className='sidebar-container'>
      <Sidebar 
      setHomeClicked={setHomeClicked}
      setMyShowsClicked={setMyShowsClicked}
      setFindShowsClicked={setFindShowsClicked}
      setCalendarClicked={setCalendarClicked}
      setBudgetClicked={setBudgetClicked}
      />
    </main>
    <aside className='main-content-container'>

    
    {homeClicked && <MainHome/>}
    {myShowsClicked && <MyShowsPage
    addShowsClicked={addShowsClicked}
    setAddShowsClicked={setAddShowsClicked}
    showInformationList={showInformationList}
    setShowInformationList={setShowInformationList} />}
    {findShowsClicked && <FindShowsPage
    currentCity={currentCity}/>}
    {calendarClicked && <ConcertCalendar 
    showInformationList={showInformationList}/>}
    {budgetClicked && <BudgetPage />}
  
    
  
    

    </aside>

    </div>
    </>
    
  );
}

export default App;
