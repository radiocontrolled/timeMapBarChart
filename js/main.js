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
    title = "UK Population Estimates, 1953-2013", 
    format = d3.format("0,000");

  function getViewportDimensions() { 

    height = window.innerHeight / 2;
    
    // if portrait
    if(window.innerHeight > window.innerWidth){
      width = document.getElementsByTagName("main")[0].offsetWidth / 1.2;
    }

    // if landscape
    else {
      width = document.getElementsByTagName("main")[0].offsetWidth / 2;
    }

  }

  function drawSvg() {
    svg = d3.select("main")
      .append("svg")
      .attr("title", "Bar chart: " + title);

      setSvgAndHeaderSize();
  }


  function setSvgAndHeaderSize() {

    svg
      .attr({
        width: width, 
        height: height
      });

    d3.select("header")
      .style("width", width + "px");

    d3.select("footer")
      .style("width", width + "px");
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
          return i * (height/8) + 25; 
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
          return 0;
        },
        "y": function(d,i) {
          return i * (height/8) + 20; 
        },

      });
    
    labelPop = svg.selectAll("text.pop")
      .data(processedData)
      .enter()
      .append("text")
      .classed("pop", true)
      .text(function(d,i){
        return format(d[1]);
      })
      .attr({
        "fill" : colour,
        "font-size" : "10px",
        "x" : function(d) {
          return scale(d[1]);
        },
        "y": function(d,i) {
          return i * (height/8) + 20; 
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
    setSvgAndHeaderSize();
    setScale();

    // update rectangle widths & labels
  
   rectangle = svg.selectAll("rect")
      .attr({
        "width": function(d) {
          return scale(d[1]);
        },
        "height": 5,
        "y": function(d,i) {
          return i * (height/8) + 25; 
        }
      });

    labelYear = svg.selectAll("text")
      .attr({
        "x" : function(d) {
          return 0;
        },
        "y": function(d,i) {
          return i * (height/8) + 20; 
        }
      });
    
    labelPop = svg.selectAll("text.pop")
      .attr({
        "x" : function(d) {
          return scale(d[1]);
        },
        "y": function(d,i) {
          return i * (height/8) + 20; 
        }, 
        "text-anchor" : "end"
      });

  }

})();
