// Set mapbox access token
mapboxgl.accessToken =
  "pk.eyJ1Ijoid29sbGV5c2Vzb20iLCJhIjoiY2t1MGdxamVwMWU4bTJudGgyOWsxaGg3ZSJ9.Pxl9xv4a8z9tVFIhSecDUw";

let centerData = [];
if (trip) {
  centerData = [trip.latitude, trip.longitude];
} else {
  centerData = [-21.9270884, 64.1436456];
}

// initialize mapbox instance
const map = new mapboxgl.Map({
  container: "map", // HTML container id
  style: "mapbox://styles/mapbox/streets-v9", // style URL
  // center: [-21.9270884, 64.1436456], // starting position as [lng, lat]
  center: centerData,
  zoom: 13, // starting zoom level
});

// autocomplete instance, used to set options
let autocompleteInstance;

// store autocomplete data to lookup user selection's coordinates
let autocompleteData;

// Autocomplete Input
const autocompleteInput = document.querySelector(".autocomplete");

const latitudeInput = document.querySelector("#latitude");
const longitudeInput = document.querySelector("#longitude");

/**
 * When DOM is loaded, initialize autocomplete
 */
document.addEventListener("DOMContentLoaded", function () {
  autocompleteInstance = M.Autocomplete.init(autocompleteInput, {
    data: [],
    // Callback when user selects an option in autocomplete
    onAutocomplete: (e) => {
      // Find user's selection in autocomplete data
      const found = autocompleteData.find((elem) => elem.place_name === e);
      // Set map center to user's selection
      // https://docs.mapbox.com/mapbox-gl-js/api/map/#map#setcenter
      map.setCenter(found.center);
      // [lat, lng]
      latitudeInput.value = found.center[0];
      longitudeInput.value = found.center[1];
    },
  });
});

/**
 * Listens to user keyup event to query for place suggestions
 */
autocompleteInput?.addEventListener("keyup", (e) => {
  // console.log(e.target.value);
  fetch("/trips/autocomplete?query=" + e.target.value)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);

      // Store data in autocompleteData for user's selection lookup
      autocompleteData = data.features;

      // Update autocomplete instance's options data
      console.log(data.features);
      console.log(
        data.features.reduce(
          (accu, curr) => ({ ...accu, [curr.place_name]: null }),
          {}
        )
      );
      autocompleteInstance.updateData(
        data.features.reduce(
          (accu, curr) => ({ ...accu, [curr.place_name]: null }),
          {}
        )
      );
    });
});
