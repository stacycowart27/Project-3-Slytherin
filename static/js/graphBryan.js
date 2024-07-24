function buildPieChart() {
    d3.json("shark_attacks.incidents.json").then((data) => {

        // Extracting the fatality status from each attack
        let fatalityStatus = data.map(attack => 
            (typeof attack.Injury === 'string' && attack.Injury.toLowerCase().includes("fatal")) ? "Fatal" : "Non-Fatal"
        );

        // Counting each fatality status
        let fatalityCounter = {
            "Fatal": 0,
            "Non-Fatal": 0
        };

        fatalityStatus.forEach(status => {
            fatalityCounter[status] += 1;
        });

        // get the data for the pie chart
        let data01 = [{
            values: [fatalityCounter["Fatal"], fatalityCounter["Non-Fatal"]],
            labels: ["Fatal", "Non-Fatal"],
            type: 'pie'
        }];

        let layout = {
            title: 'Fatal & Non-Fatal Shark Attacks'
        };

        Plotly.newPlot('pie', data01, layout);
    });
}

// Call function to make the pie chart
buildPieChart();


