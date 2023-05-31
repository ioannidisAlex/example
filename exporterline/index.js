const { timeLog } = require("console");
const fs = require("fs");
const chartExporter = require("highcharts-export-server");
// Initialize the exporter
chartExporter.initPool();
// Chart details object specifies chart type and data to plot

const csvdata = `Titlos
Subtitlos
Xaksonas
Yaksonas
"Category","Installation & Developers","Manufacturing","Sales & Distribution","Operations & Maintenance","Other"
2010,43934,24916,11744,,21908
2011,48656,37941,30000,,5548
2012,65165,29742,16005,,8105
2013,81827,29851,19771,,11248
2014,112143,32490,20185,,8989
2015,142383,30282,24377,,11816
2016,171533,38121,32147,,18274
2017,165174,36885,30912,,17300
2018,155157,33726,29243,11164,13053
2019,161454,34243,29213,11218,11906
2020,154610,31050,25663,10077,10073
`

const lines = csvdata.split(/\r?\n/);
const title = lines[0];
const subtitle = lines[1];
const xAxis = lines[2];
const yAxis = lines[3];
lines.splice(0, 4);
const chartdata = lines.join('\n');
const chartDetails = {
    type: "png",
    options: {
        chart: {
            type: 'line'

        },
        title: {
            text: title
        },
        legend: {
            enabled: true
        },
        subtitle: {
            text: subtitle
        },
        data: {
            csv: chartdata,
        },
        yAxis: {
            title: {
                text: yAxis
            }
        },

        xAxis: {
            title: {
                text: xAxis
            }
        },

    }
};

chartExporter.export(chartDetails, (err, res) => {
    // Get the image data (base64)
    let imageb64 = res.data;

    // Filename of the output
    let outputFile = "line.png";

    // Save the image to file
    fs.writeFileSync(outputFile, imageb64, "base64", function (err) {
        if (err) console.log(err);
    });

    console.log("Saved image!");
    chartExporter.killPool();
});