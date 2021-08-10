/** 
 * Get last saved games from the server
 */
$.ajax('https://colonist.maikelstuivenberg.nl/game/last/5', {
    type: 'GET',
}).done(function(data) {
    // Reset table
    $("#resulttable_last > tbody").empty();

    // Fill table
    var tbody = $("<tbody />"),
        tr;
    $.each(data, function(_, row) {
        tr = $("<tr class=\"resultrow\" />");
        // tr.append("<td>" + row.id + "</td>")
        tr.append("<td width=65>" + moment(row.createdAt).format("DD MMM YY") + "</td>");
        tr.append("<td width=25>" + moment(row.createdAt).format("HH:mm") + "</td>");
        var td4 = $("<td width=25><a class=\"details\">Details</a></td>");
        getPlayers(row).appendTo(tr);
        td4.appendTo(tr);
        tr.appendTo(tbody);

        td4.click(function() { showDetailsPart(row) });
    });
    tbody.appendTo("#resulttable_last");
});

/** Toggle search btn on/off (based on input) */
$(".usr_input").keyup(function() {
    if ($(".usr_input").val() != '')
        $(".search_btn").prop('disabled', false);
    else
        $(".search_btn").prop('disabled', true);
});

/**
 * Search results
 */
$(".search_btn").click(function() {
    $("#search").hide();
    $("#search_results").show();
    $("#search_results_header").text($(".usr_input").val());

    $.ajax('https://colonist.maikelstuivenberg.nl/game?username=' + encodeURIComponent($(".usr_input").val()), {
        type: 'GET',
    }).done(function(data) {

        // Reset table
        $("#resulttable > tbody").empty();

        // Fill table
        var tbody = $("<tbody />"),
            tr;
        $.each(data, function(_, row) {
            tr = $("<tr class=\"resultrow\" />");
            var td1 = $("<td width=65>" + moment(row.createdAt).format("DD MMM YY") + "</td>");
            var td2 = $("<td width=25>" + moment(row.createdAt).format("HH:mm") + "</td>");
            var td4 = $("<td width=25><a class=\"details\">Details</a></td>");
            td1.appendTo(tr);
            td2.appendTo(tr);
            getPlayers(row).appendTo(tr);
            td4.appendTo(tr);
            tr.appendTo(tbody);

            // When clicking on this result, show the details 
            // td1.click(function(){ showDetailsPart(row)});
            // td2.click(function(){ showDetailsPart(row)});
            td4.click(function() { showDetailsPart(row) });
        });
        tbody.appendTo("#resulttable");
    });
});

$(".reset_btn").click(reset);

$("#gamedetails_tabs > .menu li").click(function() {
    // Hide all tabs and (re)open the correct one
    $("#tab1").hide();
    $("#tab2").hide();

    var tab = $("#" + $(this).attr('id').substring(1));
    tab.show();

    // Change active menu item
    $(this).parent().find('li.active').removeClass('active');
    $(this).addClass('active');
});

function reset() {
    $(".usr_input").val("");
    $("#search").show();
    $("#search_results").hide();
    $("#game_data").hide();
}

function getPlayers(row, useDiv = false) {
    var players;
    if (useDiv)
        players = $("<div>");
    else
        players = $("<td>");

    for (var i = 0; i < row.players.length; i++) {
        const usr = row.players[i].username;
        playersA = $("<a>" + usr + "</a>");
        playersA.click(function() {
            reset();

            $(".usr_input").val(usr);
            $(".search_btn").click();
        });
        playersA.appendTo(players);

        if (i < row.players.length - 1) {
            playersSpan = $("<span>, </span>");
            playersSpan.appendTo(players);
        }
    }

    return players;
}

function showDetailsPart(row) {

    showGameDetails(row);
    generateDiceStats(row);
    generateResourceStats(row);

    // Show details & hide search results
    $("#search").hide();
    $("#search_results").hide();
    $("#game_data").show();
}

function showGameDetails(row) {
    // Reset table
    $("#gamedetailstable > tbody").empty();

    // Create new tbody
    var dataTbody = $("<tbody />");

    var tr1 = $("<tr><th width=\"75\">Number</th><td width=\"325\">" + row.id + "</td></tr>");
    tr1.appendTo(dataTbody);

    var tr2 = $("<tr><th>Date</th><td>" + moment(row.createdAt).format("DD MMMM YYYY, HH:mm") + "</td></tr>");
    tr2.appendTo(dataTbody);

    var parsedJson = JSON.parse(row.json);

    // var tr5 = $("<tr><td colspan=\"2\"><textarea>" + row.json + "</textarea></td></tr>");
    // tr5.appendTo(dataTbody);

    var tr3 = $("<tr><th>Players</th></tr>");
    var td3 = $("<td class=\"players\">");
    getPlayers(row, true).appendTo(td3);
    td3.appendTo(tr3);
    tr3.appendTo(dataTbody);

    var tr4 = $("<tr><th>Winner</th><td>" + parsedJson.Data.Players.find(el => el.WinningPlayer).Player.UserState.Username + "</td></tr>");
    tr4.appendTo(dataTbody);

    // Add to table
    dataTbody.appendTo("#gamedetailstable");
}

function generateDiceStats(row) {

    // Reset table
    $("#dicestatstable > tbody").empty();

    // Create new tbody
    var dataTbody = $("<tbody />");

    var parsedJson = JSON.parse(row.json);

    for (var i = 0; i < 11; i++) {
        dataTbody.append("<tr><th width=\"75\">" + (i + 2) + "</th><td width=\"325\">" + parsedJson.Data.DiceStats[i] + "</td></tr>");
    }

    // Add to table
    dataTbody.appendTo("#dicestatstable");
}

function generateResourceStats(row) {

    var resources = {
        1: "Lumber",
        2: "Brick",
        3: "Wool",
        4: "Grain",
        5: "Ore"
    };

    // Reset table
    $("#resourcecards > tbody").empty();

    // Create new tbody
    var dataTbody = $("<tbody />");

    var parsedJson = JSON.parse(row.json);

    console.log(parsedJson.Data.ResourceCardStats);
    for (var i = 1; i <= 5; i++) {
        dataTbody.append("<tr><th width=\"75\">" + resources[i] + "</th><td width=\"325\">" + parsedJson.Data.ResourceCardStats.filter(el => el == i).length + "</td></tr>");
    }

    // Add to table
    dataTbody.appendTo("#resourcecards");
}