// Animar a barra de progresso
const progressBar = document.getElementById('progressBar');
let progress = 0;
const interval = setInterval(() => {
    progress += Math.random() * 10;
    progressBar.style.width = `${Math.min(progress, 100)}%`;
    
    if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
            // Redirecionar para a página inicial após a animação
            window.location.href = 'TI.html';
        }, 500);
    }
}, 300);

// Adicionar efeito de fade out ao clicar em qualquer lugar
document.body.addEventListener('click', () => {
    document.body.classList.add('fade-out');
    setTimeout(() => {
        window.location.href = 'TI.html';
    }, 500);
});

// Adicionar estilo para fade out
const style = document.createElement('style');
style.textContent = `
    .fade-out {
        opacity: 0;
        transition: opacity 0.5s ease-in-out;
    }
`;
document.head.appendChild(style);