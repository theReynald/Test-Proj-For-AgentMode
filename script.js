let currentInput = '';
let operator = '';
let previousInput = '';

// History management
const MAX_HISTORY_ITEMS = 50;
let calculationHistory = [];

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
            const formattedResult = parseFloat(result.toFixed(10)).toString();
            display.value = formattedResult;
            
            // Add to history
            addToHistory(expression, formattedResult);
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

// History functions
function loadHistory() {
    try {
        const stored = localStorage.getItem('calculatorHistory');
        if (stored) {
            calculationHistory = JSON.parse(stored);
            updateHistoryDisplay();
        }
    } catch (error) {
        console.error('Error loading history:', error);
        calculationHistory = [];
    }
}

function saveHistory() {
    try {
        localStorage.setItem('calculatorHistory', JSON.stringify(calculationHistory));
    } catch (error) {
        console.error('Error saving history:', error);
    }
}

function addToHistory(expression, result) {
    // Don't add error results to history
    if (result === 'Error') {
        return;
    }
    
    const historyItem = {
        expression: expression,
        result: result,
        timestamp: new Date().toISOString()
    };
    
    // Add to beginning of array (newest first)
    calculationHistory.unshift(historyItem);
    
    // Limit to MAX_HISTORY_ITEMS
    if (calculationHistory.length > MAX_HISTORY_ITEMS) {
        calculationHistory = calculationHistory.slice(0, MAX_HISTORY_ITEMS);
    }
    
    saveHistory();
    updateHistoryDisplay();
}

function updateHistoryDisplay() {
    const historyList = document.getElementById('historyList');
    
    if (calculationHistory.length === 0) {
        historyList.innerHTML = '<p class="history-empty">No calculations yet</p>';
        return;
    }
    
    historyList.innerHTML = calculationHistory.map((item, index) => {
        const date = new Date(item.timestamp);
        const timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        return `
            <div class="history-item" onclick="reuseResult('${item.result.replace(/'/g, "\\'")}')">
                <div class="history-expression">${escapeHtml(item.expression)} =</div>
                <div class="history-result">${escapeHtml(item.result)}</div>
                <div class="history-time">${timeString}</div>
            </div>
        `;
    }).join('');
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function reuseResult(result) {
    const display = document.getElementById('result');
    display.value = result;
}

function clearHistory() {
    if (calculationHistory.length === 0) {
        return;
    }
    
    if (confirm('Are you sure you want to clear all calculation history?')) {
        calculationHistory = [];
        saveHistory();
        updateHistoryDisplay();
    }
}

function toggleHistory() {
    const historyPanel = document.getElementById('historyPanel');
    historyPanel.classList.toggle('open');
}

// Load history on page load
window.addEventListener('DOMContentLoaded', loadHistory);
