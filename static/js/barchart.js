var margin = {top: 50, right: 50, bottom: 200, left: 50},
    width = 1500 - margin.left - margin.right,
    height = 1000 - margin.top - margin.bottom;

var svg = d3.select("body").append("svg")
	.attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
	.append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("static/data/combined_internet_country.csv", function(error, data){
console.log('---data-',data)
	// filter year
	var data = data.filter(function(d){return d.rank <101;});
	// Get every column value
	var elements = Object.keys(data[0])
		.filter(function(d){
			return (d != "countrycode" && d != "country" && d != "totpop");
		});
	var selection = elements[0];
  console.log('---',elements);
  if (selection != "rank") {
    var y = d3.scale.linear()
			.domain([0, d3.max(data, function(d){
				return +d[selection];
			})])
			.range([height, 0]);
  } else {
    var y = d3.scale.linear()
			.domain([ d3.max(data, function(d){
				return +d[selection];
			}),0])
			.range([height, 0]);
  }
	

	var x = d3.scale.ordinal()
			.domain(data.map(function(d){ return d.country;}))
			.rangeBands([0, width]);


	var xAxis = d3.svg.axis()
		.scale(x)
	    .orient("bottom");

	var yAxis = d3.svg.axis()
		.scale(y)
	    .orient("left");

	svg.append("g")
    	.attr("class", "x axis")
    	.attr("transform", "translate(0," + height + ")")
    	.call(xAxis)
    	.selectAll("text")
    	.style("font-size", "15px")
      	.style("text-anchor", "end")
      	.attr("dx", "-.8em")
      	.attr("dy", "-.55em")
      	.attr("transform", "rotate(-90)" );

   

 	svg.append("g")
    	.attr("class", "y axis")
    	.call(yAxis);

	svg.selectAll("rectangle")
		.data(data)
		.enter()
		.append("rect")
		.attr("class","rectangle")
		.attr("width", width/data.length/1.25)
    .attr("padding",10)


    // .append("text")
    // .text(function(d) { 
    //     return data[d];
    // })
    // .attr("x", function(d){
    //     return x(d) + x.bandwidth()/2;
    // })
    // .attr("y", function(d){
    //     return y(data[d]) - 5;
    // })
    // .attr("font-family" , "sans-serif")
    // .attr("font-size" , "14px")
    // .attr("fill" , "black")
    // .attr("text-anchor", "middle")


		.attr("height", function(d){
			return height - y(+d[selection]);
		})
		.attr("x", function(d, i){
			return (width / data.length) * i ;
		})
		.attr("y", function(d){
			return y(+d[selection]);
		})
		.append("title")
		.text(function(d){
			return d.country + " : " + d[selection];
		});

	var selector = d3.select("#drop")
    	.append("select")
    	.attr("id","dropdown")
    	.on("change", function(d){
        	selection = document.getElementById("dropdown");
   console.log ('selection',selection.value)
     if (selection.value != "rank") {
      y.domain([0, d3.max(data, function(d){
				return +d[selection.value];})]);
          }
           else {
            y.domain([d3.max(data, function(d){
				return +d[selection.value];}),0]);
          }
        	yAxis.scale(y);
        	d3.selectAll(".rectangle")
           		.transition()
	            .attr("height", function(d){
					return height - y(+d[selection.value]);
				})
				.attr("x", function(d, i){
					return (width / data.length) * i ;
				})
				.attr("y", function(d){
					return y(+d[selection.value]);
				})
           		.ease("linear")
           		.select("title")
           		.text(function(d){
           			return d.country + " : " + d[selection.value];
           		});
      
           	d3.selectAll("g.y.axis")
           		.transition()
           		.call(yAxis);

         });

    selector.selectAll("option")
      .data(elements)
      .enter().append("option")
      .attr("value", function(d){
        return d;
      })
      .text(function(d){
        return d;
      })


});
