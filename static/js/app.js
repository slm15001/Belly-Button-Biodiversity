function buildMetadata(sample) {
  var metadata_url = `/metadata/${sample}`;
  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  d3.json(metadata_url).then(successHandle).catch(errorHandle)
  
  function successHandle(results) {
    var sample_metadata = d3.select("#sample-metadata");
    sample_metadata.html("");

    Object.entries(results).forEach(result => {
      let key = result[0]
      let value = result[1]
    var row = sample_metadata.append("p");
    row.text(`${key}: ${value}`);
  });
  }

  function errorHandle(error) {
    console.log(`error = ${error}`);
  };
};

//build charts

function buildCharts(sample) {

  d3.json(`/samples/${sample}`).then(data => {
    let bubbleSampleValues = data.sample_values;
    let otuIds = data.otu_ids;
    let otuLabels = data.otu_labels;

      console.log(bubbleSampleValues);
      console.log(otuIds);
      console.log(otuLabels);
      let trace1 = {
        x: otuIds,
        y: bubbleSampleValues,
        text: otuLabels,
        mode: 'markers',
        marker: {
          color: otuIds,
          colorscale: 'Earth',
        size: bubbleSampleValues
        }
      };
      let bubbleData = [trace1];
      let layout = {
        title: 'OTU vs Sample Values',
        showlegend: false,
      };
      
      Plotly.newPlot('bubble', bubbleData, layout);
  });
  // @TODO: Use `d3.json` to fetch the sample data for the plots
    // @TODO: Build a Bubble Chart using the sample data
    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    d3.json(`/samples/${sample}`).then(data => {
      let sampleValues = data.sample_values;
      let otuIds = data.otu_ids;
      let otuLabels = data.otu_labels;

    let trace2 ={
      values: sampleValues.slice(0,10),
      lables: otuLabels.slice(0,10),
      type: 'pie'
    };
    let pieData = [trace2]

    let pieLayout = {
      margin: {t:0, 1:0},
      showlegend: false
    };

    Plotly.newPlot('pie', pieData, pieLayout);
});
}
function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
