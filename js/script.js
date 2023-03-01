const FRAME_HEIGHT = 500;
const FRAME_WIDTH = 500;
const MARGINS = {left:50, right:50, top:50, bottom:50};

const VIS_HEIGHT = FRAME_HEIGHT - (MARGINS.top + MARGINS.bottom);
const VIS_WIDTH = FRAME_WIDTH - (MARGINS.left + MARGINS.right);

//function to get border data
function Border() {

    console.log("1")
    this.classList.toggle("add_border");
    let circle_x = this.getAttribute("cx") / 50;
    let circle_y = (500 - this.getAttribute("cy")) / 50;
    let newText = "Last Point Clicked: (" + circle_x + ", " + circle_y + ")"
    document.getElementById("print_points").innerHTML = newText;
}
//function to add border
function addBorder() {
    let circle_values = document.getElementsByTagName("circle");

    for (let i = 0; i < circle_values.length; i++){
        let circle_value = circle_values[i];
        circle_value.addEventListener("click", Border);
        console.log("2")
    }
}
//function to get coordinates
function getcoordinates() {

    // Get X and Y coordinates
    let x_ax = document.getElementById('X-ax');
    let y_ax = document.getElementById('Y-ax');
    let x = x_ax.value * 50;
    let y = 500 - (y_ax.value * 50);

    svg_plot = document.getElementById("svg_plot");
    svg_plot.innerHTML += '<circle class="circle" cx=' + x + ' cy=' + y + ' r="10" onClick="addBorder()"/>';

    }
//function to send new point to svg
function SendPoint() {
    let new_point = document.getElementById("SendPoint");
    new_point.addEventListener("click", getcoordinates);
}


const FRAME1 = d3.select("#vis1")
    .append("svg")
    .attr("height", FRAME_HEIGHT)
    .attr("width", FRAME_WIDTH)
    .attr("class", "frame");

// Read CSV data
d3.csv("data/scatter-data.csv").then((DATA) => {

    const X_SCALE = d3.scaleLinear()
        .domain([0, 10])
        .range([0, VIS_WIDTH]);
    const Y_SCALE = d3.scaleLinear()
        .domain([10, 0])
        .range([0, VIS_HEIGHT]);
    // Plot the points
	FRAME1.selectAll("points")
        .data(DATA)
        .enter()
        .append("circle")
        .attr("cx", (d) => { return (X_SCALE(d.x) + MARGINS.left); })
        .attr("cy", (d) => { return (Y_SCALE(d.y) + MARGINS.top) ; })
        .attr("r", 6)
        .attr("class", "point");

	// Append Axis
	FRAME1.append("g")
		.attr("transform", "translate(" + MARGINS.left + "," + (VIS_HEIGHT + MARGINS.top) + ")")
		.call(d3.axisBottom(X_SCALE).ticks(10))
        .attr("font-size", "15px");
	FRAME1.append("g")
		.attr("transform", "translate(" + MARGINS.left + "," + (MARGINS.bottom) + ")")
		.call(d3.axisLeft(Y_SCALE).ticks(10))
        .attr("font-size", "15px");

    // Last clicked point
    function pointClicked() {

        let xCoord = d3.select(this).attr("cx");
        let yCoord = d3.select(this).attr("cy");

        xCoord = Math.round(X_SCALE.invert(xCoord - MARGINS.left));
        yCoord = Math.round(Y_SCALE.invert(yCoord - MARGINS.top));
        
        document.getElementById("last_point").innerHTML = "Last Point Clicked: (" + xCoord + "," + yCoord + ")";

        this.classList.toggle('point-border');
    }

    function addPoint() {
        let xCoord = document.getElementById("x-coord");
        let yCoord =  document.getElementById("y-coord");

        let x = xCoord.value;
        let y = yCoord.value;


        FRAME1.append("circle")
            .attr("cx", (d) => { return (X_SCALE(x) + MARGINS.left); })
            .attr("cy", (d) => { return (Y_SCALE(y) + MARGINS.top) ; })
            .attr("r", 6)
            .attr("class", "point")
            .on("click", pointClicked);
    }
    d3.selectAll("#enter").on("click", addPoint);
    d3.selectAll(".point").on("click", pointClicked);
});




// Frame for visualization #2
const FRAME2 = d3.select("#vis2")
    .append("svg")
    .attr("height", FRAME_HEIGHT)
    .attr("width", FRAME_WIDTH)
    .attr("class", "frame"); 

// Read CSV data
d3.csv("data/bar-data.csv").then((DATA) => {
 
	const MAX_Y = d3.max(DATA, (d) => { return parseInt(d.amount); });

	const X_SCALE = d3.scaleBand()
        .domain(DATA.map(function(d) { return d.category; }))
        .range([0, VIS_WIDTH])
        .padding(.2);
	const Y_SCALE = d3.scaleLinear()
        .domain([(MAX_Y+1), 0])
        .range([0, VIS_HEIGHT]);

    FRAME2.selectAll("bars")  
        .data(DATA)
        .enter()       
        .append("rect")  
            .attr("x", (d) => { return X_SCALE(d.category) + MARGINS.left; }) 
            .attr("y", (d) => { return Y_SCALE(d.amount) +  MARGINS.top; })
            .attr("width", X_SCALE.bandwidth())
            .attr("height", (d) => { return VIS_HEIGHT - Y_SCALE(d.amount); })
            .attr("class", "bar") 

	// Append Axis
	FRAME2.append("g")
		.attr("transform", "translate(" + MARGINS.left + "," + (VIS_HEIGHT + MARGINS.top) + ")")
		.call(d3.axisBottom(X_SCALE).ticks(7))
		.attr("font-size", '20px');  
	FRAME2.append("g")
		.attr("transform", "translate(" + MARGINS.left + "," + (MARGINS.bottom) + ")")
		.call(d3.axisLeft(Y_SCALE).ticks(10))
		.attr("font-size", '20px');


});  