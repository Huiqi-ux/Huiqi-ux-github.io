const url = 'https://opendata.cwa.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=CWA-BC8E8EE9-992C-4A3A-8FB1-AB4B055C7A5D';

fetch(url)
    .then(response => response.json())
    .then(result => {
        console.log(result);

        const locations = result.records.location;
        if (!locations) {
            console.error("無法找到天氣資訊");
            return;
        }


        document.querySelectorAll(".dropdown-content a").forEach(link => {
            link.addEventListener("click", function () {
                const cityName = this.textContent.trim();
                console.log("使用者選擇:", cityName);
                updateWeatherInfo(cityName, locations);
            });
        });
    })
    .catch(error => {
        console.error("無法取得天氣資料：", error);
    });

/**

 * @param {string} cityName 
 * @param {Array} locations 
 */
function updateWeatherInfo(cityName, locations) {

    const nameMap = {
        "臺北": "臺北市",
        "新北": "新北市",
        "桃園": "桃園市",
        "新竹": "新竹縣",
        "宜蘭": "宜蘭縣",
        "基隆": "基隆市",
        "苗栗": "苗栗縣",
        "臺中": "臺中市",
        "彰化": "彰化縣",
        "南投": "南投縣",
        "雲林": "雲林縣",
        "嘉義": "嘉義縣",
        "臺南": "臺南市",
        "高雄": "高雄市",
        "屏東": "屏東縣",
        "花蓮": "花蓮縣",
        "台東": "臺東縣",
        "澎湖": "澎湖縣",
        "金門": "金門縣",
        "馬祖": "連江縣"
    };

    const mappedCityName = nameMap[cityName] || cityName;


    const location = locations.find(loc => loc.locationName === mappedCityName);

    if (!location) {
        console.error("找不到該縣市的天氣資訊:", mappedCityName);
        return;
    }

    const weatherElements = location.weatherElement;

    const weatherCondition = weatherElements.find(el => el.elementName === "Wx")?.time[0].parameter.parameterName || "無資料";
    const rainProbability = weatherElements.find(el => el.elementName === "PoP")?.time[0].parameter.parameterName || "無資料";
    const minTemp = weatherElements.find(el => el.elementName === "MinT")?.time[0].parameter.parameterName || "無資料";
    const maxTemp = weatherElements.find(el => el.elementName === "MaxT")?.time[0].parameter.parameterName || "無資料";
    const startTime = weatherElements[0].time[0].startTime;
    const endTime = weatherElements[0].time[0].endTime;


    const weatherCube = document.getElementById("weather-cube");
    weatherCube.innerHTML = `
        <p><strong>地點：</strong>${location.locationName}</p>
        <p><strong>天氣狀況：</strong>${weatherCondition}</p>
        <p><strong>降雨機率：</strong>${rainProbability}%</p>
        <p><strong>最低氣溫：</strong>${minTemp}°C</p>
        <p><strong>最高氣溫：</strong>${maxTemp}°C</p>
        <p><strong>時間：</strong>${startTime} ~ ${endTime}</p>
    `;
}


function toggleDropdown(id) {
    let dropdown = document.getElementById(id);
    if (!dropdown) {
        console.error(`找不到 ID 為 ${id} 的下拉選單`);
        return;
    }


    document.querySelectorAll('.dropdown-content').forEach(menu => {
        if (menu.id !== id) {
            menu.classList.remove('show');
        }
    });


    dropdown.classList.toggle("show");
}


window.onclick = function (event) {
    if (!event.target.matches('.btn')) {
        document.querySelectorAll('.dropdown-content').forEach(menu => {
            menu.classList.remove('show');
        });
    }
};
