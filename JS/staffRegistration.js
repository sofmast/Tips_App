const steps = document.querySelectorAll('.step');
const nextBtn = document.getElementById('nextBtn');
const prevBtn = document.getElementById('prevBtn');
const progressBar = document.getElementById('progressBar');
const percent = document.getElementById('percent');
const stepText = document.getElementById('stepText');
const form = document.getElementById('staffForm');
const successBox = document.getElementById('successBox');

let currentStep = 0;

/* =========================
   STEP DISPLAY
========================= */

function showStep(){

  steps.forEach((step,index)=>{
    step.classList.toggle('active', index === currentStep);
  });

  const progress = ((currentStep + 1) / steps.length) * 100;

  progressBar.style.width = progress + '%';
  percent.innerText = Math.round(progress) + '%';
  stepText.innerText = `Step ${currentStep + 1} of ${steps.length}`;

  prevBtn.style.display = currentStep === 0 ? 'none' : 'block';

  if(currentStep === steps.length - 1){
    nextBtn.innerHTML = 'Submit Registration ✓';
  }else{
    nextBtn.innerHTML = 'Next →';
  }

}

/* =========================
   VALIDATION
========================= */

function validateStep(){

  let currentInputs = steps[currentStep].querySelectorAll('input, select');
  let valid = true;

  currentInputs.forEach(input=>{

    const error = input.parentElement.querySelector('.error');

    if(
      !input.checkValidity() ||
      (input.type !== 'file' && input.value.trim() === '')
    ){

      input.style.borderColor = '#d93025';

      if(error){
        error.style.display = 'block';
      }

      valid = false;

    }else{

      input.style.borderColor = '#dadce0';

      if(error){
        error.style.display = 'none';
      }

    }

  });

  /* PASSWORD CHECK */

  if(currentStep === 4){

    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');

    if(password.value !== confirmPassword.value){

      confirmPassword.style.borderColor = '#d93025';

      confirmPassword.parentElement
      .querySelector('.error')
      .style.display = 'block';

      valid = false;

    }

  }

  return valid;

}

/* =========================
   FILE PREVIEW NAMES
========================= */

function setupFilePreview(inputId, displayId){

  const input = document.getElementById(inputId);
  const display = document.getElementById(displayId);

  input.addEventListener('change', ()=>{

    if(input.files.length > 1){

      display.innerText = `${input.files.length} files selected`;

    }else if(input.files.length === 1){

      display.innerText = input.files[0].name;

    }else{

      display.innerText = '';

    }

  });

}

setupFilePreview('nrcFront','frontFileName');
setupFilePreview('nrcBack','backFileName');
setupFilePreview('certificates','certificateFileName');

/* =========================
   CONVERT FILE TO BASE64
========================= */

function fileToBase64(file){

  return new Promise((resolve,reject)=>{

    const reader = new FileReader();

    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);

    reader.readAsDataURL(file);

  });

}

/* =========================
   SAVE STAFF TO LOCALSTORAGE
========================= */

async function saveStaffData(){

  const nrcFrontFile = document.getElementById('nrcFront').files[0];
  const nrcBackFile = document.getElementById('nrcBack').files[0];

  let certificateFiles = document.getElementById('certificates').files;

  const certificates = [];

  for(const file of certificateFiles){

    certificates.push({
      name:file.name,
      data:await fileToBase64(file)
    });

  }

  const staffData = {

    id:'STAFF-' + Date.now(),

    personal:{
      firstName:document.getElementById('firstName').value,
      lastName:document.getElementById('lastName').value,
      gender:document.getElementById('gender').value,
      dob:document.getElementById('dob').value
    },

    professional:{
      profession:document.getElementById('profession').value,
      licenseNumber:document.getElementById('licenseNumber').value,
      department:document.getElementById('department').value,
      employmentType:document.getElementById('employmentType').value
    },

    contact:{
      phone:document.getElementById('phone').value,
      email:document.getElementById('email').value,
      emergencyName:document.getElementById('emergencyName').value,
      emergencyPhone:document.getElementById('emergencyPhone').value
    },

    documents:{
      nrcFront:{
        name:nrcFrontFile.name,
        data:await fileToBase64(nrcFrontFile)
      },

      nrcBack:{
        name:nrcBackFile.name,
        data:await fileToBase64(nrcBackFile)
      },

      certificates:certificates
    },

    account:{
      username:document.getElementById('username').value,
      role:document.getElementById('role').value,
      password:document.getElementById('password').value
    },

    createdAt:new Date().toISOString()

  };

  let existingStaff =
    JSON.parse(localStorage.getItem('oxytips_staff')) || [];

  existingStaff.push(staffData);

  localStorage.setItem(
    'oxytips_staff',
    JSON.stringify(existingStaff)
  );

}

/* =========================
   NEXT BUTTON
========================= */

nextBtn.addEventListener('click', async ()=>{

  if(!validateStep()) return;

  if(currentStep < steps.length - 1){

    currentStep++;
    showStep();

  }else{

    nextBtn.disabled = true;
    nextBtn.innerHTML = 'Saving...';

    await saveStaffData();

    form.style.display = 'none';

    successBox.classList.add('active');

  }

});

/* =========================
   PREVIOUS BUTTON
========================= */

prevBtn.addEventListener('click',()=>{

  if(currentStep > 0){

    currentStep--;

    showStep();

  }

});

/* =========================
   INIT
========================= */

showStep();
