import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./DriverVehicles.module.css";
import API from "../../api/api";

type VehicleRecord = {
  driverId: string;
  brand: string;
  model: string;
  costPerKm: number;
};

const getVehicleStorageKey = (uuid?: string) => `driverVehicles_${uuid ?? "driver"}`;

const DriverVehicles: React.FC = () => {
  const { uuid } = useParams();
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState<VehicleRecord[]>([]);
  const [form, setForm] = useState({ brand: "", model: "", costPerKm: "" });
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(getVehicleStorageKey(uuid));
      if (!raw) {
        setVehicles([]);
        return;
      }

      const parsed = JSON.parse(raw) as VehicleRecord[];
      setVehicles(Array.isArray(parsed) ? parsed : []);
    } catch (error) {
      console.error("Failed to load vehicles:", error);
      setVehicles([]);
    }
  }, [uuid]);

  const totalFleetValue = useMemo(
    () => vehicles.reduce((total, vehicle) => total + vehicle.costPerKm, 0),
    [vehicles]
  );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const brand = form.brand.trim();
    const model = form.model.trim();
    const costPerKm = Number(form.costPerKm);

    if (!brand || !model || Number.isNaN(costPerKm) || costPerKm <= 0) {
      setFeedback("Please provide a valid brand, model, and cost per km.");
      return;
    }

    try {
      const response = await API.post("/car", {
        brand,
        model,
        costPerKm,
        driverId: uuid,
      });

      if (response.status >= 200 && response.status < 300) {
        const nextVehicle: VehicleRecord = {
          driverId: response.data?.driverId ?? uuid ?? "driver",
          brand,
          model,
          costPerKm,
        };

        const nextVehicles = [nextVehicle, ...vehicles];
        localStorage.setItem(getVehicleStorageKey(uuid), JSON.stringify(nextVehicles));
        setVehicles(nextVehicles);
        setForm({ brand: "", model: "", costPerKm: "" });
        setFeedback(`${brand} ${model} has been added to your fleet.`);
      }
    } catch (error) {
      console.error("Error adding vehicle:", error);
      setFeedback("Unable to save vehicle right now. Please try again.");
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.overlay} aria-hidden="true" />
      <div className={styles.content}>
        <header className={styles.header}>
          <div>
            <p className={styles.eyebrow}>Driver fleet</p>
            <h1 className={styles.title}>Registered vehicles</h1>
            <p className={styles.subtitle}>
              Track every vehicle you have added for ride requests and pricing.
            </p>
          </div>
          <button type="button" className={styles.backButton} onClick={() => navigate(`/driver-dashboard/${uuid}`)}>
            Back to dashboard
          </button>
        </header>

        <section className={styles.grid}>
          <article className={styles.panel}>
            <div className={styles.panelHeader}>
              <div>
                <p className={styles.panelLabel}>Fleet overview</p>
                <h2 className={styles.panelTitle}>Vehicles on record</h2>
              </div>
              <span className={styles.countBadge}>{vehicles.length} total</span>
            </div>

            <div className={styles.summaryRow}>
              <div className={styles.summaryCard}>
                <p className={styles.summaryLabel}>Registered vehicles</p>
                <strong className={styles.summaryValue}>{vehicles.length}</strong>
              </div>
              <div className={styles.summaryCard}>
                <p className={styles.summaryLabel}>Average cost/km</p>
                <strong className={styles.summaryValue}>
                  {vehicles.length ? (totalFleetValue / vehicles.length).toFixed(2) : "0.00"}
                </strong>
              </div>
            </div>

            {vehicles.length === 0 ? (
              <div className={styles.emptyState}>
                <p>No vehicles have been registered yet.</p>
                <span>Add your first vehicle from the dashboard to start building your fleet.</span>
              </div>
            ) : (
              <div className={styles.vehicleList}>
                {vehicles.map((vehicle) => (
                  <article key={vehicle.driverId} className={styles.vehicleCard}>
                    <div>
                      <p className={styles.vehicleBrand}>{vehicle.brand}</p>
                      <h3 className={styles.vehicleModel}>{vehicle.model}</h3>
                    </div>
                    <div className={styles.vehicleMeta}>
                      <span>Cost / km</span>
                      <strong>${vehicle.costPerKm.toFixed(2)}</strong>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </article>

          <article className={styles.panel}>
            <div className={styles.panelHeader}>
              <div>
                <p className={styles.panelLabel}>Add another vehicle</p>
                <h2 className={styles.panelTitle}>Quick registration</h2>
              </div>
            </div>

            <form className={styles.form} onSubmit={handleSubmit}>
              <label className={styles.field}>
                <span>Brand</span>
                <input
                  type="text"
                  value={form.brand}
                  onChange={(event) => setForm((prev) => ({ ...prev, brand: event.target.value }))}
                  placeholder="Toyota"
                />
              </label>
              <label className={styles.field}>
                <span>Model</span>
                <input
                  type="text"
                  value={form.model}
                  onChange={(event) => setForm((prev) => ({ ...prev, model: event.target.value }))}
                  placeholder="Camry"
                />
              </label>
              <label className={styles.field}>
                <span>Cost per km</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.costPerKm}
                  onChange={(event) => setForm((prev) => ({ ...prev, costPerKm: event.target.value }))}
                  placeholder="1.75"
                />
              </label>
              <button type="submit" className={styles.submitButton}>Save vehicle</button>
            </form>

            {feedback && <p className={styles.feedback}>{feedback}</p>}
          </article>
        </section>
      </div>
    </div>
  );
};

export default DriverVehicles;
