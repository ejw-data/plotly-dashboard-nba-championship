
// Get nba game id's from nba.com stats pages (in URL of each players profile)
// created this for ease in code and show common structure; this could have been scraped from website
let nba_finals = [{"id": 1,"title":"Game 1","game_info":{"game_id":"0042100401","date":"20220602","location":"San Francisco","hometeam":"Warriors"}}, 
              {"id": 2,"title":"Game 2","game_info":{"game_id":"0042100402","date":"20220605","location":"San Francisco","hometeam":"Warriors"}}, 
              {"id": 3,"title":"Game 3","game_info":{"game_id":"0042100403","date":"20220608","location":"Boston","hometeam":"Celtics"}},
              {"id": 4,"title":"Game 4","game_info":{"game_id":"0042100404","date":"20220610","location":"Boston","hometeam":"Celtics"}},
              {"id": 5,"title":"Game 5","game_info":{"game_id":"0042100405","date":"20220613","location":"San Francisco","hometeam":"Warriors"}},
              {"id": 6,"title":"Game 6","game_info":{"game_id":"0042100406","date":"20220616","location":"Boston","hometeam":"Celtics"}},
              {"id": 7,"title":"Game 7","game_info":{"game_id":"0042100407","date":"20220619","location":"San Francisco","hometeam":"Warriors"}}]

// created list for ease; demo dropdown 
let quarters = ['First Quarter','Second Quarter','Third Quarter','Fourth Quarter']

// used to replace personID with their actual name; incoming data uses their personID number
// personID found from nba.com stats pages
let players = [{"name":"Jayson Tatum","position":"forward","team":"Celtics","teamID":"1610612738","personID":"1628369"},
           {"name":"Jaylen Brown","position":"guard","team":"Celtics","teamID":"1610612738","personID":"1627759"},  
           {"name":"Al Horford","position":"forward","team":"Celtics","teamID":"1610612738","personID":"201143"}, 
           {"name":"Marcus Smart","position":"guard","team":"Celtics","teamID":"1610612738","personID":"203935"}, 
           {"name":"Robert Williams","position":"center","team":"Celtics","teamID":"1610612738","personID":"1629057"}, 
           {"name":"Derek White","position":"guard","team":"Celtics","teamID":"1610612738","personID":"1628401"}, 
           {"name":"Grant Williams","position":"forward","team":"Celtics","teamID":"1610612738","personID":"1629684"}, 
           {"name":"Payton Pritchard","position":"guard","team":"Celtics","teamID":"1610612738","personID":"1630202"}, 
           {"name":"Daniel Theis","position":"center","team":"Celtics","teamID":"1610612738","personID":"1628464"}, 
           {"name":"Steph Curry","position":"guard","team":"Warriors","teamID":"1610612744","personID":"201939"}, 
           {"name":"Klay Thompson","position":"guard","team":"Warriors","teamID":"1610612744","personID":"202691"}, 
           {"name":"Andrew Wiggins","position":"forward","team":"Warriors","teamID":"1610612744","personID":"203952"}, 
           {"name":"Draymond Green","position":"forward","team":"Warriors","teamID":"1610612744","personID":"203110"}, 
           {"name":"Kevon Looney","position":"center","team":"Warriors","teamID":"1610612744","personID":"1626172"}, 
           {"name":"Jordan Poole","position":"guard","team":"Warriors","teamID":"1610612744","personID":"1629673"}, 
           {"name":"Otto Porter","position":"forward","team":"Warriors","teamID":"1610612744","personID":"203490"}, 
           {"name":"Andre Iguodala","position":"forward","team":"Warriors","teamID":"1610612744","personID":"2738"},
           {"name":"Gary Payton II","position":"guard","team":"Warriors","teamID":"1610612744","personID":"1627780"},
           {"name":"Nemanja Bjelica","position":"forward","team":"Warriors","teamID":"1610612744","personID":"202357"} 
]

// Global Variables
let game_start_date;
let quarter;
let game_id;
let game_title;
let home_team;
let quarterFilter;

// runs on page load/refresh
init();

// generates selector dropdowns and sets-up default parameters
// calls function to generate charts
function init(){
   console.log(Date())
  // generate the two dropdowns
  game_selector();
  quarter_selector();

  // set default values the page loads one
  // loads Game 1 Quarter 1 data
  date = '20220602' 
  game_id = '0042100401'
  quarter = 1

  // get data
  let playByPlay= `https://data.nba.net/prod/v1/${date}/${game_id}_pbp_${quarter}.json`;
  
  // create charts
  createCharts(playByPlay);
}
// runs when a change to the UX occurs
function update(){
  
  // grab game select dropdown value
  let new_id = d3.select('#game').node().value 
  // check if it is the unimportant first value/title
  if(new_id != "Playoff Game"){
    game_id = new_id
  }
  // grab quarter select dropdown value
  let new_quarter = d3.select('#quarter').node().value 
  // check if it is teh unimportant first value/title
  if(new_quarter != "Quarter"){
    quarter = new_quarter
  }

  // from game select or value in memory, get game start date
  game_start_date = nba_finals.filter(i => i.game_info.game_id == game_id).map(i => i.game_info.date)[0]
  console.log(`Start date ${game_start_date}`)
  // check if the game selected has occurred yet
  if(game_start_date == nowDate()){
    // alert user with popup box
    alert(`Game Selected has not started.  Previous selection is being displayed`)
  }
  else if(game_start_date > nowDate()){
    // alert user with popup box
    alert(`Game Selected has not started.  Previous selection is being displayed`)
  }
  else{
    // get data
    let playByPlay= `https://data.nba.net/prod/v1/${game_start_date}/${game_id}_pbp_${quarter}.json`;
  
    // create charts
    createCharts(playByPlay);
  }
  

  
}
// populates select box, using basic for loop
function quarter_selector(){
  let quarter_select = d3.select('#quarter');
  quarter_select.attr("class","form-select form-select-lg mb-3 fw-bold fs-4");
  quarter_select.append("option")
                .text("Quarter");
  
  for(let i = 0; i < quarters.length; i++){
    quarter_select.append("option")
                  .text(quarters[i])
                  .attr("value", i+1)
  }
}
// populates select box, using forEach loop
function game_selector(){
  let game_select = d3.select('#game');
  game_select.attr("class","form-select form-select-lg mb-3 fw-bold fs-4")
  game_select.append("option")
             .text("Playoff Game");
             

  nba_finals.forEach(i => 
    game_select.append("option")
          .text(i.title)
          .attr("value", i.game_info.game_id)
  );
}
// code to manipulate data and call chart functions
function createCharts(route){
    d3.json(route).then(function(data) {
      let allData = data.plays;
      let scores1 = allData.filter(i => i.isScoreChange == true);

      // select horizontal filter range bar (top-center of page)
      // range bar ends with 12 and moving to the left decreases value
      // 12 minus range bar value gives game clock value aka quarterFilter
      quarterFilter = (12 - parseInt(d3.select('#quarterFilter').node().value))
      // Compare each rows clock (game time) to quarterFilter (range bar game time)
      scores = scores1.filter(i => timeConvert(i.clock) >= (quarterFilter * 60))
      console.log(scores)

      // setup linechart
      // *****************************************************
      let home_team_pts = scores.map(i => i.hTeamScore);
      let visiting_team_pts = scores.map(i => parseInt(i.vTeamScore));

      // add start of quarter scores
      let home_start = allData[0].hTeamScore;
      let visitor_start = allData[0].vTeamScore;
      home_team_pts.unshift(home_start);
      visiting_team_pts.unshift(visitor_start);

      let time_label = scores.map(i => i.clock);
      // add start of quarter time so scores (above) and times matchup
      time_label.unshift('12:00');
      // convert time string to numerical value
      let time_seconds = time_label.map(i => (720 - timeConvert(i)));

      // setup box scores
      //******************************************************
      // update celtics score box
      let home_current_quarter_points = home_team_pts.slice(-1);
      // update warriors score box
      let visitor_current_quarter_points = visiting_team_pts.slice(-1);
      

      // setup barchart
      // *****************************************************
      // find total points for each team at any given time
      let sum_scores = [];
      for(let i=0; i < home_team_pts.length; i++){
        sum_scores.push(home_team_pts[i] + visiting_team_pts[i])
      }
      // calculate changes in score; change is related to most recent personId
      let delta_points = [];
      for(let i=1; i < sum_scores.length; i++){
        delta_points.push( sum_scores[i] - sum_scores[i-1])
      }
    
      // celtics as visiting team
      let visiting_players_scored = scores.filter(i => i.teamId  == '1610612738').map(j => j.personId).map(k => findName(k)).reduce(valueCounts, {});
      let visiting_player_baskets = Object.entries(visiting_players_scored);
      let visiting_basketData = visiting_player_baskets.sort(function(a, b){return b[1]-a[1]});
      let vplayers =visiting_basketData.map(i => i[0]);
      let vbaskets = visiting_basketData.map(i => i[1]);   

      // warriors as home team
      let home_players_scored = scores.filter(i => i.teamId  == '1610612744').map(j => j.personId).map(k => findName(k)).reduce(valueCounts, {});
      let home_player_baskets = Object.entries(home_players_scored);
      let home_basketData = home_player_baskets.sort(function(a, b){return b[1]-a[1]});
      let hplayers =home_basketData.map(i => i[0]);
      let hbaskets = home_basketData.map(i => i[1]);

      // find who is actually the hometeam (for any team)
      let team_record = nba_finals.map(i => i.game_info).filter(i => i.game_id == game_id)[0]
      home_team = team_record.hometeam;

      game_title = nba_finals.filter(i => i.game_info.game_id == game_id).map(i => i.title)[0]

      // quick fix for my bad naming convention
      if(home_team == "Warriors"){
        // use filtered data above in these functions that create the charts
        lineChart(home_team_pts, visiting_team_pts, time_seconds);
        barChart(hplayers, hbaskets, vplayers, vbaskets);
        boxScore("#current-celtics-score", "rgb(0,136,83)","Celtics", visitor_current_quarter_points);
        boxScore("#current-warriors-score", "rgb(253,185,39)","Warriors", home_current_quarter_points);
        simpleText('#overview', game_title, quarter, quarterFilter);
      }
        
      else{
        // reverse order 
        lineChart(visiting_team_pts, home_team_pts, time_seconds);
        // bar chart doesn't change since I filter based on team id in the calc
        barChart(hplayers, hbaskets, vplayers, vbaskets);
        boxScore("#current-celtics-score", "rgb(0,136,83)","Celtics", home_current_quarter_points);
        boxScore("#current-warriors-score", "rgb(253,185,39)","Warriors", visitor_current_quarter_points);
        simpleText('#overview', game_title, quarter, quarterFilter);
      }

    })
      
}

function simpleText(id, line1, line2, line3){
  let overview = d3.select(id)
  overview.attr("class","my-4 fs-4")
  overview.selectAll('span')
          .data(line1)
          
  overview.join(
    enter => enter.append("span")
                  .html(`<strong>CURENT VIEW</strong><br>
                        <strong>Game:</strong> ${line1}<br>
                        <strong>Period:</strong> ${line2}<br>
                        <strong>Game Clock:</strong> ${line3}:00`),
    update => update.html(`<strong>CURENT VIEW</strong><br>
                           <strong>Game:</strong> ${line1}<br>
                           <strong>Period:</strong> ${line2}<br>
                           <strong>Game Clock:</strong> ${line3}:00`)
  )
}

// Advanced version of d3 updated text
// Must use d3 v5.8 or later to use .join()
// Updates with changes in range bar
function boxScore(id, bgColor, title, score){
  let team_box = d3.select(id);
  let local_width = team_box.node().getBoundingClientRect().width;
  team_box.attr("class", "col-12 mb-3 text-center align-top")
          .style("background-color", bgColor)
          .style("color", "white")
          .style("height", local_width + "px");

  let header = team_box.selectAll('p')
                       .data(score,d => d)
  header.join(
    enter =>
      enter.append('p')
           .style("font-size","30px")
           .style("margin","0")
           .html(`${title}<br>Latest Score`)
  )
  
  let team_score_box = team_box.selectAll('span')
                               .data(score, d => d)
  team_score_box.join(
    enter => 
      enter.append('span').text(d => d)
           .style("font-size", "150px"),
    update =>
      update.text(d => d) 
  );
}

// code for line chart
function lineChart(home, away, time){
  var trace1 = {
    x: time,
    y: away,
    name: 'Celtics',
    mode: 'lines',
    line: {
      color: 'rgb(0,136,83)',
      width: 5
    }
  };

  var trace2 = {
    x: time,
    y: home,
    name: 'Warriors',
    mode: 'lines',
    line: {
      color: 'rgb(253,185,39)',
      width: 5
    }
  };

  var data = [trace1, trace2];

  var layout = {
    title: 'Score Changes During Quarter',
    legend: {"orientation": "h"},
    xaxis: {tickvals:['60','120','180','240','300','360','420','480','540','600','660','720'],
        ticktext : ['11','10','9','8','7','6','5','4','3','2','1','0'],
        title: "Game Clock"},
    yaxis: {title: "Score",
            ticklen: 5,
            tickcolor: 'rgba(0,0,0,0)'}  
  };

  var config = {responsive: true}

  Plotly.newPlot('scoreDiv', data, layout, config);
}

// code for bar chart
function barChart(hplayers, hfg, vplayers, vfg){
  var trace1 = {
    x: vplayers,
    y: vfg,
    name: 'Celtics',
    type: 'bar',
    marker: {
      color: 'rgb(0,136,83)'
    }
  };

  var trace2 = {
    x: hplayers,
    y: hfg,
    name: 'Warriors',
    type: 'bar',
    marker: {
      color: 'rgb(253,185,39)'
    }
  };

  var data = [trace1,trace2];

  var layout = {
    barmode: 'group',
    title: 'Shots Made Per Player',
    yaxis: {title: "Field Goals Made"},
    xaxis: {title: "Player Name",
            standoff:120}
  };

  var config = {responsive: true}

  Plotly.newPlot('shotsDiv', data, layout, config);
}
// convert MM:SS to seconds
function timeConvert(str){
  convertTime = str.split(':')
  return (parseInt(convertTime[1]) + parseInt(convertTime[0])*60)
}
// not used; this format (MM:SS) seems to be treated as labels and not continuous
function reversetimeConvert(num){
  minutes = parseInt(num/60)
  seconds = (num % 60)
  return (`${minutes}:${seconds}`)
}
// calculates the number of occurances 
function valueCounts(obj, player){
  // updated my syntax after doing a stackoverflow search
  // code is 90% me, but 10% syntax whiz SO user
  if (!obj[player]) {
      obj[player] = 1;
  } 
  else {
      obj[player]++;
  }
  return obj;
}
// convert from player id to player name
function findName(playerId){
    let record = players.filter(i => i.personID == playerId);
    let result = record.map(i => i.name)
    return result[0]
}
// generates a string representing today's date
function nowDate(){
  // mostly a stack overflow search result
  let today = new Date();
  console.log(today)
  let dd = String(today.getDate()).padStart(2, '0');
  let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  let yyyy = today.getFullYear();

  now = yyyy+mm+dd
  // console.log(now)
  return now

}