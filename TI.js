// Dados dos usuários
const users = [
    {
        id: 1,
        name: "Usuário Padrão",
        avatar: "👤",
        password: "senha123",
        hint: "Dica: tente 'senha123'",
        color: "#4a90e2"
    },
    {
        id: 2,
        name: "Convidado",
        avatar: "👋",
        password: "convidado",
        hint: "Dica: tente 'convidado'",
        color: "#9c27b0"
    },
    {
        id: 3,
        name: "Admin",
        avatar: "👑",
        password: "admin123",
        hint: "Dica: tente 'admin123'",
        color: "#ff9800"
    },
    {
        id: 4,
        name: "Desenvolvedor",
        avatar: "💻",
        password: "dev123",
        hint: "Dica: tente 'dev123'",
        color: "#4caf50"
    }
];

let selectedUser = null;

// Atualizar hora e data
function updateClock() {
    const now = new Date();
    const timeString = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    document.getElementById('time').textContent = timeString;
    
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateString = now.toLocaleDateString('pt-BR', options);
    document.getElementById('date').textContent = dateString;
}

// Carregar usuários na tela
function loadUsers() {
    const usersContainer = document.getElementById('usersContainer');
    usersContainer.innerHTML = '';
    
    users.forEach(user => {
        const userElement = document.createElement('div');
        userElement.className = 'user-option';
        userElement.innerHTML = `
            <div class="user-option-avatar" style="background-color: ${user.color}20; border: 2px solid ${user.color}">${user.avatar}</div>
            <div class="user-option-name">${user.name}</div>
        `;
        
        userElement.addEventListener('click', () => selectUser(user));
        usersContainer.appendChild(userElement);
    });
}

// Selecionar usuário
function selectUser(user) {
    selectedUser = user;
    
    // Atualizar UI
    document.querySelectorAll('.user-option').forEach(el => el.classList.remove('selected'));
    event.currentTarget.classList.add('selected');
    
    // Mostrar caixa de login
    document.getElementById('usersContainer').style.display = 'none';
    document.getElementById('loginBox').style.display = 'block';
    
    // Atualizar informações do usuário
    document.getElementById('currentUserAvatar').innerHTML = user.avatar;
    document.getElementById('currentUserAvatar').style.backgroundColor = `${user.color}20`;
    document.getElementById('currentUserAvatar').style.border = `2px solid ${user.color}`;
    document.getElementById('currentUserName').textContent = user.name;
    document.getElementById('hintText').textContent = user.hint;
    document.getElementById('password').focus();
}

// Voltar para seleção de usuários
document.getElementById('backBtn').addEventListener('click', () => {
    document.getElementById('loginBox').style.display = 'none';
    document.getElementById('usersContainer').style.display = 'flex';
    document.getElementById('password').value = '';
    selectedUser = null;
});

// Verificar senha
document.getElementById('loginBtn').addEventListener('click', () => {
    const password = document.getElementById('password').value;
    
    if (!selectedUser) return;
    
    if (password === selectedUser.password) {
        // Animação de desbloqueio
        document.querySelector('.lock-screen').classList.add('unlocking');
        
        // Salvar usuário autenticado
        sessionStorage.setItem('authenticated', 'true');
        sessionStorage.setItem('currentUser', JSON.stringify(selectedUser));
        
        // Redirecionar após a animação
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    } else {
        // Efeito de erro
        const loginBox = document.getElementById('loginBox');
        loginBox.style.animation = 'none';
        void loginBox.offsetWidth; // Trigger reflow
        loginBox.style.animation = 'shake 0.5s';
        
        document.getElementById('password').value = '';
        document.getElementById('password').focus();
    }
});

// Permitir login com Enter
document.getElementById('password').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        document.getElementById('loginBtn').click();
    }
});

// Botão de desligar
// Botão de desligar - versão melhorada
document.getElementById('powerBtn').addEventListener('click', () => {
    const modal = document.createElement('div');
    modal.className = 'shutdown-modal';

    const modalContent = document.createElement('div');
    modalContent.className = 'shutdown-modal-content';

    const message = document.createElement('p');
    message.textContent = 'Deseja realmente desligar o computador?';
    message.style.color = '#fff';
    message.style.marginBottom = '20px';
    message.style.fontSize = '16px';

    const btnContainer = document.createElement('div');
    btnContainer.style.display = 'flex';
    btnContainer.style.justifyContent = 'center';
    btnContainer.style.gap = '10px';

    const confirmBtn = document.createElement('button');
    confirmBtn.textContent = 'Desligar';
    confirmBtn.className = 'shutdown-modal-btn confirm';
    confirmBtn.style.padding = '8px 20px';
    confirmBtn.style.border = 'none';
    confirmBtn.style.borderRadius = '5px';
    confirmBtn.style.backgroundColor = '#e74c3c';
    confirmBtn.style.color = 'white';
    confirmBtn.style.cursor = 'pointer';

    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = 'Cancelar';
    cancelBtn.className = 'shutdown-modal-btn cancel';
    cancelBtn.style.padding = '8px 20px';
    cancelBtn.style.border = 'none';
    cancelBtn.style.borderRadius = '5px';
    cancelBtn.style.backgroundColor = '#3498db';
    cancelBtn.style.color = 'white';
    cancelBtn.style.cursor = 'pointer';

    // Hover effects
    confirmBtn.onmouseover = () => confirmBtn.style.backgroundColor = '#c0392b';
    confirmBtn.onmouseout = () => confirmBtn.style.backgroundColor = '#e74c3c';
    cancelBtn.onmouseover = () => cancelBtn.style.backgroundColor = '#2980b9';
    cancelBtn.onmouseout = () => cancelBtn.style.backgroundColor = '#3498db';

    // Botão Desligar
    confirmBtn.addEventListener('click', () => {
        document.body.classList.add('fade-out');
        setTimeout(() => {
            window.location.href = 'shutdown.html';
        }, 1000);
    });

    // Botão Cancelar
    cancelBtn.addEventListener('click', () => {
        modal.remove();
    });

    // Fechar ao clicar fora
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });

    btnContainer.appendChild(cancelBtn);
    btnContainer.appendChild(confirmBtn);
    modalContent.appendChild(message);
    modalContent.appendChild(btnContainer);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
});


// Adicionar animação de shake
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
`;
document.head.appendChild(style);

// Inicializar
updateClock();
setInterval(updateClock, 1000);
loadUsers();