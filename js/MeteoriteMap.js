// Scatterplot.js

    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/meteorite-strike-data.json');
    xhr.onload = function() {
        if (xhr.status === 200) {
            var json = JSON.parse(xhr.response);
            console.log(json);

            function buildChart(dataset) {

              // Code goes here

            }
            buildChart(json);
        }
        else {
            // Handle error if xhr request fails
            console.log('Request failed.  Returned status of ' + xhr.status);
        }
    };
    xhr.send();

