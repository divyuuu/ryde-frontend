import React, { useEffect, useMemo, useState } from "react";
import styles from "./PassengerDashboard.module.css";
import { useParams } from "react-router-dom";
import axios from "axios";

const rideOptions = [
  { id: "ryde", label: "Ryde", description: "Reliable everyday ride" },
  { id: "premium", label: "Premium", description: "Comfort ride with top drivers" },
  { id: "share", label: "Share", description: "Economical shared route" },
];

const savedPlaces = [
  { label: "Home", address: "12 Willow Ave, Austin" },
  { label: "Work", address: "220 Trade Street, Austin" },
  { label: "Airport", address: "AUS Airport, Terminal 2" },
];

type userData = {
  uuid: string;
  name: string;
  totalRides: number;
  rating: number;
  email: string;
}

const PassengerDashboard: React.FC = () => {
  const [pickup, setPickup] = useState("Current location");
  const [destination, setDestination] = useState("");
  const [selectedOption, setSelectedOption] = useState("ryde");
  const [message, setMessage] = useState("");

  const routeReady = useMemo(
    () => pickup.trim() !== "" && destination.trim() !== "" && pickup !== destination,
    [pickup, destination]
  );

  const routeDistance = routeReady ? "7.8 km" : "—";
  const routeTime = routeReady ? "14 min" : "—";
  const routePrice = routeReady ? "$10.20" : "—";
  const rideOption = rideOptions.find((option) => option.id === selectedOption) ?? rideOptions[0];
  const uuid = useParams().uuid;
  const [user, setUser] = useState<userData | null>(null);

  const handleBook = (event: React.FormEvent) => {
    event.preventDefault();
    if (!routeReady) return;
    setMessage(`Ride requested: ${rideOption.label}. Driver arriving in ${routeTime}.`);
  };

  const choosePlace = (address: string) => {
    setDestination(address);
    setMessage("");
  };

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/user/${uuid}`);
        if(res.status !== 200) {
          console.error("Failed to fetch user data");
          return;
        }
        const userData: userData = res.data;
        setUser(userData);

      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    getUser();
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.mapLayer} aria-hidden="true" />
      <div className={styles.content}>
        <header className={styles.header}>
          <div className={styles.logoRow}>
            <div className={styles.logoMark}>R</div>
            <div>
              <p className={styles.siteName}>Ryde</p>
              <p className={styles.siteTag}>Passenger dashboard</p>
            </div>
          </div>
          <div className={styles.profileCard}>
            <p className={styles.profileName}>Hello, {user?.name || "Guest"}</p>
            <p className={styles.profileMeta}>Plan your next ride instantly.</p>
          </div>
        </header>

        <div className={styles.grid}>
          <section className={styles.mainCard}>
            <div className={styles.cardHeader}>
              <div>
                <h1 className={styles.title}>Book your ride</h1>
                <p className={styles.subtitle}>Enter pickup and destination to see fare estimates.</p>
              </div>
              <span className={styles.badge}>Fast booking</span>
            </div>

            <form className={styles.form} onSubmit={handleBook}>
              <label className={styles.field}>
                <span className={styles.labelText}>Pickup location</span>
                <input
                  className={styles.input}
                  value={pickup}
                  onChange={(event) => {
                    setPickup(event.target.value);
                    setMessage("");
                  }}
                  placeholder="Current location"
                />
              </label>

              <label className={styles.field}>
                <span className={styles.labelText}>Destination</span>
                <input
                  className={styles.input}
                  value={destination}
                  onChange={(event) => {
                    setDestination(event.target.value);
                    setMessage("");
                  }}
                  placeholder="Where are you going?"
                />
              </label>

              <div className={styles.optionRow}>
                {rideOptions.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    className={`${styles.optionButton} ${selectedOption === option.id ? styles.optionActive : ""}`}
                    onClick={() => {
                      setSelectedOption(option.id);
                      setMessage("");
                    }}
                  >
                    <span>{option.label}</span>
                    <small>{option.description}</small>
                  </button>
                ))}
              </div>

              <div className={styles.statsRow}>
                <div className={styles.statCard}>
                  <span className={styles.statLabel}>Distance</span>
                  <strong>{routeDistance}</strong>
                </div>
                <div className={styles.statCard}>
                  <span className={styles.statLabel}>ETA</span>
                  <strong>{routeTime}</strong>
                </div>
                <div className={styles.statCard}>
                  <span className={styles.statLabel}>Fare</span>
                  <strong>{routePrice}</strong>
                </div>
              </div>

              <button className={styles.submitButton} type="submit" disabled={!routeReady}>
                Request ride
              </button>
              {message && <p className={styles.message}>{message}</p>}
            </form>
          </section>

          <section className={styles.sideCard}>
            <div className={styles.cardHeader}>
              <h2 className={styles.title}>Saved places</h2>
              <p className={styles.subtitle}>Tap a destination to fill the form.</p>
            </div>
            <div className={styles.placesList}>
              {savedPlaces.map((place) => (
                <button
                  key={place.label}
                  type="button"
                  className={styles.placeButton}
                  onClick={() => choosePlace(place.address)}
                >
                  <span className={styles.placeName}>{place.label}</span>
                  <span className={styles.placeAddress}>{place.address}</span>
                </button>
              ))}
            </div>

            <div className={styles.summaryCard}>
              <p className={styles.summaryLabel}>Ride status</p>
              <h3 className={styles.summaryTitle}>{routeReady ? "Ready to request" : "Awaiting route"}</h3>
              <p className={styles.summaryText}>
                {routeReady
                  ? "Your route is ready. Request the ride and track your driver on the map."
                  : "Add pickup and destination to preview your ride details."}
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PassengerDashboard;
