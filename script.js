'use strict';

// Function to display representative results
function displayRepresentativeResults(representatives) {
  let output = '';
  representatives.forEach((rep) => {
    output += `<li><a href="#" data-id="${rep.id}">${rep.name} (${rep.party})</a></li>`;
  });
  $('#house ul').html(output);
}

// Function to fetch representatives for a state using ProPublica API
function getProPublicaRepresentatives(userState) {
  const apiKey = 'oV0LUln0XnaZ6napeu84Uk0B4SXzdxedXgpai4I';

  $.ajax({
    url: `https://api.propublica.org/congress/v1/members/house/${userState}/current.json`,
    type: 'GET',
    dataType: 'json',
    headers: {
      'X-API-Key': 'oV0LUln0XnaZ6napeu84Uk0B4SXzdxedXgpai4I',
    },
  })
    .done(function (result) {
      const representatives = result.results;
      displayRepresentativeResults(representatives);
    })
    .fail(function (jqXHR, error, errorThrown) {
      console.log(jqXHR);
      console.log(error);
      console.log(errorThrown);
    });
}

// Event listener for state search
function handleSearchSubmit() {
  $('#rep-state-search').on('click', function (event) {
    event.preventDefault();

    const userState = $('#state-input').val();
    getProPublicaRepresentatives(userState);
  });
}

// Event listener for representative selection
function getPoliticianId() {
  $('#house ul').on('click', 'li a', function (event) {
    event.preventDefault();

    const politicianId = $(this).data('id');
    // Call the function to fetch individual politician details using the ID
    getIndividualPolitician(politicianId);
  });
}

// Function to display individual politician results
function displayIndividualResults(individualArray) {
  const politicianName = `${individualArray.results[0].first_name} ${individualArray.results[0].last_name}`;
  getPostArticles(politicianName);
  const politicianNameWithMiddle = `${individualArray.results[0].first_name} ${individualArray.results[0].middle_name} ${individualArray.results[0].last_name}`;

  $('#pol-name').html(`<a href="${individualArray.results[0].url}" target="_blank">${politicianName}</a>`);

  $('#pol-image').html(`<img src="https://github.com/unitedstates/images/blob/gh-pages/congress/225x275/${individualArray.results[0].member_id}.jpg?raw=true" alt="Image of ${individualArray.results[0].first_name} ${individualArray.results[0].last_name}">`);

  if (individualArray.results[0].current_party === 'D') {
    $('#party').html('Democrat');
  } else if (individualArray.results[0].current_party === 'R') {
    $('#party').html('Republican');
  } else if (individualArray.results[0].current_party === 'I') {
    $('#party').html('Independent');
  }

  $('#contact-info').html(
    `
<p>Phone Number: ${individualArray.results[0].roles[0].phone}</p>
<p>Website: ${individualArray.results[0].url}</p>
<p>Office Address:  ${individualArray.results[0].roles[0].office}, Washington, DC 20515</p>
<p>Instagram: <a href="https://www.instagram.com/${individualArray.results[0].instagram_account}/" target="_blank">${individualArray.results[0].instagram_account}</a></p>
<p>Facebook: <a href="https://www.facebook.com/${individualArray.results[0].facebook_account}/" target="_blank">${individualArray.results[0].facebook_account}</a></p>
<p>Twitter: <a href="https://www.twitter.com/${individualArray.results[0].twitter_account}/" target="_blank">@${individualArray.results[0].twitter_account}</a></p>
<p>YouTube: <a href="https://www.youtube.com/user/${individualArray.results[0].youtube_account}/" target="_blank">${individualArray.results[0].youtube_account}</a></p>
`
  );

  $('#next-election').html(individualArray.results[0].roles[0].next_election);

  const billsSponsored = individualArray.results[0].roles[0].bills_sponsored;
  const billsCosponsored = individualArray.results[0].roles[0].bills_cosponsored;
  const missedVotes = individualArray.results[0].roles[0].missed_votes;
  const votesWithParty = individualArray.results[0].roles[0].votes_with_party_pct;

  $('#stats').html(
    `
<p>Bills Sponsored: ${billsSponsored}</p>
<p>Bills Cosponsored: ${billsCosponsored}</p>
<p>Missed Votes: ${missedVotes}</p>
<p>Votes With Party: ${votesWithParty}%</p>
`
  );
}

// Function to fetch individual politician details using the ID
function getIndividualPolitician(politicianId) {
  const apiKey = 'oV0LUln0XnaZ6napeu84Uk0B4SXzdxedXgpai4I';

  $.ajax({
    url: `https://api.propublica.org/congress/v1/members/${politicianId}.json`,
    type: 'GET',
    dataType: 'json',
    headers: {
      'X-API-Key': 'oV0LUln0XnaZ6napeu84Uk0B4SXzdxedXgpai4I',
    },
  })
    .done(function (result) {
      const individualArray = result;
      displayIndividualResults(individualArray);
    })
    .fail(function (jqXHR, error, errorThrown) {
      console.log(jqXHR);
      console.log(error);
      console.log(errorThrown);
    });
}

// Function to display politician-related news articles using News API
function displayPoliticianArticles(articles) {
  let output = '';
  articles.forEach((article) => {
    output += `<li><a href="${article.url}" target="_blank">${article.title}</a></li>`;
  });
  $('#news ul').html(output);
}

// Function to fetch recent news articles related to a politician's name
function getPostArticles(politicianName) {
  const apiKey = 'oV0LUln0XnaZ6napeu84Uk0B4SXzdxedXgpai4I';

  $.ajax({
    url: `https://newsapi.org/v2/everything?q=${politicianName}&apiKey=${apiKey}&pageSize=5`,
    type: 'GET',
    dataType: 'json',
  })
    .done(function (result) {
      const articles = result.articles;
      displayPoliticianArticles(articles);
    })
    .fail(function (jqXHR, error, errorThrown) {
      console.log(jqXHR);
      console.log(error);
      console.log(errorThrown);
    });
}

// Event listener for document ready
$(document).ready(function () {
  handleSearchSubmit();
  getPoliticianId();
});
