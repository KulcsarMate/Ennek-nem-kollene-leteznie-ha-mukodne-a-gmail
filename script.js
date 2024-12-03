let currentInput = "";

function appendValue(value) {
  if (currentInput === "error") {
    currentInput = "";
  }
  
  if (value === 'x^2') {
    currentInput += "**2";
  } else if (value === 'sqrt(') {
    currentInput += "Math.sqrt(";
  } else if (value === 'sin(' || value === 'cos(') {
    currentInput += "Math." + value;
  } else {
    currentInput += value;
  }
  
  updateDisplay();
}

function updateDisplay() {
  document.getElementById("display").value = currentInput;
}

function clearDisplay() {
  currentInput = "";
  updateDisplay();
}

function calculateResult() {
  try {
    if (currentInput.includes("Math.sin(") && !currentInput.includes(")")) {
      currentInput += ")";
    }
    if (currentInput.includes("Math.cos(") && !currentInput.includes(")")) {
      currentInput += ")";
    }
    if (currentInput.includes("Math.sqrt(") && !currentInput.includes(")")) {
      currentInput += ")";
    }
    
    currentInput = eval(currentInput).toString();
    updateDisplay();
  } catch (error) {
    currentInput = "error";
    updateDisplay();
  }
}
