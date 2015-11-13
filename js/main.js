(function() {
  "use strict";

  var height, 
    width, 
    svg, 
    data, 
    processedData = [], 
    rectangle,
    scale, 
    labelYear, 
    labelPop, 
    colour = "#7f8c8d", 
    title = "World Population Growth, 1953-2013";


  function getViewportDimensions() { 
    width = document.getElementsByTagName("main")[0].offsetWidth / 2;
    height = window.innerHeight / 1.5;
  }

  function drawSvg() {
   // d3.select("main")
   //      .append("text")
   //      .text(title);

    svg = d3.select("main")
      .append("svg")
      .attr("title", "Bar chart: " + title);

      setSvgSize();
  }

  function setSvgSize() {
    svg
      .attr({
        width: width,
        height: height
      });
  }

  function processData() {
    for(var i = 0; i < data.length; i++ ) {
      var innerArray = [];
      innerArray.push(parseInt(data[i].Year));
      innerArray.push(parseInt(data[i].UK));
      processedData.push(innerArray);
    }
    drawBarChart();
  }

  function setScale() {
    // to-do, get the min/max of the year's values programatically 
    scale = d3.scale.linear()
      .domain([50592900,64105654])
      .range([width/2,width]);
  }


  function drawBarChart() {
    setScale();

    rectangle = svg.selectAll("rect")
      .data(processedData)
      .enter()
      .append("rect")
      .attr({
        "width": function(d) {
          return scale(d[1]);
        },
        "height": 5,
        "y": function(d,i) {
          return i * (height/10) + 25; 
        }, 
        "fill" : colour
      });

    labelYear = svg.selectAll("text")
      .data(processedData)
      .enter()
      .append("text")
      .text(function(d,i){
        return d[0];
      })
      .attr({
        "fill" : "#bdc3c7",
        "font-size" : "10px",
        "x" : function(d) {
          return 0
        },
        "y": function(d,i) {
          return i * (height/10) + 20; 
        },

      });
    
    labelPop = svg.selectAll("text.pop")
      .data(processedData)
      .enter()
      .append("text")
      .classed("pop", true)
      .text(function(d,i){
        return d[1];
      })
      .attr({
        "fill" : colour,
        "font-size" : "10px",
        "x" : function(d) {
          return scale(d[1]);
        },
        "y": function(d,i) {
          return i * (height/10) + 20; 
        }, 
        "text-anchor" : "end"
      });

  }


  d3.csv("data/pop.csv", function(error, json){
    if(error) {
      console.log("error");
    }

    else {
      data = json;
    }

    // drawBarChart();
    processData();

  });

  getViewportDimensions();
  drawSvg();


  d3.select(window).on('resize', resize);

  function resize() {

    getViewportDimensions();
    setSvgSize();

  }

})();
