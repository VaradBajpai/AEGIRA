import { useState } from "react";

function ReportPreview({ report }) {
  const [editableReport, setEditableReport] =
    useState(report);

  const [saveMessage, setSaveMessage] =
    useState("");

  const updateField = (field, value) => {
    setEditableReport({
      ...editableReport,
      [field]: value,
    });

    setSaveMessage("");
  };

  const saveReportLocally = () => {
    try {
      const existingReports =
        JSON.parse(
          localStorage.getItem(
            "aegira_incident_reports"
          )
        ) || [];

      const reportToSave = {
        ...editableReport,

        id: Date.now(),

        saved_at:
          new Date().toISOString(),
      };

      const updatedReports = [
        ...existingReports,
        reportToSave,
      ];

      localStorage.setItem(
        "aegira_incident_reports",
        JSON.stringify(updatedReports)
      );

      setSaveMessage(
        "Report saved privately on this device."
      );
    } catch (error) {
      console.error(
        "Unable to save report:",
        error
      );

      setSaveMessage(
        "Unable to save the report."
      );
    }
  };

  return (
    <div className="report-preview">
      <span className="hero-badge">
        AEGIRA Structured Draft
      </span>

      <h2>Review Your Report</h2>

      <p>
        AEGIRA may misunderstand some details.
        Review and edit every field before saving.
      </p>

      <div className="report-field">
        <label>Incident Type</label>

        <input
          type="text"
          value={
            editableReport.incident_type || ""
          }
          onChange={(e) =>
            updateField(
              "incident_type",
              e.target.value
            )
          }
        />
      </div>

      <div className="report-row">
        <div className="report-field">
          <label>Date</label>

          <input
            type="text"
            value={
              editableReport.date || ""
            }
            onChange={(e) =>
              updateField(
                "date",
                e.target.value
              )
            }
          />
        </div>

        <div className="report-field">
          <label>Time</label>

          <input
            type="text"
            value={
              editableReport.time || ""
            }
            onChange={(e) =>
              updateField(
                "time",
                e.target.value
              )
            }
          />
        </div>
      </div>

      <div className="report-field">
        <label>Location</label>

        <input
          type="text"
          value={
            editableReport.location || ""
          }
          onChange={(e) =>
            updateField(
              "location",
              e.target.value
            )
          }
        />
      </div>

      <div className="report-field">
        <label>Actions Taken</label>

        <textarea
          rows="4"
          value={
            Array.isArray(
              editableReport.actions_taken
            )
              ? editableReport.actions_taken.join(
                  ", "
                )
              : editableReport.actions_taken ||
                ""
          }
          onChange={(e) =>
            updateField(
              "actions_taken",
              e.target.value
                .split(",")
                .map((item) =>
                  item.trim()
                )
            )
          }
        />
      </div>

      <div className="report-field">
        <label>Evidence / Notes</label>

        <input
          type="text"
          value={
            editableReport.evidence || ""
          }
          onChange={(e) =>
            updateField(
              "evidence",
              e.target.value
            )
          }
        />
      </div>

      <div className="report-field">
        <label>Support Needed</label>

        <input
          type="text"
          value={
            editableReport.support_needed ||
            ""
          }
          onChange={(e) =>
            updateField(
              "support_needed",
              e.target.value
            )
          }
        />
      </div>

      <div className="report-field">
        <label>Original Description</label>

        <textarea
          rows="7"
          value={
            editableReport.original_description ||
            ""
          }
          onChange={(e) =>
            updateField(
              "original_description",
              e.target.value
            )
          }
        />
      </div>

      <div className="report-actions">
        <button
          onClick={saveReportLocally}
        >
          Save Privately
        </button>
      </div>

      {saveMessage && (
        <div className="message-success">
          {saveMessage}
        </div>
      )}

      <div className="report-warning">
        <strong>Important:</strong>{" "}
        This is a private structured draft created
        from your description. AEGIRA does not
        determine whether an allegation is true and
        this draft is not automatically submitted
        anywhere.
      </div>
    </div>
  );
}

export default ReportPreview;