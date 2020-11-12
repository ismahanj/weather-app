const onLoad = () => {
        const searchHistory = JSON.parse(window.localStorage.getItem('cityList'))
    
        const historyExist = !!searchHistory
        if (historyExist) {
            return searchHistory[searchHistory.length - 1]
        }
    }
    
    window.onload = getTodayWeather()
    
    const cityList = [];
    async function getTodayWeather() {
        let city = document.getElementById('city')
        console.log('STARTED')
        let input = city.value || onLoad();
        input = input.trim();
    
    
        try {
            const result = await fetch('https://api.openweathermap.org/data/2.5/weather?appid=57c70e5816fcd6cbdb312839f8ff4ea2&q=' + input);
            let data = await result.json();
    
            if (cityList.indexOf(input) === -1) {
                cityList.push(input);
                window.localStorage.setItem('cityList', JSON.stringify(cityList));
            }
    
    
            const getCitiesInStorage = JSON.parse(window.localStorage.getItem('cityList'))
    
    
            const newInput = document.createElement('div');
            newInput.innerHTML = getCitiesInStorage[getCitiesInStorage.length - 1];
            document.querySelector('.cities').appendChild(newInput)
    
            if (getCitiesInStorage.length > 5) {
                getCitiesInStorage.shift()
                cityList = getCitiesInStorage
                window.localStorage.setItem('cityList', JSON.stringify(cityList));
            }
    
            //Retrieve needed values from API response
            const myCity = data.name;
            const todayDate = moment().format('(MMMM DD, YYYY)');
            const temp = Math.round(data.main.temp);
            const humidity = data.main.humidity;
            const wind = data.wind.speed;
            const dayIcon = 'https://openweathermap.org/img/wn/' + data.weather[0].icon + '.png';
            console.log('icon', dayIcon);
            const coord = '?lat=' + data.coord.lat + '&lon=' + data.coord.lon;
    
            const img = document.createElement('img');
            img.setAttribute('src', dayIcon);
            document.querySelector('.city-date').innerHTML = `${input} ${todayDate}`
            document.querySelector('.temperature').innerHTML = `Temperature: ${temp} F`
            document.querySelector('.humidity').innerHTML = `Humidity: ${humidity} &#37;`
            document.querySelector('.wind-speed').innerHTML = `Wind Speed: ${wind}MPH`
    
            const uvElement = document.querySelector('.uv-index');
    
    
    
            const uvResult = await getTodayUV(coord)
            uvElement.innerHTML = `UV Index: ${uvResult}`;
    
            uvElement.style.backgroundColor = 'red';
    
            getFiveDay(input)
    
        } catch (err) {
            console.log('err', err);
        }
    
    }
    
    
    //Function to get Today's UV Index
    async function getTodayUV(location) {
        const token = '&appid=57c70e5816fcd6cbdb312839f8ff4ea2'
        const url = 'https://api.openweathermap.org/data/2.5/uvi' + location + token;
    
        try {
            const result = await fetch(url);
            let data = await result.json();
    
            return data.value
        } catch (err) {
            console.log('err', err)
        }
    }
    
    
    //Function to get lat/lon valuses for the five day weather forecast
    async function getFiveDay(city) {
        const token = '&appid=57c70e5816fcd6cbdb312839f8ff4ea2'
        const url = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + token + '&units=imperial';
    
        try {
            const result = await fetch(url);
            let data = await result.json();
    
            const fiveDayCoord = '?lat=' + data.coord.lat + '&lon=' + data.coord.lon;
    
            renderFiveDay(fiveDayCoord);
        } catch (err) {
            console.log('err', err);
        }
    }
    
    
    //Function to create five day forecast and design
    async function renderFiveDay(coord) {
        const token = '&appid=57c70e5816fcd6cbdb312839f8ff4ea2'
        const url = 'https://api.openweathermap.org/data/2.5/onecall' + coord + '&exclude=current,minutely,hourly' + token + '&units=imperial';
    
        try {
            const result = await fetch(url);
            let data = await result.json();
    
            document.querySelector('.weather-cards').innerHTML = '';
    
    
            for (let i = 0; i < 5; i++) {
                const dailyWeather = document.createElement('div')
                const fiveDayTemp = Math.round(data.daily[i].temp.day);
                const fiveDayHumidity = data.daily[i].humidity;
                dailyWeather.innerHTML = `
                    <div class="daily-weather">
                        <div class="date">${moment(data.daily[i].dt * 1000).format('MMMM DD, YYYY')}</div>
                        <div class="icon">&#9729;</div>
                        <div class="temperature">Temp: ${fiveDayTemp} &deg;F</div>
                        <div class="humidity">Humdity: ${fiveDayHumidity} &#37;</div>
                    </div>
                `
    
                document.querySelector('.weather-cards').appendChild(dailyWeather);
            }
    
        } catch (err) {
            console.log('err', err);
        }
    }
    
    
    document.querySelector('span').addEventListener('click', getTodayWeather);