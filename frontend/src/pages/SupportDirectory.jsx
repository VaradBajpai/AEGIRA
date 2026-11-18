import { useState } from "react";


const CATEGORIES = [
  "Counseling",
  "Legal Aid",
  "Medical",
  "Shelter",
  "Women Support",
  "Workplace Support",
];


const CITIES = [
  "Roorkee",
  "Haridwar",
  "Dehradun",
  "Delhi",
  "Noida",
  "Gurugram",
  "Mumbai",
];


// ==========================================
// MULTIPLE REAL-WORLD SEARCH TERMS
// ==========================================

const CATEGORY_SEARCHES = {

  Medical: [
    "hospital",
    "women hospital",
    "medical clinic",
    "emergency hospital",
  ],


  Shelter: [
    "women shelter",
    "women safe home",
    "nari niketan",
    "women protection home",
    "short stay home for women",
  ],


  "Legal Aid": [
    "legal aid",
    "district legal services authority",
    "legal services",
    "lawyer",
    "women legal aid",
  ],


  Counseling: [
    "counselling centre",
    "mental health clinic",
    "psychologist",
    "women counselling centre",
    "therapy centre",
  ],


  "Women Support": [
    "women support centre",
    "one stop centre women",
    "mahila help centre",
    "women welfare centre",
    "women protection centre",
  ],


  "Workplace Support": [
    "workplace harassment support",
    "women legal support",
    "labour office",
    "women commission",
    "legal aid workplace harassment",
  ],

};


function SupportDirectory() {

  const [
    category,
    setCategory
  ] = useState("Medical");


  const [
    city,
    setCity
  ] = useState("Roorkee");


  const [
    results,
    setResults
  ] = useState([]);


  const [
    loading,
    setLoading
  ] = useState(false);


  const [
    error,
    setError
  ] = useState("");


  const [
    status,
    setStatus
  ] = useState("");


  // ==========================================
  // DISTANCE CALCULATION
  // ==========================================

  const calculateDistance = (
    lat1,
    lon1,
    lat2,
    lon2
  ) => {

    const earthRadius = 6371;


    const toRadians = (
      degrees
    ) => (
      degrees *
      Math.PI /
      180
    );


    const dLat =
      toRadians(
        lat2 - lat1
      );


    const dLon =
      toRadians(
        lon2 - lon1
      );


    const a =
      Math.sin(
        dLat / 2
      ) ** 2
      +
      Math.cos(
        toRadians(lat1)
      )
      *
      Math.cos(
        toRadians(lat2)
      )
      *
      Math.sin(
        dLon / 2
      ) ** 2;


    const c =
      2 *
      Math.atan2(
        Math.sqrt(a),
        Math.sqrt(1 - a)
      );


    return (
      earthRadius * c
    );

  };


  // ==========================================
  // FIND CITY COORDINATES
  // ==========================================

  const getCityCoordinates =
    async (
      selectedCity
    ) => {

      const query =
        `${selectedCity}, India`;


      const url =
        "https://nominatim.openstreetmap.org/search" +
        "?format=jsonv2" +
        "&limit=1" +
        "&countrycodes=in" +
        "&q=" +
        encodeURIComponent(
          query
        );


      const response =
        await fetch(
          url,
          {
            headers: {
              Accept:
                "application/json",
            },
          }
        );


      if (!response.ok) {

        throw new Error(
          "Unable to locate the selected city."
        );

      }


      const data =
        await response.json();


      if (
        !Array.isArray(data)
        ||
        data.length === 0
      ) {

        throw new Error(
          `Could not locate ${selectedCity}.`
        );

      }


      return {

        latitude:
          Number(
            data[0].lat
          ),

        longitude:
          Number(
            data[0].lon
          ),

      };

    };


  // ==========================================
  // GET CURRENT LOCATION
  // ==========================================

  const getCurrentLocation = () => {

    return new Promise(
      (
        resolve,
        reject
      ) => {

        if (
          !navigator.geolocation
        ) {

          reject(
            new Error(
              "Location is not supported by this browser."
            )
          );

          return;

        }


        navigator.geolocation
          .getCurrentPosition(

            (
              position
            ) => {

              resolve({

                latitude:
                  position.coords
                    .latitude,

                longitude:
                  position.coords
                    .longitude,

              });

            },


            () => {

              reject(
                new Error(
                  "Location permission was denied."
                )
              );

            },


            {
              enableHighAccuracy:
                true,

              timeout:
                10000,

              maximumAge:
                60000,
            }

          );

      }
    );

  };


  // ==========================================
  // SEARCH ONE QUERY
  // ==========================================

  const searchOneQuery =
    async (
      searchText,
      latitude,
      longitude,
      selectedCity,
      useCurrentLocation
    ) => {

      /*
        Viewbox keeps searches reasonably
        close to the selected/current area.
      */

      const latOffset =
        0.22;

      const lonOffset =
        0.25;


      const left =
        longitude -
        lonOffset;

      const right =
        longitude +
        lonOffset;

      const top =
        latitude +
        latOffset;

      const bottom =
        latitude -
        latOffset;


      let query;


      if (
        useCurrentLocation
      ) {

        query =
          searchText;

      } else {

        query =
          `${searchText}, ${selectedCity}, India`;

      }


      const params =
        new URLSearchParams({

          format:
            "jsonv2",

          q:
            query,

          limit:
            "8",

          countrycodes:
            "in",

          addressdetails:
            "1",

          extratags:
            "1",

          namedetails:
            "1",

          viewbox:
            `${left},${top},${right},${bottom}`,

        });


      const url =
        "https://nominatim.openstreetmap.org/search?" +
        params.toString();


      const response =
        await fetch(
          url,
          {
            headers: {
              Accept:
                "application/json",
            },
          }
        );


      if (!response.ok) {

        return [];

      }


      const data =
        await response.json();


      if (
        !Array.isArray(data)
      ) {

        return [];

      }


      return data;

    };


  // ==========================================
  // NORMALIZE RESULT
  // ==========================================

  const normalizePlace = (
    item,
    selectedCategory,
    originLatitude,
    originLongitude
  ) => {

    const latitude =
      Number(
        item.lat
      );


    const longitude =
      Number(
        item.lon
      );


    const extra =
      item.extratags || {};


    const names =
      item.namedetails || {};


    let name =
      names.name ||
      names["name:en"] ||
      "";


    if (!name) {

      name =
        item.display_name
          ?.split(",")[0]
          ?.trim()
        ||
        "Support Service";

    }


    const phone =
      extra.phone ||
      extra[
        "contact:phone"
      ] ||
      extra.mobile ||
      "";


    const website =
      extra.website ||
      extra[
        "contact:website"
      ] ||
      extra.url ||
      "";


    const distance =
      calculateDistance(
        originLatitude,
        originLongitude,
        latitude,
        longitude
      );


    return {

      id:
        `${item.osm_type}-${item.osm_id}`,

      name,

      category:
        selectedCategory,

      address:
        item.display_name ||
        "Address available on map",

      phone,

      website,

      latitude,

      longitude,

      distance,

    };

  };


  // ==========================================
  // SEARCH CATEGORY
  // ==========================================

  const searchCategory =
    async (
      selectedCategory,
      latitude,
      longitude,
      selectedCity,
      useCurrentLocation = false
    ) => {

      const searchTerms =
        CATEGORY_SEARCHES[
          selectedCategory
        ] || [
          selectedCategory
        ];


      const collected =
        [];


      const seen =
        new Set();


      /*
        Search several descriptions because
        different organisations are mapped
        using different names.
      */

      for (
        const term
        of searchTerms
      ) {

        try {

          const items =
            await searchOneQuery(
              term,
              latitude,
              longitude,
              selectedCity,
              useCurrentLocation
            );


          for (
            const item
            of items
          ) {

            const id =
              `${item.osm_type}-${item.osm_id}`;


            if (
              seen.has(id)
            ) {

              continue;

            }


            seen.add(id);


            const normalized =
              normalizePlace(
                item,
                selectedCategory,
                latitude,
                longitude
              );


            /*
              Avoid extremely distant
              unrelated search results.
            */

            if (
              normalized.distance >
              40
            ) {

              continue;

            }


            collected.push(
              normalized
            );

          }

        } catch (
          searchError
        ) {

          console.log(
            "Search attempt failed:",
            term,
            searchError
          );

        }

      }


      /*
        Sort nearest locations first.
      */

      collected.sort(
        (
          first,
          second
        ) => (
          first.distance -
          second.distance
        )
      );


      /*
        Keep interface clean.
      */

      return collected.slice(
        0,
        15
      );

    };


  // ==========================================
  // FIND SUPPORT USING SELECTED CITY
  // ==========================================

  const handleFindSupport =
    async () => {

      try {

        setLoading(true);

        setResults([]);

        setError("");


        setStatus(
          `Searching real ${category} services around ${city}...`
        );


        const coordinates =
          await getCityCoordinates(
            city
          );


        const places =
          await searchCategory(

            category,

            coordinates.latitude,

            coordinates.longitude,

            city,

            false

          );


        setResults(
          places
        );


        if (
          places.length === 0
        ) {

          setStatus("");


          setError(
            `No ${category} locations were found around ${city} in the public map database. Try Google Maps or another nearby city.`
          );

        } else {

          setStatus(
            `${places.length} real ${category} result(s) found around ${city}.`
          );

        }

      } catch (
        searchError
      ) {

        console.error(
          searchError
        );


        setStatus("");


        setError(
          searchError.message ||
          "Unable to search support services."
        );

      } finally {

        setLoading(false);

      }

    };


  // ==========================================
  // FIND USING CURRENT DEVICE LOCATION
  // ==========================================

  const handleCurrentLocationSearch =
    async () => {

      try {

        setLoading(true);

        setResults([]);

        setError("");


        setStatus(
          "Getting your current location..."
        );


        const coordinates =
          await getCurrentLocation();


        setStatus(
          `Searching nearby ${category} services...`
        );


        const places =
          await searchCategory(

            category,

            coordinates.latitude,

            coordinates.longitude,

            "",

            true

          );


        setResults(
          places
        );


        if (
          places.length === 0
        ) {

          setStatus("");


          setError(
            `No nearby ${category} results were found in the public map database.`
          );

        } else {

          setStatus(
            `${places.length} nearby ${category} result(s) found.`
          );

        }

      } catch (
        locationError
      ) {

        setStatus("");


        setError(
          locationError.message
        );

      } finally {

        setLoading(false);

      }

    };


  // ==========================================
  // OPEN INDIVIDUAL LOCATION IN GOOGLE MAPS
  // ==========================================

  const openPlaceInGoogleMaps = (
    place
  ) => {

    const query =
      `${place.latitude},${place.longitude}`;


    const url =
      "https://www.google.com/maps/search/" +
      "?api=1&query=" +
      encodeURIComponent(
        query
      );


    window.open(
      url,
      "_blank",
      "noopener,noreferrer"
    );

  };


  // ==========================================
  // OPEN CATEGORY SEARCH IN GOOGLE MAPS
  // ==========================================

  const openCategoryInGoogleMaps =
    () => {

      const searchText =
        CATEGORY_SEARCHES[
          category
        ]?.[0]
        ||
        category;


      const query =
        `${searchText} in ${city}`;


      const url =
        "https://www.google.com/maps/search/" +
        "?api=1&query=" +
        encodeURIComponent(
          query
        );


      window.open(
        url,
        "_blank",
        "noopener,noreferrer"
      );

    };


  // ==========================================
  // RESET
  // ==========================================

  const clearSearch = () => {

    setResults([]);

    setError("");

    setStatus("");

    setCategory(
      "Medical"
    );

    setCity(
      "Roorkee"
    );

  };


  return (

    <div className="support-directory">


      {/* ===================================
          HEADER
      =================================== */}

      <div className="support-intro">

        <span className="section-eyebrow">
          LIVE SUPPORT DISCOVERY
        </span>


        <h2>
          Find Real Support
        </h2>


        <p>
          Discover real map-listed medical,
          shelter, legal, counseling and
          women's support services.
        </p>

      </div>


      <div className="message-success">

        AEGIRA searches public map data
        instead of generating demo
        organisations. Please verify a
        service before relying on it.

      </div>


      {/* ===================================
          FILTERS
      =================================== */}

      <div className="support-filters">


        <div className="report-field">

          <label>
            Type of Support
          </label>


          <select
            value={category}
            onChange={
              (
                event
              ) => {

                setCategory(
                  event.target.value
                );

                setResults([]);

                setError("");

                setStatus("");

              }
            }
          >

            {CATEGORIES.map(
              (
                item
              ) => (

                <option
                  value={item}
                  key={item}
                >
                  {item}
                </option>

              )
            )}

          </select>

        </div>


        <div className="report-field">

          <label>
            Location
          </label>


          <select
            value={city}
            onChange={
              (
                event
              ) => {

                setCity(
                  event.target.value
                );

                setResults([]);

                setError("");

                setStatus("");

              }
            }
          >

            {CITIES.map(
              (
                item
              ) => (

                <option
                  value={item}
                  key={item}
                >
                  {item}
                </option>

              )
            )}

          </select>

        </div>


        <div className="support-filter-buttons">


          <button
            type="button"
            onClick={
              handleFindSupport
            }
            disabled={
              loading
            }
          >

            {loading
              ? "Searching..."
              : "Find Support"}

          </button>


          <button
            type="button"
            className="maps-secondary-button"
            onClick={
              handleCurrentLocationSearch
            }
            disabled={
              loading
            }
          >

            ◎ Use My Location

          </button>


          <button
            type="button"
            className="maps-secondary-button"
            onClick={
              openCategoryInGoogleMaps
            }
          >

            📍 Google Maps

          </button>


          <button
            type="button"
            onClick={
              clearSearch
            }
          >

            Clear

          </button>


        </div>

      </div>


      <hr />


      {/* ===================================
          SEARCH STATUS
      =================================== */}

      {status && (

        <div className="live-search-status">

          <span>
            ●
          </span>

          {status}

        </div>

      )}


      {/* ===================================
          ERROR
      =================================== */}

      {error && (

        <div className="message-error">

          <p>
            {error}
          </p>


          <button
            type="button"
            onClick={
              openCategoryInGoogleMaps
            }
          >

            Search Google Maps Instead

          </button>

        </div>

      )}


      {/* ===================================
          RESULTS
      =================================== */}

      {!loading &&
        results.length > 0 && (

          <>

            <div className="support-results-header">

              <div>

                <span className="section-eyebrow">
                  LIVE MAP RESULTS
                </span>


                <h3>
                  {category} Results
                </h3>


                <p>
                  Nearest results are
                  displayed first.
                </p>

              </div>

            </div>


            <div className="support-grid">


              {results.map(
                (
                  place
                ) => (

                  <article
                    className="support-card live-support-card"
                    key={
                      place.id
                    }
                  >


                    <div className="support-source-row">


                      <span className="support-badge">

                        {
                          place.category
                        }

                      </span>


                      <span className="live-source-badge">

                        ● LIVE MAP

                      </span>


                    </div>


                    <h3>
                      {place.name}
                    </h3>


                    <p>

                      <strong>
                        Address:
                      </strong>

                      {" "}

                      {
                        place.address
                      }

                    </p>


                    <p>

                      <strong>
                        Distance:
                      </strong>

                      {" "}

                      {
                        place.distance
                          .toFixed(1)
                      } km

                    </p>


                    {place.phone && (

                      <p>

                        <strong>
                          Phone:
                        </strong>

                        {" "}

                        {
                          place.phone
                        }

                      </p>

                    )}


                    <div className="support-card-actions">


                      <button
                        type="button"
                        className="maps-place-button"
                        onClick={
                          () =>
                            openPlaceInGoogleMaps(
                              place
                            )
                        }
                      >

                        📍 Open in Google Maps

                      </button>


                      {place.phone && (

                        <a
                          href={
                            `tel:${place.phone}`
                          }
                          className="support-call-button"
                        >

                          ☎ Call

                        </a>

                      )}


                      {place.website && (

                        <a
                          href={
                            place.website
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="support-website-button"
                        >

                          Website ↗

                        </a>

                      )}


                    </div>


                  </article>

                )
              )}


            </div>

          </>

        )}


      {/* ===================================
          START SCREEN
      =================================== */}

      {!loading &&
        results.length === 0 &&
        !error && (

          <div className="support-start-card">


            <div className="support-start-icon">

              {category === "Medical"
                ? "🏥"
                : category === "Shelter"
                ? "🏠"
                : category === "Legal Aid"
                ? "⚖️"
                : category === "Counseling"
                ? "♡"
                : category === "Women Support"
                ? "🤝"
                : "🛡️"}

            </div>


            <h3>
              Search for {category}
            </h3>


            <p>
              Choose a location and press
              Find Support, or use your
              current device location.
            </p>


          </div>

        )}


    </div>

  );

}


export default SupportDirectory;