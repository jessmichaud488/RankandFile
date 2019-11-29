'use strict';

function displayFedHouseResults(fedHouseArray) {

	let buildFedHouseMembers = "";

	for (let i = 0; i < fedHouseArray.results.length; i++) {
		buildFedHouseMembers +=
			`<li><a href="#" data-id= ${fedHouseArray.results[i].id}>${fedHouseArray.results[i].name} ${fedHouseArray.results[i].party})</a></li>`;
	}

	$('#house ul').html(buildFedHouseMembers);
}

function displayFedSenateResults(fedSenateArray) {

	let buildFedSenateMembers = "";

	for (let i = 0; i < fedSenateArray.results.length; i++) {
		buildFedSenateMembers +=
			`<li><a href="#" data-id= ${fedSenateArray.results[i].id}>${fedSenateArray.results[i].name} (${fedSenateArray.results[i].party})</a></li>`
	};
	$('#senate ul').html(buildFedSenateMembers);
}

function formatCommittee(committeeArray) {
  let committeehtml=`<br>`;
  committeeArray.forEach(function(item,index){
    committeehtml+=`Committee ${index+1}:<br>${item.name}<br>`;
  });

  committeehtml+=`<br>`;
  return committeehtml;
}

function displayIndividualResults(individualArray) {


        var politicianName = `${individualArray.results[0].first_name} ${individualArray.results[0].last_name}`;
        getPostArticles(politicianName);
        var politicianNameWithMiddle = `${individualArray.results[0].first_name} ${individualArray.results[0].middle_name} ${individualArray.results[0].last_name}`;

        $('#pol-name').html(`<a href="${individualArray.results[0].url}" target="_blank">${politicianName}</a>`);

        $('#pol-image').html(`<img src="https://github.com/unitedstates/images/blob/gh-pages/congress/225x275/${individualArray.results[0].member_id}.jpg?raw=true" alt="Image of ${individualArray.results[0].first_name} ${individualArray.results[0].last_name}">`)

        if (individualArray.results[0].current_party === ("D")) {
            $('#party').html('Democrat');
        }
        else if (individualArray.results[0].current_party === ("R")) {
            $('#party').html('Republican');
        }
        else if (individualArray.results[0].current_party === ("I")) {
            $('#party').html('Independent');
        }

        $('#contact-info').html(
            `
<p>Phone Number: ${individualArray.results[0].roles[0].phone}</p>
<p>Website: ${individualArray.results[0].url}</p>
<p>Office Address:  ${individualArray.results[0].roles[0].office}, Washington, DC 20515</p>
<p>Facebook: <a href="https://www.facebook.com/${individualArray.results[0].facebook_account}/" target="_blank">${individualArray.results[0].facebook_account}</a></p>
<p>Twitter: <a href="https://www.twitter.com/${individualArray.results[0].twitter_account}?lang=en" target="_blank">${individualArray.results[0].twitter_account}</a></p>
<br>
<p>Committees: `+
formatCommittee(individualArray.results[0].roles[0].committees)


+`</p>
<p>Sub-Committees: `+
formatCommittee(individualArray.results[0].roles[0].subcommittees)


+`</p>
<p>Bills Sponsored: ${individualArray.results[0].roles[0].bills_sponsored}</p>
<p>Bills Co-Sponored: ${individualArray.results[0].roles[0].bills_cosponsored}</p>
<p>Missed Votes: ${individualArray.results[0].roles[0].bills_sponsored}</p>
<p>Votes with Party Percentage: ${individualArray.results[0].roles[0].bills_cosponsored}</p>
<p>Most Recent Vote: ${individualArray.results[0].most_recent_vote}</p>
<p>End of Term: ${individualArray.results[0].roles[0].end_date}</p>
<p>Profile Updated as of: ${individualArray.results[0].last_updated}</p>
`
        );
}

function displayPostArticles(postArray) {
        let buildPostOutput = '';

        for (let i=0; i<5; i++){
        buildPostOutput += `<article>`;
        buildPostOutput += `<h
        4><a href="${postArray.articles[i].url}" target="_blank">${postArray.articles[i].title}</a></h4>`;
        buildPostOutput += `<img href="${postArray.articles[i].urlToImage}">`;
        buildPostOutput += `<p>${postArray.articles[i].description}</p>`;
        buildPostOutput += `</article>`;
        }

        $('#news-results-section').html(buildPostOutput);
    };

///////////////////////////////////////////////
///// API functions /////
//////////////////////////////////////////////

function getProPublicaFedHouse(userState) {
		var resultFedHouse = $.ajax({
			url: `https://api.propublica.org/congress/v1/members/house/${userState}/current.json`,
			type: "GET",
			dataType: 'json',
			headers: {
				'X-API-Key': 'EoV0LUln0XnaZ6napeu84Uk0B4SXzdxedXgpai4I'
			}
		})
			.done(function (resultFedHouse) {
				displayFedHouseResults(resultFedHouse);
			})
			.fail(function (jqXHR, error, errorThrown) {
				console.log(jqXHR);
				console.log(error);
				console.log(errorThrown);
			});
}
function getProPublicaFedSenate(userState) {
		var resultFedSenate = $.ajax({
			url: `https://api.propublica.org/congress/v1/members/senate/${userState}/current.json`,
			type: "GET",
			dataType: 'json',
			headers: {
				'X-API-Key': 'EoV0LUln0XnaZ6napeu84Uk0B4SXzdxedXgpai4I'
			}
		})
			.done(function (resultFedSenate) {
				displayFedSenateResults(resultFedSenate);
			})
			.fail(function (jqXHR, error, errorThrown) {
				console.log(jqXHR);
				console.log(error);
				console.log(errorThrown);
			});
	//});
}

function getIndividualPolitician(politicianId) {
    var resultIndividualPolitician = $.ajax({
            url: `https://api.propublica.org/congress/v1/members/${politicianId}.json`,
            type: "GET",
            dataType: 'json',
            headers: {
                'X-API-Key': 'EoV0LUln0XnaZ6napeu84Uk0B4SXzdxedXgpai4I'
            }
        })
        .done(function (resultIndividualPolitician) {
            displayIndividualResults(resultIndividualPolitician);
        })
        .fail(function (jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
        });
  };


function getPostArticles(politicianName) {
		var resultPost = $.ajax({
			url: `https://newsapi.org/v2/everything?q="${politicianName.trim()}"&sortBy=popularity&apiKey=d92f4d2e634f41ae9faacbd9c287a945`,
			type: 'GET',
      pageSize: 5
		})
			.done(function (postResults) {
				displayPostArticles(postResults);
			})
			.fail(function (jqXHR, error, errorThrown) {
				console.log(jqXHR);
				console.log(error);
				console.log(errorThrown);
			});
}

///////////////////////////////////////////////
///// Event listener functions /////
//////////////////////////////////////////////

function handleSearchSubmit() {
	$('#rep-state-search').on('click', function (event) {
		event.preventDefault();

		let userState = $('#state-select').val();
		$("#pick-rep").show();
		getProPublicaFedHouse(userState);
	  getProPublicaFedSenate(userState);
	});
}

function handleReset() {
  $("#reset").on('click', function (event) {
    event.preventDefault();
    
    $("#pick-rep").hide();
  	$("#rep-results-section").hide();
    $("#news-results-section").hide();
    $(".newsfeed-header").hide();
  });
}

function getPoliticianId () {
  $("ul#senate-members, ul#house-members").on('click', 'li a', function (event) {
    event.preventDefault();

    let politicianId = $(this).data("id");
    $("#rep-results-section").show();
    $("#news-results-section").show();
    $(".newsfeed-header").show();
    getIndividualPolitician(politicianId);

  });
 
}

function init() {

	//add all event listeners here
	handleSearchSubmit();
  getPoliticianId();
  handleReset();
  $("#reset").hide();
	$("#pick-rep").hide();
	$("#rep-results-section").hide();
  $("#news-results-section").hide();
  $(".newsfeed-header").hide();
}

//document on ready function
$(init);