$(".search_btn").click(function () {
    $("#search").hide();
    $("#search_results").show();

    $.ajax('https://colonist.maikelstuivenberg.nl/game?username=' + $(".usr_input").val(), {
        type: 'GET',
    }).done(function (data) {

        // Reset table
        $("#resulttable > tbody").empty();

        // Fill table
        var tbody = $("<tbody />"), tr;
        $.each(data, function (_, row) {
            tr = $("<tr class=\"resultrow\" />");
            // $.each(row, function (_, text) {
            tr.append("<td>" + row.id + "</td>")
            tr.append("<td>" + moment(row.createdAt).format("MMMM Do YYYY, h:mm:ss a") + "</td>")
            // });
            tr.appendTo(tbody);

            // When clicking on this result, show the details 
            tr.click(function () {
                // Reset table
                $("#gametable > tbody").empty();

                // Fill table
                var dataTbody = $("<tbody />");

                var tr1 = $("<tr><th width=\"150\">Number</th><td>" + row.id + "</td></tr>");
                tr1.appendTo(dataTbody);

                var tr2 = $("<tr><th>Date</th><td>" + moment(row.createdAt).format("MMMM Do YYYY, h:mm:ss a") + "</td></tr>");
                tr2.appendTo(dataTbody);

                var parsedJson = JSON.parse(row.json);
                console.log(parsedJson);

                var tr3 = $("<tr><th>Amt of players</th><td>" + parsedJson.Data.Players.length + "</td></tr>");
                tr3.appendTo(dataTbody);

                var tr4 = $("<tr><th>Winner</th><td>" + parsedJson.Data.Players.find(el => el.WinningPlayer).Player.UserState.Username + "</td></tr>");
                tr4.appendTo(dataTbody);

                var tr5 = $("<tr><td colspan=\"2\"><textarea>" + row.json + "</textarea></td></tr>");
                tr5.appendTo(dataTbody);


                dataTbody.appendTo("#gametable");


                // Show details & hide search results
                $("#search_results").hide();
                $("#game_data").show();
            });
        });
        tbody.appendTo("#resulttable");
    });
});

$(".reset_btn").click(function () {
    $("#search").show();
    $("#search_results").hide();
    $("#game_data").hide();
});