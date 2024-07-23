console.log("js loaded");

// Initialize function to load data and set up initial state
function init() {
    console.log("Initializing...");

    d3.json("shark_attacks.incidents.json").then((data) => {
        console.log("Data loaded:", data);

        // Populate dropdown with incident IDs
        function addList() {
            var select = document.getElementById("selDataset");
            for (let i = 0; i < data.length; i++) {
                var option = document.createElement('option');
                option.text = option.value = data[i].id;
                select.add(option, 0);
            }
        }
        addList();

        // Plot top 15 shark attack activities
        let activities = data.map(attack => attack.Activity);
        let activityCounter = {};
        activities.forEach(item => {
            activityCounter[item] = (activityCounter[item] || 0) + 1;
        });
        let sortedActivities = Object.fromEntries(Object.entries(activityCounter).sort((a, b) => b[1] - a[1]));
        let activityList = Object.keys(sortedActivities).slice(0, 15);
        let activityCounts = Object.values(sortedActivities).slice(0, 15);
        let trace = {
            x: activityCounts,
            y: activityList,
            orientation: 'h',
            type: 'bar'
        };
        let data01 = [trace];
        let layout = {
            title: 'Top 15 Shark Attack Activities'
        };
        Plotly.newPlot('bar', data01, layout);

        // Plot shark attack types
        let types = ['Unprovoked', 'Provoked', 'Questionable', 'Watercraft', 'Sea Disaster'];
        plotTypes(data, types);
    }).catch((error) => {
        console.error("Error loading data:", error);
    });
}

// Function to plot types of shark attacks
function plotTypes(sharkData, types) {
    let typeCount = {
        'Unprovoked': 0,
        'Provoked': 0,
        'Questionable': 0,
        'Watercraft': 0,
        'Sea Disaster': 0
    };

    // Count occurrences of each type
    for (let j = 0; j < sharkData.length; j++) {
        if (sharkData[j].Type in typeCount) {
            typeCount[sharkData[j].Type] += 1;
        }
    }

    // Extract counts and plot using Plotly
    let counts = Object.values(typeCount);
    let trace = {
        x: types,
        y: counts,
        type: "bar"
    };

    let data = [trace];

    let layout = {
        title: "Shark Attacks by Type"
    };

    Plotly.newPlot("plot", data, layout);  // Assuming you have a <div id="plot"></div> in your HTML
}

// Function to handle dropdown selection change
function optionChanged(newid) {
    console.log("Dropdown selected:", newid);
    d3.json("shark_attacks.incidents.json").then((data) => {
        let attackdata = data.filter(sharkdata => sharkdata.id == newid);
        attackdata = attackdata[0];
        delete attackdata["_id"];
        console.log("Selected incident data:", attackdata);
        let panel = d3.select("#sample-metadata");
        panel.html("");
        for (item in attackdata) {
            panel.append("h5").text(`${item}: ${attackdata[item]}`);
        }
    }).catch((error) => {
        console.error("Error fetching incident data:", error);
    });
}

init(); // Call init function to start everything
