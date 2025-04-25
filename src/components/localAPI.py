from datetime import datetime as dt
from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
import requests
from sqlalchemy.exc import IntegrityError

from sqlalchemy import (
    create_engine, 
    MetaData,
    Table,
    Column,
    Integer,
    String,
    Insert,
    Select,
    Delete,
    update,
    func

)



class ConcertDB:
    def __init__(self):
        self.engine = create_engine("sqlite:///shows.db")
        self.metadata_obj = MetaData()
        self.shows_table = Table(
            "shows",
            self.metadata_obj,
            Column("id", Integer, primary_key=True),
            Column("artist_name", String),
            Column("image_url", String),
            Column("date", String),
            Column("time", String),
            Column("venue_name", String),
            Column("cost", Integer)
            
        )

        self.metadata_obj.create_all(self.engine)

    def shows_row_to_dict(self, row):
        return {
            "id": row[0],
            "artist_name": row[1],
            "image_url": row[2],
            "date": row[3],
            "time": row[4],
            "venue_name": row[5],
            "cost": row[6]

        }

    def add_show(self, show):
        statement = Insert(self.shows_table).values(show)
        with self.engine.connect() as conn:
            conn.execute(statement)
            conn.commit()

    def get_shows(self):
        statement = Select(self.shows_table).order_by(self.shows_table.c.date)
        with self.engine.connect() as conn:
            rows = conn.execute(statement).all()
        shows = [self.shows_row_to_dict(row) for row in rows]
        if len(shows) > 0 :
            return shows
        else:
            return
    
    def get_show(self, artist_name):
        statement = Select(self.shows_table).where(
            self.shows_table.c.artist_name == artist_name
            )
        with self.engine.connect() as conn:
            row = conn.execute(statement).first()
        if not row:
            return None
        return self.shows_row_to_dict(row)
    
    def remove_show(self, show_id):
        try: 
            statement = Delete(self.shows_table).where(self.shows_table.c.id == show_id)

            with self.engine.connect() as conn:
                conn.execute(statement)
                conn.commit()
            return True
        except:
            return False
        
    def edit_show(self, show_id, show):
        try: 
            statement = update(self.shows_table).where(
                self.shows_table.c.id == show_id).values(show)

            with self.engine.begin() as conn:
                conn.execute(statement)
                conn.commit()
            return show
        except Exception as e:
            print("error",e)
            return 
        
    

class BudgetDB:
    def __init__(self):
        self.engine = create_engine("sqlite:///budgets.db")
        self.metadata_obj = MetaData()
        self.budgets_table = Table(
            "budgets",
            self.metadata_obj,
            Column("id", Integer, primary_key=True),
            Column("show", String),
            Column("show_date", String),
            Column("show_url", String),
            Column("total_budget", Integer),
            Column("ticket_price", Integer),
            Column("food_drink_budget", Integer),
            Column("parking_budget", Integer),
            Column("merch_budget", Integer)
        )

        self.metadata_obj.create_all(self.engine)

    def budgets_row_to_dict(self, row):
        return {
            "id": row[0],
            "show": row[1],
            "show_date": row[2],
            "show_url": row[3],
            "total_budget": row[4],
            "ticket_price": row[5],
            "food_drink_budget": row[6],
            "parking_budget": row[7],
            "merch_budget": row[8]

        }
    
    def add_budget(self, budget):
        statement = Insert(self.budgets_table).values(budget)
        with self.engine.connect() as conn:
            conn.execute(statement)
            conn.commit()

    def get_budgets(self):
        statement = Select(self.budgets_table).order_by(self.budgets_table.c.show_date)
        with self.engine.connect() as conn:
            rows = conn.execute(statement).all()
        budgets = [self.budgets_row_to_dict(row) for row in rows]
        if len(budgets) > 0 :
            return budgets
        else:
            return
        
    def get_total_spent(self):
        statement = Select(func.sum(self.budgets_table.c.ticket_price))
        with self.engine.connect() as conn:
            result = conn.execute(statement).scalar()
        return result or 0
    

        



app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



class APIS:

    def __init__(self):
        pass

    def call_ticketmaster_events(self, city):
         api_key = 'ALfihhmVSnspYe4ldyG7RC1gBFAsPPVD'


         url = f'https://app.ticketmaster.com/discovery/v2/events.json?classificationName=music&city={city}&apikey={api_key}'

         try:
            music_call = requests.get(url) 
            return music_call.json()
         except requests.exceptions.RequestException as e:
            print(f"Error calling Ticketmaster API: {e}")
            raise HTTPException(status_code=500, detail="Error connecting to Ticketmaster API")
         
     
    def call_ticketmaster_venues(self, venue_keyword):
         api_key = 'ALfihhmVSnspYe4ldyG7RC1gBFAsPPVD'


         url = f'https://app.ticketmaster.com/discovery/v2/venues.json?keyword={venue_keyword}&apikey={api_key}'

         try:
            venue_call = requests.get(url) 
            return venue_call.json()
         except requests.exceptions.RequestException as e:
            print(f"Error calling Ticketmaster API: {e}")
            raise HTTPException(status_code=500, detail="Error connecting to Ticketmaster API")



    def search_spotify_artists(self, artist_name):
        client_id = '94817e28e180404289e6846315cab828'
        client_secret = 'e11629603b2a4802bc1e87c5f09a7611'

        grant_type = 'client_credentials'
        body_params = {'grant_type': grant_type}
        url = "https://accounts.spotify.com/api/token"

        response_json = requests.post(url, data=body_params, 
                                      auth = (client_id, client_secret)).json()

        headers = {'Authorization': 'Bearer '+response_json['access_token']}

        artist_url = f'https://api.spotify.com/v1/search?q={artist_name}&type=artist'

        try:
            artist_call = requests.get(artist_url, headers=headers) 
            return artist_call.json()
        except requests.exceptions.RequestException as e:
            print(f"Error calling Ticketmaster API: {e}")
            raise HTTPException(status_code=500, detail="Error connecting to Ticketmaster API")


    def get_setlistfm_mbid(self, artist_name):
    
        rootURL = 'https://api.setlist.fm/rest/1.0/'

        headers = {
            "x-api-key": "-ee1yrxLkXnX3xbqxECtVo6bRPUzKS5LhIgh", 
            "Accept": "application/json",
            "User-Agent":'Emilie Barbattini emilie.barbattini@colorado.edu'
        }

        mbid_url = (rootURL+f'search/artists?artistName={artist_name}')

        call = requests.get(mbid_url,headers=headers).json()

        for artist in call['artist']:
            if artist['name'].lower() == artist_name.lower():
                return artist['mbid']
            

    def get_setlistfm_setlist(self, artist_mbid):
        rootURL = 'https://api.setlist.fm/rest/1.0/'
        headers = {
            "x-api-key": "-ee1yrxLkXnX3xbqxECtVo6bRPUzKS5LhIgh", 
            "Accept": "application/json",
            "User-Agent": 'Emilie Barbattini emilie.barbattini@colorado.edu'
        }

        mbid_url = rootURL + f'search/setlists?artistMbid={artist_mbid}'

        try:
            response = requests.get(mbid_url, headers=headers)
            response.raise_for_status()  # 💥 Raises error on 4xx/5xx
            call = response.json()
        except Exception as e:
            print("Error getting setlists:", e)
            return {}

        if "setlist" not in call:
            print("No setlist returned for MBID:", artist_mbid)
            return {}

        song_list = []
        for set in call['setlist']:
            try:
                # create list of dicts that will store songs for each setlist 
                setlist = []
                sets = set['sets']['set']
                # usually multiple parts of set (main show, encores 1&2)
                for time_played in sets:
                    # loop through each song dict
                    for song in time_played['song']:
                        song_cover_artist = None

                        # init the time_played
                        if 'encore' not in time_played:
                            time_played = 'main show'
                        else:
                            time_played = 'encore'
                        
                        # add another field-cover_artist if applicable
                        if 'cover' in song.keys():
                            song_name = song['name']
                            song_type = 'cover'
                            song_cover_artist = song['cover']['name']
                            
                        else:
                            # otherwise just gather the name
                            song_name = song['name']
                            song_type = 'original'

                        # create final dict to add as value to setlist key
                        setlist_dict = {
                        'song_name':song_name,
                        'song_type': song_type,
                        'time_played': time_played,
                    }
                        # add cover artist if applicable
                        if song_cover_artist:
                            setlist_dict['cover_artist'] = song_cover_artist
                            
                        # put it all together
                        setlist.append(setlist_dict)

            # error trap                        
            except Exception as e:
                print('error with finding songs??', e)
            
            song_list.extend(setlist)
        
        song_counts = {}
        for song in song_list:
            if song['song_name'] not in song_counts:
                song_counts[song["song_name"]] = 1
            else:
                song_counts[song["song_name"]] += 1

        sorted_songs = dict(sorted(song_counts.items(), key=lambda item: item[1], reverse=True))
        
        return sorted_songs




apis = APIS()
concert_db = ConcertDB()
budget_db = BudgetDB()



@app.get("/ticketmaster-events")
def find_events(city):
    return apis.call_ticketmaster_events(city)

@app.get("/ticketmaster-venues")
def find_venues(venue_keyword):
    return apis.call_ticketmaster_venues(venue_keyword)

@app.get("/spotify-artist-search")
def find_artists(artist_name):
    return apis.search_spotify_artists(artist_name)

@app.get("/shows")
def get_shows():
    return concert_db.get_shows()

@app.post("/add-show")
def add_show(show: dict):
    try:
        concert_db.add_show(show)
        return show
    except:
        return

@app.get("/delete-show")
def remove_show(show_id: int):
    return concert_db.remove_show(show_id)

@app.post("/edit-show")
def edit_show(show_id: int, show: dict):
    return concert_db.edit_show(show_id, show)

@app.get("/setlistfm-artist-search")
def mbid_search(artist_name):
    return apis.get_setlistfm_mbid(artist_name)

@app.get("/setlistfm-setlist-search")
def setlist_search(artist_mbid: str):
    if not artist_mbid or artist_mbid == "null":
        raise HTTPException(status_code=400, detail="Missing or invalid MBID")

    try:
        return apis.get_setlistfm_setlist(artist_mbid)
    except Exception as e:
        print("Setlist.fm fetch error:", e)
        raise HTTPException(status_code=502, detail="Failed to fetch from Setlist.fm")

@app.post("/add-budget")
def add_budget(budget: dict):
    try:
        budget_db.add_budget(budget)
        return budget
    except:
        return
    
@app.get("/budgets")
def get_budgets():
    return budget_db.get_budgets()

@app.get("/budgets/total-spent")
def get_total_ticket_spent():
    return {"total_ticket_spent": budget_db.get_total_spent()}