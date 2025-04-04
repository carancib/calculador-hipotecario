let originalMonthlyPayment = 0;
let originalTotalInterest = 0;
let originalDuration = 0;

async function calculateAmortization() {
    // Get input values
    const loanAmount = parseFloat(document.getElementById('loanAmount').value.replace(',', '.'));
    const annualRate = parseFloat(document.getElementById('annualRate').value.replace(',', '.'));
    const duration = parseInt(document.getElementById('duration').value);

    // Validate inputs
    if (isNaN(loanAmount) || isNaN(annualRate) || isNaN(duration) ||
        loanAmount <= 0 || annualRate <= 0 || duration <= 0) {
        alert('Por favor ingrese valores válidos para todos los campos');
        return;
    }

    // Store original values for comparison
    originalDuration = duration;
    
    // Calculate monthly interest rate
    const monthlyRate = annualRate / 12 / 100;

    // Calculate monthly payment using French amortization formula
    const monthlyPayment = loanAmount * 
        (monthlyRate * Math.pow(1 + monthlyRate, duration)) / 
        (Math.pow(1 + monthlyRate, duration) - 1);

    // Store original monthly payment for comparison
    originalMonthlyPayment = monthlyPayment;

    // Generate amortization schedule
    generateAmortizationSchedule(loanAmount, monthlyRate, duration, monthlyPayment);
}

function generateAmortizationSchedule(loanAmount, monthlyRate, duration, monthlyPayment) {
    let remainingBalance = loanAmount;
    let totalInterest = 0;
    const tableBody = document.getElementById('amortizationBody');
    tableBody.innerHTML = '';

    for (let month = 1; month <= duration; month++) {
        const interestPayment = remainingBalance * monthlyRate;
        const principalPayment = monthlyPayment - interestPayment;
        remainingBalance -= principalPayment;
        totalInterest += interestPayment;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${month}</td>
            <td>${formatCurrency(monthlyPayment)}</td>
            <td>${formatCurrency(principalPayment)}</td>
            <td>${formatCurrency(interestPayment)}</td>
            <td>${formatCurrency(Math.max(0, remainingBalance))}</td>
        `;
        tableBody.appendChild(row);
    }

    // Store original total interest for comparison
    originalTotalInterest = totalInterest;

    // Update summary
    updateSummary(monthlyPayment, totalInterest, loanAmount);
}

function updateSummary(monthlyPayment, totalInterest, loanAmount) {
    document.getElementById('monthlyPayment').textContent = formatCurrency(monthlyPayment);
    document.getElementById('totalInterest').textContent = formatCurrency(totalInterest);
    document.getElementById('totalAmount').textContent = formatCurrency(loanAmount + totalInterest);
}

function formatCurrency(amount) {
    return amount.toLocaleString('es-CL', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

async function calculateWithExtraPayment() {
    // Get input values
    const loanAmount = parseFloat(document.getElementById('loanAmount').value.replace(',', '.'));
    const annualRate = parseFloat(document.getElementById('annualRate').value.replace(',', '.'));
    const duration = parseInt(document.getElementById('duration').value);
    const extraPayment = parseFloat(document.getElementById('extraPaymentAmount').value.replace(',', '.'));
    const extraPaymentMonth = parseInt(document.getElementById('extraPaymentMonth').value);
    const simulationType = document.querySelector('input[name="simulationType"]:checked').value;

    // Validate inputs
    if (isNaN(loanAmount) || isNaN(annualRate) || isNaN(duration) ||
        isNaN(extraPayment) || isNaN(extraPaymentMonth) ||
        loanAmount <= 0 || annualRate <= 0 || duration <= 0 ||
        extraPayment <= 0 || extraPaymentMonth <= 0 || extraPaymentMonth > duration) {
        alert('Por favor ingrese valores válidos para todos los campos');
        return;
    }

    // Calculate monthly interest rate
    const monthlyRate = annualRate / 12 / 100;

    // Calculate monthly payment using French amortization formula
    const monthlyPayment = loanAmount * 
        (monthlyRate * Math.pow(1 + monthlyRate, duration)) / 
        (Math.pow(1 + monthlyRate, duration) - 1);

    // Generate amortization schedule based on simulation type
    if (simulationType === 'reduceDuration') {
        generateExtraPaymentSchedule(loanAmount, monthlyRate, duration, monthlyPayment, extraPayment, extraPaymentMonth, 'reduceDuration');
    } else {
        generateExtraPaymentSchedule(loanAmount, monthlyRate, duration, monthlyPayment, extraPayment, extraPaymentMonth, 'reducePayment');
    }
}

function generateExtraPaymentSchedule(loanAmount, monthlyRate, duration, monthlyPayment, extraPayment, extraPaymentMonth, simulationType) {
    let remainingBalance = loanAmount;
    let totalInterest = 0;
    let newDuration = duration;
    const tableBody = document.getElementById('amortizationBody');
    tableBody.innerHTML = '';

    if (simulationType === 'reduceDuration') {
        // Generate schedule with reduced duration
        for (let month = 1; month <= duration; month++) {
            const interestPayment = remainingBalance * monthlyRate;
            let principalPayment = monthlyPayment - interestPayment;
            
            if (month === extraPaymentMonth) {
                principalPayment += extraPayment;
            }
            
            remainingBalance -= principalPayment;
            totalInterest += interestPayment;

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${month}</td>
                <td>${formatCurrency(monthlyPayment + (month === extraPaymentMonth ? extraPayment : 0))}</td>
                <td>${formatCurrency(principalPayment)}</td>
                <td>${formatCurrency(interestPayment)}</td>
                <td>${formatCurrency(Math.max(0, remainingBalance))}</td>
            `;
            tableBody.appendChild(row);

            if (remainingBalance <= 0 && month < duration) {
                newDuration = month;
                break;
            }
        }

        updateExtraPaymentSummary(monthlyPayment, totalInterest, loanAmount, newDuration, 'reduceDuration');
    } else {
        // Calculate new monthly payment after extra payment
        let newMonthlyPayment = monthlyPayment;
        
        // Apply payments until extra payment month
        for (let month = 1; month <= extraPaymentMonth; month++) {
            const interestPayment = remainingBalance * monthlyRate;
            const principalPayment = monthlyPayment - interestPayment;
            remainingBalance -= principalPayment;
            totalInterest += interestPayment;

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${month}</td>
                <td>${formatCurrency(monthlyPayment + (month === extraPaymentMonth ? extraPayment : 0))}</td>
                <td>${formatCurrency(principalPayment + (month === extraPaymentMonth ? extraPayment : 0))}</td>
                <td>${formatCurrency(interestPayment)}</td>
                <td>${formatCurrency(Math.max(0, remainingBalance))}</td>
            `;
            tableBody.appendChild(row);
        }

        // Apply extra payment
        remainingBalance -= extraPayment;

        // Calculate new monthly payment for remaining duration
        if (remainingBalance > 0 && (duration - extraPaymentMonth) > 0) {
            newMonthlyPayment = remainingBalance * 
                (monthlyRate * Math.pow(1 + monthlyRate, duration - extraPaymentMonth)) / 
                (Math.pow(1 + monthlyRate, duration - extraPaymentMonth) - 1);
        }

        // Continue with new monthly payment
        for (let month = extraPaymentMonth + 1; month <= duration; month++) {
            const interestPayment = remainingBalance * monthlyRate;
            const principalPayment = newMonthlyPayment - interestPayment;
            remainingBalance -= principalPayment;
            totalInterest += interestPayment;

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${month}</td>
                <td>${formatCurrency(newMonthlyPayment)}</td>
                <td>${formatCurrency(principalPayment)}</td>
                <td>${formatCurrency(interestPayment)}</td>
                <td>${formatCurrency(Math.max(0, remainingBalance))}</td>
            `;
            tableBody.appendChild(row);
        }

        updateExtraPaymentSummary(monthlyPayment, totalInterest, loanAmount, duration, 'reducePayment', newMonthlyPayment);
    }
}

function updateExtraPaymentSummary(monthlyPayment, totalInterest, loanAmount, newDuration, simulationType, newMonthlyPayment = 0) {
    document.getElementById('monthlyPayment').textContent = formatCurrency(monthlyPayment);
    document.getElementById('totalInterest').textContent = formatCurrency(totalInterest);
    document.getElementById('totalAmount').textContent = formatCurrency(loanAmount + totalInterest);
    
    const extraPaymentSummary = document.getElementById('extraPaymentSummary');
    extraPaymentSummary.style.display = 'block';
    
    if (simulationType === 'reduceDuration') {
        document.getElementById('reduceDurationSummary').style.display = 'block';
        document.getElementById('reducePaymentSummary').style.display = 'none';
        document.getElementById('interestSaved').textContent = formatCurrency(originalTotalInterest - totalInterest);
        document.getElementById('newTotalAmount').textContent = formatCurrency(loanAmount + totalInterest);
        document.getElementById('monthsReduced').textContent = originalDuration - newDuration;
    } else {
        document.getElementById('reduceDurationSummary').style.display = 'none';
        document.getElementById('reducePaymentSummary').style.display = 'block';
        document.getElementById('newMonthlyPayment').textContent = formatCurrency(newMonthlyPayment);
        document.getElementById('monthlyPaymentReduced').textContent = formatCurrency(monthlyPayment - newMonthlyPayment);
        document.getElementById('interestSavedFixedDuration').textContent = formatCurrency(originalTotalInterest - totalInterest);
    }
} 