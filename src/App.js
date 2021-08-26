import React from 'react';
import { useState, useEffect } from 'react';
import ReactMapGL, { Marker, Popup } from 'react-map-gl';
import { Room, Star } from '@material-ui/icons';
import axios from 'axios';
import { format } from 'timeago.js';
import './app.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './components/Navbar';
import Register from './components/Register';
import Login from './components/Login';

function App() {
  const storage = window.localStorage;
  const [CurrentUser, setCurrentUser] = useState(null);

  const [viewport, setViewport] = useState({
    width: '100vw',
    height: '100vh',
    latitude: 20.5937,
    longitude: 78.9629,
    zoom: 4,
  });

  const [pins, setPins] = useState([]);
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [newPlace, setNewPlace] = useState(null);
  const [showPopup, togglePopup] = React.useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [rating, setRating] = useState(0);
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    const getPin = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/pins');
        setPins(res.data);
      } catch (error) {
        console.log(error.message);
      }
    };
    getPin();
  }, []);

  const handleMarker = (id, lat, long) => {
    setCurrentPlaceId(id);
    setViewport({ ...viewport, latitude: lat, longitude: long });
  };
  const handleAddClick = (e) => {
    const [long, lat] = e.lngLat;
    setNewPlace({
      lat,
      long,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPin = {
      username: CurrentUser,
      title,
      description,
      rating,
      lat: newPlace.lat,
      long: newPlace.long,
    };
    try {
      if (CurrentUser) {
        const res = await axios.post('http://localhost:5000/api/pins', newPin);
        setPins([...pins, res.data]);
        setNewPlace(null);
      } else {
        window.alert('please sign in');
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <ReactMapGL
      {...viewport}
      mapboxApiAccessToken={process.env.REACT_APP_MAPBOX}
      onViewportChange={(nextViewport) => setViewport(nextViewport)}
      mapStyle='mapbox://styles/aniket01/ckspvcbqj0oe417qh15g46pqv'
      onDblClick={handleAddClick}
      className='map'
    >
      <Navbar
        currentUser={CurrentUser}
        setShowRegister={setShowRegister}
        setShowLogin={setShowLogin}
        setCurrentUser={setCurrentUser}
      />
      {pins.map((pin) => (
        <>
          <Marker
            latitude={pin.lat}
            longitude={pin.long}
            offsetLeft={-20}
            offsetTop={-10}
            key={pin._id}
          >
            <Room
              style={{
                fontSize: viewport.zoom * 7,
                cursor: 'pointer',
                color: pin.username === CurrentUser ? 'tomato' : 'slateblue',
              }}
              onClick={() => handleMarker(pin._id, pin.lat, pin.long)}
              key={pin._id}
            />
          </Marker>
          {pin._id === currentPlaceId && (
            <Popup
              latitude={pin.lat}
              longitude={pin.long}
              closeButton={true}
              closeOnClick={true}
              onClose={() => togglePopup(false)}
              anchor='left'
              onClose={() => setCurrentPlaceId(null)}
              key={pin._id}
            >
              <div className='card' key={pin._id}>
                <label>Place</label>
                <h4 className='place'>{pin.title}</h4>
                <label>Review</label>
                <p className='des'>{pin.description}</p>
                <label>Rating</label>
                <div className='star'>{Array(pin.rating).fill(<Star />)}</div>
                <label>Info</label>
                <span className='user'>
                  Created by <b> {pin.username}</b>
                </span>
                <span className='time'>{format(pin.createdAt)}</span>
              </div>
            </Popup>
          )}
        </>
      ))}
      {newPlace && (
        <Popup
          latitude={newPlace.lat}
          longitude={newPlace.long}
          closeButton={true}
          closeOnClick={false}
          onClose={() => togglePopup(false)}
          anchor='left'
          onClose={() => setNewPlace(null)}
        >
          <div>
            <form onSubmit={handleSubmit}>
              <label>Title</label>
              <input
                placeholder='enter title'
                onChange={(e) => setTitle(e.target.value)}
              />
              <label>Review</label>
              <textarea
                placeholder='say something'
                onChange={(e) => setDescription(e.target.value)}
              />
              <label>Rating</label>
              <select onChange={(e) => setRating(e.target.value)}>
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
                <option>5</option>
              </select>
              <button className='sub' type='submit'>
                Add pin
              </button>
            </form>
          </div>
        </Popup>
      )}
      {showRegister && <Register setShowRegister={setShowRegister} />}
      {showLogin && (
        <Login
          setShowLogin={setShowLogin}
          storage={storage}
          setCurrentUser={setCurrentUser}
        />
      )}
    </ReactMapGL>
  );
}

export default App;
