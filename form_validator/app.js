// ============================================
// FORM VALIDATOR - Vanilla JavaScript
// ============================================

const form = document.querySelector("#registrationForm");
const fullNameInput = document.querySelector("#fullName");
const emailInput = document.querySelector("#email");
const passwordInput = document.querySelector("#password");
const confirmPasswordInput = document.querySelector("#confirmPassword");
const phoneInput = document.querySelector("#phone");
const submitBtn = document.querySelector(".btn-submit");

const modal = document.querySelector("#successModal");
const modalClose = document.querySelector("#modalClose");
const modalInfo = document.querySelector("#modalInfo");

// ============================================
// VALIDATION STATE
// ============================================
let validationState = {
  fullName: false,
  email: false,
  password: false,
  confirmPassword: false,
  phone: false,
};

// ============================================
// 1. FULL NAME VALIDATION
// ============================================
fullNameInput.addEventListener("input", (e) => {
  const value = e.target.value.trim();
  const errorEl = document.querySelector("#fullNameError");

  if (value.length === 0) {
    setInputState(fullNameInput, "default");
    errorEl.textContent = "";
    validationState.fullName = false;
  } else if (value.length < 2) {
    setInputState(fullNameInput, "invalid");
    errorEl.textContent = "Name must be at least 2 characters";
    validationState.fullName = false;
  } else if (value.length > 50) {
    setInputState(fullNameInput, "invalid");
    errorEl.textContent = "Name must not exceed 50 characters";
    validationState.fullName = false;
  } else if (!isValidName(value)) {
    setInputState(fullNameInput, "invalid");
    errorEl.textContent = "Name can only contain letters, spaces, and hyphens";
    validationState.fullName = false;
  } else {
    setInputState(fullNameInput, "valid");
    errorEl.textContent = "";
    validationState.fullName = true;
  }

  updateSubmitBtn();
});

function isValidName(name) {
  return /^[a-zA-Z\s\-']+$/.test(name);
}

// ============================================
// 2. EMAIL VALIDATION
// ============================================
emailInput.addEventListener("input", (e) => {
  const value = e.target.value.trim();
  const errorEl = document.querySelector("#emailError");

  if (value.length === 0) {
    setInputState(emailInput, "default");
    errorEl.textContent = "";
    validationState.email = false;
  } else if (!isValidEmail(value)) {
    setInputState(emailInput, "invalid");
    errorEl.textContent = "Please enter a valid email address";
    validationState.email = false;
  } else {
    setInputState(emailInput, "valid");
    errorEl.textContent = "";
    validationState.email = true;
  }

  updateSubmitBtn();
});

function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// ============================================
// 3. PASSWORD VALIDATION & STRENGTH
// ============================================
passwordInput.addEventListener("input", (e) => {
  const value = e.target.value;
  const errorEl = document.querySelector("#passwordError");
  const strengthMeter = document.querySelector("#strengthMeter");
  const strengthText = document.querySelector("#strengthText");

  if (value.length === 0) {
    setInputState(passwordInput, "default");
    errorEl.textContent = "";
    strengthMeter.className = "strength-meter";
    strengthText.className = "strength-text";
    strengthText.textContent = "";
    validationState.password = false;
  } else if (value.length < 8) {
    setInputState(passwordInput, "invalid");
    errorEl.textContent = "Password must be at least 8 characters";
    strengthMeter.className = "strength-meter weak";
    strengthText.className = "strength-text weak";
    strengthText.textContent = "Weak - Too short";
    validationState.password = false;
  } else {
    const strength = calculatePasswordStrength(value);

    if (strength === "weak") {
      setInputState(passwordInput, "invalid");
      errorEl.textContent = "Password is too weak";
      strengthMeter.className = "strength-meter weak";
      strengthText.className = "strength-text weak";
      strengthText.textContent = "Weak - Add more variety";
      validationState.password = false;
    } else if (strength === "medium") {
      setInputState(passwordInput, "valid");
      errorEl.textContent = "";
      strengthMeter.className = "strength-meter medium";
      strengthText.className = "strength-text medium";
      strengthText.textContent = "Medium - Good, but could be stronger";
      validationState.password = true;
    } else {
      setInputState(passwordInput, "valid");
      errorEl.textContent = "";
      strengthMeter.className = "strength-meter strong";
      strengthText.className = "strength-text strong";
      strengthText.textContent = "Strong - Excellent password!";
      validationState.password = true;
    }
  }

  // Re-validate confirm password
  validateConfirmPassword();
  updateSubmitBtn();
});

function calculatePasswordStrength(password) {
  let score = 0;

  // Length
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;

  // Lowercase
  if (/[a-z]/.test(password)) score++;

  // Uppercase
  if (/[A-Z]/.test(password)) score++;

  // Numbers
  if (/\d/.test(password)) score++;

  // Special characters
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score++;

  if (score <= 2) return "weak";
  if (score <= 4) return "medium";
  return "strong";
}

// ============================================
// 4. CONFIRM PASSWORD VALIDATION
// ============================================
confirmPasswordInput.addEventListener("input", validateConfirmPassword);

function validateConfirmPassword() {
  const value = confirmPasswordInput.value;
  const errorEl = document.querySelector("#confirmPasswordError");

  if (value.length === 0) {
    setInputState(confirmPasswordInput, "default");
    errorEl.textContent = "";
    validationState.confirmPassword = false;
  } else if (value !== passwordInput.value) {
    setInputState(confirmPasswordInput, "invalid");
    errorEl.textContent = "Passwords do not match";
    validationState.confirmPassword = false;
  } else {
    setInputState(confirmPasswordInput, "valid");
    errorEl.textContent = "";
    validationState.confirmPassword = true;
  }

  updateSubmitBtn();
}

// ============================================
// 5. PHONE VALIDATION & AUTO-FORMAT
// ============================================
phoneInput.addEventListener("input", (e) => {
  let value = e.target.value.replace(/\D/g, "");

  // Auto-format: 0901-234-567
  if (value.length > 0) {
    if (value.length <= 3) {
      value = value;
    } else if (value.length <= 6) {
      value = value.slice(0, 3) + "-" + value.slice(3);
    } else {
      value =
        value.slice(0, 3) + "-" + value.slice(3, 6) + "-" + value.slice(6, 10);
    }
    e.target.value = value;
  }

  validatePhone();
});

function validatePhone() {
  const value = phoneInput.value.replace(/\D/g, "");
  const errorEl = document.querySelector("#phoneError");

  if (value.length === 0) {
    setInputState(phoneInput, "default");
    errorEl.textContent = "";
    validationState.phone = false;
  } else if (value.length !== 10) {
    setInputState(phoneInput, "invalid");
    errorEl.textContent = "Phone number must be 10 digits";
    validationState.phone = false;
  } else if (!value.startsWith("0")) {
    setInputState(phoneInput, "invalid");
    errorEl.textContent = "Phone number must start with 0";
    validationState.phone = false;
  } else {
    setInputState(phoneInput, "valid");
    errorEl.textContent = "";
    validationState.phone = true;
  }

  updateSubmitBtn();
}

// ============================================
// 6. UTILITY FUNCTIONS
// ============================================
function setInputState(input, state) {
  input.classList.remove("valid", "invalid");
  if (state === "valid" || state === "invalid") {
    input.classList.add(state);
  }
}

function updateSubmitBtn() {
  const isAllValid = Object.values(validationState).every((v) => v === true);
  submitBtn.disabled = !isAllValid;
}

// ============================================
// 7. FORM SUBMIT
// ============================================
form.addEventListener("submit", (e) => {
  e.preventDefault();

  // Final validation
  const isAllValid = Object.values(validationState).every((v) => v === true);

  if (isAllValid) {
    showSuccessModal();
  }
});

// ============================================
// 8. SUCCESS MODAL
// ============================================
function showSuccessModal() {
  const fullName = fullNameInput.value.trim();
  const email = emailInput.value.trim();
  const phone = phoneInput.value;

  modalInfo.innerHTML = `
        <strong>Full Name:</strong>
        ${escapeHtml(fullName)}
        <strong>Email:</strong>
        ${escapeHtml(email)}
        <strong>Phone:</strong>
        ${escapeHtml(phone)}
        <strong>Account Status:</strong>
        ✅ Successfully Created!
    `;

  modal.classList.remove("hidden");
  form.reset();
  resetValidationState();
  updateSubmitBtn();
}

function resetValidationState() {
  validationState = {
    fullName: false,
    email: false,
    password: false,
    confirmPassword: false,
    phone: false,
  };

  document
    .querySelectorAll(
      "input[type='text'], input[type='email'], input[type='password'], input[type='tel']",
    )
    .forEach((input) => {
      setInputState(input, "default");
    });

  document.querySelectorAll(".error-message").forEach((el) => {
    el.textContent = "";
  });

  document.querySelector("#strengthMeter").className = "strength-meter";
  document.querySelector("#strengthText").className = "strength-text";
  document.querySelector("#strengthText").textContent = "";
}

modalClose.addEventListener("click", () => {
  modal.classList.add("hidden");
});

modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.classList.add("hidden");
  }
});

// ============================================
// 9. UTILITY
// ============================================
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}
