function buildMetadata(sample) {
  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  const url = "/personInfoUrl/"+ personId;
  var data = d3.json(url).then(
      (personInfoValues) => {
    // Use d3 to select the panel with id of `#sample-metadata`
    // Use `.html("") to clear any existing metadata
    var panel = d3.select('body').select('#personInfoHtmlBox');
    panel.html("");
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(personInfoValues).forEach((personInfoValue)=>{
      panel.append("div")
      .text(personInfoValue[0]+ ": " + personInfoValue[1]);
    }) 
}
);
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  const url = "/samples/"+ sample;
 
   
  d3.json(`/samples/${sample}`).then(data => {
    var sampleValues = data.sample_values;
    var otuIds = data.otu_ids;
    var otuLabels = data.otu_labels;

      console.log(sampleValues);
      console.log(otuIds);
      console.log(otuLabels);

      var trace1 = {
       x: otuIds,
       y: sampleValues,
       labels: otuLabels,
       mode: 'markers',
       marker: {
          color: otuIds,
          colorscale: 'Earth',
          size: sampleValues
        }
    };

      var data = [trace1];

      var layout = {
        title: 'OTU vs Sample Values',
        showlegend: false,
      };

      Plotly.newPlot('bubble', data, layout);

  });


 // // @TODO: Build a Bubble Chart using the sample data
 var trace1 = {
  x: otu_ids,
  y: sample_values,
  text: otu_labels,
  mode: 'markers',
  marker: {
    color: otu_ids,
    colorscale: [
      ['0.0', 'rgb(165,0,38)'],
      ['0.111111111111', 'rgb(215,48,39)'],
      ['0.222222222222', 'rgb(244,109,67)'],
      ['0.333333333333', 'rgb(253,174,97)'],
      ['0.444444444444', 'rgb(254,224,144)'],
      ['0.555555555556', 'rgb(224,243,248)'],
      ['0.666666666667', 'rgb(171,217,233)'],
      ['0.777777777778', 'rgb(116,173,209)'],
      ['0.888888888889', 'rgb(69,117,180)'],
      ['1.0', 'rgb(49,54,149)']
    ],
  size: sample_values
  }
};
var data = [trace1];
var layout = {
  // title: 'Bubble Chart Hover Text',
  showlegend: false,
  height: 600,
  width: 1000,
  xaxis:{
    title: 'Otu ID',
    titlefont:{
      size: 18,
      color: '#7f7f7f'
    },
  yaxis:{
    title: 'Sample Values',
    titlefont:{
      size: 18,
      color: '#7f7f7f'
    }
  }
  }
};
Plotly.newPlot('bubble', data, layout);
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
