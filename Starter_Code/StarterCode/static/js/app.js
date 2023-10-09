let data;

d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json")
  .then(function (data) {  

    // Populate the dropdown with sample IDs
    let dropdown = d3.select("#selDataset");
    let sampleIds = data.names;    
    sampleIds.forEach(function (id) {
      dropdown.append("option").text(id).property("value", id);
    }); 
    
    // let metadataDiv = d3.select("#sample-metadata");
    // metadataDiv.html(""); // Clears any previous content
  
    subjects = data.samples;
    metadata = data.metadata;
    //console.log("subjects", subjects);

    //Initial rendering of the chart
    updateBarChart(sampleIds[0], data);
    updateBubbleChart(sampleIds[0], data);
    updateMetadata(sampleIds[0], data);

  })
  .catch(function (error) {
    console.error("Error loading JSON file:", error);
  });


function optionChanged(selectedValue) {    
    updateBarChart(selectedValue, data);
    updateBubbleChart(selectedValue, data);
    updateMetadata(selectedValue, data)
    console.log("Selected value:", selectedValue);
}


function updateBarChart(selectedValue, data) {
    
    let selectedId = String(selectedValue);
    let sampleData = subjects.find(sample => sample.id == selectedId);
  
    if (!sampleData) {
      console.error(`Sample with ID ${selectedId} not found.`);
      return;
    }
    // Sort the data to get the top 10 OTUs
    let sortedData = sampleData.sample_values.slice(0, 10).reverse();
    let otuIds = sampleData.otu_ids.slice(0, 10).reverse();
    let otuLabels = sampleData.otu_labels.slice(0, 10).reverse();

    // Create the horizontal bar chart using Plotly
    let trace = {
        x: sortedData,
        y: otuIds.map(id => `OTU ${id}`),
        text: otuLabels,
        type: 'bar',
        orientation: 'h'
    };

    let barData = [trace];

    let layout = {
        title: `Top 10 OTUs for Sample ${selectedId}`,
        xaxis: { title: 'Sample Values' },
        yaxis: { title: 'OTU IDs' }
    };
    

    Plotly.newPlot('bar',barData, layout);
} 


function updateBubbleChart(selectedValue, data) {
    let selectedId = String(selectedValue);
    let sampleData = subjects.find(sample => sample.id == selectedId); 
    let otuIds = sampleData.otu_ids
    let sampleValues = sampleData.sample_values
    let otuLabels = sampleData.otu_labels
    let maxValue = Math.max(...sampleValues);
    let maxRadius = maxValue *2

    let trace = {
        y: sampleValues,
        x: otuIds,//.map(id => `OTU ${id}`),
        mode : 'markers',
        marker: {
            size: sampleValues,
            color: otuIds,
            colorscale: 'Viridis', 
            colorbar: {
              title: 'OTU IDs',
            },
          },
        text: otuLabels,

    };

    let bubbleData = [trace];

    let layout = {
        title: `Otu Detection Frequency`,
        yaxis: {  title: 'Sample Values' },
        xaxis: { title: 'OTU IDs' }
    };
    

    Plotly.newPlot('bubble',bubbleData, layout);
}

function updateMetadata(selectedValue) {
    let metadataDiv = d3.select("#sample-metadata");
    let selectedId = String(selectedValue);
    let sampleData = metadata.find(sample => sample.id == selectedId);
    metadataDiv.html(""); // Clears any previous content   

    // Use D3 to bind the metadata object to a selection and append div elements
    metadataDiv
    .selectAll("div")
    .data(d3.entries(sampleData))
    .enter()
    .append("div")
    .text(function (d) {
        return `${d.key}: ${d.value}`;
    });
}    