import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  getCurrentLocation,
} from "../services/locationService";

import {
  sendSOSAlert,
} from "../services/api";

import {
  getTrustedContacts,
} from "../services/storageService";


const TIMER_STORAGE_KEY =
  "aegira_active_safety_timer";


const TIMER_OPTIONS = [
  {
    label: "30 Sec Demo",
    seconds: 30,
  },
  {
    label: "1 Minute",
    seconds: 60,
  },
  {
    label: "5 Minutes",
    seconds: 300,
  },
  {
    label: "10 Minutes",
    seconds: 600,
  },
  {
    label: "30 Minutes",
    seconds: 1800,
  },
];


function SafetyTimer() {

  const [
    selectedSeconds,
    setSelectedSeconds,
  ] = useState(300);


  const [
    remainingSeconds,
    setRemainingSeconds,
  ] = useState(0);


  const [
    timerData,
    setTimerData,
  ] = useState(null);


  const [
    status,
    setStatus,
  ] = useState("");


  const [
    alertStatus,
    setAlertStatus,
  ] = useState("");


  const alertInProgress =
    useRef(false);


  // ========================================
  // SAVE TIMER
  // ========================================

  const saveTimer = (
    data
  ) => {

    localStorage.setItem(
      TIMER_STORAGE_KEY,
      JSON.stringify(data)
    );


    setTimerData(data);

  };


  // ========================================
  // CLEAR TIMER
  // ========================================

  const clearStoredTimer = () => {

    localStorage.removeItem(
      TIMER_STORAGE_KEY
    );


    setTimerData(null);

    setRemainingSeconds(0);

  };


  // ========================================
  // READ TIMER
  // ========================================

  const getStoredTimer = () => {

    try {

      const saved =
        localStorage.getItem(
          TIMER_STORAGE_KEY
        );


      if (!saved) {
        return null;
      }


      return JSON.parse(
        saved
      );

    } catch (error) {

      console.error(
        "Timer storage error:",
        error
      );


      localStorage.removeItem(
        TIMER_STORAGE_KEY
      );


      return null;

    }

  };


  // ========================================
  // FORMAT TIME
  // ========================================

  const formatTime = (
    totalSeconds
  ) => {

    const safeSeconds =
      Math.max(
        0,
        totalSeconds
      );


    const minutes =
      Math.floor(
        safeSeconds / 60
      );


    const seconds =
      safeSeconds % 60;


    return (
      `${String(minutes).padStart(2, "0")}:` +
      `${String(seconds).padStart(2, "0")}`
    );

  };


  // ========================================
  // CALCULATE REAL REMAINING TIME
  // ========================================

  const calculateRemaining = (
    data
  ) => {

    if (
      !data ||
      !data.endTime
    ) {

      return 0;

    }


    const difference =
      data.endTime -
      Date.now();


    return Math.max(
      0,
      Math.ceil(
        difference / 1000
      )
    );

  };


  // ========================================
  // SEND EXPIRED TIMER ALERT
  // ========================================

  const triggerExpiredAlert =
    async (
      expiredTimer
    ) => {

      if (
        alertInProgress.current
      ) {

        return;

      }


      if (
        expiredTimer?.alertTriggered
      ) {

        return;

      }


      alertInProgress.current =
        true;


      /*
        Mark it immediately so multiple
        browser events cannot send the
        same emergency alert repeatedly.
      */

      const updatedTimer = {
        ...expiredTimer,

        active: false,

        expired: true,

        alertTriggered: true,

        expiredAt:
          Date.now(),
      };


      saveTimer(
        updatedTimer
      );


      setRemainingSeconds(0);


      setStatus(
        "Safety Check-In expired."
      );


      setAlertStatus(
        "Preparing emergency alert..."
      );


      try {

        const contacts =
          getTrustedContacts();


        if (
          !contacts ||
          contacts.length === 0
        ) {

          setAlertStatus(
            "Timer expired, but no trusted contacts are configured."
          );


          return;

        }


        setAlertStatus(
          "Getting your current location..."
        );


        const location =
          await getCurrentLocation();


        setAlertStatus(
          "Sending AEGIRA safety alert..."
        );


        const response =
          await sendSOSAlert({

            name:
              "AEGIRA User",

            latitude:
              location.latitude,

            longitude:
              location.longitude,

            contacts,

            trigger_type:
              "safety_timer_expired",

          });


        console.log(
          "Safety timer alert:",
          response
        );


        setAlertStatus(
          "Emergency alert sent to your trusted circle."
        );

      } catch (error) {

        console.error(
          "Safety timer alert error:",
          error
        );


        setAlertStatus(
          error.message ||
          "The timer expired, but AEGIRA could not send the alert."
        );

      } finally {

        alertInProgress.current =
          false;

      }

    };


  // ========================================
  // SYNCHRONIZE TIMER WITH REAL CLOCK
  // ========================================

  const syncTimer = () => {

    const savedTimer =
      getStoredTimer();


    if (!savedTimer) {

      setTimerData(null);

      setRemainingSeconds(0);

      return;

    }


    setTimerData(
      savedTimer
    );


    /*
      Already completed/cancelled/expired
    */

    if (
      !savedTimer.active
    ) {

      setRemainingSeconds(0);

      return;

    }


    const remaining =
      calculateRemaining(
        savedTimer
      );


    if (
      remaining <= 0
    ) {

      setRemainingSeconds(0);


      triggerExpiredAlert(
        savedTimer
      );


      return;

    }


    setRemainingSeconds(
      remaining
    );


    setStatus(
      "Safety Check-In is active."
    );

  };


  // ========================================
  // RESTORE TIMER WHEN COMPONENT OPENS
  // ========================================

  useEffect(() => {

    syncTimer();

  }, []);


  // ========================================
  // REAL CLOCK TIMER
  // ========================================

  useEffect(() => {

    if (
      !timerData?.active
    ) {

      return;
    }


    const interval =
      setInterval(
        () => {

          const currentTimer =
            getStoredTimer();


          if (
            !currentTimer ||
            !currentTimer.active
          ) {

            clearInterval(
              interval
            );

            return;

          }


          const remaining =
            calculateRemaining(
              currentTimer
            );


          setRemainingSeconds(
            remaining
          );


          if (
            remaining <= 0
          ) {

            clearInterval(
              interval
            );


            triggerExpiredAlert(
              currentTimer
            );

          }

        },
        1000
      );


    return () => {

      clearInterval(
        interval
      );

    };

  }, [
    timerData?.endTime,
    timerData?.active,
  ]);


  // ========================================
  // RESYNC WHEN USER RETURNS TO TAB
  // ========================================

  useEffect(() => {

    const handleVisibility =
      () => {

        if (
          document.visibilityState ===
          "visible"
        ) {

          syncTimer();

        }

      };


    const handleFocus =
      () => {

        syncTimer();

      };


    const handlePageShow =
      () => {

        syncTimer();

      };


    document.addEventListener(
      "visibilitychange",
      handleVisibility
    );


    window.addEventListener(
      "focus",
      handleFocus
    );


    window.addEventListener(
      "pageshow",
      handlePageShow
    );


    return () => {

      document.removeEventListener(
        "visibilitychange",
        handleVisibility
      );


      window.removeEventListener(
        "focus",
        handleFocus
      );


      window.removeEventListener(
        "pageshow",
        handlePageShow
      );

    };

  }, []);


  // ========================================
  // START TIMER
  // ========================================

  const startTimer = () => {

    const now =
      Date.now();


    const newTimer = {

      active: true,

      expired: false,

      alertTriggered: false,

      startedAt:
        now,

      endTime:
        now +
        selectedSeconds * 1000,

      durationSeconds:
        selectedSeconds,

    };


    saveTimer(
      newTimer
    );


    setRemainingSeconds(
      selectedSeconds
    );


    setStatus(
      "Safety Check-In started."
    );


    setAlertStatus("");

  };


  // ========================================
  // USER CONFIRMED SAFE
  // ========================================

  const markSafe = () => {

    clearStoredTimer();


    setStatus(
      "You checked in safely. Timer completed."
    );


    setAlertStatus("");

  };


  // ========================================
  // CANCEL TIMER
  // ========================================

  const cancelTimer = () => {

    clearStoredTimer();


    setStatus(
      "Safety Check-In cancelled."
    );


    setAlertStatus("");

  };


  // ========================================
  // EXTEND BY 5 MINUTES
  // ========================================

  const extendTimer = () => {

    const currentTimer =
      getStoredTimer();


    if (
      !currentTimer ||
      !currentTimer.active
    ) {

      return;

    }


    const updatedTimer = {

      ...currentTimer,

      endTime:
        currentTimer.endTime +
        5 * 60 * 1000,

    };


    saveTimer(
      updatedTimer
    );


    setRemainingSeconds(
      calculateRemaining(
        updatedTimer
      )
    );


    setStatus(
      "Safety Check-In extended by 5 minutes."
    );

  };


  const isActive =
    Boolean(
      timerData?.active
    );


  const isExpired =
    Boolean(
      timerData?.expired
    );


  return (

    <div className="timer-panel">


      {/* =================================
          TIMER NOT ACTIVE
      ================================= */}

      {!isActive &&
        !isExpired && (

          <>

            <h3>
              Start a Safety Check-In
            </h3>


            <p>
              Choose how long AEGIRA should
              wait for your safe check-in.
            </p>


            <div className="report-field">

              <label>
                Check-In Duration
              </label>


              <select
                value={
                  selectedSeconds
                }
                onChange={
                  (event) =>
                    setSelectedSeconds(
                      Number(
                        event.target.value
                      )
                    )
                }
              >

                {TIMER_OPTIONS.map(
                  (option) => (

                    <option
                      key={
                        option.seconds
                      }
                      value={
                        option.seconds
                      }
                    >

                      {option.label}

                    </option>

                  )
                )}

              </select>

            </div>


            <button
              type="button"
              onClick={
                startTimer
              }
            >
              Start Safety Check-In
            </button>

          </>

        )}


      {/* =================================
          ACTIVE TIMER
      ================================= */}

      {isActive && (

        <>

          <span className="hero-badge">
            CHECK-IN ACTIVE
          </span>


          <h3>
            Your safety timer is running
          </h3>


          <div className="timer-display">

            {
              formatTime(
                remainingSeconds
              )
            }

          </div>


          <p>
            You can safely move to another
            AEGIRA page. This timer will
            continue running.
          </p>


          <div className="timer-actions">


            <button
              type="button"
              onClick={
                markSafe
              }
            >
              ✓ I'm Safe
            </button>


            <button
              type="button"
              onClick={
                extendTimer
              }
            >
              + Extend 5 Min
            </button>


            <button
              type="button"
              className="danger-button"
              onClick={
                cancelTimer
              }
            >
              Cancel
            </button>


          </div>

        </>

      )}


      {/* =================================
          EXPIRED TIMER
      ================================= */}

      {isExpired && (

        <>

          <span className="hero-badge">
            CHECK-IN EXPIRED
          </span>


          <h3>
            Safety Check-In expired
          </h3>


          <div className="timer-display">
            00:00
          </div>


          {alertStatus && (

            <div
              className={
                alertStatus.includes(
                  "could not"
                )
                  ? "message-error"
                  : "message-success"
              }
            >

              {alertStatus}

            </div>

          )}


          <div
            className="timer-actions"
          >

            <button
              type="button"
              onClick={
                () => {

                  clearStoredTimer();

                  setStatus("");

                  setAlertStatus("");

                }
              }
            >
              Start New Check-In
            </button>

          </div>

        </>

      )}


      {/* =================================
          STATUS
      ================================= */}

      {status &&
        !isExpired && (

          <div
            className="message-success"
          >

            {status}

          </div>

        )}


    </div>

  );

}


export default SafetyTimer;