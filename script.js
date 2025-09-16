document.getElementById('searchBtn').addEventListener('click', getWeather);
document.getElementById('cityInput').addEventListener('keyup', e => {
  if (e.key === 'Enter') getWeather();
});

async function getWeather() {
  const city = document.getElementById('cityInput').value.trim();
  const apiKey = '4b2e31fc65120c82f6a07b0a8bbd64c9';

  if (!city) return;

  // Current weather
  const currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  const res = await fetch(currentUrl);
  if (!res.ok) return alert('City not found');
  const data = await res.json();

  const { coord, main, weather, wind, sys, name } = data;
  const icon = weather[0].icon;

  // Update current weather UI
  document.getElementById('cityName').textContent = `${name}, ${sys.country}`;
  document.getElementById('dateText').textContent = new Date().toDateString();
  document.getElementById('temperature').textContent = `${Math.round(main.temp)}°`;
  document.getElementById('weatherDesc').textContent = weather[0].description;
  document.getElementById('highTemp').textContent = `${Math.round(main.temp_max)}°`;
  document.getElementById('lowTemp').textContent = `${Math.round(main.temp_min)}°`;
  document.getElementById('windSpeed').textContent = `${wind.speed} m/s`;
  document.getElementById('humidity').textContent = `${main.humidity}%`;
  document.getElementById('sunrise').textContent = formatTime(sys.sunrise);
  document.getElementById('sunset').textContent = formatTime(sys.sunset);

  const iconEl = document.getElementById('weatherIcon');
  iconEl.src = `http://openweathermap.org/img/wn/${icon}@2x.png`;
  iconEl.style.display = 'block';

  // Forecast (Next hours)
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${coord.lat}&lon=${coord.lon}&appid=${apiKey}&units=metric`;
  const res2 = await fetch(forecastUrl);
  const fdata = await res2.json();

  const forecastEl = document.getElementById('forecast');
  forecastEl.innerHTML = '';

  fdata.list.slice(0, 8).forEach(item => {
    const time = new Date(item.dt * 1000).getHours() + ':00';
    const card = document.createElement('div');
    card.className = 'forecast-card';
    card.innerHTML = `
      <p>${time}</p>
      <img src="http://openweathermap.org/img/wn/${item.weather[0].icon}.png" alt="">
      <p>${Math.round(item.main.temp)}°</p>
    `;
    forecastEl.appendChild(card);
  });
}

function formatTime(ts) {
  const date = new Date(ts * 1000);
  return `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
}



