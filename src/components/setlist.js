import React from 'react';

const SetlistFm = ({ shows }) => {
  const [setlistResponse, setSetlistResponse] = React.useState({});
  const [displayArtist, setDisplayArtist] = React.useState('');

  React.useEffect(() => {
    const fetchSetlistForRandomArtist = async () => {
      if (!shows || shows.length === 0) return;

      const randomIndex = Math.floor(Math.random() * shows.length);
      const artist = shows[randomIndex]?.artist_name;

      if (!artist) return;

      try {
        const mbidCall = await fetch(`http://localhost:8000/setlistfm-artist-search?artist_name=${encodeURIComponent(artist)}`);
        const mbidResponse = await mbidCall.json();

        if (!mbidResponse || mbidResponse === "null") {
          console.warn("No MBID found for artist:", artist);
          return;
        }

        const setlistCall = await fetch(`http://localhost:8000/setlistfm-setlist-search?artist_mbid=${mbidResponse}`);
        const setlistData = await setlistCall.json();

        setDisplayArtist(artist);
        setSetlistResponse(setlistData);
      } catch (err) {
        console.error("Error fetching setlist data:", err);
      }
    };

    fetchSetlistForRandomArtist();
  }, [shows]);

  return (
    <div className="setlist-container">
      <h1>{displayArtist ? `${displayArtist}'s most played songs in recent shows` : "No artist selected"}</h1>
      <ul>
        {Object.keys(setlistResponse)
          .slice(0, 5)
          .map((key) => (
            <li key={key}>
              {key}: <strong>{setlistResponse[key]}</strong> plays
            </li>
        ))}
      </ul>
    </div>
  );
};

export default SetlistFm;
