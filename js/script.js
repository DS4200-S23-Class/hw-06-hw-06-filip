//Create constants for the frame
const FRAME_HEIGHT = 500;
const FRAME_WIDTH = 400; 
const MARGINS = {left: 50, right: 50, top: 50, bottom: 50};

const VIS_HEIGHT = FRAME_HEIGHT - MARGINS.top - MARGINS.bottom;
const VIS_WIDTH = FRAME_WIDTH - MARGINS.left - MARGINS.right; 



//Create Frames
const FRAME1 = d3.select("#vis1") 
                  .append("svg") 
                    .attr("height", FRAME_HEIGHT)   
                    .attr("width", FRAME_WIDTH)
                    .attr("class", "frame"); 

const FRAME2 = d3.select("#vis2") 
                    .append("svg") 
                      .attr("height", FRAME_HEIGHT)   
                      .attr("width", FRAME_WIDTH)
                      .attr("class", "frame");

const FRAME3 = d3.select("#vis3") 
                    .append("svg") 
                      .attr("height", FRAME_HEIGHT)   
                      .attr("width", FRAME_WIDTH)
                      .attr("class", "frame"); 

//Read CSV data
d3.csv("data/iris.csv").then((data) => { 

	//Petal Length vs Sepal Length scatter
    const MAX_Y1 = d3.max(data, (d) => { return parseFloat(d.Petal_Length); });
	const MAX_X1 = d3.max(data, (d) => { return parseFloat(d.Sepal_Length); });
	

	//Create scales
	const X_SCALE = d3.scaleLinear() 
	                    .domain([0, (MAX_X1 + 2)]) 
	                    .range([0, VIS_WIDTH]); 
	const Y_SCALE = d3.scaleLinear() 
	                    .domain([0, (MAX_Y1 + 2)]) 
	                    .range([VIS_HEIGHT, 0]); 

    const color = d3.scaleOrdinal()
                        .domain(["setosa", "versicolor", "virginica"])
                        .range(["red", "blue", "green"]);

	   //Append svg
        var point1 = FRAME1.append("g")
        .   selectAll("point")  
            .data(data) 
            .enter()       
            .append("circle")  
            .attr("cx", (d) => { return (X_SCALE(d.Sepal_Length) + MARGINS.left); }) 
            .attr("cy", (d) => { return (Y_SCALE(d.Petal_Length) + MARGINS.bottom); })
            .attr("r", 5)
            .style('opacity', 0.5)
            .style("fill", (d) => {return color(d.Species);})
            .attr("class", "point")
           

        //X axis
    	FRAME1.append("g") 
                .attr("transform", "translate(" + MARGINS.left + 
                   "," + (VIS_HEIGHT + MARGINS.top) + ")") 
                .call(d3.axisBottom(X_SCALE)) 
                .attr("font-size", '7px'); 

        //Y axis
        FRAME1.append("g") 
            .attr("transform", "translate(" + (MARGINS.left) + 
                 "," + (MARGINS.top) + ")") 
            .call(d3.axisLeft(Y_SCALE)) 
            .attr("font-size", '10px');
    
        //Petal Width vs Sepal Width scatter
        const MAX_X2 = d3.max(data, (d) => { return parseFloat(d.Sepal_Width); });
        const MAX_Y2 = d3.max(data, (d) => { return parseFloat(d.Petal_Width); });
         
        const X_SCALE2 = d3.scaleLinear() 
                                 .domain([0, (MAX_X2 + 2)]) 
                                 .range([0, VIS_WIDTH]); 
        const Y_SCALE2 = d3.scaleLinear() 
                                 .domain([0, (MAX_Y2 + 2)]) 
                                 .range([VIS_HEIGHT, 0]);

        
    
        var point2 = FRAME2.append("g")
            .selectAll("circle")  
            .data(data) 
            .enter()       
            .append("circle")  
            .attr("cx", (d) => { return (X_SCALE2(d.Sepal_Width) + MARGINS.left); }) 
            .attr("cy", (d) => { return (Y_SCALE2(d.Petal_Width) + MARGINS.bottom); })
            .attr("r", 5)
            .style('opacity', 0.5)
            .style("fill", (d) => {return color(d.Species); })
            .attr("class", "point")
    
        
    //BRUSH constant
    const BRUSH = d3.brush()
                        .extent([ [0,0], [FRAME_WIDTH,FRAME_HEIGHT] ])
                        .on("start brush", brushed);
       

    function brushed(event) {

        
        const selection = event.selection;

        //Highlighting
        point2.classed("selectedPoint", (d) => { return Been_Brushed(selection, X_SCALE2(d.Sepal_Width) + MARGINS.left, Y_SCALE2(d.Petal_Width) + MARGINS.bottom ); });
        point1.classed("selectedPoint", (d) => { return Been_Brushed(selection, X_SCALE2(d.Sepal_Width) + MARGINS.left, Y_SCALE2(d.Petal_Width) + MARGINS.bottom ); });
        bars.classed("selectedPoint", (d) => { return Been_Brushed(selection, X_SCALE2(d.Sepal_Width) + MARGINS.left, Y_SCALE2(d.Petal_Width) + MARGINS.bottom ); });
            
       
       }; 
    
    //Finds points in frame
    function Been_Brushed(brush_coords, cx, cy) {
       var x0 = brush_coords[0][0],
           x1 = brush_coords[1][0],
           y0 = brush_coords[0][1],
           y1 = brush_coords[1][1];
      return x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1;  
     };

       
  

    FRAME2.call(BRUSH);

	FRAME2.append("g") 
            .attr("transform", "translate(" + MARGINS.left + 
               "," + (VIS_HEIGHT + MARGINS.top) + ")") 
            .call(d3.axisBottom(X_SCALE)) 
            .attr("font-size", '7px'); 

     FRAME2.append("g") 
        .attr("transform", "translate(" + (MARGINS.left) + 
             "," + (MARGINS.top) + ")") 
        .call(d3.axisLeft(Y_SCALE)) 
        .attr("font-size", '10px');

	const MAX_AMT = 50;


    //Y axis scale
	const AMT_SCALE = d3.scaleLinear() 
	                    .domain([MAX_AMT + 10, 0]) 
	                    .range([0, VIS_HEIGHT]); 

	// create x axis scale based on category names
    const CATEGORY_SCALE = d3.scaleBand() 
                .domain(data.map((d) => { return d.Species; })) 
                .range([0, VIS_WIDTH])
                .padding(.2); 


    // plot bar based on data with rectangle svgs 
	var bars = FRAME3.selectAll("bar")  
        .data(data) 
        .enter()       
        .append("rect")  
          .attr("y", (d) => { return AMT_SCALE(MAX_AMT) + MARGINS.bottom; }) 
          .attr("x", (d) => { return CATEGORY_SCALE(d.Species) + MARGINS.left;}) 
          .attr("height", (d) => { return VIS_HEIGHT - AMT_SCALE(MAX_AMT); })
          .attr("width", CATEGORY_SCALE.bandwidth())
          .style("fill", (d) => {return color(d.Species); })
          .attr("class", "bar");

	 FRAME3.append("g") 
        .attr("transform", "translate(" + MARGINS.left + 
              "," + (VIS_HEIGHT + MARGINS.top) + ")") 
        .call(d3.axisBottom(CATEGORY_SCALE))
          .attr("font-size", '20px'); 

	FRAME3.append("g") 
	      .attr("transform", "translate(" + (MARGINS.left) + 
	            "," + (MARGINS.top) + ")") 
	      .call(d3.axisLeft(AMT_SCALE).ticks(10)) 
	        .attr("font-size", '20px');


        
});