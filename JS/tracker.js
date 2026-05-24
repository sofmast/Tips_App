/* =========================
   STORAGE
========================= */

const devices = JSON.parse(localStorage.getItem('oxytips_devices')) || [];
const records = JSON.parse(localStorage.getItem('oxytips_records')) || [];

function saveData(){
  localStorage.setItem('oxytips_devices', JSON.stringify(devices));
  localStorage.setItem('oxytips_records', JSON.stringify(records));
}

/* =========================
   ELEMENTS
========================= */

const inventoryTable = document.getElementById('inventoryTable');
const recordsTable = document.getElementById('recordsTable');
const recordsMobile = document.getElementById('recordsMobile');

const inventorySearch = document.getElementById('inventorySearch');
const recordSearch = document.getElementById('recordSearch');
const globalSearch = document.getElementById('globalSearch');

const statusFilter = document.getElementById('statusFilter');
const recordFilter = document.getElementById('recordFilter');

const deviceModal = document.getElementById('deviceModal');
const sidebar = document.getElementById('sidebar');

/* =========================
   HELPERS
========================= */

function formatSearchable(obj){
  return Object.values(obj)
  .join(' ')
  .toLowerCase();
}

function getGlobalSearchValue(){
  return globalSearch.value.trim().toLowerCase();
}

function getBadge(status){

  if(status === 'Available'){
    return 'badge available';
  }

  if(status === 'In Use'){
    return 'badge inuse';
  }

  if(status === 'Maintenance'){
    return 'badge maintenance';
  }

  return 'badge returned';
}

function emptyState(message){
  return `
    <div class="empty-state">
      ${message}
    </div>
  `;
}

/* =========================
   STATS
========================= */

function renderStats(){

  document.getElementById('totalDevices').textContent =
    devices.length;

  document.getElementById('devicesInUse').textContent =
    devices.filter(d => d.status === 'In Use').length;

  document.getElementById('maintenanceDevices').textContent =
    devices.filter(d => d.status === 'Maintenance').length;

  document.getElementById('returnedDevices').textContent =
    records.filter(r => r.activity === 'Returned').length;
}

/* =========================
   INVENTORY
========================= */

function renderInventory(){

  inventoryTable.innerHTML = '';

  const searchText =
    (
      inventorySearch.value +
      ' ' +
      getGlobalSearchValue()
    )
    .toLowerCase()
    .trim();

  const filter = statusFilter.value;

  const filteredDevices = devices.filter(device => {

    const matchesSearch =
      formatSearchable(device).includes(searchText);

    const matchesFilter =
      filter === 'all' || device.status === filter;

    return matchesSearch && matchesFilter;
  });

  if(filteredDevices.length === 0){

    inventoryTable.innerHTML = `
      <tr>
        <td colspan="7">
          ${emptyState('No devices found')}
        </td>
      </tr>
    `;

    return;
  }

  filteredDevices.forEach(device => {

    inventoryTable.innerHTML += `
      <tr>
        <td>${device.id}</td>

        <td>${device.name}</td>

        <td>${device.category}</td>

        <td>
          <span class="${getBadge(device.status)}">
            ${device.status}
          </span>
        </td>

        <td>${device.ward || '-'}</td>

        <td>${device.staff || '-'}</td>

        <td>${device.updated}</td>
      </tr>
    `;
  });

}

/* =========================
   RECORDS
========================= */

function renderRecords(){

  recordsTable.innerHTML = '';
  recordsMobile.innerHTML = '';

  const searchText =
    (
      recordSearch.value +
      ' ' +
      getGlobalSearchValue()
    )
    .toLowerCase()
    .trim();

  const filter = recordFilter.value;

  const filteredRecords = [...records]
  .reverse()
  .filter(record => {

    const matchesSearch =
      formatSearchable(record).includes(searchText);

    const matchesFilter =
      filter === 'all' || record.activity === filter;

    return matchesSearch && matchesFilter;
  });

  if(filteredRecords.length === 0){

    recordsTable.innerHTML = `
      <tr>
        <td colspan="7">
          ${emptyState('No records found')}
        </td>
      </tr>
    `;

    recordsMobile.innerHTML =
      emptyState('No records found');

    return;
  }

  filteredRecords.forEach(record => {

    /* DESKTOP TABLE */

    recordsTable.innerHTML += `
      <tr>

        <td>${record.date}</td>

        <td>${record.deviceId}</td>

        <td>${record.deviceName}</td>

        <td>
          <span class="${getBadge(record.activity)}">
            ${record.activity}
          </span>
        </td>

        <td>${record.staff}</td>

        <td>${record.ward}</td>

        <td>${record.notes || '-'}</td>

      </tr>
    `;

    /* MOBILE CARD */

    recordsMobile.innerHTML += `

      <div class="record-card">

        <div class="record-top">

          <div>

            <div class="record-device">
              ${record.deviceName}
            </div>

            <div class="record-id">
              ${record.deviceId}
            </div>

          </div>

          <span class="${getBadge(record.activity)}">
            ${record.activity}
          </span>

        </div>

        <div class="record-grid">

          <div class="record-item">
            <small>Staff</small>
            ${record.staff}
          </div>

          <div class="record-item">
            <small>Ward</small>
            ${record.ward}
          </div>

          <div class="record-item">
            <small>Date</small>
            ${record.date}
          </div>

          <div class="record-item">
            <small>Activity</small>
            ${record.activity}
          </div>

        </div>

        <div class="record-notes">
          <small>Notes</small>
          ${record.notes || 'No notes'}
        </div>

      </div>

    `;

  });

}

/* =========================
   DEMO DATA
========================= */

function initializeDemoData(){

  if(devices.length === 0){

    devices.push(
      {
        id:'OXY-102',
        name:'Oxygen Cylinder A',
        category:'Oxygen Supply',
        status:'Available',
        ward:'Emergency',
        staff:'Nurse Mary',
        updated:new Date().toLocaleString()
      },
      {
        id:'VEN-205',
        name:'Portable Ventilator',
        category:'Respiratory',
        status:'In Use',
        ward:'ICU',
        staff:'Dr. James',
        updated:new Date().toLocaleString()
      }
    );

    records.push(
      {
        date:new Date().toLocaleString(),
        deviceId:'VEN-205',
        deviceName:'Portable Ventilator',
        activity:'In Use',
        staff:'Dr. James',
        ward:'ICU',
        notes:'Ventilator assigned to ICU'
      }
    );

    saveData();
  }
}

/* =========================
   INITIALIZE
========================= */

initializeDemoData();

renderInventory();
renderRecords();
renderStats();

/* =========================
   ADD DEVICE
========================= */

document.getElementById('deviceForm')
.addEventListener('submit', e => {

  e.preventDefault();

  const device = {
    id:newDeviceId.value.trim(),
    name:newDeviceName.value.trim(),
    category:newCategory.value.trim(),
    status:newStatus.value,
    ward:newWard.value.trim(),
    staff:newStaff.value.trim(),
    updated:new Date().toLocaleString()
  };

  const alreadyExists = devices.some(
    d => d.id.toLowerCase() === device.id.toLowerCase()
  );

  if(alreadyExists){
    alert('Device ID already exists.');
    return;
  }

  devices.push(device);

  records.push({
    date:new Date().toLocaleString(),
    deviceId:device.id,
    deviceName:device.name,
    activity:'Added',
    staff:device.staff || '-',
    ward:device.ward || '-',
    notes:'Device added to inventory'
  });

  saveData();

  renderInventory();
  renderRecords();
  renderStats();

  deviceModal.classList.remove('active');

  e.target.reset();

});

/* =========================
   ACTIVITY FORM
========================= */

document.getElementById('activityForm')
.addEventListener('submit', e => {

  e.preventDefault();

  const activity = {
    date:new Date(activityDate.value).toLocaleString(),
    deviceId:deviceId.value.trim(),
    deviceName:deviceName.value.trim(),
    activity:activityType.value,
    staff:staffName.value.trim(),
    ward:ward.value.trim(),
    notes:notes.value.trim()
  };

  records.push(activity);

  const existingDevice = devices.find(
    d => d.id.toLowerCase() === activity.deviceId.toLowerCase()
  );

  if(existingDevice){

    existingDevice.status = activity.activity;
    existingDevice.staff = activity.staff;
    existingDevice.ward = activity.ward;
    existingDevice.updated = new Date().toLocaleString();

  }

  saveData();

  renderInventory();
  renderRecords();
  renderStats();

  e.target.reset();

});

/* =========================
   SEARCH + FILTERS
========================= */

inventorySearch.addEventListener('input', renderInventory);

recordSearch.addEventListener('input', renderRecords);

globalSearch.addEventListener('input', () => {
  renderInventory();
  renderRecords();
});

statusFilter.addEventListener('change', renderInventory);

recordFilter.addEventListener('change', renderRecords);

/* =========================
   MODAL
========================= */

document.getElementById('openAddDevice').onclick = () => {
  deviceModal.classList.add('active');
};

document.getElementById('closeModal').onclick = () => {
  deviceModal.classList.remove('active');
};

window.addEventListener('click', e => {

  if(e.target === deviceModal){
    deviceModal.classList.remove('active');
  }

});

/* =========================
   NAVIGATION
========================= */

document.querySelectorAll('.nav-btn')
.forEach(btn => {

  btn.addEventListener('click', () => {

    document.querySelectorAll('.nav-btn')
    .forEach(b => b.classList.remove('active'));

    btn.classList.add('active');

    document.querySelectorAll('.page')
    .forEach(page => page.classList.remove('active'));

    document.getElementById(btn.dataset.page)
    .classList.add('active');

    if(window.innerWidth < 900){
      sidebar.classList.remove('active');
    }

  });

});

/* =========================
   MOBILE SIDEBAR
========================= */

document.getElementById('toggleSidebar')
.onclick = () => {
  sidebar.classList.toggle('active');
};

/* =========================
   FOOTER YEAR
========================= */

document.getElementById('year').textContent =
  new Date().getFullYear();