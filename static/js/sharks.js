//get an array of types
let types = ['Unprovoked','Provoked','Questionable', 'Watercraft', 'Sea Disaster']
//function to plot a count of types
function plotTypes(sharkData, types)
{
    let typeCount = {
        'Unprovoked': 0,
        'Provoked': 0,
        'Questionable': 0,
        'Watercraft': 0,
        'Sea Disaster': 0
    };
    for (let j = 0; j < sharkData.length; j++){
        //console.log(sharkData[j].Type)
        if (sharkData[j].Type in typeCount){
            typeCount[sharkData[j].Type] += 1
        }
    }
    console.log(typeCount)
    let counts = Object.values(typeCount)
    console.log(counts)
    let trace = {
        x: types,
        y: counts,
        type: "bar"
    };

    let data = [trace];

    let layout = {
        title: "Shark Attacks by Type" 
    };

    Plotly.newPlot("plot", data, layout)
}

plotTypes(sharkData, types);