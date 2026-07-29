const form = document.getElementById('form');
const weightInput = document.getElementById('weight');
const heightInput = document.getElementById('height');
const weightError = document.getElementById('weight-error');
const heightError = document.getElementById('height-error');
const valueSpan = document.getElementById('value');
const categorySpan = document.getElementById('category');
const emojiSpan = document.getElementById('emoji');
const infosDiv = document.getElementById('infos');

function clearErrors() {
    weightError.textContent = '';
    weightError.classList.remove('visible');
    heightError.textContent = '';
    heightError.classList.remove('visible');
}

function setError(element, message) {
    element.textContent = message;
    element.classList.add('visible');
}

function validateInputs(weight, height) {
    let isValid = true;
    clearErrors();

    if (!weight || weight <= 0) {
        setError(weightError, 'Informe um peso válido.');
        isValid = false;
    } else if (weight < 1 || weight > 500) {
        setError(weightError, 'Peso deve estar entre 1 e 500 kg.');
        isValid = false;
    }

    if (!height || height <= 0) {
        setError(heightError, 'Informe uma altura válida.');
        isValid = false;
    } else if (height < 0.3 || height > 3) {
        setError(heightError, 'Altura deve estar entre 0,30 e 3,00 m.');
        isValid = false;
    }

    return isValid;
}

function getIMCCategory(bmi) {
    if (bmi < 18.5) {
        return {
            description: 'Abaixo do peso',
            detail: 'Cuidado! Você está abaixo do peso ideal.',
            emoji: '⚠️',
            colorClass: 'color-underweight',
            indicatorColor: '#eab308',
            indicatorWidth: 15
        };
    } else if (bmi < 25) {
        return {
            description: 'Peso ideal',
            detail: 'Parabéns! Você está no peso ideal.',
            emoji: '🎉',
            colorClass: 'color-normal',
            indicatorColor: '#22c55e',
            indicatorWidth: 40
        };
    } else if (bmi < 30) {
        return {
            description: 'Sobrepeso',
            detail: 'Atenção! Você está com sobrepeso.',
            emoji: '⚡',
            colorClass: 'color-overweight',
            indicatorColor: '#f97316',
            indicatorWidth: 60
        };
    } else if (bmi < 35) {
        return {
            description: 'Obesidade Grau I',
            detail: 'Cuidado! Você está com obesidade moderada.',
            emoji: '🚨',
            colorClass: 'color-obese',
            indicatorColor: '#ef4444',
            indicatorWidth: 75
        };
    } else if (bmi < 40) {
        return {
            description: 'Obesidade Grau II',
            detail: 'Cuidado! Você está com obesidade severa.',
            emoji: '🚨',
            colorClass: 'color-obese-severe',
            indicatorColor: '#dc2626',
            indicatorWidth: 88
        };
    } else {
        return {
            description: 'Obesidade Grau III',
            detail: 'Cuidado! Você está com obesidade mórbida.',
            emoji: '🚨',
            colorClass: 'color-obese-severe',
            indicatorColor: '#b91c1c',
            indicatorWidth: 100
        };
    }
}

function animateValue(element, start, end, duration) {
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = start + (end - start) * easeOut;
        element.textContent = current.toFixed(2).replace('.', ',');
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

form.addEventListener('submit', function(event) {
    event.preventDefault();
    clearErrors();

    const weight = parseFloat(weightInput.value.replace(',', '.'));
    const height = parseFloat(heightInput.value.replace(',', '.'));

    if (!validateInputs(weight, height)) {
        infosDiv.classList.add('hidden');
        return;
    }

    const bmi = weight / (height * height);
    const category = getIMCCategory(bmi);

    // Remove classes anteriores
    valueSpan.className = '';
    categorySpan.className = '';

    // Mostra resultados
    infosDiv.classList.remove('hidden');

    // Anima o valor
    animateValue(valueSpan, 0, bmi, 800);

    // Aplica cores
    valueSpan.classList.add(category.colorClass);
    categorySpan.classList.add(category.colorClass);

    // Atualiza texto
    categorySpan.textContent = category.detail;
    emojiSpan.textContent = category.emoji;

    // Cria barra de indicador se não existir
    let indicator = document.getElementById('bmi-indicator');
    if (!indicator) {
        indicator = document.createElement('div');
        indicator.id = 'bmi-indicator';
        const fill = document.createElement('div');
        fill.id = 'bmi-indicator-fill';
        indicator.appendChild(fill);
        infosDiv.insertBefore(indicator, document.getElementById('more_info'));
    }

    const fill = document.getElementById('bmi-indicator-fill');
    fill.style.width = '0%';
    fill.style.backgroundColor = category.indicatorColor;

    // Anima a barra após um pequeno delay
    setTimeout(() => {
        fill.style.width = category.indicatorWidth + '%';
    }, 100);

    // Scroll suave para o resultado em mobile
    if (window.innerWidth <= 900) {
        infosDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
});

// Limpa erros ao digitar
[weightInput, heightInput].forEach(input => {
    input.addEventListener('input', clearErrors);
});

// Suporte a tecla Enter no último campo
heightInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        form.dispatchEvent(new Event('submit'));
    }
});
