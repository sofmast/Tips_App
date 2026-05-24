const defaultDevices = [

    {
        id:'OXY-102',
        device:'O2 Cylinder',
        patient:'John Banda',
        staff:'Nurse Mercy',
        ward:'ICU',
        used:'19 May 2026 - 09:30',
        returned:'--',
        status:'In Use'
    },

    {
        id:'VENT-210',
        device:'Ventilator',
        patient:'Sarah Phiri',
        staff:'Dr. Tembo',
        ward:'Ward B',
        used:'18 May 2026 - 14:00',
        returned:'18 May 2026 - 18:20',
        status:'Returned'
    },

    {
        id:'OXY-115',
        device:'Portable Oxygen',
        patient:'Peter Zulu',
        staff:'Nurse Chola',
        ward:'Emergency',
        used:'19 May 2026 - 11:10',
        returned:'--',
        status:'In Use'
    }

];

/*

    Logged in user
    Replace this with your real auth system later.

    Example after login:

    localStorage.setItem('loggedUser', JSON.stringify({
        name:'Charles Banda'
    }))

*/

if(!localStorage.getItem('loggedUser')){

    localStorage.setItem('loggedUser', JSON.stringify({
        name:'Nurse Mercy'
    }));

}

const loggedUser = JSON.parse(localStorage.getItem('loggedUser'));

let devices = JSON.parse(localStorage.getItem('officeDevices')) || defaultDevices;

function saveDevices(){
    localStorage.setItem('officeDevices', JSON.stringify(devices));
}

saveDevices();

const table = document.getElementById('deviceTable');
const searchInput = document.getElementById('searchInput');
const deviceFilter = document.getElementById('deviceFilter');
const statusFilter = document.getElementById('statusFilter');

const modal = document.getElementById('recordModal');
const openModalBtn = document.getElementById('openModalBtn');
const closeModalBtn = document.getElementById('closeModalBtn');
const form = document.getElementById('recordForm');

const staffInput = document.getElementById('staffName');
staffInput.value = loggedUser.name;

function renderDevices(){

    const search = searchInput.value.toLowerCase();
    const deviceValue = deviceFilter.value;
    const statusValue = statusFilter.value;

    table.innerHTML = '';

    const filtered = devices.filter(item => {

        const matchesSearch =
            item.device.toLowerCase().includes(search) ||
            item.staff.toLowerCase().includes(search) ||
            item.patient.toLowerCase().includes(search);

        const matchesDevice =
            deviceValue === 'all' || item.device === deviceValue;

        const matchesStatus =
            statusValue === 'all' || item.status === statusValue;

        return matchesSearch && matchesDevice && matchesStatus;

    });

    filtered.forEach(item => {

        let statusClass = '';

        if(item.status === 'In Use'){
            statusClass = 'inuse';
        }
        else if(item.status === 'Returned'){
            statusClass = 'returned';
        }
        else{
            statusClass = 'maintenance';
        }

        table.innerHTML += `

            <tr>
                <td>${item.id}</td>
                <td>${item.device}</td>
                <td>${item.patient}</td>
                <td>${item.staff}</td>
                <td>${item.ward}</td>
                <td>${item.used}</td>
                <td>${item.returned}</td>
                <td>
                    <span class="status ${statusClass}">
                        ${item.status}
                    </span>
                </td>
            </tr>

        `;

    });

}

renderDevices();

searchInput.addEventListener('input', renderDevices);
deviceFilter.addEventListener('change', renderDevices);
statusFilter.addEventListener('change', renderDevices);

openModalBtn.addEventListener('click', () => {
    modal.classList.add('active');
});

closeModalBtn.addEventListener('click', () => {
    modal.classList.remove('active');
});

window.addEventListener('click', (e) => {
    if(e.target === modal){
        modal.classList.remove('active');
    }
});

form.addEventListener('submit', (e) => {

    e.preventDefault();

    const newDevice = {
        id:document.getElementById('deviceId').value,
        device:document.getElementById('deviceType').value,
        patient:document.getElementById('patientName').value,
        staff:loggedUser.name,
        ward:document.getElementById('wardName').value,
        used:new Date().toLocaleString(),
        returned:'--',
        status:document.getElementById('statusName').value
    };

    devices.unshift(newDevice);

    saveDevices();

    renderDevices();

    modal.classList.remove('active');

    form.reset();

});