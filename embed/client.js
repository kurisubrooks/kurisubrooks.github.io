var socket = io("http://shake.kurisubrooks.com:3390");
var sound_alarm = new Audio("./assets/alarm.mp3");
var sound_alert = new Audio("./assets/nhk.mp3");
var sound_info = new Audio("./assets/info.mp3");

// `~ 192

$(document).ready(function() {
    socket.on("connect", function() {
        socket.emit("open", { version: 2 });
        modal("close");
    });

    socket.on("message", function(data) {
        if (!data.ok) modal("open", data.message);
        console.log(data);
    });

    socket.on("reconnect", function() {
        console.warn("Reconnecting to Shake");
        modal("open", "Attempting Reconnection");
    });

    socket.on("disconnect", function() {
        console.error("Connection to Shake was dropped.");
        modal("open", "Lost Connection to Server");
    });

    socket.on("auth", function(data) {
        if (data.ok) {
            console.info("Connected to Shake");
            $("body").css("background", "#333");
        } else {
            console.error("Connection to Shake was refused. Client disconnected.");
        }
    });

    socket.on("quake.eew", function(data) {
        console.log(data);
        eew(data, 1);
    });

    /*socket.on("quake.info", function(data) {
        info(data);
    });*/

    $.getJSON("http://shake.kurisubrooks.com:3390/api/quake.last", function(data) {
        console.log(data);
        eew(data, 0);
    });

    function eew(data, type) {
        data = (typeof data !== "object") ? JSON.parse(data) : data;

        $("#epicenter").text(data.details.epicenter.en);
        $("#seismic #value").text(data.details.seismic.en);
        $("#magnitude #value").text(data.details.magnitude);
        $("#depth #value").text(data.details.geography.depth);
        $("#previous").text("Earthquake Warning");

        if (type === 1) {
            $("body").css("background", "#E44242");
        }
        
        if (data.alarm) sound_alarm.play();
        else if (type === 1) sound_alert.play();
        else sound_info.play();

        if (data.situation !== 0) {
            if (type === 0) {
                timeout(0, true);
            } else {
                if (data.situation === 1) {
                    timeout(60000, true);
                } else if (data.situation === 2) {
                    timeout(50, false);
                    $("#previous").text("Cancelled");
                }
            }
        }
    }

    /*function info() {

    }*/

    function timeout(time, change) {
        setTimeout(function() {
            $("body").css("background", "#333333");
            if (change) $("#previous").text("Previous Details");
        }, time);
    }

    function modal(command, text, color) {
        if (text) $(".message").html(text);
        if (color) $(".overlay").css("background", color);

        if (command == "open" && !modal) $(".overlay").fadeIn("fast");
        if (command == "close") $(".overlay").fadeOut("fast");
    }

    function loaded() {
        setTimeout(function() {
            $(".overlay").fadeOut("fast");
        }, 1000);
    }

    function time() {
        $("#time").text(moment().tz("Asia/Tokyo").format("YYYY年MM月DD日 HH:mm:ss"));
    }

    setInterval(function() {
        time();
    }, 1000);

    /*setTimeout(function() {
        $("#epicenter").text("Amakusa Ashikita, Kumamoto Prefecture");
        $("#previous").text("Earthquake Alert");
        $("body").css("background", "#E44242");
    }, 2000);*/

    time();
});
