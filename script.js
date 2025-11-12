let currentInput = '';
let operator = '';
let previousInput = '';

function appendToDisplay(value) {
    const display = document.getElementById('result');
    
    if (value === '.' && display.value.includes('.')) {
        return; // Prevent multiple decimal points
    }
    
    display.value += value;
}

function clearDisplay() {
    document.getElementById('result').value = '';
    currentInput = '';
    operator = '';
    previousInput = '';
}

function deleteLast() {
    const display = document.getElementById('result');
    display.value = display.value.slice(0, -1);
}

function calculate() {
    const display = document.getElementById('result');
    const expression = display.value;
    
    if (expression === '') {
        return;
    }
    
    try {
        // Replace × with * for evaluation
        const sanitizedExpression = expression.replace(/×/g, '*');
        
        // Basic validation to prevent code injection
        if (!/^[0-9+\-*/.() ]+$/.test(sanitizedExpression)) {
            throw new Error('Invalid expression');
        }
        
        const result = eval(sanitizedExpression);
        
        if (isNaN(result) || !isFinite(result)) {
            display.value = 'Error';
        } else {
            display.value = parseFloat(result.toFixed(10)).toString();
        }
    } catch (error) {
        display.value = 'Error';
    }
}

// Add keyboard support
document.addEventListener('keydown', function(event) {
    const key = event.key;
    
    if (key >= '0' && key <= '9' || key === '.') {
        appendToDisplay(key);
    } else if (key === '+' || key === '-') {
        appendToDisplay(key);
    } else if (key === '*') {
        appendToDisplay('*');
    } else if (key === '/') {
        event.preventDefault(); // Prevent browser search
        appendToDisplay('/');
    } else if (key === 'Enter' || key === '=') {
        event.preventDefault();
        calculate();
    } else if (key === 'Escape' || key === 'c' || key === 'C') {
        clearDisplay();
    } else if (key === 'Backspace') {
        deleteLast();
    }
});

// Add touch support for mobile devices
document.addEventListener('touchstart', function() {}, {passive: true});
