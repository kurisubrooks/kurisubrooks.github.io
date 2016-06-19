$(function() {
    var key = 'faca357e3d78d552';
    var gradients = {
        overcast: 'background:-moz-linear-gradient(270deg,#9CB4D5 0%,#7798B2 65%,#7798B2 100%);background:-webkit-gradient(linear,left top,left bottom,color-stop(0%, #9CB4D5),color-stop(65%,#7798B2),color-stop(100%,#7798B2));background:-webkit-linear-gradient(270deg,#9CB4D5 0%,#7798B2 65%,#7798B2 100%);background:-o-linear-gradient(270deg,#9CB4D5 0%,#7798B2 65%,#7798B2 100%);background:-ms-linear-gradient(270deg,#9CB4D5 0%,#7798B2 65%,#7798B2 100%);background:linear-gradient(180deg,#9CB4D5 0%,#7798B2 65%,#7798B2 100%);',
        sunny: 'background:-moz-linear-gradient(270deg,#67B0DE 0%,#61AED5 65%,#61AED5 100%);background:-webkit-gradient(linear,left top,left bottom,color-stop(0%, #67B0DE),color-stop(65%,#61AED5),color-stop(100%,#61AED5));background:-webkit-linear-gradient(270deg,#67B0DE 0%,#61AED5 65%,#61AED5 100%);background:-o-linear-gradient(270deg,#67B0DE 0%,#61AED5 65%,#61AED5 100%);background:-ms-linear-gradient(270deg,#67B0DE 0%,#61AED5 65%,#61AED5 100%);background:linear-gradient(180deg,#67B0DE 0%,#61AED5 65%,#61AED5 100%);',
        night: 'background:-moz-linear-gradient(270deg,#8452F5 0%,#946BF5 65%,#946BF5 100%);background:-webkit-gradient(linear,left top,left bottom,color-stop(0%, #8452F5),color-stop(65%,#946BF5),color-stop(100%,#946BF5));background:-webkit-linear-gradient(270deg,#8452F5 0%,#946BF5 65%,#946BF5 100%);background:-o-linear-gradient(270deg,#8452F5 0%,#946BF5 65%,#946BF5 100%);background:-ms-linear-gradient(270deg,#8452F5 0%,#946BF5 65%,#946BF5 100%);background:linear-gradient(180deg,#8452F5 0%,#946BF5 65%,#946BF5 100%);'
    };

    $('body').attr('style', gradients.sunny);

    $("#search").submit(function() {
        var country, place;
        var input = $("#search-box").val().replace(',', '/');
        $.getJSON("https://api.wunderground.com/api/" + key + "/conditions/q/" + input + ".json?callback=?", function(data) {
            run(data);
        });
        return false;
    });

    function run(data) {
        console.log(data);
        if (data.response.error) error('error', data.response.error.description);
        else if (data.response.results) error('results', data.response.results);
        else {
            $('.error').hide();
            $('#search').hide();
            post(data.current_observation, image(data.current_observation.weather.toLowerCase(), cycle(data.current_observation.local_tz_offset)));
        }
    }

    function error(type, error) {
        if (type == 'error') {
            $('.error').text('Error: ' + error);
            $('.error').fadeIn('fast');
        } else if (type == 'results') {
            console.log(error);
            $('.error').html('Did you mean:<br>');
            $.each(error, function(index, value) {
                $('.error').append('- ' + value.city + ', ' + value.state + ' ' + value.country_name + '<br>');
            });
            $('.error').show();
        }
    }

    function cycle(o) {
        var time = moment().utcOffset(o).format('HH');
        if (time <= 06 || time >= 19) return 'night';
        else return 'day';
    }

    function image(c, t) {
        if (t == 'night') {
            if (c == 'cloudy' || c == 'overcast') {
                return ['cloudy', 'overcast'];
            } else if (c == 'smoke' || c == 'fog' || c == 'haze' || c == 'mist') {
                return ['fog', 'overcast'];
            } else if (c == 'mostly cloudy') {
                return ['mostly_cloudy_night', 'night'];
            } else if (c == 'mostly sunny') {
                return ['mostly_sunny', 'sunny'];
            } else if (c == 'partly cloudy' || c == 'scattered clouds') {
                return ['partly_cloudy_night', 'night'];
            } else if (c == 'change of rain' || c == 'rain' || c == 'showers') {
                return ['showers_night', 'overcast'];
            } else if (c == 'chance of a thunderstorm') {
                return ['thunderstorm_night', 'overcast'];
            } else if (c == 'light rain showers' || c == 'light rain') {
                return ['drizzle', 'overcast'];
            } else if (c == 'sunny' || c == 'clear') {
                return ['clear_night', 'night'];
            } else if (c == 'snow') {
                return ['snow_showers_night', 'snow'];
            } else if (c == 'light snow showers' || c == 'light snow') {
                return ['snow_flurry', 'snow'];
            } else if (c == 'snow and rain' || c == 'rain and snow') {
                return ['sleet', 'snow'];
            } else {
                return ['unknown', 'overcast'];
            }
        } else {
            if (c == 'cloudy' || c == 'overcast') {
                return ['cloudy', 'overcast'];
            } else if (c == 'smoke' || c == 'fog' || c == 'haze' || c == 'mist') {
                return ['fog', 'overcast'];
            } else if (c == 'mostly cloudy') {
                return ['mostly_cloudy_day', 'overcast'];
            } else if (c == 'mostly sunny') {
                return ['mostly_sunny', 'sunny'];
            } else if (c == 'partly cloudy' || c == 'scattered clouds') {
                return ['partly_cloudy', 'sunny'];
            } else if (c == 'change of rain' || c == 'rain' || c == 'showers') {
                return ['showers_day', 'overcast'];
            } else if (c == 'chance of a thunderstorm') {
                return ['thunderstorm_day', 'overcast'];
            } else if (c == 'light rain showers' || c == 'light rain') {
                return ['drizzle', 'overcast'];
            } else if (c == 'sunny' || c == 'clear') {
                return ['sunny', 'sunny'];
            } else if (c == 'snow') {
                return ['snow_showers_day', 'snow'];
            } else if (c == 'light snow showers' || c == 'light snow') {
                return ['snow_flurry', 'snow'];
            } else if (c == 'snow and rain' || c == 'rain and snow') {
                return ['sleet', 'snow'];
            } else {
                return ['unknown', 'overcast'];
            }
        }
    }

    function post(data, image) {
        var class_main = $('<div class="weather"></div>');
        var class_right = $('<div class="weather-gutter"></div>');
        var class_icon = $('<img src="https://kurisubrooks.com/static/nano/weather/light/' + image[0].toLowerCase() + '.png" width="98px">');
        var class_condition = $('<div class="weather-condition">' + data.weather + '</div>');
        var class_time = $('<div class="weather-time">' + moment().utcOffset(data.local_tz_offset).format('dddd, h:mm a') + '</div>');
        var class_temp = $('<div class="weather-temp">' + data.temp_c + '<sup>&#xBA;C</sup></div>');
        var class_feels = $('<div class="weather-feels">Feel like ' + data.feelslike_c + '&#xBA;</div>');
        var class_place = $('<div class="weather-location">' + data.display_location.full + '</div>');

        $(class_right).append(class_icon);
        $(class_right).append(class_condition);
        $(class_main).append(class_right);
        $(class_main).append(class_time);
        $(class_main).append(class_temp);
        $(class_main).append(class_feels);
        $(class_main).hide();
        $('.weather-container').append(class_place);
        $('.weather-container').append(class_main);
        $('.weather').delay(10).fadeIn('slow');

        $('body').attr('style', gradients[image[1]]);
    }
});
