const socket = io();

socket.on(
    'connect',
    () => {

        console.log(
            'Socket.IO Terhubung'
        );

    }
);
const ctx =
    document.getElementById("waterChart");

const chart =
    new Chart(ctx, {

        type: "line",

        data: {

            labels: [],

            datasets: [{

                label: "Tinggi Air (cm)",

                data: [],

                tension: 0.3,

                fill: false

            }]

        },

        options: {

            responsive: true,

            animation: false,

            scales: {

                y: {

                    beginAtZero: true,

                    min: 0,

                    max: 35

                }

            }

        }

    });

async function ambilData() {

    const response =
        await fetch(
            "/data"
        );

    const data =
        await response.json();

    const statusElement =
        document.getElementById("status");

    statusElement.innerText =
        data.status;

    statusElement.className = "";
    if (data.status === "AMAN") {

        statusElement.classList.add(
            "aman"
        );

    }
    else if (
        data.status === "SIAGA"
    ) {

        statusElement.classList.add(
            "siaga"
        );

    }
    else {

        statusElement.classList.add(
            "bahaya"
        );

    }
const alertBox =
    document.getElementById(
        "alertBox"
    );
const alarmSound =
    document.getElementById(
        "alarmSound"
    );
if(
    data.status === "BAHAYA"
){

    alertBox.style.display =
        "block";

    document.body.classList.add(
        "dangerBackground"
    );

    if(alarmSound.paused){

    alarmSound.play();

}

}
else{

    alertBox.style.display =
        "none";

    document.body.classList.remove(
        "dangerBackground"
    );

    alarmSound.pause();

    alarmSound.currentTime = 0;

}
    if (data.status === "AMAN") {

        statusElement.style.color =
            "green";

    }
    else if (
        data.status === "WASPADA"
    ) {

        statusElement.style.color =
            "orange";

    }
    else {

        statusElement.style.color =
            "red";

    }

    document.getElementById("level")
        .innerText =
        data.waterLevel + " cm";

    document.getElementById("speed")
        .innerText =
        data.waterSpeed + " cm/s";

    document.getElementById("time")
        .innerText =
        new Date()
            .toLocaleTimeString();

    chart.data.labels.push(
        new Date()
            .toLocaleTimeString()
    );

    chart.data.datasets[0]
        .data
        .push(data.waterLevel);

    if (
        chart.data.labels.length > 20
    ) {

        chart.data.labels.shift();

        chart.data.datasets[0]
            .data
            .shift();

    }

    chart.update();

}

async function ambilHistory() {

    const response =
        await fetch(
            "/history"
        );

    const history =
        await response.json();
if(history.length > 0){

    const levels =
        history.map(
            item =>
            item.waterLevel
        );

    document
        .getElementById(
            "maxLevel"
        )
        .innerText =
        Math.max(
            ...levels
        );

    document
        .getElementById(
            "minLevel"
        )
        .innerText =
        Math.min(
            ...levels
        );

}
    const tbody =
        document.querySelector(
            "#historyTable tbody"
        );

    tbody.innerHTML = "";

    history
        .slice(-20)
        .reverse()
        .forEach(item => {

 let warnaStatus = "";

if(item.status === "AMAN"){

    warnaStatus = "aman";

}
else if(
    item.status === "SIAGA"
){

    warnaStatus = "siaga";

}
else{

    warnaStatus = "bahaya";

}

tbody.innerHTML += `

<tr>

    <td>${item.time}</td>

    <td class="${warnaStatus}">
        ${item.status}
    </td>

    <td>${item.waterLevel}</td>

    <td>${item.waterSpeed}</td>

</tr>

`;

        });

}

ambilData();
ambilHistory();

setInterval(() => {

    ambilData();

}, 1000);

setInterval(() => {

    ambilHistory();

}, 5000);