// Sistema Operacional Simulado
class MacIOS {
    constructor() {
        this.apps = [];
        this.windows = [];
        this.files = JSON.parse(localStorage.getItem('savedFiles')) || [];
        this.init();
        this.setupParallax();
        this.initTheme();
        this.initWallpaper()
    }

    init() {
        this.setupClock();
        this.setupDockEffects();
        this.setupDesktop();
        this.loadSavedFiles();
        this.registerDefaultApps();
        this.applySavedIconPositions();
        this.setupTiltEffect() 
    }

    showFolderPrompt() {
        return new Promise((resolve) => {
            const overlay = document.createElement('div');
            overlay.className = 'custom-prompt-overlay';
            
            const prompt = document.createElement('div');
            prompt.className = 'custom-prompt explorer-prompt';
            prompt.innerHTML = `
                <div class="custom-prompt-title">
                    <i class="fas fa-folder-plus" style="margin-right: 10px; color: #4a90e2;"></i>
                    Nova Pasta
                </div>
                <input type="text" class="custom-prompt-input" placeholder="Nome da pasta" autofocus>
                <div class="custom-prompt-buttons">
                    <button class="custom-prompt-button cancel">Cancelar</button>
                    <button class="custom-prompt-button confirm">Criar</button>
                </div>
            `;
            
            overlay.appendChild(prompt);
            document.body.appendChild(overlay);
            
            const input = prompt.querySelector('.custom-prompt-input');
            const cancelBtn = prompt.querySelector('.cancel');
            const confirmBtn = prompt.querySelector('.confirm');
            
            const cleanup = () => {
                document.body.removeChild(overlay);
            };
            
            cancelBtn.addEventListener('click', () => {
                cleanup();
                resolve(null);
            });
            
            confirmBtn.addEventListener('click', () => {
                const folderName = input.value.trim();
                if (folderName) {
                    cleanup();
                    resolve(folderName);
                } else {
                    input.focus();
                }
            });
            
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const folderName = input.value.trim();
                    if (folderName) {
                        cleanup();
                        resolve(folderName);
                    }
                }
            });
            
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    cleanup();
                    resolve(null);
                }
            });
        });
    }

    // Substitua o método createNewFile por este:
createNewFile() {
    return new Promise((resolve) => {
        const overlay = document.createElement('div');
        overlay.className = 'custom-prompt-overlay';
        
        const prompt = document.createElement('div');
        prompt.className = 'custom-prompt';
        prompt.innerHTML = `
            <div class="custom-prompt-title">Novo Arquivo</div>
            <input type="text" class="custom-prompt-input" placeholder="Digite o nome do arquivo (ex: documento.txt)" autofocus>
            <div class="custom-prompt-buttons">
                <button class="custom-prompt-button cancel">Cancelar</button>
                <button class="custom-prompt-button confirm">Criar</button>
            </div>
        `;
        
        overlay.appendChild(prompt);
        document.body.appendChild(overlay);
        
        const input = prompt.querySelector('.custom-prompt-input');
        const cancelBtn = prompt.querySelector('.cancel');
        const confirmBtn = prompt.querySelector('.confirm');
        
        const cleanup = () => {
            document.body.removeChild(overlay);
        };
        
        cancelBtn.addEventListener('click', () => {
            cleanup();
            resolve(null);
        });
        
        confirmBtn.addEventListener('click', () => {
            const fileName = input.value.trim();
            cleanup();
            resolve(fileName);
        });
        
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const fileName = input.value.trim();
                cleanup();
                resolve(fileName);
            }
        });
        
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                cleanup();
                resolve(null);
            }
        });
    }).then(fileName => {
        if (!fileName) return;
        
        // Criar um objeto de arquivo vazio
        const fileData = {
            id: Date.now(),
            name: fileName,
            content: '',
            x: Math.random() * (window.innerWidth - 100),
            y: Math.random() * (window.innerHeight - 150)
        };

        // Adicionar à lista de arquivos
        this.files.push(fileData);
        localStorage.setItem('savedFiles', JSON.stringify(this.files));

        // Criar ícone na área de trabalho
        this.createFileIcon(fileData);

        // Abrir o arquivo no editor de notas
        this.openFile(fileData.id);
    });
}

createNewFolder() {
    return new Promise((resolve) => {
        const overlay = document.createElement('div');
        overlay.className = 'custom-prompt-overlay';
        
        const prompt = document.createElement('div');
        prompt.className = 'custom-prompt';
        prompt.innerHTML = `
            <div class="custom-prompt-title">Nova Pasta</div>
            <input type="text" class="custom-prompt-input" placeholder="Digite o nome da pasta" autofocus>
            <div class="custom-prompt-buttons">
                <button class="custom-prompt-button cancel">Cancelar</button>
                <button class="custom-prompt-button confirm">Criar</button>
            </div>
        `;
        
        overlay.appendChild(prompt);
        document.body.appendChild(overlay);
        
        const input = prompt.querySelector('.custom-prompt-input');
        const cancelBtn = prompt.querySelector('.cancel');
        const confirmBtn = prompt.querySelector('.confirm');
        
        const cleanup = () => {
            document.body.removeChild(overlay);
        };
        
        cancelBtn.addEventListener('click', () => {
            cleanup();
            resolve(null);
        });
        
        confirmBtn.addEventListener('click', () => {
            const folderName = input.value.trim();
            cleanup();
            resolve(folderName);
        });
        
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const folderName = input.value.trim();
                cleanup();
                resolve(folderName);
            }
        });
        
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                cleanup();
                resolve(null);
            }
        });
    }).then(folderName => {
        if (!folderName) return;

        const fileSystem = JSON.parse(localStorage.getItem('fileSystem')) || {
            '/': {
                type: 'directory',
                children: {}
            }
        };

        let currentDir = fileSystem['/'];
        
        if (!currentDir.children[folderName]) {
            currentDir.children[folderName] = {
                type: 'directory',
                children: {}
            };
            
            localStorage.setItem('fileSystem', JSON.stringify(fileSystem));
            
            // Atualizar visualização se o explorador estiver aberto
            const explorerWindow = this.windows.find(w => w.id === 'explorer');
            if (explorerWindow && explorerWindow.element.style.display === 'flex') {
                const currentPath = explorerWindow.element.querySelector('#currentPath').textContent;
                this.renderFiles(currentPath);
            }
        } else {
            this.showAlert('Já existe uma pasta com esse nome!');
        }
    });
}
    initWallpaper() {
        const savedWallpaper = localStorage.getItem('wallpaper');
        if (savedWallpaper && (savedWallpaper.startsWith('data:image') || savedWallpaper.startsWith('http'))) {
            document.body.style.backgroundImage = `url(${savedWallpaper})`;
        }
    
        const dock = document.querySelector('.dock');
        if (!dock) {
            console.warn("Dock não encontrado. Botão de papel de parede não foi adicionado.");
            return;
        }
    
        // Evita duplicação do botão
        if (dock.querySelector('.wallpaper-button')) return;
    
        const wallpaperButton = document.createElement('div');
        wallpaperButton.className = 'dock-item wallpaper-button';
        wallpaperButton.innerHTML = '<i class="fas fa-image" style="color: #6c5ce7;"></i>';
        wallpaperButton.title = 'Trocar Papel de Parede';
    
        wallpaperButton.addEventListener('click', () => {
            this.showWallpaperMenu();
        });
    
        dock.appendChild(wallpaperButton);
    }
    
    
    showWallpaperMenu() {
        const existing = document.querySelector('.wallpaper-menu');
        if (existing) existing.remove();
    
        const wallpapers = [
            { name: 'Padrão', url: '/imgs/pexels-iriser-1366957.jpg' },
            { name: 'Gradiente', url: 'https://images.pexels.com/photos/339119/pexels-photo-339119.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
            { name: 'Natureza', url: 'https://example.com/nature.jpg' },
            { name: 'Abstrato', url: 'https://example.com/abstract.jpg' },
            { name: 'Personalizado...', url: null }
        ];
    
        const menu = document.createElement('div');
        menu.className = 'wallpaper-menu';
        Object.assign(menu.style, {
            position: 'absolute',
            bottom: '70px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(40, 40, 40, 0.9)',
            backdropFilter: 'blur(20px)',
            borderRadius: '10px',
            padding: '10px',
            boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
            zIndex: '1000'
        });
    
        wallpapers.forEach(wp => {
            const item = document.createElement('div');
            item.className = 'wallpaper-item';
            item.textContent = wp.name;
            Object.assign(item.style, {
                padding: '8px 15px',
                borderRadius: '5px',
                cursor: 'pointer',
                margin: '2px 0'
            });
    
            item.addEventListener('mouseenter', () => {
                item.style.background = 'rgba(255,255,255,0.1)';
            });
    
            item.addEventListener('mouseleave', () => {
                item.style.background = 'transparent';
            });
    
            item.addEventListener('click', () => {
                if (wp.url) {
                    this.changeWallpaper(wp.url);
                } else {
                    const url = prompt("Digite a URL da nova imagem de fundo:");
                    if (url && (url.startsWith('http') || url.startsWith('data:image'))) {
                        this.changeWallpaper(url);
                    } else {
                        alert("URL inválida.");
                    }
                }
                menu.remove();
            });
    
            menu.appendChild(item);
        });
    
        document.body.appendChild(menu);
    
        const closeMenu = (e) => {
            if (!menu.contains(e.target)) {
                menu.remove();
                document.removeEventListener('click', closeMenu);
            }
        };
    
        setTimeout(() => {
            document.addEventListener('click', closeMenu);
        }, 100);
    }
    
    
    changeWallpaper(url) {
        if (typeof url !== 'string' || (!url.startsWith('http') && !url.startsWith('data:image') && !url.startsWith('/'))) {
            alert('URL inválida para papel de parede.');
            return;
        }
    
        document.body.style.backgroundImage = `url(${url})`;
        localStorage.setItem('wallpaper', url);
    
        const layer1 = document.querySelector('.layer-1');
        if (layer1) {
            layer1.style.backgroundImage = `url(${url})`;
        }
    }
    
    updateThemeIcon() {
        const themeIcon = document.getElementById('themeIcon');
        if (!themeIcon) return;
    
        if (document.body.classList.contains('dark-mode')) {
            themeIcon.classList.replace('fa-sun', 'fa-moon');
        } else {
            themeIcon.classList.replace('fa-moon', 'fa-sun');
        }
    }
    

    toggleTheme() {
        if (document.body.classList.contains('dark-mode')) {
            document.body.classList.replace('dark-mode', 'light-mode');
            localStorage.setItem('theme', 'light-mode');
        } else {
            document.body.classList.replace('light-mode', 'dark-mode');
            localStorage.setItem('theme', 'dark-mode');
        }
    
        this.updateThemeIcon();
    }
    

    initTheme() {
        const savedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (savedTheme) {
            document.body.classList.add(savedTheme);
        } else if (systemPrefersDark) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.add('light-mode');
        }
        
        this.updateThemeIcon();
        
        // Configurar alternância de tema
        document.querySelector('.theme-toggle').addEventListener('click', () => {
            this.toggleTheme();
        });
    }

    setupParallax() {
        const layers = document.querySelectorAll('.parallax-layer');
        if (layers.length === 0) return;
    
        let x = 0, y = 0;
    
        document.addEventListener('mousemove', (e) => {
            x = e.clientX / window.innerWidth;
            y = e.clientY / window.innerHeight;
        });
    
        const animate = () => {
            layers.forEach((layer, index) => {
                const speed = (index + 1) * 0.02;
                const xOffset = x * speed * 100;
                const yOffset = y * speed * 100;
                layer.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
            });
    
            requestAnimationFrame(animate);
        };
    
        animate();
    }
    

    setupTiltEffect() {
        const desktop = document.getElementById('desktop');
        if (!desktop) return;
    
        desktop.addEventListener('mousemove', (e) => {
            const xAxis = (window.innerWidth / 2 - e.pageX) / 25;
            const yAxis = (window.innerHeight / 2 - e.pageY) / 25;
            desktop.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
        });
    
        desktop.addEventListener('mouseleave', () => {
            desktop.style.transform = 'rotateY(0deg) rotateX(0deg)';
            desktop.style.transition = 'transform 0.5s ease';
            setTimeout(() => {
                desktop.style.transition = '';
            }, 500);
        });
    }
    
    // Configuração do relógio
    setupClock() {
        const timeEl = document.getElementById('time-display');
        if (!timeEl) return;
    
        const updateClock = () => {
            const now = new Date();
            const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            timeEl.textContent = timeString;
        };
    
        updateClock();
        setInterval(updateClock, 60000);
    }
    

    // Efeitos do Dock
    setupDockEffects() {
        const dock = document.querySelector('.dock');
        if (!dock) return;
    
        dock.addEventListener('mousemove', (e) => {
            const dockRect = dock.getBoundingClientRect();
            const mouseX = e.clientX - dockRect.left;
            const center = dockRect.width / 2;
    
            document.querySelectorAll('.dock-item').forEach(item => {
                const itemX = item.offsetLeft + item.offsetWidth / 2;
                const distance = Math.abs(itemX - mouseX);
                const scale = Math.max(1, Math.min(1.4, 1 + (0.4 * (1 - distance / center))));
                item.style.transform = `scale(${scale})`;
            });
        });
    
        dock.addEventListener('mouseleave', () => {
            document.querySelectorAll('.dock-item').forEach(item => {
                item.style.transform = 'scale(1)';
            });
        });
    }
    
    // Configuração do Desktop
    setupDesktop() {
        
        this.makeIconsDraggable();
        
        // Efeito de clique nos ícones
        document.addEventListener('click', (e) => {
            const icon = e.target.closest('.icon, .dock-item');
            if (!icon) return;
            
            icon.style.transform = 'scale(0.9)';
            setTimeout(() => {
                icon.style.transform = icon.classList.contains('dock-item') ? 'scale(1.2)' : 'scale(1)';
            }, 100);
        });
        
        // Suporte para arrastar e soltar imagens como papel de parede
        document.addEventListener('dragover', (e) => {
            e.preventDefault();
        });
        
        document.addEventListener('drop', (e) => {
            e.preventDefault();
            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    this.changeWallpaper(event.target.result);
                };
                reader.readAsDataURL(file);
            }
        });
    
        // Menu de contexto personalizado
        document.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            
            
            // Remover menu antigo, se houver
            const oldMenu = document.querySelector('.custom-context-menu');
            if (oldMenu) oldMenu.remove();
            
            // Criar novo menu
            const menu = document.createElement('div');
            menu.className = 'custom-context-menu';
            
            // Verificar se o clique foi em um ícone
            const icon = e.target.closest('.icon');
            const isFileIcon = icon && icon.classList.contains('file');
            
            // Opções do menu
            const options = [
                {
                    text: 'Novo Arquivo',
                    icon: 'fa-file-alt',
                    action: () => {
                        this.createNewFile();
                    }
                },
                {
                    text: 'Nova Pasta',
                    icon: 'fa-folder-plus',
                    action: () => {
                        macos.createNewFolder();
                    }
                },
                { separator: true },
                {
                    text: 'Alterar Papel de Parede',
                    icon: 'fa-image',
                    action: () => this.showWallpaperMenu()
                },
                {
                    text: 'Alternar Tema',
                    icon: document.body.classList.contains('dark-mode') ? 'fa-sun' : 'fa-moon',
                    action: () => this.toggleTheme()
                }
            ];
    
            // Se for um ícone de arquivo, adicionar opções específicas
            if (isFileIcon) {
                options.unshift(
                    {
                        text: 'Abrir',
                        icon: 'fa-folder-open',
                        action: () => {
                            const fileId = parseInt(icon.getAttribute('data-file-id'));
                            this.openFile(fileId);
                        }
                    },
                    {
                        text: 'Excluir',
                        icon: 'fa-trash',
                        action: () => {
                            const fileId = parseInt(icon.getAttribute('data-file-id'));
                            const fileIndex = this.files.findIndex(f => f.id === fileId);
                            if (fileIndex !== -1) {
                                const deletedFile = this.files.splice(fileIndex, 1)[0];
                                
                                // Mover para lixeira
                                const trash = JSON.parse(localStorage.getItem('trashFiles')) || [];
                                trash.push(deletedFile);
                                localStorage.setItem('trashFiles', JSON.stringify(trash));
                                
                                localStorage.setItem('savedFiles', JSON.stringify(this.files));
                                icon.remove();
                                
                                // Remover posição salva
                                const savedIcons = JSON.parse(localStorage.getItem('savedIcons')) || {};
                                for (let key in savedIcons) {
                                    if (savedIcons[key].appId == fileId) {
                                        delete savedIcons[key];
                                        break;
                                    }
                                }
                                localStorage.setItem('savedIcons', JSON.stringify(savedIcons));
                            }
                        }
                    },
                    { separator: true }
                );
            }
    
            // Adicionar itens ao menu
            options.forEach(opt => {
                if (opt.separator) {
                    const separator = document.createElement('div');
                    separator.className = 'separator';
                    menu.appendChild(separator);
                } else {
                    const item = document.createElement('div');
                    item.className = 'context-item';
                    item.innerHTML = `
                        <i class="fas ${opt.icon}" style="margin-right: 10px;"></i>
                        ${opt.text}
                    `;
                    item.addEventListener('click', () => {
                        opt.action();
                        menu.remove();
                    });
                    menu.appendChild(item);
                }
            });
    
            document.body.appendChild(menu);
            
            // Posicionar o menu
            const x = Math.min(e.pageX, window.innerWidth - menu.offsetWidth - 10);
            const y = Math.min(e.pageY, window.innerHeight - menu.offsetHeight - 10);
            
            menu.style.left = `${x}px`;
            menu.style.top = `${y}px`;
            menu.style.display = 'block';
            
            // Fechar menu ao clicar fora
            const closeMenu = (e) => {
                if (!menu.contains(e.target)) {
                    menu.remove();
                    document.removeEventListener('click', closeMenu);
                }
            };
            
            setTimeout(() => {
                document.addEventListener('click', closeMenu);
            }, 100);
        });
    }
    // Tornar ícones arrastáveis
    makeIconsDraggable() {
        // Carrega posições salvas dos ícones
        const savedIcons = JSON.parse(localStorage.getItem('savedIcons')) || {};
        
        interact('.icon').draggable({
            inertia: true,
            modifiers: [
                interact.modifiers.restrictRect({
                    restriction: 'parent',
                    endOnly: true
                })
            ],
            listeners: {
                start(event) {
                    event.target.style.zIndex = 10;
                    event.target.style.transform = 'scale(1.1)';
                    event.target.style.filter = 'brightness(1.2)';
                    
                    // Inicializa posições se não existirem
                    if (!event.target.hasAttribute('data-x')) {
                        const iconId = event.target.dataset.appId || 'icon-' + Math.random().toString(36).substr(2, 9);
                        event.target.setAttribute('data-icon-id', iconId);
                        event.target.setAttribute('data-x', '0');
                        event.target.setAttribute('data-y', '0');
                    }
                },
                move(event) {
                    const target = event.target;
                    const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
                    const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
                    
                    target.style.transform = `translate(${x}px, ${y}px) scale(1.1)`;
                    target.setAttribute('data-x', x);
                    target.setAttribute('data-y', y);
                },
                end(event) {
                    const target = event.target;
                    target.style.zIndex = '';
                    target.style.transform = `translate(${target.getAttribute('data-x')}px, ${target.getAttribute('data-y')}px) scale(1)`;
                    target.style.filter = 'brightness(1)';
                    
                    // Salva a posição do ícone
                    this.saveIconPosition(target);
                }
            }
        });
        
        // Aplica posições salvas aos ícones
        this.applySavedIconPositions();
    }
    
    // Novo método para salvar posição dos ícones
    saveIconPosition(iconElement) {
        const iconId = iconElement.getAttribute('data-icon-id') || 
                      iconElement.dataset.appId || 
                      'icon-' + Math.random().toString(36).substr(2, 9);
        
        const savedIcons = JSON.parse(localStorage.getItem('savedIcons')) || {};
        
        savedIcons[iconId] = {
            x: parseFloat(iconElement.getAttribute('data-x')) || 0,
            y: parseFloat(iconElement.getAttribute('data-y')) || 0,
            elementType: iconElement.classList.contains('file') ? 'file' : 'app',
            appId: iconElement.dataset.appId
        };
        
        localStorage.setItem('savedIcons', JSON.stringify(savedIcons));
    }
    
    // Novo método para aplicar posições salvas
    applySavedIconPositions() {
        const savedIcons = JSON.parse(localStorage.getItem('savedIcons')) || {};
        
        Object.keys(savedIcons).forEach(iconId => {
            const iconData = savedIcons[iconId];
            let iconElement;
            
            if (iconData.elementType === 'file') {
                iconElement = document.querySelector(`.file[data-file-id="${iconData.appId}"]`);
            } else {
                iconElement = document.querySelector(`.icon[data-app-id="${iconData.appId}"]`);
            }
            
            if (iconElement) {
                iconElement.setAttribute('data-icon-id', iconId);
                iconElement.setAttribute('data-x', iconData.x);
                iconElement.setAttribute('data-y', iconData.y);
                iconElement.style.transform = `translate(${iconData.x}px, ${iconData.y}px)`;
            }
        });
    }

    // Registrar aplicativos padrão
    registerDefaultApps() {


    this.registerApp({
    id: 'notes',
    name: 'Notas',
    icon: 'fa-file-alt',
    iconColor: '#ffeb3b',
    defaultX: 4,
    defaultY: 0,
    windowWidth: '500px',
    windowHeight: '600px',
    windowTitle: 'Bloco de Notas',
    template: `
        <div class="window-content notes-container">
            <div class="notes-toolbar">
                <button class="notes-toolbar-button" id="newNoteBtn" title="Novo">
                    <i class="fas fa-file"></i>
                </button>
                <button class="notes-toolbar-button" id="saveNoteBtn" title="Salvar">
                    <i class="fas fa-save"></i>
                </button>
                <button class="notes-toolbar-button" id="deleteNoteBtn" title="Excluir">
                    <i class="fas fa-trash"></i>
                </button>
                <div class="notes-toolbar-separator"></div>
                <button class="notes-toolbar-button" id="boldBtn" title="Negrito">
                    <i class="fas fa-bold"></i>
                </button>
                <button class="notes-toolbar-button" id="italicBtn" title="Itálico">
                    <i class="fas fa-italic"></i>
                </button>
                <button class="notes-toolbar-button" id="underlineBtn" title="Sublinhado">
                    <i class="fas fa-underline"></i>
                </button>
                <div class="notes-toolbar-separator"></div>
                <div class="notes-title-container">
                    <input type="text" id="notesTitle" placeholder="Sem título" class="notes-title-input">
                </div>
            </div>
            <div class="notes-editor-container">
                <div id="notesEditor" contenteditable="true" class="notes-editor"></div>
            </div>
            <div class="notes-status-bar">
                <span class="notes-status-text" id="notesStatus">Pronto</span>
                <span class="notes-word-count" id="notesWordCount">0 palavras</span>
            </div>
        </div>
    `,
    onOpen: (windowElement) => {
        const editor = windowElement.querySelector('#notesEditor');
        const titleInput = windowElement.querySelector('#notesTitle');
        const wordCount = windowElement.querySelector('#notesWordCount');
        const statusText = windowElement.querySelector('#notesStatus');
        
        // Carregar conteúdo salvo
        const savedNotes = localStorage.getItem('macos-notes');
        if (savedNotes) {
            editor.innerHTML = savedNotes;
        }
        
        // Atualizar contagem de palavras
        const updateWordCount = () => {
            const text = editor.innerText.trim();
            const words = text ? text.split(/\s+/).length : 0;
            wordCount.textContent = `${words} palavra${words !== 1 ? 's' : ''}`;
        };
        
        // Event listeners
        editor.addEventListener('input', () => {
            localStorage.setItem('macos-notes', editor.innerHTML);
            updateWordCount();
            statusText.textContent = "Modificado";
        });
        
        windowElement.querySelector('#newNoteBtn').addEventListener('click', () => {
            editor.innerHTML = '';
            titleInput.value = 'Sem título';
            statusText.textContent = "Novo documento criado";
            updateWordCount();
        });
        
        windowElement.querySelector('#saveNoteBtn').addEventListener('click', () => {
            statusText.textContent = "Documento salvo";
            setTimeout(() => {
                statusText.textContent = "Pronto";
            }, 2000);
        });
        
        windowElement.querySelector('#deleteNoteBtn').addEventListener('click', () => {
            if (confirm("Tem certeza que deseja excluir esta nota?")) {
                editor.innerHTML = '';
                titleInput.value = 'Sem título';
                statusText.textContent = "Documento excluído";
                localStorage.removeItem('macos-notes');
                updateWordCount();
            }
        });
        
        // Formatação de texto
        const formatText = (command) => {
            document.execCommand(command, false, null);
            editor.focus();
            statusText.textContent = `Texto formatado: ${command}`;
            setTimeout(() => {
                statusText.textContent = "Pronto";
            }, 2000);
        };
        
        windowElement.querySelector('#boldBtn').addEventListener('click', () => formatText('bold'));
        windowElement.querySelector('#italicBtn').addEventListener('click', () => formatText('italic'));
        windowElement.querySelector('#underlineBtn').addEventListener('click', () => formatText('underline'));
        
        // Atualizar contagem inicial
        updateWordCount();
    },
    menuItems: [
        { 
            text: 'Novo', 
            action: (windowElement) => {
                windowElement.querySelector('#newNoteBtn').click();
            }
        },
        { 
            text: 'Salvar', 
            action: (windowElement) => {
                windowElement.querySelector('#saveNoteBtn').click();
            }
        },
        { 
            text: 'Salvar Como...', 
            action: this.saveAsFile.bind(this) 
        },
        { 
            text: 'Excluir', 
            action: (windowElement) => {
                windowElement.querySelector('#deleteNoteBtn').click();
            }
        },
        { separator: true },
        { 
            text: 'Fechar', 
            action: (windowElement) => {
                windowElement.style.display = 'none';
            }
        }
    ]
});
        // Substitua o app de configurações existente por este:
this.registerApp({
    id: 'settings',
    name: 'Configurações',
    icon: 'fa-cog',
    iconColor: '#9e9e9e',
    defaultX: 5,
    defaultY: 1,
    windowWidth: '700px',
    windowHeight: '600px',
    windowTitle: 'Configurações do Sistema',
    template: `
        <div class="window-content settings-container">
            <div class="settings-sidebar">
                <div class="sidebar-item active" data-section="appearance">
                    <i class="fas fa-palette"></i>
                    <span>Aparência</span>
                </div>
                <div class="sidebar-item" data-section="desktop">
                    <i class="fas fa-desktop"></i>
                    <span>Área de Trabalho</span>
                </div>
                <div class="sidebar-item" data-section="dock">
                    <i class="fas fa-window-restore"></i>
                    <span>Dock</span>
                </div>
                <div class="sidebar-item" data-section="system">
                    <i class="fas fa-microchip"></i>
                    <span>Sistema</span>
                </div>
                <div class="sidebar-item" data-section="about">
                    <i class="fas fa-info-circle"></i>
                    <span>Sobre</span>
                </div>
            </div>
            
            <div class="settings-content">
                <!-- Seção Aparência -->
                <div class="settings-section" id="appearance-section">
                    <h2><i class="fas fa-palette"></i> Aparência</h2>
                    
                    <div class="settings-group">
                        <h3>Tema do Sistema</h3>
                        <div class="theme-options">
                            <div class="theme-option" data-theme="light">
                                <div class="theme-preview light-theme"></div>
                                <span>Claro</span>
                            </div>
                            <div class="theme-option" data-theme="dark">
                                <div class="theme-preview dark-theme"></div>
                                <span>Escuro</span>
                            </div>
                            <div class="theme-option" data-theme="auto">
                                <div class="theme-preview auto-theme">
                                    <div class="light-half"></div>
                                    <div class="dark-half"></div>
                                </div>
                                <span>Automático</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="settings-group">
                        <h3>Papel de Parede</h3>
                        <div class="wallpaper-grid">
                            <div class="wallpaper-thumb" data-url="/imgs/pexels-iriser-1366957.jpg" style="background-image: url('/imgs/pexels-iriser-1366957.jpg')"></div>
                            <div class="wallpaper-thumb" data-url="https://images.unsplash.com/photo-1506318137071-a8e063b4bec0" style="background-image: url('https://images.unsplash.com/photo-1506318137071-a8e063b4bec0')"></div>
                            <div class="wallpaper-thumb" data-url="https://images.unsplash.com/photo-1462331940025-496dfbfc7564" style="background-image: url('https://images.unsplash.com/photo-1462331940025-496dfbfc7564')"></div>
                            <div class="wallpaper-thumb" data-url="https://images.unsplash.com/photo-1542273917363-3b1817f69a2d" style="background-image: url('https://images.unsplash.com/photo-1542273917363-3b1817f69a2d')"></div>
                            <div class="wallpaper-thumb" data-url="https://images.unsplash.com/photo-1451187580459-43490279c0fa" style="background-image: url('https://images.unsplash.com/photo-1451187580459-43490279c0fa')"></div>
                            <div class="wallpaper-thumb custom-wallpaper">
                                <i class="fas fa-plus"></i>
                                <span>Personalizado</span>
                            </div>
                        </div>
                        <button class="settings-button" id="selectWallpaperBtn">
                            <i class="fas fa-folder-open"></i> Selecionar da Biblioteca
                        </button>
                    </div>
                    
                    <div class="settings-group">
                        <h3>Efeitos Visuais</h3>
                        <div class="toggle-option">
                            <label>
                                <input type="checkbox" id="parallaxToggle" checked>
                                <span class="toggle-slider"></span>
                                Efeito Parallax
                            </label>
                        </div>
                        <div class="toggle-option">
                            <label>
                                <input type="checkbox" id="tiltEffectToggle" checked>
                                <span class="toggle-slider"></span>
                                Efeito de Inclinação
                            </label>
                        </div>
                        <div class="toggle-option">
                            <label>
                                <input type="checkbox" id="animationsToggle" checked>
                                <span class="toggle-slider"></span>
                                Animações
                            </label>
                        </div>
                    </div>
                </div>
                
                <!-- Seção Área de Trabalho -->
                <div class="settings-section" id="desktop-section" style="display:none;">
                    <h2><i class="fas fa-desktop"></i> Área de Trabalho</h2>
                    
                    <div class="settings-group">
                        <h3>Ícones</h3>
                        <div class="toggle-option">
                            <label>
                                <input type="checkbox" id="showIconsToggle" checked>
                                <span class="toggle-slider"></span>
                                Mostrar Ícones
                            </label>
                        </div>
                        <div class="toggle-option">
                            <label>
                                <input type="checkbox" id="snapToGridToggle" checked>
                                <span class="toggle-slider"></span>
                                Alinhar à Grade
                            </label>
                        </div>
                        <div class="toggle-option">
                            <label>
                                <input type="checkbox" id="showExtensionsToggle">
                                <span class="toggle-slider"></span>
                                Mostrar Extensões de Arquivos
                            </label>
                        </div>
                    </div>
                    
                    <div class="settings-group">
                        <h3>Tamanho dos Ícones</h3>
                        <div class="slider-container">
                            <input type="range" id="iconSizeSlider" min="60" max="120" value="80">
                            <span id="iconSizeValue">80px</span>
                        </div>
                    </div>
                </div>
                
                <!-- Seção Dock -->
                <div class="settings-section" id="dock-section" style="display:none;">
                    <h2><i class="fas fa-window-restore"></i> Dock</h2>
                    
                    <div class="settings-group">
                        <h3>Posição do Dock</h3>
                        <div class="radio-options">
                            <label>
                                <input type="radio" name="dockPosition" value="bottom" checked>
                                <span>Inferior</span>
                            </label>
                            <label>
                                <input type="radio" name="dockPosition" value="left">
                                <span>Esquerda</span>
                            </label>
                            <label>
                                <input type="radio" name="dockPosition" value="right">
                                <span>Direita</span>
                            </label>
                        </div>
                    </div>
                    
                    <div class="settings-group">
                        <h3>Tamanho do Dock</h3>
                        <div class="slider-container">
                            <input type="range" id="dockSizeSlider" min="40" max="100" value="50">
                            <span id="dockSizeValue">50%</span>
                        </div>
                    </div>
                    
                    <div class="settings-group">
                        <h3>Comportamento</h3>
                        <div class="toggle-option">
                            <label>
                                <input type="checkbox" id="dockMagnificationToggle" checked>
                                <span class="toggle-slider"></span>
                                Ampliação ao Passar o Mouse
                            </label>
                        </div>
                        <div class="toggle-option">
                            <label>
                                <input type="checkbox" id="dockAutoHideToggle">
                                <span class="toggle-slider"></span>
                                Ocultar Automaticamente
                            </label>
                        </div>
                    </div>
                </div>
                
                <!-- Seção Sistema -->
                <div class="settings-section" id="system-section" style="display:none;">
                    <h2><i class="fas fa-microchip"></i> Sistema</h2>
                    
                    <div class="settings-group">
                        <h3>Informações do Sistema</h3>
                        <div class="system-info">
                            <div class="info-row">
                                <span class="info-label">Nome do Sistema:</span>
                                <span class="info-value">MacIOS Simulado</span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">Versão:</span>
                                <span class="info-value">1.2.0</span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">Memória:</span>
                                <span class="info-value" id="memoryUsage">Carregando...</span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">Armazenamento:</span>
                                <span class="info-value" id="storageUsage">Carregando...</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="settings-group">
                        <h3>Atualizações</h3>
                        <div class="update-status">
                            <p>Seu sistema está atualizado.</p>
                            <button class="settings-button" id="checkUpdatesBtn">
                                <i class="fas fa-sync-alt"></i> Verificar Atualizações
                            </button>
                        </div>
                    </div>
                    
                    <div class="settings-group">
                        <h3>Segurança</h3>
                        <div class="toggle-option">
                            <label>
                                <input type="checkbox" id="firewallToggle" checked>
                                <span class="toggle-slider"></span>
                                Firewall Ativado
                            </label>
                        </div>
                    </div>
                </div>
                
                <!-- Seção Sobre -->
                <div class="settings-section" id="about-section" style="display:none;">
                    <h2><i class="fas fa-info-circle"></i> Sobre</h2>
                    
                    <div class="about-content">
                        <div class="about-logo">
                            <i class="fab fa-apple" style="font-size: 80px; color: #fff;"></i>
                        </div>
                        <div class="about-info">
                            <h3>MacIOS Simulado</h3>
                            <p>Versão 1.2.0</p>
                            <p>© 2023 Simulação de Sistema Operacional</p>
                            <p>Desenvolvido para fins educacionais</p>
                        </div>
                    </div>
                    
                    <div class="developer-info">
                        <h4>Desenvolvedor</h4>
                        <p>Nome: [Seu Nome]</p>
                        <p>Email: [seu@email.com]</p>
                        <p>GitHub: <a href="#" class="link">github.com/seuuser</a></p>
                    </div>
                </div>
            </div>
        </div>
    `,
    onOpen: (windowElement) => {
        // Carregar configurações salvas
        const settings = JSON.parse(localStorage.getItem('systemSettings')) || {
            theme: 'auto',
            wallpaper: '/imgs/pexels-iriser-1366957.jpg',
            parallaxEnabled: true,
            tiltEffectEnabled: true,
            animationsEnabled: true,
            showIcons: true,
            snapToGrid: true,
            showExtensions: false,
            dockPosition: 'bottom',
            dockSize: 50,
            dockMagnification: true,
            dockAutoHide: false,
            iconSize: 80,
            firewallEnabled: true
        };
        
        // Aplicar configurações salvas
        this.applySettings(settings);
        
        // Navegação na sidebar
        windowElement.querySelectorAll('.sidebar-item').forEach(item => {
            item.addEventListener('click', () => {
                const section = item.dataset.section;
                
                // Atualizar sidebar
                windowElement.querySelectorAll('.sidebar-item').forEach(i => {
                    i.classList.remove('active');
                });
                item.classList.add('active');
                
                // Mostrar seção correspondente
                windowElement.querySelectorAll('.settings-section').forEach(sec => {
                    sec.style.display = 'none';
                });
                document.getElementById(`${section}-section`).style.display = 'block';
            });
        });
        
        // Configurar controles de tema
        windowElement.querySelector(`.theme-option[data-theme="${settings.theme}"]`).classList.add('selected');
        
        windowElement.querySelectorAll('.theme-option').forEach(option => {
            option.addEventListener('click', () => {
                windowElement.querySelectorAll('.theme-option').forEach(o => o.classList.remove('selected'));
                option.classList.add('selected');
                
                const theme = option.dataset.theme;
                settings.theme = theme;
                localStorage.setItem('systemSettings', JSON.stringify(settings));
                
                if (theme === 'auto') {
                    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                    document.body.classList.add(systemPrefersDark ? 'dark-mode' : 'light-mode');
                } else {
                    document.body.classList.add(`${theme}-mode`);
                }
                
                this.updateThemeIcon();
            });
        });
        
        // Configurar seleção de papel de parede
        const currentWallpaper = localStorage.getItem('wallpaper') || settings.wallpaper;
        
        windowElement.querySelectorAll('.wallpaper-thumb:not(.custom-wallpaper)').forEach(thumb => {
            const url = thumb.getAttribute('data-url');
            if (url === currentWallpaper) {
                thumb.classList.add('selected');
            }
            
            thumb.addEventListener('click', () => {
                windowElement.querySelectorAll('.wallpaper-thumb').forEach(t => t.classList.remove('selected'));
                thumb.classList.add('selected');
                this.changeWallpaper(url);
                settings.wallpaper = url;
                localStorage.setItem('systemSettings', JSON.stringify(settings));
            });
        });
        
        // Configurar papel de parede personalizado
        windowElement.querySelector('.custom-wallpaper').addEventListener('click', () => {
            const url = prompt("Digite a URL da imagem ou arraste um arquivo:");
            if (url) {
                this.changeWallpaper(url);
                settings.wallpaper = url;
                localStorage.setItem('systemSettings', JSON.stringify(settings));
            }
        });
        
        // Configurar toggles
        const setupToggle = (id, property) => {
            const toggle = windowElement.querySelector(`#${id}`);
            toggle.checked = settings[property];
            
            toggle.addEventListener('change', () => {
                settings[property] = toggle.checked;
                localStorage.setItem('systemSettings', JSON.stringify(settings));
                
                // Aplicar mudanças imediatamente
                if (id === 'parallaxToggle') {
                    if (toggle.checked) {
                        this.setupParallax();
                    } else {
                        document.querySelectorAll('.parallax-layer').forEach(layer => {
                            layer.style.transform = 'none';
                        });
                    }
                } else if (id === 'tiltEffectToggle') {
                    if (toggle.checked) {
                        this.setupTiltEffect();
                    } else {
                        document.getElementById('desktop').style.transform = 'none';
                    }
                }
            });
        };
        
        setupToggle('parallaxToggle', 'parallaxEnabled');
        setupToggle('tiltEffectToggle', 'tiltEffectEnabled');
        setupToggle('animationsToggle', 'animationsEnabled');
        setupToggle('showIconsToggle', 'showIcons');
        setupToggle('snapToGridToggle', 'snapToGrid');
        setupToggle('showExtensionsToggle', 'showExtensions');
        setupToggle('dockMagnificationToggle', 'dockMagnification');
        setupToggle('dockAutoHideToggle', 'dockAutoHide');
        setupToggle('firewallToggle', 'firewallEnabled');
        
        // Configurar sliders
        const setupSlider = (id, property, unit, updateFn) => {
            const slider = windowElement.querySelector(`#${id}`);
            const valueDisplay = windowElement.querySelector(`#${id}Value`);
            
            slider.value = settings[property];
            valueDisplay.textContent = `${settings[property]}${unit}`;
            
            slider.addEventListener('input', () => {
                valueDisplay.textContent = `${slider.value}${unit}`;
                settings[property] = parseInt(slider.value);
                localStorage.setItem('systemSettings', JSON.stringify(settings));
                
                if (updateFn) {
                    updateFn(parseInt(slider.value));
                }
            });
        };
        
        setupSlider('iconSizeSlider', 'iconSize', 'px', (value) => {
            document.querySelectorAll('.icon').forEach(icon => {
                icon.style.width = `${value}px`;
                icon.style.height = `${value}px`;
                icon.querySelector('i').style.fontSize = `${value * 0.5}px`;
            });
        });
        
        setupSlider('dockSizeSlider', 'dockSize', '%', (value) => {
            const dock = document.querySelector('.dock');
            if (settings.dockPosition === 'bottom') {
                dock.style.height = `${value}px`;
                dock.style.width = 'auto';
            } else {
                dock.style.width = `${value}px`;
                dock.style.height = 'auto';
            }
        });
        
        // Configurar opções de posição do dock
        windowElement.querySelector(`input[name="dockPosition"][value="${settings.dockPosition}"]`).checked = true;
        
        windowElement.querySelectorAll('input[name="dockPosition"]').forEach(radio => {
            radio.addEventListener('change', () => {
                settings.dockPosition = radio.value;
                localStorage.setItem('systemSettings', JSON.stringify(settings));
                
                const dock = document.querySelector('.dock');
                dock.className = 'dock';
                dock.classList.add(radio.value);
                
                // Atualizar tamanho baseado na nova posição
                const sizeSlider = windowElement.querySelector('#dockSizeSlider');
                sizeSlider.dispatchEvent(new Event('input'));
            });
        });
        
        // Botão para selecionar papel de parede da biblioteca
        windowElement.querySelector('#selectWallpaperBtn').addEventListener('click', () => {
            this.showWallpaperMenu();
        });
        
        // Botão para verificar atualizações
        windowElement.querySelector('#checkUpdatesBtn').addEventListener('click', () => {
            const updateStatus = windowElement.querySelector('.update-status p');
            updateStatus.textContent = "Verificando atualizações...";
            
            setTimeout(() => {
                updateStatus.textContent = "Seu sistema está atualizado.";
            }, 2000);
        });
        
        // Atualizar informações do sistema
        this.updateSystemInfo(windowElement);
    },
    
    applySettings: function(settings) {
        // Aplicar tema
        if (settings.theme === 'auto') {
            const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            document.body.classList.add(systemPrefersDark ? 'dark-mode' : 'light-mode');
        } else {
            document.body.classList.add(`${settings.theme}-mode`);
        }
        
        // Aplicar papel de parede
        if (settings.wallpaper) {
            this.changeWallpaper(settings.wallpaper);
        }
        
        // Aplicar tamanho de ícones
        document.querySelectorAll('.icon').forEach(icon => {
            icon.style.width = `${settings.iconSize}px`;
            icon.style.height = `${settings.iconSize}px`;
            icon.querySelector('i').style.fontSize = `${settings.iconSize * 0.5}px`;
        });
        
        // Aplicar configurações do dock
        const dock = document.querySelector('.dock');
        dock.className = 'dock';
        dock.classList.add(settings.dockPosition);
        
        if (settings.dockPosition === 'bottom') {
            dock.style.height = `${settings.dockSize}px`;
            dock.style.width = 'auto';
        } else {
            dock.style.width = `${settings.dockSize}px`;
            dock.style.height = 'auto';
        }
        
        if (!settings.dockMagnification) {
            dock.removeEventListener('mousemove', this.dockMagnificationHandler);
        } else {
            this.setupDockEffects();
        }
        
        if (settings.dockAutoHide) {
            dock.style.opacity = '0.5';
            dock.style.transition = 'opacity 0.3s ease';
            
            dock.addEventListener('mouseenter', () => {
                dock.style.opacity = '1';
            });
            
            dock.addEventListener('mouseleave', () => {
                dock.style.opacity = '0.5';
            });
        }
        
        // Mostrar/ocultar ícones
        document.getElementById('desktop').style.display = settings.showIcons ? 'grid' : 'none';
    },
    
    updateSystemInfo: function(windowElement) {
        // Simular uso de memória
        const memoryUsed = Math.floor(Math.random() * 4) + 2; // 2-5 GB
        const memoryTotal = 8; // 8 GB
        const memoryPercent = Math.round((memoryUsed / memoryTotal) * 100);
        
        windowElement.querySelector('#memoryUsage').textContent = 
            `${memoryUsed} GB de ${memoryTotal} GB (${memoryPercent}%)`;
        
        // Simular uso de armazenamento
        const storageUsed = Math.floor(Math.random() * 100) + 50; // 50-150 GB
        const storageTotal = 256; // 256 GB
        const storagePercent = Math.round((storageUsed / storageTotal) * 100);
        
        windowElement.querySelector('#storageUsage').textContent = 
            `${storageUsed} GB de ${storageTotal} GB (${storagePercent}%)`;
    }
});
        // No método registerDefaultApps(), adicione este novo aplicativo:
        this.registerApp({
            id: 'explorer',
            name: 'Explorador',
            icon: 'fa-folder',
            iconColor: '#4a90e2',
            defaultX: 3,
            defaultY: 0,
            windowWidth: '800px',
            windowHeight: '600px',
            windowTitle: 'Explorador de Arquivos',
            template: `
                <div class="window-content">
                    <div class="explorer-container">
                        <div class="explorer-header">
                            <div class="window-controls">
                                <div class="window-control close"></div>
                                <div class="window-control minimize"></div>
                                <div class="window-control maximize"></div>
                            </div>
                            <div class="address-bar" id="currentPath">/</div>
                            <button class="new-folder-btn" id="newFolderBtn">
                                <i class="fas fa-plus"></i> Nova Pasta
                            </button>
                        </div>
                        <div class="explorer-body">
                            <div class="explorer-sidebar">
                                <div class="sidebar-item" data-path="/">
                                    <i class="fas fa-home"></i> Início
                                </div>
                                <div class="sidebar-item" data-path="/documents">
                                    <i class="fas fa-file-alt"></i> Documentos
                                </div>
                                <div class="sidebar-item" data-path="/downloads">
                                    <i class="fas fa-download"></i> Downloads
                                </div>
                                <div class="sidebar-item" data-path="/pictures">
                                    <i class="fas fa-image"></i> Imagens
                                </div>
                            </div>
                            <div class="explorer-files" id="fileList">
                                <!-- Arquivos e pastas serão exibidos aqui -->
                            </div>
                        </div>
                    </div>
                </div>
            `,
            onOpen: (windowElement) => {
                // Estrutura inicial do sistema de arquivos
                if (!localStorage.getItem('fileSystem')) {
                    const initialFileSystem = {
                        '/': {
                            type: 'directory',
                            children: {
                                'documents': { type: 'directory', children: {} },
                                'downloads': { type: 'directory', children: {} },
                                'pictures': { type: 'directory', children: {} }
                            }
                        }
                    };
                    localStorage.setItem('fileSystem', JSON.stringify(initialFileSystem));
                }
        
                const fileSystem = JSON.parse(localStorage.getItem('fileSystem'));
                let currentPath = '/';
        
                // Função para navegar até um caminho
                const navigateTo = (path) => {
                    currentPath = path;
                    windowElement.querySelector('#currentPath').textContent = path;
                    renderFiles(path);
                };
        
                // Função para renderizar os arquivos de um diretório
                const renderFiles = (path) => {
                    const fileList = windowElement.querySelector('#fileList');
                    fileList.innerHTML = '';
        
                    // Adicionar link para pasta pai (exceto na raiz)
                    if (path !== '/') {
                        const parentItem = document.createElement('div');
                        parentItem.className = 'file-icon folder';
                        parentItem.innerHTML = `
                            <i class="fas fa-level-up-alt"></i>
                            <span>..</span>
                        `;
                        parentItem.addEventListener('click', () => {
                            const parentPath = path.split('/').slice(0, -1).join('/') || '/';
                            navigateTo(parentPath);
                        });
                        fileList.appendChild(parentItem);
                    }
        
                    // Obter o diretório atual
                    const pathParts = path === '/' ? [] : path.split('/').filter(p => p);
                    let currentDir = fileSystem['/'];
        
                    for (const part of pathParts) {
                        if (currentDir.children && currentDir.children[part]) {
                            currentDir = currentDir.children[part];
                        } else {
                            console.error('Caminho não encontrado:', path);
                            return;
                        }
                    }
        
                    // Renderizar itens
                    if (currentDir.children) {
                        Object.entries(currentDir.children).forEach(([name, item]) => {
                            const fileItem = document.createElement('div');
                            fileItem.className = `file-icon ${item.type === 'directory' ? 'folder' : 'file'}`;
        
                            const icon = item.type === 'directory' ? 'fa-folder' : 'fa-file';
                            const iconColor = item.type === 'directory' ? '#4a90e2' : '#808080';
        
                            fileItem.innerHTML = `
                                <i class="fas ${icon}" style="color: ${iconColor}"></i>
                                <span>${name}</span>
                            `;
        
                            if (item.type === 'directory') {
                                fileItem.addEventListener('click', () => {
                                    const newPath = path === '/' ? `/${name}` : `${path}/${name}`;
                                    navigateTo(newPath);
                                });
                            } else {
                                fileItem.addEventListener('dblclick', () => {
                                    alert(`Abrindo arquivo: ${name}`);
                                });
                            }
        
                            fileList.appendChild(fileItem);
                        });
                    }
                };
        
                // Botão para criar nova pasta
                windowElement.querySelector('#newFolderBtn').addEventListener('click', () => {
                    this.showFolderPrompt().then(folderName => {
                        if (!folderName) return;
        
                        const fileSystem = JSON.parse(localStorage.getItem('fileSystem'));
                        const pathParts = currentPath === '/' ? [] : currentPath.split('/').filter(p => p);
                        let currentDir = fileSystem['/'];
        
                        for (const part of pathParts) {
                            currentDir = currentDir.children[part];
                        }
        
                        if (!currentDir.children[folderName]) {
                            currentDir.children[folderName] = {
                                type: 'directory',
                                children: {}
                            };
        
                            localStorage.setItem('fileSystem', JSON.stringify(fileSystem));
                            renderFiles(currentPath);
                        } else {
                            this.showAlert('Já existe uma pasta com esse nome!');
                        }
                    });
                });
        
                // Navegação pela sidebar
                windowElement.querySelectorAll('.sidebar-item').forEach(item => {
                    item.addEventListener('click', () => {
                        const path = item.dataset.path;
                        navigateTo(path);
                    });
                });
        
                // Iniciar na raiz
                navigateTo('/');
            },
            menuItems: [
                {
                    text: 'Nova Pasta',
                    action: (windowElement) => {
                        windowElement.querySelector('#newFolderBtn').click();
                    }
                },
                {
                    text: 'Atualizar',
                    action: (windowElement) => {
                        const currentPath = windowElement.querySelector('#currentPath').textContent;
                        const fileSystem = JSON.parse(localStorage.getItem('fileSystem'));
                        const pathParts = currentPath === '/' ? [] : currentPath.split('/').filter(p => p);
                        let currentDir = fileSystem['/'];
                        for (const part of pathParts) {
                            currentDir = currentDir.children[part];
                        }
                        localStorage.setItem('fileSystem', JSON.stringify(fileSystem));
                        renderFiles(currentPath);
                    }
                },
                { separator: true },
                {
                    text: 'Fechar',
                    action: (windowElement) => {
                        windowElement.style.display = 'none';
                    }
                }
            ]
        });
        
        this.registerApp({
            id: 'calculator',
            name: 'Calculadora',
            icon: 'fa-calculator',
            iconColor: '#4caf50',
            defaultX: 4,
            defaultY: 1,
            windowWidth: '300px',
            windowHeight: '450px', // Aumentei a altura para acomodar o novo design
            windowTitle: 'Calculadora Científica',
            template: `
                <div class="window-content">
                    <div class="calculator-display">
                        <div class="calculator-history" id="calcHistory"></div>
                        <div class="calculator-current" id="calcCurrent">0</div>
                    </div>
                    <div class="calculator-buttons">
                        <button data-value="C" class="function">C</button>
                        <button data-value="±" class="function">±</button>
                        <button data-value="%" class="function">%</button>
                        <button data-value="÷" class="operator">÷</button>
                        
                        <button data-value="7">7</button>
                        <button data-value="8">8</button>
                        <button data-value="9">9</button>
                        <button data-value="×" class="operator">×</button>
                        
                        <button data-value="4">4</button>
                        <button data-value="5">5</button>
                        <button data-value="6">6</button>
                        <button data-value="-" class="operator">-</button>
                        
                        <button data-value="1">1</button>
                        <button data-value="2">2</button>
                        <button data-value="3">3</button>
                        <button data-value="+" class="operator">+</button>
                        
                        <button data-value="0" class="span-2">0</button>
                        <button data-value=".">.</button>
                        <button data-value="=" class="operator equals">=</button>
                        
                        <button data-value="(" class="scientific">(</button>
                        <button data-value=")" class="scientific">)</button>
                        <button data-value="√" class="scientific">√</button>
                        <button data-value="^" class="scientific">^</button>
                        
                        <button data-value="sin" class="scientific">sin</button>
                        <button data-value="cos" class="scientific">cos</button>
                        <button data-value="tan" class="scientific">tan</button>
                        <button data-value="π" class="scientific">π</button>
                    </div>
                </div>
            `,
            onOpen: (windowElement) => {
                const display = windowElement.querySelector('#calcCurrent');
                const history = windowElement.querySelector('#calcHistory');
                let currentInput = '0';
                let previousInput = '';
                let operation = null;
                let resetInput = false;
                let memory = 0;
        
                const updateDisplay = () => {
                    display.textContent = currentInput;
                };
        
                const calculate = (a, b, op) => {
                    a = parseFloat(a);
                    b = parseFloat(b);
                    
                    switch(op) {
                        case '+': return a + b;
                        case '-': return a - b;
                        case '×': return a * b;
                        case '÷': return a / b;
                        case '^': return Math.pow(a, b);
                        case '%': return a % b;
                        default: return b;
                    }
                };
        
                const handleScientificFunction = (func) => {
                    const num = parseFloat(currentInput);
                    let result = num;
                    
                    switch(func) {
                        case '√': result = Math.sqrt(num); break;
                        case 'sin': result = Math.sin(num * Math.PI / 180); break;
                        case 'cos': result = Math.cos(num * Math.PI / 180); break;
                        case 'tan': result = Math.tan(num * Math.PI / 180); break;
                        case 'π': result = Math.PI; break;
                    }
                    
                    currentInput = String(result);
                    updateDisplay();
                };
        
                windowElement.querySelectorAll('.calculator-buttons button').forEach(button => {
                    button.addEventListener('click', () => {
                        const value = button.dataset.value;
        
                        if (button.classList.contains('scientific')) {
                            handleScientificFunction(value);
                            return;
                        }
        
                        if (value === 'C') {
                            currentInput = '0';
                            previousInput = '';
                            operation = null;
                            history.textContent = '';
                        } else if (value === '±') {
                            currentInput = String(-parseFloat(currentInput));
                        } else if (value === '%') {
                            currentInput = String(parseFloat(currentInput) / 100);
                        } else if (['+', '-', '×', '÷', '^'].includes(value)) {
                            if (previousInput && operation && !resetInput) {
                                const result = calculate(previousInput, currentInput, operation);
                                history.textContent = `${previousInput} ${operation} ${currentInput} =`;
                                currentInput = String(result);
                                previousInput = currentInput;
                            } else {
                                previousInput = currentInput;
                            }
                            operation = value;
                            resetInput = true;
                        } else if (value === '=') {
                            if (operation && previousInput) {
                                history.textContent = `${previousInput} ${operation} ${currentInput} =`;
                                currentInput = String(calculate(
                                    previousInput, 
                                    currentInput, 
                                    operation
                                ));
                                operation = null;
                                previousInput = '';
                                resetInput = true;
                            }
                        } else {
                            if (currentInput === '0' || resetInput) {
                                currentInput = value;
                                resetInput = false;
                            } else {
                                currentInput += value;
                            }
                        }
        
                        updateDisplay();
                    });
                });
        
                // Adiciona suporte para teclado
                windowElement.addEventListener('keydown', (e) => {
                    const key = e.key;
                    const button = windowElement.querySelector(`button[data-value="${key}"]`) || 
                                  windowElement.querySelector(`button[data-value="${key === '*' ? '×' : key === '/' ? '÷' : ''}"]`);
                    
                    if (button) {
                        button.click();
                        button.classList.add('active');
                        setTimeout(() => button.classList.remove('active'), 100);
                    }
                });
            }
        });
        // No método registerDefaultApps(), substitua o template do app 'browser' por este:
this.registerApp({
    id: 'browser',
    name: 'Navegador',
    icon: 'fa-globe',
    iconColor: '#2196F3',
    defaultX: 5,
    defaultY: 0,
    windowWidth: '900px',  // Tamanho maior
    windowHeight: '650px', // Tamanho maior
    windowTitle: 'Navegador Web',
    template: `
        <div class="window-content">
            <div class="browser-header">
                <div class="browser-controls">
                    <div class="browser-control back" title="Voltar">
                        <i class="fas fa-arrow-left"></i>
                    </div>
                    <div class="browser-control forward" title="Avançar">
                        <i class="fas fa-arrow-right"></i>
                    </div>
                    <div class="browser-control refresh" title="Recarregar">
                        <i class="fas fa-sync-alt"></i>
                    </div>
                </div>
                <div class="browser-url-container">
                    <div class="browser-favicon">
                        <i class="fas fa-globe"></i>
                    </div>
                    <input type="text" class="browser-url" placeholder="Digite um URL ou termo de pesquisa...">
                    <button class="browser-go">
                        <i class="fas fa-search"></i>
                    </button>
                </div>
                <div class="browser-actions">
                    <div class="browser-action bookmarks" title="Favoritos">
                        <i class="fas fa-star"></i>
                    </div>
                    <div class="browser-action new-tab" title="Nova aba">
                        <i class="fas fa-plus"></i>
                    </div>
                </div>
            </div>
            <div class="browser-tabs">
                <div class="browser-tab active">
                    <span class="tab-title">Nova aba</span>
                    <span class="tab-close">&times;</span>
                </div>
            </div>
            <iframe class="browser-frame" sandbox="allow-same-origin allow-scripts allow-popups allow-forms"></iframe>
            <div class="browser-status-bar">
                <span class="status-text">Pronto</span>
            </div>
        </div>
    `,
    onOpen: (windowElement) => {
        const urlInput = windowElement.querySelector('.browser-url');
        const frame = windowElement.querySelector('.browser-frame');
        const backBtn = windowElement.querySelector('.browser-control.back');
        const forwardBtn = windowElement.querySelector('.browser-control.forward');
        const refreshBtn = windowElement.querySelector('.browser-control.refresh');
        const statusText = windowElement.querySelector('.status-text');
        const favicon = windowElement.querySelector('.browser-favicon i');
        
        const loadUrl = (url) => {
            if (!url) return;
            
            if (!url.startsWith('http://') && !url.startsWith('https://')) {
                // Se não for uma URL completa, fazer pesquisa no Google
                if (url.includes('.')) {
                    url = 'https://' + url;
                } else {
                    url = 'https://www.google.com/search?q=' + encodeURIComponent(url);
                }
            }
            
            statusText.textContent = "Carregando...";
            frame.src = url;
            
            // Atualizar favicon
            setTimeout(() => {
                try {
                    const domain = new URL(frame.src).hostname.replace('www.', '');
                    favicon.className = `fas fa-${this.getFaviconForDomain(domain)}`;
                } catch (e) {
                    favicon.className = 'fas fa-globe';
                }
            }, 1000);
        };
        
        frame.addEventListener('load', () => {
            statusText.textContent = "Pronto";
            urlInput.value = frame.src;
        });
        
        frame.addEventListener('error', () => {
            statusText.textContent = "Erro ao carregar a página";
        });
        
        urlInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                loadUrl(urlInput.value.trim());
            }
        });
        
        windowElement.querySelector('.browser-go').addEventListener('click', () => {
            loadUrl(urlInput.value.trim());
        });
        
        backBtn.addEventListener('click', () => {
            try { frame.contentWindow.history.back(); } catch (e) {}
        });
        
        forwardBtn.addEventListener('click', () => {
            try { frame.contentWindow.history.forward(); } catch (e) {}
        });
        
        refreshBtn.addEventListener('click', () => {
            frame.src = frame.src;
        });
        
        // Carregar página inicial
        frame.src = 'https://www.google.com';
    },
    getFaviconForDomain: (domain) => {
        const icons = {
            'google.com': 'search',
            'youtube.com': 'youtube',
            'facebook.com': 'facebook',
            'twitter.com': 'twitter',
            'instagram.com': 'instagram',
            'github.com': 'github',
            'reddit.com': 'reddit',
            'wikipedia.org': 'wikipedia-w'
        };
        
        return icons[domain] || 'globe';
    }
});
        // Adicionar botão de logout no menu
        this.registerApp({
            id: 'logout',
            name: 'Logout',
            icon: 'fa-sign-out-alt',
            iconColor: '#ff5252',
            defaultX: 6,
            defaultY: 0,
            windowWidth: '300px',
            windowHeight: '200px',
            windowTitle: 'Sair do Sistema',
            template: `
                <div class="window-content" style="display: flex; flex-direction: column; justify-content: center; align-items: center;">
                    <p style="margin-bottom: 20px; text-align: center;">Deseja realmente sair do sistema?</p>
                    <button id="confirmLogout" style="padding: 10px 20px; background: #ff5252; color: white; border: none; border-radius: 5px; cursor: pointer;">Sair</button>
                </div>
            `,
        onOpen: (windowElement) => {
        windowElement.querySelector('#confirmLogout').addEventListener('click', () => {
                sessionStorage.removeItem('authenticated');
                window.location.href = 'TI.html';
            });
        } 
    });

    this.registerApp({
        id: 'trash',
        name: 'Lixeira',
        icon: 'fa-trash',
        iconColor: '#f44336',
        defaultX: 6,
        defaultY: 1,
        windowWidth: '500px',
        windowHeight: '400px',
        windowTitle: 'Lixeira',
        template: `
            <div class="window-content trash-content" style="overflow-y:auto; color:white;">
                <ul class="trash-list" style="list-style:none; padding:0;"></ul>
            </div>
        `,
        onOpen: (windowElement) => {
            const list = windowElement.querySelector('.trash-list');
            list.innerHTML = '';
            const trash = JSON.parse(localStorage.getItem('trashFiles')) || [];
            trash.forEach(file => {
                const li = document.createElement('li');
                li.style.marginBottom = '10px';
                li.innerHTML = `<strong>${file.name}</strong> 
                    <button style="margin-left:10px;" data-id="${file.id}">Restaurar</button>`;
                li.querySelector('button').addEventListener('click', () => {
                    // Restaurar
                    const restored = trash.filter(f => f.id === file.id)[0];
                    const updatedTrash = trash.filter(f => f.id !== file.id);
                    localStorage.setItem('trashFiles', JSON.stringify(updatedTrash));

                    const files = JSON.parse(localStorage.getItem('savedFiles')) || [];
                    files.push(restored);
                    localStorage.setItem('savedFiles', JSON.stringify(files));
                    window.location.reload();
                });
                list.appendChild(li);
            });
        }
    });

    this.registerApp({
        id: 'terminal',
        name: 'Terminal',
        icon: 'fa-terminal',
        iconColor: '#4CAF50',
        defaultX: 6,
        defaultY: 2,
        windowWidth: '700px',
        windowHeight: '500px',
        windowTitle: 'Terminal',
        template: `
            <div class="window-content terminal-container">
                <div class="terminal-header">
                    <div class="terminal-tabs">
                        <div class="terminal-tab active">Terminal</div>
                        <div class="terminal-tab new-tab">+</div>
                    </div>
                    <div class="terminal-controls">
                        <button class="terminal-control" id="clearTerminal" title="Limpar">
                            <i class="fas fa-eraser"></i>
                        </button>
                        <button class="terminal-control" id="settingsTerminal" title="Configurações">
                            <i class="fas fa-cog"></i>
                        </button>
                    </div>
                </div>
                <div class="terminal-body" id="terminalOutput">
                    <div class="terminal-line">
                        <span class="terminal-prompt">user@macios:~$</span>
                        <span class="terminal-welcome">Bem-vindo ao Terminal MacIOS v1.0.0</span>
                    </div>
                    <div class="terminal-line">
                        <span class="terminal-prompt">user@macios:~$</span>
                        <span class="terminal-welcome">Digite "help" para ver os comandos disponíveis</span>
                    </div>
                </div>
                <div class="terminal-input-container">
                    <span class="terminal-prompt">user@macios:~$</span>
                    <input type="text" class="terminal-input" id="terminalInput" autofocus>
                </div>
            </div>
        `,
        onOpen: function (windowElement) {
            const terminalOutput = windowElement.querySelector('#terminalOutput');
            const terminalInput = windowElement.querySelector('#terminalInput');
            const clearButton = windowElement.querySelector('#clearTerminal');
            const settingsButton = windowElement.querySelector('#settingsTerminal');
    
            const settings = {
                theme: 'dark',
                font: 'monospace',
                fontSize: 14,
                prompt: 'user@macios:~$',
                welcomeMessage: true,
            };
    
            const savedSettings = localStorage.getItem('terminalSettings');
            if (savedSettings) {
                Object.assign(settings, JSON.parse(savedSettings));
            }
    
            const applySettings = () => {
                terminalOutput.style.fontFamily = settings.font;
                terminalOutput.style.fontSize = `${settings.fontSize}px`;
                windowElement.querySelectorAll('.terminal-prompt').forEach(el => {
                    el.textContent = settings.prompt;
                });
    
                const container = windowElement.querySelector('.terminal-container');
                container.classList.toggle('dark-theme', settings.theme === 'dark');
                container.classList.toggle('light-theme', settings.theme === 'light');
            };
    
            applySettings();
    
            const commands = {
                help: {
                    description: 'Mostra esta mensagem de ajuda',
                    execute: () => {
                        addOutput('Comandos disponíveis:', 'system');
                        Object.keys(commands).forEach(cmd => {
                            addOutput(`${cmd} - ${commands[cmd].description}`, 'system');
                        });
                    },
                },
                clear: {
                    description: 'Limpa o terminal',
                    execute: () => {
                        terminalOutput.innerHTML = '';
                    },
                },
                echo: {
                    description: 'Exibe o texto digitado',
                    execute: (args) => {
                        addOutput(args.join(' '), 'user');
                    },
                },
                ls: {
                    description: 'Lista arquivos e diretórios',
                    execute: () => {
                        const fileSystem = JSON.parse(localStorage.getItem('fileSystem')) || {
                            '/': {
                                type: 'directory',
                                children: {
                                    documents: { type: 'directory', children: {} },
                                    downloads: { type: 'directory', children: {} },
                                    pictures: { type: 'directory', children: {} },
                                },
                            },
                        };
    
                        const root = fileSystem['/'];
                        let output = '';
    
                        for (const [name, item] of Object.entries(root.children)) {
                            output += `${item.type === 'directory' ? '📁' : '📄'} ${name}\n`;
                        }
    
                        addOutput(output || 'Nenhum arquivo encontrado', 'system');
                    },
                },
                theme: {
                    description: 'Altera o tema do terminal (dark/light)',
                    execute: (args) => {
                        if (args.length === 0) {
                            addOutput(`Tema atual: ${settings.theme}`, 'system');
                            return;
                        }
    
                        const newTheme = args[0].toLowerCase();
                        if (['dark', 'light'].includes(newTheme)) {
                            settings.theme = newTheme;
                            localStorage.setItem('terminalSettings', JSON.stringify(settings));
                            applySettings();
                            addOutput(`Tema alterado para: ${newTheme}`, 'system');
                        } else {
                            addOutput('Tema inválido. Use "dark" ou "light"', 'error');
                        }
                    },
                },
                date: {
                    description: 'Mostra a data e hora atual',
                    execute: () => {
                        addOutput(new Date().toLocaleString(), 'system');
                    },
                },
                neofetch: {
                    description: 'Mostra informações do sistema',
                    execute: () => {
                        const info = `
    ╭─────────────────────────────╮
    │  MacIOS Simulado v1.0       │
    ├─────────────────────────────┤
    │  CPU: Virtual Apple M1      │
    │  Memória: 8GB               │
    │  Armazenamento: 256GB       │
    │  Tema: ${settings.theme.padEnd(16)}│
    ╰─────────────────────────────╯
                        `;
                        addOutput(info, 'system');
                    },
                },
                open: {
                    description: 'Abre um aplicativo (ex: open notes)',
                    execute: (args) => {
                        if (args.length === 0) {
                            addOutput('Uso: open <app>', 'error');
                            addOutput('Aplicativos disponíveis: notes, calculator, browser, settings, explorer', 'system');
                            return;
                        }
    
                        const app = args[0].toLowerCase();
                        const validApps = ['notes', 'calculator', 'browser', 'settings', 'explorer'];
    
                        if (validApps.includes(app)) {
                            this.openApp(app);
                            addOutput(`Abrindo ${app}...`, 'system');
                        } else {
                            addOutput(`Aplicativo "${app}" não encontrado`, 'error');
                        }
                    },
                },
                mkdir: {
                    description: 'Cria um novo diretório',
                    execute: (args) => {
                        if (args.length === 0) {
                            addOutput('Uso: mkdir <nome-da-pasta>', 'error');
                            return;
                        }
    
                        const folderName = args[0];
                        const fileSystem = JSON.parse(localStorage.getItem('fileSystem')) || {
                            '/': {
                                type: 'directory',
                                children: {},
                            },
                        };
    
                        if (!fileSystem['/'].children[folderName]) {
                            fileSystem['/'].children[folderName] = {
                                type: 'directory',
                                children: {},
                            };
    
                            localStorage.setItem('fileSystem', JSON.stringify(fileSystem));
                            addOutput(`Pasta "${folderName}" criada com sucesso`, 'success');
                        } else {
                            addOutput(`Erro: Já existe uma pasta com o nome "${folderName}"`, 'error');
                        }
                    },
                },
            };
    
            const addOutput = (text, type = 'user') => {
                const lines = text.split('\n');
    
                lines.forEach(line => {
                    if (!line.trim()) return;
    
                    const lineElement = document.createElement('div');
                    lineElement.className = `terminal-line ${type}`;
    
                    lineElement.innerHTML = type === 'user'
                        ? `<span class="terminal-prompt">${settings.prompt}</span><span class="terminal-command">${line}</span>`
                        : `<span class="terminal-output ${type}">${line}</span>`;
    
                    terminalOutput.appendChild(lineElement);
                });
    
                terminalOutput.scrollTop = terminalOutput.scrollHeight;
            };
    
            const processCommand = (command) => {
                if (!command.trim()) return;
    
                addOutput(command, 'user');
    
                const [cmd, ...args] = command.split(' ');
                if (commands[cmd]) {
                    try {
                        commands[cmd].execute(args);
                    } catch (err) {
                        addOutput(`Erro ao executar o comando: ${err}`, 'error');
                    }
                } else {
                    addOutput(`Comando não encontrado: ${cmd}`, 'error');
                    addOutput('Digite "help" para ver os comandos disponíveis', 'system');
                }
            };
    
            terminalInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    processCommand(terminalInput.value);
                    terminalInput.value = '';
                }
            });
    
            clearButton.addEventListener('click', () => {
                terminalOutput.innerHTML = '';
                if (settings.welcomeMessage) {
                    addOutput('Bem-vindo ao Terminal MacIOS v1.0.0', 'system');
                    addOutput('Digite "help" para ver os comandos disponíveis', 'system');
                }
            });
    
            settingsButton.addEventListener('click', () => {
                const settingsMenu = document.createElement('div');
                settingsMenu.className = 'terminal-settings-menu';
                settingsMenu.innerHTML = `
                    <div class="settings-group">
                        <h3>Configurações do Terminal</h3>
                        <div class="settings-option">
                            <label>Tema:</label>
                            <select id="terminalThemeSelect">
                                <option value="dark" ${settings.theme === 'dark' ? 'selected' : ''}>Escuro</option>
                                <option value="light" ${settings.theme === 'light' ? 'selected' : ''}>Claro</option>
                            </select>
                        </div>
                        <div class="settings-option">
                            <label>Fonte:</label>
                            <select id="terminalFontSelect">
                                <option value="monospace" ${settings.font === 'monospace' ? 'selected' : ''}>Monospace</option>
                                <option value="Courier New" ${settings.font === 'Courier New' ? 'selected' : ''}>Courier New</option>
                                <option value="Consolas" ${settings.font === 'Consolas' ? 'selected' : ''}>Consolas</option>
                            </select>
                        </div>
                        <div class="settings-option">
                            <label>Tamanho da fonte:</label>
                            <input type="range" id="terminalFontSize" min="10" max="24" value="${settings.fontSize}">
                            <span id="fontSizeValue">${settings.fontSize}px</span>
                        </div>
                        <div class="settings-option">
                            <label>Prompt:</label>
                            <input type="text" id="terminalPromptInput" value="${settings.prompt}">
                        </div>
                        <div class="settings-option">
                            <label>
                                <input type="checkbox" id="terminalWelcomeCB" ${settings.welcomeMessage ? 'checked' : ''}>
                                Mostrar mensagem de boas-vindas
                            </label>
                        </div>
                        <div class="settings-buttons">
                            <button id="saveTerminalSettings">Salvar</button>
                            <button id="cancelTerminalSettings">Cancelar</button>
                        </div>
                    </div>
                `;
    
                document.body.appendChild(settingsMenu);
    
                const rect = settingsButton.getBoundingClientRect();
                settingsMenu.style.left = `${rect.left - 200}px`;
                settingsMenu.style.top = `${rect.bottom + 5}px`;
    
                setTimeout(() => {
                    document.addEventListener('click', function closeMenu(e) {
                        if (!settingsMenu.contains(e.target)) {
                            settingsMenu.remove();
                            document.removeEventListener('click', closeMenu);
                        }
                    });
                }, 100);
    
                const fontSizeSlider = settingsMenu.querySelector('#terminalFontSize');
                const fontSizeValue = settingsMenu.querySelector('#fontSizeValue');
    
                fontSizeSlider.addEventListener('input', () => {
                    fontSizeValue.textContent = `${fontSizeSlider.value}px`;
                });
    
                settingsMenu.querySelector('#saveTerminalSettings').addEventListener('click', () => {
                    settings.theme = settingsMenu.querySelector('#terminalThemeSelect').value;
                    settings.font = settingsMenu.querySelector('#terminalFontSelect').value;
                    settings.fontSize = parseInt(fontSizeSlider.value);
                    settings.prompt = settingsMenu.querySelector('#terminalPromptInput').value;
                    settings.welcomeMessage = settingsMenu.querySelector('#terminalWelcomeCB').checked;
    
                    localStorage.setItem('terminalSettings', JSON.stringify(settings));
                    applySettings();
                    settingsMenu.remove();
                });
    
                settingsMenu.querySelector('#cancelTerminalSettings').addEventListener('click', () => {
                    settingsMenu.remove();
                });
            });
    
            windowElement.addEventListener('click', () => {
                terminalInput.focus();
            });
    
            terminalInput.focus();
        },
        menuItems: [
            {
                text: 'Novo Terminal',
                action: () => this.openApp('terminal'),
            },
            {
                text: 'Limpar Terminal',
                action: (windowElement) => {
                    windowElement.querySelector('#clearTerminal').click();
                },
            },
            { separator: true },
            {
                text: 'Fechar',
                action: (windowElement) => {
                    windowElement.style.display = 'none';
                },
            },
        ],
    });
    


    }

    // Método para registrar novos aplicativos
    registerApp(appConfig) {
        this.apps.push(appConfig);
        this.createDesktopIcon(appConfig);
        this.createAppWindow(appConfig);
    }

    // Criar ícone no desktop
    createDesktopIcon(appConfig) {
        const desktop = document.getElementById('desktop');
        const icon = document.createElement('div');
        icon.className = 'icon';
        icon.dataset.appId = appConfig.id;
        
        // Verifica se há posição salva para este ícone
        const savedIcons = JSON.parse(localStorage.getItem('savedIcons')) || {};
        const savedPosition = Object.values(savedIcons).find(pos => pos.appId === appConfig.id);
        
        if (savedPosition) {
            icon.style.left = '0';
            icon.style.top = '0';
            icon.setAttribute('data-x', savedPosition.x);
            icon.setAttribute('data-y', savedPosition.y);
            icon.style.transform = `translate(${savedPosition.x}px, ${savedPosition.y}px)`;
        } else {
            icon.style.left = `${appConfig.defaultX * 100}px`;
            icon.style.top = `${appConfig.defaultY * 100}px`;
        }
        
        icon.innerHTML = `
            <i class="fas ${appConfig.icon}" style="color: ${appConfig.iconColor};"></i>
            <span>${appConfig.name}</span>
        `;
        
        icon.addEventListener('dblclick', () => {
            this.openApp(appConfig.id);
        });
    
        desktop.appendChild(icon);
    }

    // Criar janela do aplicativo
    createAppWindow(appConfig) {
        const windowsContainer = document.getElementById('windows-container');
        const windowId = `${appConfig.id}-window`;
    
        const windowElement = document.createElement('div');
        windowElement.className = 'app-window';
        windowElement.id = windowId;
        windowElement.style.display = 'none';
        windowElement.style.width = appConfig.windowWidth || '800px'; // Tamanho padrão maior
        windowElement.style.height = appConfig.windowHeight || '600px'; // Tamanho padrão maior
        
        // Construir menu
        let menuItemsHTML = '';
        if (appConfig.menuItems) {
            appConfig.menuItems.forEach(item => {
                if (item.separator) {
                    menuItemsHTML += '<div class="dropdown-separator"></div>';
                } else {
                    menuItemsHTML += `
                        <div class="dropdown-item" data-action="${item.text.toLowerCase().replace(' ', '-')}">
                            ${item.text}
                        </div>
                    `;
                }
            });
        }

        windowElement.innerHTML = `
            <div class="window-header" id="${appConfig.id}-header">
                <div class="window-controls">
                    <div class="window-close" data-window="${windowId}"></div>
                    <div class="window-minimize" data-window="${windowId}"></div>
                    <div class="window-maximize" data-window="${windowId}"></div>
                </div>
                <div class="window-menu">
                    <div class="menu-item">${appConfig.name}</div>
                    ${appConfig.menuItems ? `
                    <div class="menu-dropdown">
                        ${menuItemsHTML}
                    </div>
                    ` : ''}
                </div>
                <div class="window-title">${appConfig.windowTitle || appConfig.name}</div>
            </div>
            ${appConfig.template}
        `;

        windowsContainer.appendChild(windowElement);
        
        // Configurar arrastável
        this.makeWindowDraggable(windowElement, `#${appConfig.id}-header`);
        
        // Configurar controles da janela
        windowElement.querySelector('.window-close').addEventListener('click', (e) => {
            e.stopPropagation();
            windowElement.style.display = 'none';
        });

        windowElement.querySelector('.window-minimize').addEventListener('click', (e) => {
            e.stopPropagation();
            windowElement.style.display = 'none';
        });

        windowElement.querySelector('.window-maximize').addEventListener('click', (e) => {
            e.stopPropagation();
            if (windowElement.style.width === '90vw') {
                windowElement.style.width = appConfig.windowWidth;
                windowElement.style.height = appConfig.windowHeight;
                windowElement.style.left = 'calc(50% - ' + (parseInt(appConfig.windowWidth)/2) + 'px)';
                windowElement.style.top = 'calc(50% - ' + (parseInt(appConfig.windowHeight)/2) + 'px)';
            } else {
                windowElement.style.width = '90vw';
                windowElement.style.height = '90vh';
                windowElement.style.left = '5vw';
                windowElement.style.top = '5vh';
            }
        });

        // Configurar itens do menu
        if (appConfig.menuItems) {
            appConfig.menuItems.forEach(item => {
                if (!item.separator && item.action) {
                    const button = windowElement.querySelector(`[data-action="${item.text.toLowerCase().replace(' ', '-')}"]`);
                    if (button) {
                        button.addEventListener('click', (e) => {
                            e.stopPropagation();
                            item.action(windowElement);
                        });
                    }
                }
            });
        }

        this.windows.push({
            id: appConfig.id,
            element: windowElement,
            config: appConfig
        });
    }

    // Tornar janela arrastável
    makeWindowDraggable(windowElement, handleSelector) {
        interact(windowElement).draggable({
            allowFrom: handleSelector,
            listeners: {
                start(event) {
                    event.target.style.zIndex = 100;
                },
                move(event) {
                    const target = event.target;
                    const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
                    const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

                    target.style.transform = `translate(${x}px, ${y}px)`;
                    target.setAttribute('data-x', x);
                    target.setAttribute('data-y', y);
                },
                end(event) {
                    event.target.style.zIndex = 50;
                }
            }
        });
    }

    // Abrir aplicativo
    openApp(appId) {
        const window = this.windows.find(w => w.id === appId);
        if (!window) return;

        const windowElement = window.element;
        windowElement.style.display = 'flex';
        windowElement.style.left = 'calc(50% - ' + (parseInt(window.config.windowWidth)/2) + 'px)';
        windowElement.style.top = 'calc(50% - ' + (parseInt(window.config.windowHeight)/2) + 'px)';
        
        // Chamar callback de abertura se existir
        if (window.config.onOpen) {
            window.config.onOpen(windowElement);
        }
    }

    // Funções para gerenciamento de arquivos
    saveAsFile(windowElement) {
        const content = windowElement.querySelector('.app-content').value;
        if (!content.trim()) {
            alert("O conteúdo está vazio!");
            return;
        }
        
        const fileName = prompt("Digite um nome para o arquivo:", "Arquivo.txt");
        if (!fileName) return;
        
        // Criar objeto Blob com o conteúdo
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        
        // Criar link para download
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName.endsWith('.txt') ? fileName : fileName + '.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        // Adicionar à lista de arquivos salvos
        const fileData = {
            id: Date.now(),
            name: fileName.endsWith('.txt') ? fileName : fileName + '.txt',
            content: content,
            x: Math.random() * (window.innerWidth - 100),
            y: Math.random() * (window.innerHeight - 150)
        };
        
        this.files.push(fileData);
        localStorage.setItem('savedFiles', JSON.stringify(this.files));
        
        // Criar ícone na área de trabalho
        this.createFileIcon(fileData);
    }

    createFileIcon(fileData) {
        const desktop = document.getElementById('desktop');
        const fileIcon = document.createElement('div');
        fileIcon.className = 'icon file';
        fileIcon.setAttribute('data-file-id', fileData.id);
        
        // Verifica se há posição salva para este arquivo
        const savedIcons = JSON.parse(localStorage.getItem('savedIcons')) || {};
        const savedPosition = Object.values(savedIcons).find(pos => pos.appId === fileData.id.toString());
        
        if (savedPosition) {
            fileIcon.style.left = '0';
            fileIcon.style.top = '0';
            fileIcon.setAttribute('data-x', savedPosition.x);
            fileIcon.setAttribute('data-y', savedPosition.y);
            fileIcon.style.transform = `translate(${savedPosition.x}px, ${savedPosition.y}px)`;
        } else {
            fileIcon.style.left = `${fileData.x}px`;
            fileIcon.style.top = `${fileData.y}px`;
        }
        
        fileIcon.innerHTML = `
            <i class="fas fa-file-alt"></i>
            <span>${fileData.name}</span>
        `;
        
        desktop.appendChild(fileIcon);

        
        // Tornar arrastável
        interact(fileIcon).draggable({
            inertia: true,
            modifiers: [
                interact.modifiers.restrictRect({
                    restriction: 'parent',
                    endOnly: true
                })
            ],
            listeners: {
                start(event) {
                    event.target.style.zIndex = 10;
                },
                move(event) {
                    const target = event.target;
                    const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
                    const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
                    
                    target.style.transform = `translate(${x}px, ${y}px)`;
                    target.setAttribute('data-x', x);
                    target.setAttribute('data-y', y);
                },
                end(event) {
                    event.target.style.zIndex = '';
                    
                    // Atualizar posição no localStorage
                    const fileId = parseInt(event.target.getAttribute('data-file-id'));
                    const fileIndex = this.files.findIndex(f => f.id === fileId);
                    if (fileIndex !== -1) {
                        this.files[fileIndex].x = parseFloat(event.target.style.left) + (parseFloat(event.target.getAttribute('data-x')) || 0);
                        this.files[fileIndex].y = parseFloat(event.target.style.top) + (parseFloat(event.target.getAttribute('data-y')) || 0);
                        localStorage.setItem('savedFiles', JSON.stringify(this.files));
                    }
                }
            }
        });
        
        // Abrir arquivo ao clicar duas vezes
        fileIcon.addEventListener('dblclick', () => {
            this.openFile(fileData.id);
        });
    }

    openFile(fileId) {
        const file = this.files.find(f => f.id === fileId);
        if (!file) return;
        
        const notesWindow = this.windows.find(w => w.id === 'notes');
        if (notesWindow) {
            const windowElement = notesWindow.element;
            windowElement.style.display = 'flex';
            windowElement.querySelector('.app-content').value = file.content;
            windowElement.querySelector('.window-title').textContent = file.name;
        }
    }

    loadSavedFiles() {
        this.files.forEach(file => {
            this.createFileIcon(file);
        });
    }

    deleteCurrentFile(windowElement) {
        const title = windowElement.querySelector('.window-title').textContent;
        const fileIndex = this.files.findIndex(f => f.name === title);
        if (fileIndex !== -1) {
            const fileId = this.files[fileIndex].id;
            const deletedFile = this.files.splice(fileIndex, 1)[0];

            // Salvar na lixeira
            const trash = JSON.parse(localStorage.getItem('trashFiles')) || [];
            trash.push(deletedFile);
            localStorage.setItem('trashFiles', JSON.stringify(trash));

            localStorage.setItem('savedFiles', JSON.stringify(this.files));

            const icon = document.querySelector(`.file[data-file-id="${fileId}"]`);
            if (icon) icon.remove();

            // Remover posição salva
            const savedIcons = JSON.parse(localStorage.getItem('savedIcons')) || {};
            for (let key in savedIcons) {
                if (savedIcons[key].appId == fileId) {
                    delete savedIcons[key];
                    break;
                }
            }
            localStorage.setItem('savedIcons', JSON.stringify(savedIcons));

            // Limpar janela
            windowElement.querySelector('.app-content').value = '';
            windowElement.querySelector('.window-title').textContent = 'Bloco de Notas';
        } else {
            alert("Nenhum arquivo aberto para excluir.");
        }
    }

    // Função auxiliar para calculadora
    calculate(a, b, operation) {
        switch (operation) {
            case '+': return a + b;
            case '-': return a - b;
            case '*': return a * b;
            case '/': return a / b;
            default: return b;
        }
    }
}

window.addEventListener('load', () => {
    const macos = new MacIOS();
    
    window.macos = macos;
});