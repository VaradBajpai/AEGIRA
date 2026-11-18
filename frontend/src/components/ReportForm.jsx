import {
  useEffect,
  useState,
} from "react";

import {
  structureIncidentReport,
} from "../services/api";


function ReportForm({
  onReportGenerated,
}) {

  const [
    description,
    setDescription,
  ] = useState("");

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  const [
    voiceMessage,
    setVoiceMessage,
  ] = useState("");


  // --------------------------------
  // RECEIVE VOICE DICTATION
  // --------------------------------

  useEffect(() => {

    const handleVoiceDictation =
      (event) => {

        const text =
          event.detail?.text;

        if (!text) {
          return;
        }


        setDescription(
          (previous) => {

            if (!previous.trim()) {
              return text;
            }

            return `${previous} ${text}`;

          }
        );


        setVoiceMessage(
          "Voice description added."
        );

      };


    window.addEventListener(
      "aegira:report-dictation",
      handleVoiceDictation
    );


    return () => {

      window.removeEventListener(
        "aegira:report-dictation",
        handleVoiceDictation
      );

    };

  }, []);


  const handleSubmit =
    async (event) => {

      event.preventDefault();


      if (
        !description.trim()
      ) {

        setError(
          "Please describe the incident or concern."
        );

        return;

      }


      try {

        setLoading(true);

        setError("");


        const response =
          await structureIncidentReport(
            description
          );


        onReportGenerated(
          response.report
        );

      } catch (error) {

        console.error(
          "Report Error:",
          error
        );


        if (
          error.message?.includes(
            "Failed to fetch"
          )
        ) {

          setError(
            "AEGIRA backend is unavailable. Please make sure Flask is running."
          );

        } else {

          setError(
            error.message ||
              "Unable to process the incident description."
          );

        }

      } finally {

        setLoading(false);

      }

    };


  return (

    <div>

      <div className="report-heading">

        <span className="hero-badge">
          Private Documentation
        </span>


        <h2>
          Private Incident Report
        </h2>


        <p>

          Describe what happened
          in your own words.
          AEGIRA will organize
          the information into an
          editable structured
          draft.

        </p>

      </div>


      <div className="privacy-banner">

        <div>

          <strong>
            Your report stays
            under your control
          </strong>


          <p>

            AEGIRA does not
            automatically send
            this report to trusted
            contacts, authorities,
            or support
            organizations.

          </p>

        </div>


        <div className="privacy-icon">
          🔒
        </div>

      </div>


      <br />


      <form
        onSubmit={
          handleSubmit
        }
      >

        <div className="report-field">

          <label>
            Describe the incident
            or concern
          </label>


          <textarea
            placeholder="Example: Yesterday around 8 PM someone followed me from the metro station while I was returning home..."
            value={description}
            onChange={(event) =>
              setDescription(
                event.target.value
              )
            }
            rows="9"
          />

        </div>


        <p className="helper-text">

          Type your description,
          or tell AEGIRA Voice
          “Dictate Report” and use
          the microphone to speak
          your description.

        </p>


        {voiceMessage && (

          <div className="message-success">

            {voiceMessage}

          </div>

        )}


        <button
          type="submit"
          disabled={loading}
        >

          {loading
            ? "Processing Report..."
            : "Generate Structured Report"}

        </button>

      </form>


      {error && (

        <div className="message-error">

          {error}

        </div>

      )}

    </div>

  );

}


export default ReportForm;