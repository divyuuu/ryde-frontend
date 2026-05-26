import React, { useEffect, useMemo, useState } from "react";
import styles from "./DriverDashboard.module.css";
import { useParams } from "react-router-dom";
import API from "../../api/api";

type UserData = {
  uuid: string;
  name: string;
  totalRides: number;
  rating: number;
  email: string;
  role?: "DRIVER" | "PASSENGER";
};

type RideRequest = {
  id: string;
  passenger: string;
  pickup: string;
  destination: string;
  fare: string;
  distance: string;
  eta: string;
};

const incomingRides: RideRequest[] = [
  {
    id: "req-1",
    passenger: "Alex M.",
    pickup: "220 Trade Street, Austin",
    destination: "AUS Airport, Terminal 2",
    fare: "$18.40",
    distance: "12.4 km",
    eta: "22 min",
  },
  {
    id: "req-2",
    passenger: "Jordan K.",
    pickup: "12 Willow Ave, Austin",
    destination: "Congress Ave & 6th St",
    fare: "$9.80",
    distance: "4.2 km",
    eta: "11 min",
  },
];

const DriverDashboard: React.FC = () => {
  const { uuid } = useParams();
  const [user, setUser] = useState<UserData | null>(null);
  const [isOnline, setIsOnline] = useState(false);
  const [activeRequestId, setActiveRequestId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const pendingRides = useMemo(
    () => incomingRides.filter((ride) => ride.id !== activeRequestId),
    [activeRequestId]
  );

  const activeRide = useMemo(
    () => incomingRides.find((ride) => ride.id === activeRequestId) ?? null,
    [activeRequestId]
  );

  const todayEarnings = activeRide ? "$42.60" : isOnline ? "$24.20" : "$0.00";
  const ridesToday = activeRide ? 6 : isOnline ? 4 : 0;

  const handleAccept = (ride: RideRequest) => {
    if (!isOnline) return;
    setActiveRequestId(ride.id);
    setMessage(`Ride accepted for ${ride.passenger}. Navigate to pickup.`);
  };

  const handleDecline = (rideId: string) => {
    if (activeRequestId === rideId) {
      setActiveRequestId(null);
      setMessage("");
      return;
    }
    setMessage("Ride request declined.");
  };

  const handleComplete = () => {
    if (!activeRide) return;
    setActiveRequestId(null);
    setMessage("Ride completed. You are ready for the next request.");
  };

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await API.get(`/users/${uuid}`);
        if (res.status !== 200) {
          console.error("Failed to fetch user data");
          return;
        }
        const userData: UserData = res.data.success;
        setUser(userData);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    getUser();
  }, [uuid]);

  return (
    <div className={styles.page}>
      <div className={styles.mapLayer} aria-hidden="true" />
      <div className={styles.content}>
        <header className={styles.header}>
          <div className={styles.logoRow}>
            <div className={styles.logoMark}>R</div>
            <div>
              <p className={styles.siteName}>Ryde</p>
              <p className={styles.siteTag}>Driver dashboard</p>
            </div>
          </div>
          <div className={styles.profileCard}>
            <p className={styles.profileName}>Hello, {user?.name || "Driver"}</p>
            <p className={styles.profileMeta}>
              {isOnline ? "You are online and receiving requests." : "Go online to start earning."}
            </p>
          </div>
        </header>

        <div className={styles.grid}>
          <section className={styles.mainCard}>
            <div className={styles.cardHeader}>
              <div>
                <h1 className={styles.title}>Ride requests</h1>
                <p className={styles.subtitle}>
                  Accept nearby trips and manage your active ride from one place.
                </p>
              </div>
              <span className={`${styles.badge} ${isOnline ? styles.badgeOnline : styles.badgeOffline}`}>
                {isOnline ? "Online" : "Offline"}
              </span>
            </div>

            <div className={styles.availabilityRow}>
              <div>
                <p className={styles.availabilityLabel}>Availability</p>
                <p className={styles.availabilityText}>
                  {isOnline
                    ? "Passengers can request rides in your area."
                    : "Turn on availability to receive new ride requests."}
                </p>
              </div>
              <button
                type="button"
                className={`${styles.toggleButton} ${isOnline ? styles.toggleOn : ""}`}
                onClick={() => {
                  setIsOnline((prev) => !prev);
                  setMessage("");
                  if (isOnline) setActiveRequestId(null);
                }}
                aria-pressed={isOnline}
              >
                {isOnline ? "Go offline" : "Go online"}
              </button>
            </div>

            <div className={styles.statsRow}>
              <div className={styles.statCard}>
                <span className={styles.statLabel}>Today&apos;s earnings</span>
                <strong>{todayEarnings}</strong>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statLabel}>Rides today</span>
                <strong>{ridesToday}</strong>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statLabel}>Rating</span>
                <strong>{user?.rating?.toFixed(1) ?? "—"}</strong>
              </div>
            </div>

            {activeRide ? (
              <div className={styles.activeRideCard}>
                <p className={styles.activeRideLabel}>Active ride</p>
                <h3 className={styles.activeRideTitle}>{activeRide.passenger}</h3>
                <div className={styles.routeBlock}>
                  <p>
                    <span className={styles.routeTag}>Pickup</span>
                    {activeRide.pickup}
                  </p>
                  <p>
                    <span className={styles.routeTag}>Drop-off</span>
                    {activeRide.destination}
                  </p>
                </div>
                <div className={styles.activeMeta}>
                  <span>{activeRide.distance}</span>
                  <span>{activeRide.eta}</span>
                  <span>{activeRide.fare}</span>
                </div>
                <button type="button" className={styles.submitButton} onClick={handleComplete}>
                  Complete ride
                </button>
              </div>
            ) : (
              <div className={styles.requestsList}>
                {pendingRides.length === 0 ? (
                  <p className={styles.emptyText}>
                    {isOnline
                      ? "No requests right now. Stay online — new rides appear here."
                      : "Go online to see incoming ride requests."}
                  </p>
                ) : (
                  pendingRides.map((ride) => (
                    <article key={ride.id} className={styles.requestCard}>
                      <div className={styles.requestHeader}>
                        <h3 className={styles.requestName}>{ride.passenger}</h3>
                        <span className={styles.requestFare}>{ride.fare}</span>
                      </div>
                      <p className={styles.requestRoute}>
                        {ride.pickup} → {ride.destination}
                      </p>
                      <p className={styles.requestMeta}>
                        {ride.distance} · {ride.eta}
                      </p>
                      <div className={styles.requestActions}>
                        <button
                          type="button"
                          className={styles.declineButton}
                          onClick={() => handleDecline(ride.id)}
                          disabled={!isOnline}
                        >
                          Decline
                        </button>
                        <button
                          type="button"
                          className={styles.acceptButton}
                          onClick={() => handleAccept(ride)}
                          disabled={!isOnline}
                        >
                          Accept ride
                        </button>
                      </div>
                    </article>
                  ))
                )}
              </div>
            )}

            {message && <p className={styles.message}>{message}</p>}
          </section>

          <section className={styles.sideCard}>
            <div className={styles.cardHeader}>
              <h2 className={styles.title}>Shift overview</h2>
              <p className={styles.subtitle}>Your performance and vehicle details for today.</p>
            </div>

            <div className={styles.summaryCard}>
              <p className={styles.summaryLabel}>Shift status</p>
              <h3 className={styles.summaryTitle}>
                {activeRide ? "On trip" : isOnline ? "Waiting for rides" : "Offline"}
              </h3>
              <p className={styles.summaryText}>
                {activeRide
                  ? "Follow the route to pickup, then complete the trip when the passenger arrives."
                  : isOnline
                    ? "New requests will show on the left. Accept a ride to start navigation."
                    : "Toggle availability when you are ready to drive."}
              </p>
            </div>

            <div className={styles.vehicleCard}>
              <p className={styles.summaryLabel}>Vehicle</p>
              <h3 className={styles.vehicleTitle}>Toyota Camry · ABC-1234</h3>
              <p className={styles.summaryText}>License verified · Insurance active</p>
            </div>

            <div className={styles.tipsCard}>
              <p className={styles.summaryLabel}>Driver tips</p>
              <ul className={styles.tipsList}>
                <li>Stay online in high-demand areas for more requests.</li>
                <li>Accept rides within 30 seconds for priority matching.</li>
                <li>Keep your rating above 4.8 for bonus eligibility.</li>
              </ul>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default DriverDashboard;
