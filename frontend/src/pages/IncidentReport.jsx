import { useState } from "react";

import ReportForm from "../components/ReportForm";
import ReportPreview from "../components/ReportPreview";

function IncidentReport() {
  const [report, setReport] =
    useState(null);

  const handleReportGenerated = (
    generatedReport
  ) => {
    setReport(generatedReport);
  };

  return (
    <div>
      <ReportForm
        onReportGenerated={
          handleReportGenerated
        }
      />

      {report && (
        <ReportPreview
          key={JSON.stringify(report)}
          report={report}
        />
      )}
    </div>
  );
}

export default IncidentReport;