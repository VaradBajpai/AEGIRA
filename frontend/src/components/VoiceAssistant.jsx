import {
  useRef,
  useState,
} from "react";

import {
  createRecognition,
  isVoiceSupported,
  speak,
} from "../services/voiceService";

import {
  getCurrentLocation,
} from "../services/locationService";

import {
  getTrustedContacts,
} from "../services/storageService";

import {
  sendSOSAlert,
} from "../services/api";


function VoiceAssistant({
  onNavigate,
}) {

  const [
    listening,
    setListening,
  ] = useState(false);

  const [
    status,
    setStatus,
  ] = useState(
    "Tap the microphone and speak a command."
  );

  const [
    pendingSOS,
    setPendingSOS,
  ] = useState(false);

  const [
    dictationMode,
    setDictationMode,
  ] = useState(false);

  const recognitionRef =
    useRef(null);


  const supported =
    isVoiceSupported();


  // --------------------------------
  // SOS THROUGH VOICE
  // --------------------------------

  const activateVoiceSOS =
    async () => {

      try {

        setStatus(
          "Preparing emergency alert..."
        );

        speak(
          "Preparing your emergency alert."
        );


        const contacts =
          getTrustedContacts();


        if (
          contacts.length === 0
        ) {

          setStatus(
            "No trusted contacts are configured."
          );

          speak(
            "No trusted contacts are configured. Please add a trusted contact first."
          );

          return;
        }


        const location =
          await getCurrentLocation();


        const alertData = {

          name:
            "AEGIRA User",

          latitude:
            location.latitude,

          longitude:
            location.longitude,

          contacts,

          trigger_type:
            "voice_sos",

        };


        const response =
          await sendSOSAlert(
            alertData
          );


        if (
          response.status ===
          "success"
        ) {

          setStatus(
            "SOS alert simulated successfully."
          );

          speak(
            "SOS alert activated successfully."
          );

        }

      } catch (error) {

        console.error(
          "Voice SOS Error:",
          error
        );


        if (
          error.code === 1
        ) {

          setStatus(
            "Location permission was denied."
          );

          speak(
            "Location permission is required to activate the SOS alert."
          );

        } else {

          setStatus(
            "Unable to activate the SOS alert."
          );

          speak(
            "I could not activate the SOS alert."
          );

        }

      } finally {

        setPendingSOS(false);

      }

    };


  // --------------------------------
  // COMMAND PROCESSING
  // --------------------------------

  const processCommand = (
    transcript
  ) => {

    const command =
      transcript
        .toLowerCase()
        .trim();


    setStatus(
      `You said: "${transcript}"`
    );


    // -----------------------------
    // REPORT DICTATION MODE
    // -----------------------------

    if (dictationMode) {

      window.dispatchEvent(
        new CustomEvent(
          "aegira:report-dictation",
          {
            detail: {
              text: transcript,
            },
          }
        )
      );


      setDictationMode(false);

      onNavigate("report");


      setStatus(
        "Voice description added to your private report."
      );

      speak(
        "Your description has been added to the private report."
      );

      return;
    }


    // -----------------------------
    // CONFIRM SOS
    // -----------------------------

    if (
      command.includes(
        "confirm sos"
      )
    ) {

      if (!pendingSOS) {

        setStatus(
          "There is no pending SOS request."
        );

        speak(
          "There is no emergency request waiting for confirmation."
        );

        return;
      }


      activateVoiceSOS();

      return;
    }


    // -----------------------------
    // CANCEL SOS
    // -----------------------------

    if (
      command.includes(
        "cancel sos"
      ) ||
      command.includes(
        "cancel emergency"
      )
    ) {

      setPendingSOS(false);

      setStatus(
        "SOS request cancelled."
      );

      speak(
        "SOS request cancelled."
      );

      return;
    }


    // -----------------------------
    // ACTIVATE SOS
    // -----------------------------

    if (
      command.includes(
        "activate sos"
      ) ||
      command.includes(
        "emergency sos"
      ) ||
      command.includes(
        "start sos"
      )
    ) {

      setPendingSOS(true);

      onNavigate("home");


      setStatus(
        "SOS requested. Say Confirm SOS to continue."
      );

      speak(
        "Emergency activation requested. Say confirm SOS to continue, or cancel SOS to stop."
      );

      return;
    }


    // -----------------------------
    // SAFETY CHECK-IN
    // -----------------------------

    if (
      command.includes(
        "safety check"
      ) ||
      command.includes(
        "check in"
      ) ||
      command.includes(
        "check-in"
      )
    ) {

      onNavigate(
        "checkin"
      );


      setStatus(
        "Opening Safety Check-In."
      );

      speak(
        "Opening safety check in."
      );

      return;
    }


    // -----------------------------
    // TRUSTED CONTACTS
    // -----------------------------

    if (
      command.includes(
        "trusted contact"
      ) ||
      command.includes(
        "trusted circle"
      ) ||
      command.includes(
        "contacts"
      )
    ) {

      onNavigate(
        "contacts"
      );


      setStatus(
        "Opening Trusted Circle."
      );

      speak(
        "Opening your trusted circle."
      );

      return;
    }


    // -----------------------------
    // PRIVATE REPORT
    // -----------------------------

    if (
      command.includes(
        "private report"
      ) ||
      command.includes(
        "incident report"
      ) ||
      command.includes(
        "create report"
      )
    ) {

      onNavigate(
        "report"
      );


      setStatus(
        "Opening Private Report."
      );

      speak(
        "Opening private incident report."
      );

      return;
    }


    // -----------------------------
    // DICTATE REPORT
    // -----------------------------

    if (
      command.includes(
        "dictate report"
      ) ||
      command.includes(
        "dictate incident"
      )
    ) {

      onNavigate(
        "report"
      );

      setDictationMode(
        true
      );


      setStatus(
        "Dictation mode ready. Tap the microphone again and describe what happened."
      );

      speak(
        "Dictation mode is ready. Tap the microphone again and describe what happened."
      );

      return;
    }


    // -----------------------------
    // SUPPORT
    // -----------------------------

    if (
      command.includes(
        "find support"
      ) ||
      command.includes(
        "support directory"
      ) ||
      command.includes(
        "help resources"
      )
    ) {

      onNavigate(
        "support"
      );


      setStatus(
        "Opening Support Directory."
      );

      speak(
        "Opening support directory."
      );

      return;
    }


    // -----------------------------
    // HOME
    // -----------------------------

    if (
      command.includes(
        "go home"
      ) ||
      command ===
        "home" ||
      command.includes(
        "open home"
      )
    ) {

      onNavigate(
        "home"
      );


      setStatus(
        "Returning home."
      );

      speak(
        "Returning to the AEGIRA home screen."
      );

      return;
    }


    // -----------------------------
    // HELP
    // -----------------------------

    if (
      command === "help" ||
      command.includes(
        "what can you do"
      )
    ) {

      setStatus(
        "Try: Activate SOS, Safety Check-In, Trusted Contacts, Private Report, Dictate Report, Find Support, or Go Home."
      );

      speak(
        "You can say activate SOS, safety check in, trusted contacts, private report, dictate report, find support, or go home."
      );

      return;
    }


    // -----------------------------
    // UNKNOWN COMMAND
    // -----------------------------

    setStatus(
      `I did not understand "${transcript}". Try saying Help.`
    );

    speak(
      "I did not understand that command. Say help to hear available commands."
    );

  };


  // --------------------------------
  // START / STOP LISTENING
  // --------------------------------

  const startListening = () => {

    if (!supported) {

      setStatus(
        "Voice recognition is not supported in this browser."
      );

      return;
    }


    if (
      listening &&
      recognitionRef.current
    ) {

      recognitionRef.current.stop();

      return;
    }


    const recognition =
      createRecognition({

        onResult:
          processCommand,


        onError:
          (event) => {

            console.error(
              "Voice recognition error:",
              event.error
            );


            if (
              event.error ===
              "not-allowed"
            ) {

              setStatus(
                "Microphone permission was denied."
              );

              speak(
                "Microphone permission is required for voice commands."
              );

            } else if (
              event.error ===
              "no-speech"
            ) {

              setStatus(
                "No speech detected. Please try again."
              );

            } else {

              setStatus(
                "Voice recognition failed. Please try again."
              );

            }


            setListening(
              false
            );

          },


        onEnd:
          () => {

            setListening(
              false
            );

          },

      });


    if (!recognition) {
      return;
    }


    recognitionRef.current =
      recognition;


    setListening(
      true
    );


    setStatus(
      dictationMode
        ? "Listening to your incident description..."
        : "Listening..."
    );


    try {

      recognition.start();

    } catch (error) {

      console.error(
        "Recognition Start Error:",
        error
      );

      setListening(
        false
      );

    }

  };


  return (
    <div className="voice-assistant">

      <div className="voice-panel">

        <div className="voice-panel-header">

          <div>

            <strong>
              AEGIRA Voice
            </strong>

            <span>
              Voice Safety Assistant
            </span>

          </div>


          <div
            className={
              listening
                ? "voice-live-dot active"
                : "voice-live-dot"
            }
          />

        </div>


        <p className="voice-status">

          {supported
            ? status
            : "Voice recognition is unavailable in this browser."}

        </p>


        {pendingSOS && (

          <div className="voice-sos-warning">

            SOS confirmation pending.

            <br />

            Say{" "}
            <strong>
              “Confirm SOS”
            </strong>{" "}
            or{" "}
            <strong>
              “Cancel SOS”
            </strong>.

          </div>

        )}


        {dictationMode && (

          <div className="voice-dictation-message">

            Report dictation mode is active.

          </div>

        )}


        <div className="voice-command-hint">

          Try: “Activate SOS”,
          “Safety Check-In”,
          “Private Report” or
          “Find Support”.

        </div>

      </div>


      <button
        className={
          listening
            ? "voice-fab listening"
            : "voice-fab"
        }

        onClick={
          startListening
        }

        disabled={
          !supported
        }

        aria-label="AEGIRA voice assistant"
        title="AEGIRA Voice Assistant"
      >

        {listening
          ? "●"
          : "🎙"}

      </button>

    </div>
  );

}


export default VoiceAssistant;