

// var temp =document.querySelector("#temp")
// var day2 =document.querySelector("#temp2")
// var day3 =document.querySelector("#temp3")


$(".search-box").on("click", function() {
        var city = $("#btn").val();
        
        $.ajax({
                url: 'http://pro.openweathermap.org/data/2.5/forecast/hourly?q=' + city + "&appid=218e7e40ee00c418394175751c4c62df",
                method: "GET", 

                 
        })
        
        .then(function(result){
// display the name of the city
        $("#location").text(result.name);

// // display the temperature 
        var F = Math.round(result.main.temp * (9/5)-459.67);
        var fahrenheit = F.toString(); 
        $("#temp").text(fahrenheit);

        });
}); 