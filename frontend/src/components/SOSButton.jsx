import { useState } from "react";

import {
  getCurrentLocation,
} from "../services/locationService";

import {
  sendSOSAlert,
} from "../services/api";

import {
  getTrustedContacts,
} from "../services/storageService";

function SOSButton() {
  const [loading, setLoading] =
    useState(false);

  const [alertData, setAlertData] =
    useState(null);

  const [error, setError] =
    useState("");

  const handleSOS = async () => {
    try {
      setLoading(true);
      setError("");
      setAlertData(null);

      const contacts =
        getTrustedContacts();

      if (contacts.length === 0) {
        setError(
          "Please add at least one trusted contact before activating SOS."
        );

        return;
      }

      const location =
        await getCurrentLocation();

      const data = {
        name: "AEGIRA User",

        latitude:
          location.latitude,

        longitude:
          location.longitude,

        contacts,
      };

      const response =
        await sendSOSAlert(data);

      setAlertData(
        response.alert
      );
    } catch (err) {
      console.error(
        "SOS Error:",
        err
      );

      if (err.code === 1) {
        setError(
          "Location permission was denied. Please allow location access."
        );
      } else if (
        err.message?.includes(
          "Failed to fetch"
        )
      ) {
        setError(
          "AEGIRA backend is unavailable. Please make sure Flask is running."
        );
      } else {
        setError(
          err.message ||
            "Unable to activate SOS."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sos-container">
      <button
        className="sos-button"
        onClick={handleSOS}
        disabled={loading}
      >
        {loading
          ? "..."
          : "SOS"}
      </button>

      {error && (
        <div className="message-error">
          {error}
        </div>
      )}

      {alertData && (
        <div className="sos-result">
          <h3>
            SOS Activated
          </h3>

          <p>
            <strong>Status:</strong>{" "}
            {
              alertData.delivery_status
            }
          </p>

          <p>
            <strong>
              Latitude:
            </strong>{" "}
            {alertData.latitude}
          </p>

          <p>
            <strong>
              Longitude:
            </strong>{" "}
            {alertData.longitude}
          </p>

          <a
            href={
              alertData.map_link
            }
            target="_blank"
            rel="noopener noreferrer"
          >
            Open Location in Maps
          </a>
        </div>
      )}
    </div>
  );
}

export default SOSButton;