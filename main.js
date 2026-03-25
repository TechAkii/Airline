console.log("main.js loaded");

// =========================
// MOBILE MENU
// =========================
const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobileMenu");

if (hamburger && mobileMenu) {
    hamburger.addEventListener("click", () => {
        mobileMenu.classList.toggle("active");
    });
}

// =========================
// HERO TYPING EFFECT
// =========================
const dynamicText = document.getElementById("dynamic");

const words = [
    "any destination.",
    "with comfort.",
    "with great deals.",
    "with confidence."
];

let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect() {
    if (!dynamicText) return;

    const currentWord = words[wordIndex];
    const currentText = currentWord.substring(0, charIndex);

    dynamicText.innerHTML = `${currentText}<span class="cursor"></span>`;

    if (!isDeleting) {
        charIndex++;
        if (charIndex > currentWord.length) {
            isDeleting = true;
            setTimeout(typeEffect, 1200);
            return;
        }
    } else {
        charIndex--;
        if (charIndex < 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            charIndex = 0;
        }
    }

    setTimeout(typeEffect, isDeleting ? 50 : 100);
}

// =========================
// AIRPORT SEARCH
// =========================
let airportData = [];

async function loadAirportData() {
    try {
        const response = await fetch("world_airports_ourairports.json");

        if (!response.ok) {
            throw new Error("Could not load world_airports_ourairports.json");
        }

        const airports = await response.json();

        airportData = airports.filter(airport =>
            airport.iata_code &&
            airport.iata_code.trim() !== "" &&
            airport.scheduled_service === "1"
        );

        console.log("Airport data loaded:", airportData.length);
    } catch (error) {
        console.error("Error loading airport data:", error);
    }
}

function renderResults(matches, resultsBox, inputBox) {
    resultsBox.innerHTML = "";

    if (matches.length === 0) {
        resultsBox.classList.remove("show");
        return;
    }

    matches.forEach(airport => {
        const item = document.createElement("div");
        item.className = "airport-item";

        const city = airport.municipality || "Unknown City";
        const country = airport.iso_country || "";
        const label = `${city}, ${country} - ${airport.name} (${airport.iata_code})`;

        item.textContent = label;

        item.addEventListener("click", () => {
            inputBox.value = label;
            inputBox.dataset.code = airport.iata_code;
            resultsBox.innerHTML = "";
            resultsBox.classList.remove("show");
        });

        resultsBox.appendChild(item);
    });

    resultsBox.classList.add("show");
}

function searchAirports(query, resultsBox, inputBox) {
    const searchText = query.trim().toLowerCase();

    resultsBox.innerHTML = "";

    if (searchText.length < 2) {
        resultsBox.classList.remove("show");
        return;
    }

    const matches = airportData.filter(airport => {
        const city = (airport.municipality || "").toLowerCase();
        const name = (airport.name || "").toLowerCase();
        const code = (airport.iata_code || "").toLowerCase();
        const country = (airport.iso_country || "").toLowerCase();

        return (
            city.includes(searchText) ||
            name.includes(searchText) ||
            code.includes(searchText) ||
            country.includes(searchText)
        );
    }).slice(0, 8);

    renderResults(matches, resultsBox, inputBox);
}

function setupAirportSearch() {
    const fromInput = document.getElementById("fromAirport");
    const toInput = document.getElementById("toAirport");
    const fromResults = document.getElementById("fromResults");
    const toResults = document.getElementById("toResults");

    if (!fromInput || !toInput || !fromResults || !toResults) {
        console.error("Airport search elements not found in HTML.");
        return;
    }

    fromInput.addEventListener("input", () => {
        searchAirports(fromInput.value, fromResults, fromInput);
    });

    toInput.addEventListener("input", () => {
        searchAirports(toInput.value, toResults, toInput);
    });

    document.addEventListener("click", (e) => {
        if (!fromInput.contains(e.target) && !fromResults.contains(e.target)) {
            fromResults.innerHTML = "";
            fromResults.classList.remove("show");
        }

        if (!toInput.contains(e.target) && !toResults.contains(e.target)) {
            toResults.innerHTML = "";
            toResults.classList.remove("show");
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const topics = document.querySelectorAll(".trip-types .topic");

    console.log("Tabs found:", topics.length);

    topics.forEach((topic) => {
        topic.addEventListener("click", () => {
            console.log("Clicked:", topic.textContent);

            topics.forEach((item) => item.classList.remove("active"));
            topic.classList.add("active");
        });
    });
});


function setupFlightSearch() {
    const searchBtn = document.querySelector(".search-btn");
    const fromInput = document.getElementById("fromAirport");
    const toInput = document.getElementById("toAirport");
    const departDate = document.getElementById("departDate");
    const passengers = document.getElementById("passengers");

    if (!searchBtn || !fromInput || !toInput || !departDate || !passengers) {
        console.error("Search form elements not found.");
        return;
    }

    searchBtn.addEventListener("click", () => {
        const fromCode = fromInput.dataset.code;
        const toCode = toInput.dataset.code;
        const date = departDate.value;
        const passengerCount = passengers.value;

        if (!fromCode) {
            alert("Please select a departure airport.");
            return;
        }

        if (!toCode) {
            alert("Please select a destination airport.");
            return;
        }

        if (!date) {
            alert("Please select a departure date.");
            return;
        }

        if (fromCode === toCode) {
            alert("Departure and destination airports cannot be the same.");
            return;
        }

        window.location.href = `flights.html?from=${fromCode}&to=${toCode}&date=${date}&passengers=${passengerCount}`;
    });
}


function filterDest(btn) {
    document.querySelectorAll('.dest-filter').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
}














// =========================
// INIT
// =========================
document.addEventListener("DOMContentLoaded", async () => {
    console.log("DOM loaded");

    typeEffect();
    await loadAirportData();
    setupAirportSearch();
    setupFlightSearch();
    setupAirportSearch();
});