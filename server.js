const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());
app.use(
    express.static(
        __dirname
    )
);
let sensorData = {

    status: "AMAN",

    waterLevel: 0,

    waterSpeed: 0

};

let historyData = [];
const csvFile = "./history.csv";

if (!fs.existsSync(csvFile)) {

    fs.writeFileSync(
        csvFile,
        "time,status,waterLevel,waterSpeed\n"
    );

}
app.get('/', (req, res) => {

    res.sendFile(
        path.join(
            __dirname,
            'index.html'
        )
    );

});
app.get('/data', (req, res) => {

    res.json(sensorData);

});

app.get('/history', (req, res) => {

    res.json(historyData);

});

app.post('/update', (req, res) => {

    sensorData = req.body;

    historyData.push({

        time:
            new Date()
                .toLocaleTimeString(),

        status:
            sensorData.status,

        waterLevel:
            sensorData.waterLevel,

        waterSpeed:
            sensorData.waterSpeed

    });
    const csvRow =

    `${new Date()
        .toLocaleTimeString()},` +

    `${sensorData.status},` +

    `${sensorData.waterLevel},` +

    `${sensorData.waterSpeed}\n`;

fs.appendFileSync(

    csvFile,

    csvRow

);
    if (historyData.length > 100) {

        historyData.shift();

    }

    console.log(
        "DATA BARU:",
        sensorData
    );

    res.json({
        success: true
    });

});

app.get(
    '/download',
    (req,res)=>{

    res.download(
        csvFile
    );

});

const PORT =
    process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log(
        `SERVER BERJALAN DI PORT ${PORT}`
    );

});