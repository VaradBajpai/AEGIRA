const API_URL =
  "http://127.0.0.1:5000";


export const sendSOSAlert = async (
  alertData
) => {

  const response = await fetch(
    `${API_URL}/api/alerts/demo`,
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify(
        alertData
      ),
    }
  );

  const data =
    await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Unable to send SOS alert."
    );
  }

  return data;
};


export const structureIncidentReport =
  async (description) => {

    const response = await fetch(
      `${API_URL}/api/report/structure`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          description: description,
        }),
      }
    );

    const data =
      await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
          "Unable to structure incident report."
      );
    }

    return data;
  };


export const getSupportResources =
  async (
    category = "",
    city = ""
  ) => {

    const params =
      new URLSearchParams();

    if (category) {
      params.append(
        "category",
        category
      );
    }

    if (city) {
      params.append(
        "city",
        city
      );
    }

    const query =
      params.toString();

    const url = query
      ? `${API_URL}/api/support?${query}`
      : `${API_URL}/api/support`;

    const response =
      await fetch(url);

    const data =
      await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
          "Unable to load support resources."
      );
    }

    return data;
  };


export const getSupportOptions =
  async () => {

    const response =
      await fetch(
        `${API_URL}/api/support/options`
      );

    const data =
      await response.json();

    if (!response.ok) {
      throw new Error(
        "Unable to load support options."
      );
    }

    return data;
  };