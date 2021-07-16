const searchBtn = document.querySelector('.search__btn');
const searchInput = document.querySelector('.search__input');
const tempHeading = document.querySelector('.temperature');
const city = document.querySelector('.info__city');
const date = document.querySelector('.info__date');
const weather = document.querySelector('.weather-icon__text');
const icon = document.querySelector('.weather-icon__img');
const container = document.querySelector('.container');
const containerRight = document.querySelector('.right');
const cloudsEl = document.querySelector('.clouds');
const humidityEl = document.querySelector('.humidity');
const pressureEl = document.querySelector('.pressure');
const windSpeedEl = document.querySelector('.wind-speed');
const windDirectionEl = document.querySelector('.wind-direction');
const visibilityEl = document.querySelector('.visibility');

const getWeatherWithGeoLocation = async (lat, lon) => {
	try {
		const response = await fetch(
			`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=ffc0f926f37ac378dddf0c156d97e8ba`
		);

		const data = await response.json();

		return data;
	} catch (err) {
		console.log(err);
	}
};

const getWeatherWithCityName = async city => {
	try {
		const response = await fetch(
			`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=ffc0f926f37ac378dddf0c156d97e8ba`
		);

		const data = await response.json();

		return data;
	} catch (err) {
		console.log(err);
	}
};

const updateContent = data => {
	const clouds = data.clouds.all;
	const { visibility, name: cityName } = data;
	const { temp, humidity, pressure } = data.main;
	const { speed: windSpeed, deg: windDeg } = data.wind;

	const currentDate = new Date();

	// creating international date
	const interNationalDate = new Intl.DateTimeFormat(navigator.language, {
		hour: '2-digit',
		minute: '2-digit',
	}).format(currentDate);

	// temperature
	tempHeading.textContent = `${temp.toFixed(0)}°C`;
	// city name
	city.textContent = cityName;
	// date
	date.textContent = interNationalDate;

	data.weather.forEach(el => {
		// weather name
		const weatherName = el.main;
		weather.textContent = weatherName;

		// icon and bg image
		switch (weatherName) {
			case 'Clouds':
				icon.src = './images/icons/cloud.svg';
				container.style.backgroundImage = "url('./images/weather/cloudy.jpg')";
				containerRight.style.color = '#fff';
				break;

			case 'Snow':
				icon.src = './images/icons/snow.svg';
				container.style.backgroundImage = "url('./images/weather/snow.jpg')";
				containerRight.style.color = '#fff';
				break;

			case 'Clear':
				icon.src = './images/icons/sun.svg';
				container.style.backgroundImage = "url('./images/weather/sunny.jpg')";
				containerRight.style.color = '#fff';
				break;

			case 'Haze':
				icon.src = './images/icons/haze.svg';
				container.style.backgroundImage = "url('./images/weather/haze.jpg')";
				break;

			case 'Rain':
				icon.src = './images/icons/raining.svg';
				container.style.backgroundImage = "url('./images/weather/raining.jpg')";
				containerRight.style.color = '#b1cfd8';
				break;
		}
	});

	// weather info
	cloudsEl.textContent = clouds;
	humidityEl.textContent = humidity;
	pressureEl.textContent = pressure;
	windSpeedEl.textContent = windSpeed;
	windDirectionEl.textContent = windDeg;
	visibilityEl.textContent = visibility / 1000;
};

const geoLocation = navigator.geolocation.getCurrentPosition(pos => {
	getWeatherWithGeoLocation(pos.coords.latitude, pos.coords.longitude).then(
		data => {
			if (data.cod === '404') alert('no city found');

			updateContent(data);
		}
	);
});

searchBtn.addEventListener('click', e => {
	e.preventDefault();

	getWeatherWithCityName(searchInput.value).then(data => {
		if (data.cod === '404') alert('no city found');

		updateContent(data);
	});

	searchInput.value = '';
});
