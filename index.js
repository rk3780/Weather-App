const userTab = document.querySelector('[data-user-weather]');
const searchTab = document.querySelector('[data-search-weather]');
const userContainer = document.querySelector('.weather-container');
const grantAccessContainer = document.querySelector('.grant-location-container');
const searchForm = document.querySelector('.form-container');
const formContainer = document.querySelector('.form-container');
const loadingScreen = document.querySelector('.loading-container');
const userInfoContainer = document.querySelector(".user-info-container");
const grantAccessButton = document.querySelector('[data-grant-access]');
const searchInput = document.querySelector("[data-search-input]");

//initially variable needed
const API_KEY = "e4be4d33c708bb9831ed7a6b4b6bdd38";
let currentTab = userTab;
currentTab.classList.add("current-tab");
getFromSessionStorage();

//ek kaam or pending hai

function switchTab(clickedTab) {
    if (clickedTab != currentTab) {
        currentTab.classList.remove('current-tab');
        currentTab = clickedTab;
        currentTab.classList.add('current-tab');

        if (!searchForm.classList.contains("active")) {
            userInfoContainer.classList.remove('active');
            grantAccessContainer.classList.remove('active');
            searchForm.classList.add('active');
        }
        else {
            searchForm.classList.remove('active');
            userInfoContainer.classList.remove('active');
            getFromSessionStorage();
        }
    }
}

userTab.addEventListener('click', () =>
    //passed clicked tab as parameter
    switchTab(userTab));

searchTab.addEventListener('click', () =>
    //passed clicked tab as parameter
    switchTab(searchTab));

function getFromSessionStorage() {
    let localCoordinates = sessionStorage.getItem('user-coordinates');
    if (!localCoordinates) {
        grantAccessContainer.classList.add('active');
    }
    else {
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

async function fetchUserWeatherInfo(coordinates) {
    const { lat, lon } = coordinates;

    grantAccessContainer.classList.remove('active');
    loadingScreen.classList.add('active');

    try {
        const result = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const data = await result.json();
        loadingScreen.classList.remove('active');
        userInfoContainer.classList.add('active');
        renderWeatherInfo(data);
    } catch (error) {
        loadingScreen.classList.remove('active');
        console.log(error);
    }
}

function renderWeatherInfo(data) {
    //fetching the elements
    const cityName = document.querySelector('[data-city-name]');
    const countryIcon = document.querySelector('[data-country-icon]');
    const desc = document.querySelector('[data-weather-desc]');
    const weatherIcon = document.querySelector('[data-weather-icon]');
    const temp = document.querySelector('[data-temperature]');
    const windspeed = document.querySelector('[data-windspeed');
    const humidity = document.querySelector('[data-humidity]');
    const cloud = document.querySelector('[data-cloud]');

    //fetch values from data file
    cityName.innerText = data?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${data?.sys?.country.toLowerCase()}.png`;
    desc.innerText = data?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${data?.weather?.[0]?.icon}.png`;
    temp.innerText = `${data?.main?.temp} °C`;
    windspeed.innerText = `${data?.wind?.speed} m/s`;
    humidity.innerText = `${data?.main?.humidity}%`;
    temp.innerText = `${data?.main?.temp} °C`;
    windspeed.innerText = `${data?.wind?.speed} m/s`;
    humidity.innerText = `${data?.main?.humidity}%`;
    cloud.innerText = `${data?.clouds?.all}%`;
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else {
        alert("GeoLoation is not supported");
    }
}

function showPosition(position) {
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    };
    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}

grantAccessButton.addEventListener('click', getLocation);

searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let cityName = searchInput.value;
    if (cityName === "")
        return;
    else
        fetchSearchWeatherInfo(cityName);
})

async function fetchSearchWeatherInfo(city) {
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch (err) {
        console.log(err);
    }
}