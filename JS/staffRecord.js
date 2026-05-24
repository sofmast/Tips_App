/* =========================
   STORAGE
========================= */

let staffRecords = JSON.parse(
  localStorage.getItem('oxytips_staff')
) || [];

/* =========================
   ELEMENTS
========================= */

const recordGrid = document.getElementById('recordGrid');
const searchInput = document.getElementById('searchInput');
const roleFilter = document.getElementById('roleFilter');

const totalStaff = document.getElementById('totalStaff');
const doctorCount = document.getElementById('doctorCount');
const nurseCount = document.getElementById('nurseCount');
const adminCount = document.getElementById('adminCount');

const modal = document.getElementById('modal');
const modalBody = document.getElementById('modalBody');
const closeModal = document.getElementById('closeModal');

/* =========================
   STATS
========================= */

function updateStats(){

  totalStaff.textContent = staffRecords.length;

  doctorCount.textContent = staffRecords.filter(
    staff => staff.professional?.profession === 'Doctor'
  ).length;

  nurseCount.textContent = staffRecords.filter(
    staff => staff.professional?.profession === 'Nurse'
  ).length;

  adminCount.textContent = staffRecords.filter(
    staff => staff.account?.role === 'Administrator'
  ).length;

}

/* =========================
   DISPLAY RECORDS
========================= */

function renderRecords(data){

  if(data.length === 0){

    recordGrid.innerHTML = `
      <div class="empty">
        <h3>No Staff Records Found</h3>
        <p>
          No matching staff records available in local storage.
        </p>
      </div>
    `;

    return;

  }

  recordGrid.innerHTML = data.map(staff => `

    <div class="staff-card">

      <div class="staff-header">

        <div class="staff-avatar">
          ${staff.personal.firstName.charAt(0)}
        </div>

        <div class="staff-name">
          ${staff.personal.firstName} ${staff.personal.lastName}
        </div>

        <div class="staff-role">
          ${staff.professional.profession}
        </div>

      </div>

      <div class="staff-body">

        <div class="info">
          <div class="label">Department</div>
          <div class="value">
            ${staff.professional.department}
          </div>
        </div>

        <div class="info">
          <div class="label">Phone</div>
          <div class="value">
            ${staff.contact.phone}
          </div>
        </div>

        <div class="info">
          <div class="label">Email</div>
          <div class="value">
            ${staff.contact.email}
          </div>
        </div>

        <div class="info">
          <div class="label">Role</div>
          <div class="value">
            ${staff.account.role}
          </div>
        </div>

      </div>

      <div class="actions">

        <button 
          class="btn view-btn"
          onclick="viewStaff('${staff.id}')"
        >
          View Details
        </button>

        <button 
          class="btn delete-btn"
          onclick="deleteStaff('${staff.id}')"
        >
          Delete
        </button>

      </div>

    </div>

  `).join('');

}

/* =========================
   SEARCH
========================= */

function searchRecords(){

  const search = searchInput.value.toLowerCase();
  const role = roleFilter.value;

  const filtered = staffRecords.filter(staff => {

    const fullName =
      `${staff.personal.firstName} ${staff.personal.lastName}`.toLowerCase();

    const profession =
      staff.professional.profession.toLowerCase();

    const department =
      staff.professional.department.toLowerCase();

    const email =
      staff.contact.email.toLowerCase();

    const username =
      staff.account.username.toLowerCase();

    const matchesSearch =

      fullName.includes(search) ||
      profession.includes(search) ||
      department.includes(search) ||
      email.includes(search) ||
      username.includes(search);

    const matchesRole =
      role === '' || staff.account.role === role;

    return matchesSearch && matchesRole;

  });

  renderRecords(filtered);

}

/* =========================
   VIEW STAFF
========================= */

function viewStaff(id){

  const staff = staffRecords.find(item => item.id === id);

  if(!staff) return;

  modal.classList.add('active');

  modalBody.innerHTML = `

    <div class="section">

      <h3>Personal Information</h3>

      <div class="detail-grid">

        <div class="detail-item">
          <span class="title">First Name</span>
          <span class="text">${staff.personal.firstName}</span>
        </div>

        <div class="detail-item">
          <span class="title">Last Name</span>
          <span class="text">${staff.personal.lastName}</span>
        </div>

        <div class="detail-item">
          <span class="title">Gender</span>
          <span class="text">${staff.personal.gender}</span>
        </div>

        <div class="detail-item">
          <span class="title">Date of Birth</span>
          <span class="text">${staff.personal.dob}</span>
        </div>

      </div>

    </div>

    <div class="section">

      <h3>Professional Information</h3>

      <div class="detail-grid">

        <div class="detail-item">
          <span class="title">Profession</span>
          <span class="text">${staff.professional.profession}</span>
        </div>

        <div class="detail-item">
          <span class="title">Department</span>
          <span class="text">${staff.professional.department}</span>
        </div>

        <div class="detail-item">
          <span class="title">License Number</span>
          <span class="text">${staff.professional.licenseNumber}</span>
        </div>

        <div class="detail-item">
          <span class="title">Employment Type</span>
          <span class="text">${staff.professional.employmentType}</span>
        </div>

      </div>

    </div>

    <div class="section">

      <h3>Contact Information</h3>

      <div class="detail-grid">

        <div class="detail-item">
          <span class="title">Phone</span>
          <span class="text">${staff.contact.phone}</span>
        </div>

        <div class="detail-item">
          <span class="title">Email</span>
          <span class="text">${staff.contact.email}</span>
        </div>

        <div class="detail-item">
          <span class="title">Emergency Contact</span>
          <span class="text">${staff.contact.emergencyName}</span>
        </div>

        <div class="detail-item">
          <span class="title">Emergency Phone</span>
          <span class="text">${staff.contact.emergencyPhone}</span>
        </div>

      </div>

    </div>

    <div class="section">

      <h3>System Access</h3>

      <div class="detail-grid">

        <div class="detail-item">
          <span class="title">Username</span>
          <span class="text">${staff.account.username}</span>
        </div>

        <div class="detail-item">
          <span class="title">Role</span>
          <span class="text">${staff.account.role}</span>
        </div>

        <div class="detail-item">
          <span class="title">Staff ID</span>
          <span class="text">${staff.id}</span>
        </div>

        <div class="detail-item">
          <span class="title">Created At</span>
          <span class="text">
            ${new Date(staff.createdAt).toLocaleString()}
          </span>
        </div>

      </div>

    </div>

  `;

}

/* =========================
   DELETE
========================= */

function deleteStaff(id){

  const confirmDelete = confirm(
    'Delete this staff record permanently?'
  );

  if(!confirmDelete) return;

  staffRecords = staffRecords.filter(
    staff => staff.id !== id
  );

  localStorage.setItem(
    'oxytips_staff',
    JSON.stringify(staffRecords)
  );

  updateStats();
  searchRecords();

}

/* =========================
   MODAL
========================= */

closeModal.addEventListener('click', ()=>{

  modal.classList.remove('active');

});

modal.addEventListener('click', (e)=>{

  if(e.target === modal){

    modal.classList.remove('active');

  }

});

/* =========================
   EVENTS
========================= */

searchInput.addEventListener('input', searchRecords);
roleFilter.addEventListener('change', searchRecords);

/* =========================
   INIT
========================= */

updateStats();
renderRecords(staffRecords);