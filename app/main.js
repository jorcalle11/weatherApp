(() => {
  const WEATHER_API_KEY = 'cf3742cfb9adef87690ac8916cf149bc';
  const WEATHER_BASE_URL = `http://api.openweathermap.org/data/2.5/weather?appid=${WEATHER_API_KEY}&`;
  const BASE_IMG = 'http://openweathermap.org/img/w/';
  const celsius = 273.15;
  const CODE_ASCII_ENTER = 13;
  const today = new Date();
  let $btnAddCity = $('[data-button="addCity"]');
  let $btnRemoveAllCities = $('[data-button="removeCities"]')
  let $txtCity = $('[data-search="nameCity"]');
  let cities = [];

  geolocation();
  loadSavedCitiesInLocalStorage();
  $btnAddCity.on('click',addNewCity);
  $btnRemoveAllCities.on('click',removeAllCities);
  // $txtCity.on('keypress', (e)=> {
  //   if (e.which == CODE_ASCII_ENTER) {
  //     addNewCity(e);
  //   };
  // });

  function geolocation () {
    if (!navigator.geolocation) return alert('actualiza tu navegador');
    navigator.geolocation.getCurrentPosition(getPosition, error);

    function error (err) {
      console.log('ocurrió algun error', err);
    }

    function getPosition (position) {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      $.getJSON(`${WEATHER_BASE_URL}lat=${latitude}&lon=${longitude}`,getCurrentCity);
    };
  }

  function getCurrentCity (data) {
    $('.loader').hide();
    $('.notFound').hide();
    let city = {};
    city.name = data.name;
    city.time = today.toLocaleTimeString('es-CO',{ hour12: true });
    city.icon = `${BASE_IMG}${data.weather[0].icon}.png`;
    city.currentTemp = (data.main.temp_min - celsius).toFixed(1);
    city.tempMax = (data.main.temp_max - celsius).toFixed(1);
    city.tempMin = (data.main.temp - celsius).toFixed(1);
    renderHTML(city);
  }

  function activeTemplate (id) {
    let t = document.querySelector(id);
    return document.importNode(t.content, true);
  }

  function renderHTML (city) {
    let clone = activeTemplate('#template--city');

    clone.querySelector('[data-city]').innerHTML = city.name;
    clone.querySelector('[data-time]').innerHTML = city.time;
    clone.querySelector('[data-icon]').src = city.icon;
    clone.querySelector('[data-temp="min"]').innerHTML= city.tempMin;
    clone.querySelector('[data-temp="max"]').innerHTML= city.tempMax;
    clone.querySelector('[data-temp="current"]').innerHTML= city.currentTemp;
    $('.cards-group').append(clone);
  }

  function addNewCity (e) {
    e.preventDefault();
    $.getJSON(`${WEATHER_BASE_URL}q=${$txtCity.val()}`, getNewCity);
    $txtCity.val('');
  }

  function getNewCity (data) {
    let city = {};
    city.name = data.name;
    city.time = today.toLocaleTimeString('es-CO',{ hour12: true });
    city.icon = `${BASE_IMG}${data.weather[0].icon}.png`;
    city.currentTemp = (data.main.temp_min - celsius).toFixed(1);
    city.tempMax = (data.main.temp_max - celsius).toFixed(1);
    city.tempMin = (data.main.temp - celsius).toFixed(1);
    renderHTML(city);
    cities.push(city);
    saveCityInLocalStorage(cities);
  }

  function saveCityInLocalStorage(city) {
    localStorage.setItem('cities',JSON.stringify(city));
  }

  function loadSavedCitiesInLocalStorage() {
    if (localStorage.cities) {
      let citiesTemp = JSON.parse(localStorage.cities);
      citiesTemp.map((city) => {
        cities.push(city);
        renderHTML(city);
      });
    }
  }

  function removeAllCities (e) {
    e.preventDefault();
    if (localStorage.cities) {
      delete localStorage.cities;
      cities = [];
      let t = document.querySelector('.cards-group');
      let articles = t.querySelectorAll('article');
      for (var i = 0; i < articles.length; i++) {
        articles[i].remove();
      }
      $('.notFound').show();
    }
  }
})();
