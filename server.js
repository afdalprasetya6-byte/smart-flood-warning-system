console.log("SCRIPT BARU BERHASIL DIMUAT");
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
    console.log("UPDATE DITERIMA");

    console.log(req.body);
    sensorData = req.body;
    console.log(
    "KIRIM SOCKET:",
    sensorData
);
    io.emit(
    'sensorUpdate',
    sensorData
);
    historyData.push({

        time:
            new Date()
.toLocaleTimeString(
    'id-ID',
    {
        timeZone:
            'Asia/Jakarta'
    }
),

        status:
            sensorData.status,

        waterLevel:
            sensorData.waterLevel,

        waterSpeed:
            sensorData.waterSpeed

    });
    const csvRow =

`${new Date()
    .toLocaleTimeString(
        'id-ID',
        {
            timeZone:
                'Asia/Jakarta'
        }
    )},` +
    `${sensorData.status},` +

    `${sensorData.waterLevel},` +

    `${sensorData.waterSpeed}\n`;

try {

    fs.appendFileSync(
        csvFile,
        csvRow
    );

}
catch(err){

    console.error(
        "Gagal simpan CSV:",
        err
    );

}

try {

    const stats =
        fs.statSync(csvFile);

    if(stats.size > 5 * 1024 * 1024){

        fs.writeFileSync(
            csvFile,
            "time,status,waterLevel,waterSpeed\n"
        );

        console.log(
            "CSV direset karena > 5MB"
        );
    }

}
catch(err){

    console.error(
        "Gagal cek ukuran CSV:",
        err
    );

}
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

const http =
    require('http');

const server =
    http.createServer(app);

const io =
    require('socket.io')(server, {

        cors: {

            origin: "*"

        }

    });

io.on(
    'connection',
    (socket) => {

        console.log(
            'DASHBOARD TERHUBUNG SOCKET.IO'
        );

    }
);
app.get(
    '/health',
    (req,res)=>{

    res.json({

        status:"OK",

        uptime:
            process.uptime(),

        memory:
            process.memoryUsage(),

        timestamp:
            new Date()

    });

});
const PORT =
    process.env.PORT || 3000;

server.listen(PORT, () => {

    console.log(
        `SERVER BERJALAN DI PORT ${PORT}`
    );

});