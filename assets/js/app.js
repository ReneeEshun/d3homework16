// Step 0: Set up our chart
//= ================================
var svgWidth = 960;
var svgHeight = 500;

var margin = { top: 20, right: 40, bottom: 80, left: 100 };

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var stateAbbrs = {
  "Arizona": "AZ",
  "Alabama":	"AL",
  "Alaska":"AK",
  "Arkansas":	"AR",
  "California":"CA",
  "Colorado":	"CO",
  "Connecticut":"CT",
  "Delaware":"DE",
  "Dist. of Columbia":"DC",
  "Florida": "FL",
  "Georgia":"GA",
  "Hawaii":	"HI",
  "Idaho":"ID",
  "Illinois":"IL",
  "Indiana":"IN",
  "Iowa":"IA",
  "Kansas":"KS",
  "Kentucky":"KY",
  "Louisiana":"LA",
  "Maine":"ME",
  "Maryland":"MD",
  "Massachusetts":"MA",
  "Michigan":"MI",
  "Minnesota":"MN",
  "Mississippi":"MS",
  "Missouri":"MO",
  "Montana":"MT",
  "Nebraska":"NE",
  "Nevada":"NV",
  "New Hampshire":"NH",
  "New Jersey":"NJ",
  "New Mexico":"NM",
  "New York":	"NY",
  "North Carolina":"NC",
  "North Dakota":"ND",
  "Ohio":"OH",
  "Oklahoma":"OK",
  "Oregon":"OR",
  "Pennsylvania":"PA",
  "Puerto Rico":"PR",
  "Rhode Island":"RI",
  "South Carolina":"SC",
  "South Dakota":"SD",
  "Tennessee":"TN",
  "Texas":"TX",
  "Utah":"UT",
  "Vermont":"VT",
  "Virginia":"VA",
  "Washington":"WA",
  "West Virginia":"WV",
  "Wisconsin":"WI",
  "Wyoming":"WY"

};

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3
  .select(".chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Append an SVG group
var chart = svg.append("g");

// Append a div to the bodyj to create tooltips, assign it a class
d3.select(".chart").append("div").attr("class", "tooltip").style("opacity", 0);

// Retrieve data from the CSV file and execute everything below
d3.csv("/hmw16Data.csv", function(err, data) {
  if (err) throw err;

    data.forEach(function(datapoint) {
    datapoint.percentNoHealthcare = +datapoint.percentNoHealthcare; 
    datapoint.percentBelowPoverty = +datapoint.percentBelowPoverty;
    datapoint.totalBlackPopulation= +datapoint.totalBlackPopulation;
    
  });

  // Create scale functions
  var yLinearScale = d3.scaleLinear().range([height, 0]);

  var xLinearScale = d3.scaleLinear().range([0, width]);

  // Create axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // These variables store the minimum and maximum values in a column in data.csv
  var xMin;
  var xMax;
  var yMin;
  var yMax;

  // This function identifies the minimum and maximum values in a column in hairData.csv
  // and assign them to xMin and xMax variables, which will define the axis domain
  function findMinAndMax(dataColumnX, dataColumnY) {
    xMin = d3.min(data, function(data) {
      return +data[dataColumnX] * 0.8;
    });

    xMax = d3.max(data, function(data) {
      return +data[dataColumnX] * 1.1;
    });

    yMax = d3.max(data, function(data) {
      return +data[dataColumnY] * 1.1;
    });

    yMin=d3.min(data,function(data) {
    return +data[dataColumnY] * 0.8;
    })
  }

  // The default x-axis is 'hair_length'
  // Another axis can be assigned to the variable during an onclick event.
  // This variable is key to the ability to change axis/data column
  var currentAxisLabelX = "percentBelowPoverty";
  var currentAxisLabely="percentNoHealthcare";


  // Call findMinAndMax() with 'hair_length' as default
  //findMinAndMax(currentAxisLabelX);
  findMinAndMax(currentAxisLabelX, currentAxisLabely);
  // Set the domain of an axis to extend from the min to the max value of the data column
  // console.log(xMin);
  // console.log(xMax);

  xLinearScale.domain([xMin, xMax]);
  yLinearScale.domain([yMin, yMax]);

  console.log(data)
  var circles = chart
    .selectAll("circle")
    .data(data)
    .enter();

    circles.append("circle")
    .attr("cx", function(datapoint, index) {
      
      return xLinearScale(+datapoint[currentAxisLabelX]);
    })
    .attr("cy", function(datapoint, index) {
      return yLinearScale(+datapoint[currentAxisLabely]);
    })
    .attr("r", "8")
    .attr("fill", "#E75480");

    circles.append("text")
    // We return the abbreviation to .text, which makes the text the abbreviation.
    .text(function(d) {
      // style("font", "10px sans-serif");
      return stateAbbrs[d.geography];
     
     
    })
    .style("font", "10px sans-serif")
    .style("text-align", "middle")
    .style("text-anchor", "bottom")
    .attr("alignment-baseline", "center")

    .classed('state-label', true)
    .attr("dx", function(d) {
      // console.log(d);
      return xLinearScale(+d[currentAxisLabelX]);
    })
    .attr("dy", function(d) {
      // When the size of the text is the radius,
      // adding a third of the radius to the height
      // pushes it into the middle of the circle.
      return yLinearScale(+d[currentAxisLabely]);
    })
    
  chart
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    // The class name assigned here will be used for transition effects
    .attr("class", "x-axis")
    .call(bottomAxis);

  // Append a group for y-axis, then display it
  chart.append("g").call(leftAxis);

  // Append y-axis label
  chart
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 40)
    .attr("x", 0 - height / 2)
    .attr("dy", "1em")
    .attr("class", "axis-text")
    .attr("data-axis-name", "num_hits")
    .text("Percentage with no Healthcare");

  // Append x-axis labels
  chart
    .append("text")
    .attr(
      "transform",
      "translate(" + width / 2 + " ," + (height + margin.top + 20) + ")"
    )
    // This axis label is active by default
    .attr("class", "axis-text active")
    .attr("data-axis-name", "percentBelowPoverty")
    .text("Percentage in Poverty");

  chart
    .append("text")
    .attr(
      "transform",
      "translate(" + width / 2 + " ," + (height + margin.top + 45) + ")"
    )
    // This axis label is inactive by default
    .attr("class", "axis-text inactive")
    .attr("data-axis-name", "totalBlackPopulation")
    .text("Total Black Population");

  // Change an axis's status from inactive to active when clicked (if it was inactive)
  // Change the status of all active axes to inactive otherwise
  function labelChange(clickedAxis) {
    d3
      .selectAll(".axis-text")
      .filter(".active")
      // An alternative to .attr("class", <className>) method. Used to toggle classes.
      .classed("active", false)
      .classed("inactive", true);

    clickedAxis.classed("inactive", false).classed("active", true);
  }

  d3.selectAll(".axis-text").on("click", function() {
    // Assign a variable to current axis
    var clickedSelection = d3.select(this);
    // "true" or "false" based on whether the axis is currently selected
    var isClickedSelectionInactive = clickedSelection.classed("inactive");
    // console.log("this axis is inactive", isClickedSelectionInactive)
    // Grab the data-attribute of the axis and assign it to a variable
    // e.g. if data-axis-name is "poverty," var clickedAxis = "poverty"
    var clickedAxis = clickedSelection.attr("data-axis-name");
    console.log("current axis: ", clickedAxis);

    // The onclick events below take place only if the x-axis is inactive
    // Clicking on an already active axis will therefore do nothing
    if (isClickedSelectionInactive) {
      // Assign the clicked axis to the variable currentAxisLabelX
      currentAxisLabelX = clickedAxis;
      // Call findMinAndMax() to define the min and max domain values.
      findMinAndMax(currentAxisLabelX);
      // Set the domain for the x-axis
      xLinearScale.domain([xMin, xMax]);
      // Create a transition effect for the x-axis
      svg
        .select(".x-axis")
        .transition()
        // .ease(d3.easeElastic)
        .duration(1800)
        .call(bottomAxis);
      // Select all circles to create a transition effect, then relocate its horizontal location
      // based on the new axis that was selected/clicked
      d3.selectAll("circle").each(function() {
        d3
          .select(this)
          .transition()
          // .ease(d3.easeBounce)
          .attr("cx", function(data) {
            return xLinearScale(+data[currentAxisLabelX]);
          })
          .duration(1800);
      });

      
      d3.selectAll("text.state-label").each(function() {
        d3
          .select(this)
          .transition()
          // .ease(d3.easeBounce)
          .attr("dx", function(data) {
            console.log(data);
            // console.log(data);
            return xLinearScale(+data[currentAxisLabelX]);
          })
          .duration(1800);
      });
  
      // Change the status of the axes. See above for more info on this function.
      labelChange(clickedSelection);
    }
  });
});
