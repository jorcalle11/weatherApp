document.addEventListener('DOMContentLoaded',main);
const API_KEY = 'cf3742cfb9adef87690ac8916cf149bc';
const BASE_URL = 'http://api.openweathermap.org/data/2.5/weather';
const BASE_IMG = 'http://openweathermap.org/img/w/';
let city = 'London';
function main () {
  geolocation();
  getCity();
}

function geolocation () {
  if (!navigator.geolocation) return alert('actualiza tu navegador');
  navigator.geolocation.getCurrentPosition(getPosition, error);

  function getPosition (position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    console.log(`tu latitud es: ${latitude}, y la longuitud es :${longitude}`);
  };

  function error (err) {
    console.log('ocurrió algun error', err);
  }
}

function getCity () {
  let cityDetail = {};
  const config = {
      url: `${BASE_URL}?q=${city}&appid=${API_KEY}`,
      method: 'GET',
      dataType: 'json'
  }
  $.ajax(config).done((data) => {
    console.log(data);
    cityDetail = data;
    var t = document.getElementById('template--city');
    var clone = document.importNode(t.content, true);

    clone.querySelector('.card__title').innerHTML = cityDetail.name;
    clone.querySelector('.card__date').innerHTML = cityDetail.dt;
    clone.querySelector('.card__logo').src = `${BASE_IMG}${cityDetail.weather[0].icon}.png`;
    clone.querySelector('.card__min-temperature').innerHTML= cityDetail.main.temp_min;
    clone.querySelector('.card__max-temperature').innerHTML= cityDetail.main.temp_max;
    clone.querySelector('.card__temperature').innerHTML= cityDetail.main.temp;
    document.body.appendChild(clone);
  });
}
