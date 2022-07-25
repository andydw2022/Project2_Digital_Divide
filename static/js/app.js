// function to change Xaxis scale when new label is chosen by the user
function xScale(xdata, currentXAxis, width) {
  // create scales
  console.log('xscale : xaxis , width', currentXAxis, width);
  console.log(xdata);
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(xdata, d => d[currentXAxis]*.5) ,
    d3.max(xdata, d => d[currentXAxis]) ])
    .range([1,width]);
  return xLinearScale;
}
// function to change Yaxis scale when new label is chosen by the user
function yScale(ydata, currentYAxis, height) {
  // create scales
  console.log('xscale : yaxis , width', currentYAxis, height);
  console.log(ydata);
  var yLinearScale = d3.scaleLinear()
    .domain([d3.max(ydata, d => d[currentYAxis]) ,
    d3.min(ydata, d => d[currentYAxis]) ])
    .range([height, 0]);

  return yLinearScale;
}
// function used for updating xAxis var upon click on axis label
function renderXAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);
  //console.log('newxScale', newXScale);
  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);
  return xAxis;
}
// function used for updating yAxis var upon click on axis label
function renderYAxes(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);
  //console.log('newYScale', newYScale);
  yAxis.transition()
    .duration(1000)
    .call(leftAxis);
  return yAxis;
}
// function used for updating data points as circles with a transition 
function renderCircles(circlesGroup, newXScale, newYScale, currentXAxis, currentYAxis) {
  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[currentXAxis]))
    .attr("cy", d => newYScale(d[currentYAxis]));
  return circlesGroup;
}
// function used for updating text within data points as circles with a transition 
function renderdata(circletextdata, newXScale, newYScale, currentXAxis, currentYAxis) {
    circletextdata.transition()
        .duration(1000)
        .attr("x", d => newXScale(d[currentXAxis]))
        .attr("y", d => newYScale(d[currentYAxis]));
    return circletextdata;
}
// function used for updating circles group with new tooltip
function updateToolTip(currentXAxis, currentYAxis, circles, circledata,dd_stats) {
  console.log('updatetooltip', currentXAxis);
  console.log('updatetooltip', currentYAxis);
  var xlabel;
  var ylabel;
  if (currentXAxis === "incomeperperson") {
    xlabel = "Income per person $ ";
  }
  else if (currentXAxis === "internetusage") {
    xlabel = "Internet usage rate person";
  }
  else {
    xlabel = "Urbanrate";
  }
  if (currentYAxis === "rank") {
    ylabel = "Rank";
  }
   var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([-10,-10])
    .attr("class", "d3-tip")
    .html(function(d) { 
        return (`${d.country} rank:${d.rank} <br>${xlabel} ${d[currentXAxis]}`);
    });

  circles.call(toolTip);
    circles.
     on("mouseover", function (data) {
       toolTip.show(data);
  })
    // onmouseout event
    .on("mouseout", function (data) {
      toolTip.hide(data);
    });

  return circles;
}
// The code for the chart is wrapped inside a function that
// automatically resizes the chart
function makeResponsive() {
  // Select div by id.
  var svgArea = d3.select("#scatter").select("svg");
  // Clear SVG.
  if (!svgArea.empty()) {
    svgArea.remove();
  }
  //SVG params.
  var svgHeight = window.innerHeight * .8;
  var svgWidth = window.innerWidth * .8 ;
  // Margins.
  var margin = {
    top:    50,
    right:  50,
    bottom: 100,
    left:   100
  };
  // Start with these axes on loading
  var currentXAxis = 'incomeperperson';
  var currentYAxis = 'rank';

  //Define drawing area
  var height = svgHeight - margin.top - margin.bottom;
  var width = svgWidth - margin.left - margin.right;
  console.log('Height ', height);
  console.log('width ', width);
  // Create an SVG wrapper, append an SVG group that will hold our chart,
  // and shift the latter by left and top margins.
  var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);
  // Append an SVG group
  var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);
  // Retrieve data from the CSV file, parse and execute everything below
  d3.csv("static/data/combined_internet_country.csv").then(function (dd_stats, err) {
    if (err) throw err;
    dd_stats.forEach(function(data) {
      data.country            = data.country;
      data.poptotal           = Math.round(+data.poptotal,0);
      data.rank               = +data.rank;
      data.code               = data.code;
      data.downloadspeed_mbps = +data.downloadspeed_mbps;
      data.number_of_isps     = +data.number_of_isps;
      data.incomeperperson    = Math.round(+data.incomeperperson,0);
      data.internetuserrate   = Math.round(+data.internetuserrate,0);
      data.urbanrate          = Math.round(+data.urbanrate,0);
    });
    //display initial axes data as a check
    console.log('dd_stats ', dd_stats);
   
    //Define x/y scales
    var xLinearScale = xScale(dd_stats, currentXAxis, width);
    var yLinearScale = yScale(dd_stats, currentYAxis, height);
    // Create initial axis functions
    console.log('xLinearScale', xLinearScale);
    console.log('yLinearScale', yLinearScale);
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // append x axis
    var xAxis = chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);
    // append y axis
    var yAxis = chartGroup.append("g")
      .call(leftAxis);

    //append initial circles
    var circlesGroup = chartGroup.selectAll("circle")
      .data(dd_stats);
    // Bind data to circlesGroup
    var elemData = circlesGroup.enter();
    // These will be the circles of data to be plotted
    var circles = elemData.append("circle")
      .attr("cx", d => xLinearScale(d[currentXAxis]))
      .attr("cy", d => yLinearScale(d[currentYAxis]))
      .attr("r", 10)
      .classed("stateCircle", true);
    //Bind labels, values data text circles plotted above
    var circledata = elemData.append("text")
      .attr("x", d => xLinearScale(d[currentXAxis]))
      .attr("y", d => yLinearScale(d[currentYAxis]))
      .attr("dy", ".35em")
      .text(d => d.abbr)
      .classed("stateText", true);
    // updateToolTip function 
    var circlesGroup = updateToolTip(currentXAxis, currentYAxis, circles, circledata,dd_stats);

    // Create group for three x-axis labels
    var labelsGroupX = chartGroup.append("g")
      .attr("transform", `translate(${width / 2}, ${height + 20})`);
    var incomelabel = labelsGroupX.append("text")
      .attr("x", 0)
      .attr("y", 20)
      .attr("value", "incomeperperson") // value to grab for event listener
      .classed("active", true)
      .text("Income per person (GDP per capita $US)");
    var internetusagelabel = labelsGroupX.append("text")
      .attr("x", 0)
      .attr("y", 40)
      .attr("value", "internetusage") // value to grab for event listener
      .classed("inactive", true)
      .text("Internet users per 100 people with access to Internet ");
    var urbanratelabel = labelsGroupX.append("text")
        .attr("x", 0)
        .attr("y", 60)
        .attr("value", "urbanrate")
        .classed("inactive", true)
        .text("Percentage of Population living in Urban area");

    // Create group for three y-axis labels
    var labelsGroupY = chartGroup.append("g")
      .attr("transform", "rotate(-90)");
      var ranklabel = labelsGroupY.append("text")
      .attr("x", 40 - (height / 2))
      .attr("y", 40 - margin.left)
      .attr("dy", "1em")
      .attr("value", "rank") // value to grab for event listener
      .classed("active", true)
      .text("Internet Ranking");
    ("Number of ISPs");

    // X labels event listener.
    labelsGroupX.selectAll("text")
      .on("click", function () {
      // Grab selected label.
      currentXAxis = d3.select(this).attr("value");
      // Update xLinearScale.
      xLinearScale = xScale(dd_stats, currentXAxis, width);
      // Render xAxis.
      xAxis = renderXAxes(xLinearScale, xAxis);
      // Switch active/inactive labels.
      if (currentXAxis === "incomeperperson") {
        incomelabel
          .classed("active", true)
          .classed("inactive", false);
        internetusagelabel
           .classed("active", false)
           .classed("inactive", true);
        urbanratelabel
           .classed("active", false)
           .classed("inactive", true);
      } else if (currentXAxis === "internetusage") {
        internetusagelabel
          .classed("active", true)
          .classed("inactive", false);
        incomelabel
          .classed("active", false)
          .classed("inactive", true);
        urbanratelabel
          .classed("active", false)
          .classed("inactive", true);
      } else if (currentXAxis === "urbanrate") {
        urbanratelabel
          .classed("active", true)
          .classed("inactive", false);
        incomelabel
          .classed("active", false)
          .classed("inactive", true);
        internetusagelabel
          .classed("active", false)
           .classed("inactive", true);
      
      }
      circle = renderCircles(circlesGroup, xLinearScale, yLinearScale, currentXAxis, currentYAxis);
      // Update tool tips with new info.
      circlesGroup = updateToolTip(currentXAxis, currentYAxis, circle, circledata,dd_stats);
      // Update circles text with new values.
      circledata = renderdata(circledata, xLinearScale, yLinearScale, currentXAxis, currentYAxis);
      });

      // Y Labels event listener.
      labelsGroupY.selectAll("text")
        .on("click", function () {
        // Select the new label
        currentYAxis = d3.select(this).attr("value");
        // Update yLinearScale.
        yLinearScale = yScale(dd_stats, currentYAxis, height);
        // Update yAxis.
        yAxis = renderYAxes(yLinearScale, yAxis);
        // Changes classes to change bold text.
        if (currentYAxis === "rank") {
           ranklabel
             .classed("active", true)
             .classed("inactive", false);
        }
        
        // Update circles with new y values.
        circle = renderCircles(circlesGroup, xLinearScale, yLinearScale, currentXAxis, currentYAxis);
        // Update tool tips with new info.
        circlesGroup = updateToolTip(currentXAxis, currentYAxis, circle, circledata,dd_stats);
        // Update circles text with new values.
        circledata = renderdata(circledata, xLinearScale, yLinearScale, currentXAxis, currentYAxis);
        });
    }).catch(function (err) {
        console.log(err);
    });
}
makeResponsive();
// When the browser window is resized, makeResponsive() is called.
d3.select(window).on("resize", makeResponsive);
