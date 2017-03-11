// MeteoriteMap.js
// This video tutorial was helpful in creating this project: https://www.youtube.com/watch?v=aNbgrqRuoiE

    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/meteorite-strike-data.json');
    xhr.onload = function() {
        if (xhr.status === 200) {
            var meteoriteData = JSON.parse(xhr.response);
            var xhr2 = new XMLHttpRequest();
            xhr2.open('GET', 'https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json');
            xhr2.onload = function() {
                if (xhr2.status === 200) {
                    var countryData = JSON.parse(xhr2.response);

                    function buildChart(dataset) {

                        // Instantiate variables
                        var svgWidth = 900;
                        var svgHeight = 550;
                        var chartPadding = 50;

                        // Setup tooltip div
                        var tooltip = d3.select('body')
                                        .append('div')
                                        .attr('class', 'tooltipStyles')

                        // Set up projection
                        var projection = d3.geoMercator()
                                           .translate([ svgWidth / 2, svgHeight / 2])
                                           .scale(140)
                        
                        // Set up path
                        var path = d3.geoPath()
                                     .projection(projection);
                   
                        // Append svg to DOM
                        var svg = d3.select('#chartDiv')
                                    .append('svg')
                                    .attr('width', svgWidth)
                                    .attr('height', svgHeight)
                                    .attr('class', 'svgBG');
                        
                        // Parse out the countries from the country data so I can draw a map
                        var countries = topojson.feature(countryData, countryData.objects.countries1).features;

                        // Draw paths using country data and append to SVG
                        svg.selectAll('.country')
                           .data(countries)
                           .enter()
                           .append('path')
                           .attr('class', 'country')
                           .attr('d', path)

                        // Clean out any data points that do not have coordinates
                        var cleanMeteoriteData = [];
                        for (let i = 0; i < meteoriteData.features.length; i++) {
                            if(meteoriteData.features[i].geometry !== null) {
                                cleanMeteoriteData.push(meteoriteData.features[i]);
                            }
                        }

                        // Put circles on map for meteorite strike locations
                        var colorsArray = ["#000094", "#940094", "#949400", "#009400"];
                        svg.selectAll('.strikes')
                           .data(cleanMeteoriteData)
                           .enter()
                           .append('circle')
                           .attr('class', 'strikes')
                           .attr('fill', function(d) {
                                // Pick one of four random colors to color circles
                                var index = Math.floor(Math.random() * (3 - 0 + 1));
                                return colorsArray[index];
                           })
                           .attr('r', function(d) {
                               // Set radius of circle based on mass of meteorite
                               if(d.properties.mass < 1000) {
                                   return 2;
                               } else if(d.properties.mass < 20000) {
                                   return 5;
                               } else {
                                   return d.properties.mass * 0.000001;
                               }
                           })
                           .attr('cx', function(d) {
                               // Maps longitude to x coordinate
                              var coords = projection([d.geometry.coordinates[0], d.geometry.coordinates[1]]);
                              return coords[0];
                           })
                           .attr('cy', function(d) {
                               // Maps latitude to y coordinate
                               var coords = projection([d.geometry.coordinates[0], d.geometry.coordinates[1]]);
                               return coords[1];
                           })
                           .on('mouseover', function(d) {
                               // Show tooltip upon hover on meteorite strike
                               tooltip.transition().style('display', 'block')
                               tooltip.html('<em>"' + d.properties.name + '"</em>' + '<br>Mass: ' + d.properties.mass + '<br>Year: ' + d.properties.year.substring(0,4) )
                                      .style('left', '350px')
                                      .style('top', '500px')
                                      .style('z-index', 2)
                           })
                           .on('mouseout', function(d) {
                               // Hide tooltip on mouseout
                               tooltip.transition().style('display', 'none');
                           })


                    }
                    buildChart(meteoriteData);
                }
                else {
                    // Handle error if xhr2 request fails
                    console.log('Request for country data failed. Returned status of ' + xhr2.status)
                }
            }
            xhr2.send();
        }
        else {
            // Handle error if xhr1 request fails
            console.log('Request failed.  Returned status of ' + xhr.status);
        }
    };
    xhr.send();

