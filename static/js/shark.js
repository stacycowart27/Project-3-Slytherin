console.log("js loaded");

function init() {
    console.log("Initializing...");

    d3.json("shark_attacks.incidents.json").then((data) => {
        console.log("Data loaded:", data);

        function addList() {
            var select = document.getElementById("selDataset");
            for (let i = 0; i < data.length; i++) {
                var option = document.createElement('option');
                option.text = option.value = data[i].id;
                select.add(option, 0);
            }
        }
        addList();

        let types = ['Unprovoked', 'Provoked', 'Questionable', 'Watercraft', 'Sea Disaster'];
        plotTypes(data, types);
    }).catch((error) => {
        console.error("Error loading data:", error);
    });
}

function plotTypes(sharkData, types) {
    let typeCount = {
        'Unprovoked': 0,
        'Provoked': 0,
        'Questionable': 0,
        'Watercraft': 0,
        'Sea Disaster': 0
    };

    for (let j = 0; j < sharkData.length; j++) {
        if (sharkData[j].Type in typeCount) {
            typeCount[sharkData[j].Type] += 1;
        }
    }

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

    Plotly.newPlot("plot", data, layout);
}

function optionChanged(newid) {
    console.log("Dropdown selected:", newid);
    d3.json("shark_attacks.incidents.json").then((data) => {
        let attackdata = data.find(sharkdata => sharkdata.id == newid);
        if (attackdata) {
            delete attackdata["_id"];
            console.log("Selected incident data:", attackdata);
            let panel = d3.select("#sample-metadata");
            panel.html("");
            for (let item in attackdata) {
                panel.append("h5").text(`${item}: ${attackdata[item]}`);
            }
        } else {
            console.error("Incident ID not found:", newid);
        }
    }).catch((error) => {
        console.error("Error fetching incident data:", error);
    });
}

init();
