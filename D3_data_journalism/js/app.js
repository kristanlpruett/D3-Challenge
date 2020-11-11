var svgWidth = 800;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("D3_data_journalism/data/data.csv").then(function(sourceData) {

    //Parse Data/Cast as numbers
    sourceData.forEach(function(data) {
      data.income = +data.income;
      data.smokes = +data.smokes;
    });

    //Create scales
    var xLinearScale = d3.scaleLinear()
      .domain([5, d3.max(sourceData, d => d.smokes)])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([10000, d3.max(sourceData, d => d.income)])
      .range([height, 0]);

    //Create axis
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    //Append Axes to the chart
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

    //State text
    sourceData.forEach(d =>
        chartGroup.selectAll("text")
        .data(sourceData)
        .enter()
        .append("text")
        .text(d => d.abbr)
        .attr("x", (d,i) => xLinearScale(d.smokes))
        .attr("y", d => yLinearScale(d.income))
        .attr("text-anchor", "middle")
        .attr("font-size", "10px")
        .classed("stateCircle", true)
    );

    //Create Circles
    var circlesGroup = chartGroup.selectAll("circle")
    .data(sourceData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.smokes))
    .attr("cy", d => yLinearScale(d.income)-3)
    .attr("r", "15")
    .attr("fill", "aquamarine")
    .attr("opacity","0.25")
    .classed("stateCircle", true)

    // Initialize tool tip
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([100, 40])
      .html(function(d) {
        return (`State: ${d.state}<br>Smokes ${d.smokes}%<br>Income: ${d.income}$`);
      });

    // Tooltip in the chart
    chartGroup.call(toolTip);

    // Create event listener to display and hide the tooltip
    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data, this);
    })

    .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });

    // Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Income ($)");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top})`)
      .attr("class", "axisText")
      .text("Smokes %");
  }).catch(function(error) {
    console.log(error);
  });