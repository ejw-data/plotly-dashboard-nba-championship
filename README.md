# plotly-dashboard-nba-championship

Author:  Erin James Wills, ejw.data@gmail.com  

![2022 NBA Championship](./images/nba-dashboard.png)
<cite>Photo by [Kenny Eliason](https://unsplash.com/@neonbrand?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/s/photos/nba?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)</cite>
<br>

## Overview  
<hr>

Simple dashboard utilizing the NBA api to obtain play-by-play data that is filtered and aggregated for several plotly charts.  The dashboard uses several controls on the page for filtering.

<br>

## Github Pages  

https://ejw-data.github.io/plotly-dashboard-nba-championship/  
   

<br>

## Technologies    
*  HTML/CSS/JS
*  Plotly.js

<br>

## Data Source  

Below is an example of how to form the api endpoint.  The information is specific to a particular game and the game id comes from https://www.nba.com/.  This information is often found in the url of the box score page.  

`date` = '20220602'   
`game_id` = '0042100401'  
`quarter` = 1    

`https://data.nba.net/prod/v1/`< date >`/`< game_id >`_pbp_`< quarter >`.json`; 

<br>

## Setup and Installation  
1. Clone the repo to your local machine
1. Open repo folder in an IDE like VSCode
1. Using a virtual server like the VSCode extention LiveServer
1. Run `index.html`  

<br>

## Example

![Dashboard](./images/dashboard-screenshot.png)
