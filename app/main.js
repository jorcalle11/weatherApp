(() => {
  const WEATHER_API_KEY = 'cf3742cfb9adef87690ac8916cf149bc';
  const WEATHER_BASE_URL = `http://api.openweathermap.org/data/2.5/weather?appid=${WEATHER_API_KEY}&`;
  const BASE_IMG = 'http://openweathermap.org/img/w/';
  const celsius = 273.15;
  const CODE_ASCII_ENTER = 13;
  const today = new Date();
  let $btnAddCity = $('[data-button="addCity"]');
  let $txtCity = $('[data-search="nameCity"]');

  geolocation();
  $btnAddCity.on('click',addNewCity);
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
    renderHTML(data);
  }

  function activeTemplate (id) {
    let t = document.querySelector(id);
    return document.importNode(t.content, true);
  }

  function renderHTML (data) {
    let clone = activeTemplate('#template--city');

    clone.querySelector('[data-city]').innerHTML = data.name;
    clone.querySelector('[data-time]').innerHTML = today.toLocaleTimeString('es-CO',{ hour12: true });
    clone.querySelector('[data-icon]').src = `${BASE_IMG}${data.weather[0].icon}.png`;
    clone.querySelector('[data-temp="min"]').innerHTML= (data.main.temp_min - celsius).toFixed(1);
    clone.querySelector('[data-temp="max"]').innerHTML= (data.main.temp_max - celsius).toFixed(1);
    clone.querySelector('[data-temp="current"]').innerHTML= (data.main.temp - celsius).toFixed(1);
    $('.cards-group').append(clone);
  }

  function addNewCity (e) {
    e.preventDefault();
    $.getJSON(`${WEATHER_BASE_URL}q=${$txtCity.val()}`, getNewCity);
    $txtCity.val('');
  }

  function getNewCity (data) {
    console.log(data);
    renderHTML(data);
  }
})();
