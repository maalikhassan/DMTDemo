// Application State
const state = {
    user: {
        name: '',
        vehicleNumber: '',
        mobileNumber: '',
        service: ''
    },
    steps: [
        { 
            title: 'Step 1', 
            description: 'Front Office 01 - Check all documents',
            guidance: [
                'Go to Front Office 01',
                'Submit all your required documents',
                'Officer will verify if all documents are complete',
                'Wait for verification to complete',
                'Click "Complete This Step" when the officer returns your documents'
            ],
            minimumTime: 10,
            userPresent: true
        },
        { 
            title: 'Step 2', 
            description: 'Front Office 02 - Get documents displayed in their system',
            guidance: [
                'Proceed to Front Office 02',
                'Your documents will be entered into the system',
                'Wait while officer processes your information',
                'Confirm all details are correct',
                'Click "Complete This Step" when officer is done'
            ],
            minimumTime: 10,
            userPresent: true
        },
        { 
            title: 'Step 3', 
            description: 'Receive token number/Payment slip',
            guidance: [
                'Receive your token number or payment slip',
                'Keep this slip safe - you will need it',
                'Note down your token number',
                'Click "Complete This Step" when you have your slip'
            ],
            minimumTime: 10,
            userPresent: true
        },
        { 
            title: 'Step 4', 
            description: 'Bank - Payment',
            guidance: [
                'Go to the bank counter',
                'Submit your payment slip',
                'Pay the required transfer fee',
                'Collect the official payment receipt',
                'Click "Complete This Step" when payment is done'
            ],
            minimumTime: 10,
            userPresent: true
        },
        { 
            title: 'Step 5', 
            description: 'Front Office 03 - Get counter number for book collection',
            guidance: [
                'Return to Front Office 03',
                'Submit your payment receipt',
                'Receive your counter number for book collection',
                'Note down the counter number',
                'Click "Complete This Step" when you receive the counter number'
            ],
            minimumTime: 10,
            userPresent: true
        },
        { 
            title: 'Step 6', 
            description: 'Waiting Area - Wait for your counter number to be called',
            guidance: [
                'Go to the designated waiting area',
                'Watch the display board for your counter number',
                'Your documents are being processed by back office staff',
                'This includes: data entry, printing CR, examining officer review, and staff officer verification',
                'Click "Complete This Step" ONLY when your counter number is called on the display'
            ],
            minimumTime: 10,
            userPresent: true
        },
        { 
            title: 'Step 7', 
            description: 'Front Office 04 - Collect your registration book',
            guidance: [
                'When your number is called, go to Front Office 04',
                'Meet with the appointed officer',
                'Receive your new vehicle registration book',
                'Verify all details are correct',
                'Sign the acknowledgment',
                'Process complete!'
            ],
            minimumTime: 10,
            userPresent: true
        }
    ],
    currentStep: 0,
    stepTimes: [],
    stepStartTime: null,
    timerInterval: null,
    buttonCheckInterval: null
};

// Format time in MM:SS
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

// Start timer for current step
function startStepTimer() {
    state.stepStartTime = Date.now();
    let elapsed = 0;
    
    const nextStepBtn = document.getElementById('nextStepBtn');
    const buttonMessage = document.getElementById('buttonMessage');
    
    // Disable button initially
    nextStepBtn.disabled = true;
    nextStepBtn.classList.add('btn-disabled');
    
    const minimumTime = state.steps[state.currentStep].minimumTime;
    
    state.timerInterval = setInterval(() => {
        elapsed = Math.floor((Date.now() - state.stepStartTime) / 1000);
        
        // Check if minimum time has passed
        if (elapsed >= minimumTime) {
            nextStepBtn.disabled = false;
            nextStepBtn.classList.remove('btn-disabled');
            buttonMessage.textContent = '✓ You can now proceed to the next step';
            buttonMessage.style.color = '#28a745';
            clearInterval(state.buttonCheckInterval);
        }
    }, 1000);
    
    // Show countdown message
    state.buttonCheckInterval = setInterval(() => {
        elapsed = Math.floor((Date.now() - state.stepStartTime) / 1000);
        const remaining = minimumTime - elapsed;
        
        if (remaining > 0) {
            buttonMessage.textContent = `⏳ Please complete this step (button will enable in ${remaining} seconds)`;
            buttonMessage.style.color = '#856404';
        }
    }, 1000);
}

// Stop timer and record time
function stopStepTimer() {
    if (state.timerInterval) {
        clearInterval(state.timerInterval);
        clearInterval(state.buttonCheckInterval);
        const elapsed = Math.floor((Date.now() - state.stepStartTime) / 1000);
        state.stepTimes.push({
            step: state.steps[state.currentStep].title,
            description: state.steps[state.currentStep].description,
            time: elapsed
        });
    }
}

// Show specific screen
function showScreen(screenId) {
    document.querySelectorAll('.form-container').forEach(container => {
        container.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

// Update progress bar
function updateProgress() {
    const progress = ((state.currentStep + 1) / state.steps.length) * 100;
    document.getElementById('progressFill').style.width = progress + '%';
}

// Display current step
function displayStep() {
    const step = state.steps[state.currentStep];
    document.getElementById('stepTitle').textContent = step.title;
    document.getElementById('stepDescription').textContent = step.description;
    
    // Display guidance
    const guidanceList = document.getElementById('guidanceList');
    guidanceList.innerHTML = '';
    step.guidance.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        guidanceList.appendChild(li);
    });
    
    updateProgress();
    startStepTimer();
}

// Validation functions
function validateName(name) {
    // Name should be at least 2 characters and contain only letters and spaces
    const namePattern = /^[a-zA-Z\s]{2,}$/;
    return namePattern.test(name.trim());
}

function validateVehicleNumber(vehicleNumber) {
    // Sri Lankan vehicle number format: ABC-1234 or ABC1234 or 12-1234
    const vehiclePattern = /^[A-Z]{2,3}[-\s]?\d{4}$|^\d{2}[-\s]?\d{4}$/i;
    return vehiclePattern.test(vehicleNumber.trim());
}

function validatePhoneNumber(phoneNumber) {
    // Sri Lankan phone number: 0771234567 or +94771234567 or 94771234567
    const phonePattern = /^(?:\+94|0)?[0-9]{9,10}$/;
    return phonePattern.test(phoneNumber.replace(/[\s-]/g, ''));
}

function showError(inputId, message) {
    const input = document.getElementById(inputId);
    const formGroup = input.parentElement;
    
    // Remove existing error message
    const existingError = formGroup.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Add error styling
    input.style.borderColor = '#dc3545';
    
    // Add error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    formGroup.appendChild(errorDiv);
}

function clearError(inputId) {
    const input = document.getElementById(inputId);
    const formGroup = input.parentElement;
    
    // Remove error message
    const existingError = formGroup.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Remove error styling
    input.style.borderColor = '#e0e0e0';
}

// Handle user form submission
document.getElementById('userForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('userName').value;
    const vehicleNumber = document.getElementById('vehicleNumber').value;
    const mobileNumber = document.getElementById('mobileNumber').value;
    
    let isValid = true;
    
    // Validate name
    if (!validateName(name)) {
        showError('userName', 'Please enter a valid name (letters only, at least 2 characters)');
        isValid = false;
    } else {
        clearError('userName');
    }
    
    // Validate vehicle number
    if (!validateVehicleNumber(vehicleNumber)) {
        showError('vehicleNumber', 'Please enter a valid vehicle number (e.g., ABC-1234 or 12-1234)');
        isValid = false;
    } else {
        clearError('vehicleNumber');
    }
    
    // Validate phone number
    if (!validatePhoneNumber(mobileNumber)) {
        showError('mobileNumber', 'Please enter a valid Sri Lankan phone number (e.g., 0771234567)');
        isValid = false;
    } else {
        clearError('mobileNumber');
    }
    
    // Only proceed if all validations pass
    if (isValid) {
        state.user.name = name.trim();
        state.user.vehicleNumber = vehicleNumber.trim().toUpperCase();
        state.user.mobileNumber = mobileNumber.replace(/[\s-]/g, '');
        
        showScreen('serviceSelection');
    }
});

// Handle service selection
document.querySelectorAll('.service-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const service = btn.dataset.service;
        state.user.service = btn.textContent.trim();
        
        // Display service on checklist
        document.getElementById('displayServiceChecklist').textContent = state.user.service;
        
        showScreen('documentChecklist');
    });
});

// Handle document checklist
const checkboxes = document.querySelectorAll('.doc-checkbox');
const proceedBtn = document.getElementById('proceedBtn');
const checklistWarning = document.getElementById('checklistWarning');

checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
        const allChecked = Array.from(checkboxes).every(cb => cb.checked);
        proceedBtn.disabled = !allChecked;
        checklistWarning.style.display = allChecked ? 'none' : 'block';
    });
});

proceedBtn.addEventListener('click', () => {
    // Display user info
    document.getElementById('displayName').textContent = state.user.name;
    document.getElementById('displayVehicle').textContent = state.user.vehicleNumber;
    document.getElementById('displayService').textContent = state.user.service;
    
    showScreen('processSteps');
    displayStep();
});

// Handle next step button
document.getElementById('nextStepBtn').addEventListener('click', () => {
    stopStepTimer();
    
    state.currentStep++;
    
    if (state.currentStep < state.steps.length) {
        displayStep();
    } else {
        showCompletionScreen();
    }
});

// Save data to your server/spreadsheet
async function saveToSpreadsheet() {
    const timestamp = new Date().toLocaleString();
    const totalSeconds = state.stepTimes.reduce((sum, step) => sum + step.time, 0);
    
    const data = {
        timestamp: timestamp,
        name: state.user.name,
        vehicleNumber: state.user.vehicleNumber,
        mobileNumber: state.user.mobileNumber,
        service: state.user.service,
        step1Time: state.stepTimes[0]?.time || 0,
        step2Time: state.stepTimes[1]?.time || 0,
        step3Time: state.stepTimes[2]?.time || 0,
        step4Time: state.stepTimes[3]?.time || 0,
        step5Time: state.stepTimes[4]?.time || 0,
        step6Time: state.stepTimes[5]?.time || 0,
        step7Time: state.stepTimes[6]?.time || 0,
        totalTime: totalSeconds,
        stepDetails: state.stepTimes
    };
    
    try {
        // Send data to Google Sheets via Google Apps Script Web App
        // PASTE YOUR WEB APP URL HERE (the one you get after deploying with "Anyone" access)
        const response = await fetch('https://script.google.com/macros/s/AKfycbwTJBJBH3dqnRQ0VM1KYnNeT6uTMP-dml8xD0_7qobNSVTctVEjgBYLfKvkaYaJ3LcK/exec', {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        console.log('Data sent successfully:', data);
        return true;
    } catch (error) {
        console.error('Error saving data:', error);
        // Still show completion even if save fails
        return false;
    }
}

// Show completion screen with summary
function showCompletionScreen() {
    const summaryDiv = document.getElementById('timeSummary');
    summaryDiv.innerHTML = '';
    
    let totalSeconds = 0;
    
    state.stepTimes.forEach(stepTime => {
        totalSeconds += stepTime.time;
        
        const stepDiv = document.createElement('div');
        stepDiv.className = 'step-summary';
        stepDiv.innerHTML = `
            <span>${stepTime.step}: ${stepTime.description}</span>
            <span style="font-weight: 600; color: #667eea;">${formatTime(stepTime.time)}</span>
        `;
        summaryDiv.appendChild(stepDiv);
    });
    
    document.getElementById('totalTime').textContent = formatTime(totalSeconds);
    
    // Save data to your server
    saveToSpreadsheet();
    
    showScreen('completionScreen');
}

// Initialize - show registration form
showScreen('registrationForm');
