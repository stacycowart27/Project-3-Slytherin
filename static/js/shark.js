console.log("js loaded");

d3.json("shark_attacks.incidents.json").then((data) => {
    //console.log(data)
    let activities = data.map(attack => attack.Activity);
    console.log(activities);
    let activitycounter = {};
    activities.forEach(item =>{
        if(activitycounter[item])
            activitycounter[item] += 1;
        else
            activitycounter[item]= 1;
    });
    //console.log(activitycounter)
    let sortedactivities = Object.fromEntries(Object.entries(activitycounter).sort((a,b)=>b[1]-a[1]));
    console.log(sortedactivities);
    let activitylist = Object.keys(sortedactivities)
    let activitycounts = Object.values(sortedactivities)
    let trace = {
        x: activitycounts.slice(15),
        y: activitylist.slice(15),
        orientation: 'h',
        type: 'bar'                               
    };
    let data01 = [trace];
    let layout = {
        title: 'Top 15 Shark Attack Activities'
    };
    Plotly.newPlot('bar',data01, layout);
})