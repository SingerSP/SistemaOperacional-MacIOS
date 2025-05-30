# 💻 MacIOS

**MacIOS** é um sistema operacional fictício, inspirado no visual do macOS, totalmente construído com HTML, CSS e JavaScript. Ele oferece uma experiência imersiva com autenticação de usuários, área de trabalho interativa, temas dinâmicos, efeitos visuais avançados e animações suaves de desligamento e encerramento de sessão.

---

## ✨ Principais Funcionalidades

### 🔐 Tela de Login (`TI.html`)
- Seleção entre múltiplos usuários fictícios com avatar.
- Autenticação com senha (com dicas).
- Transição suave para a área de trabalho após login bem-sucedido.
- Modal de confirmação ao tentar desligar o sistema.

### 🖥️ Interface Desktop (`index.html`)
- Dock interativo com ícones animados.
- Menu superior inspirado no Finder.
- Relógio dinâmico.
- Ícones arrastáveis e persistentes (usando `localStorage`).
- Menu de contexto com criação de arquivos/pastas.
- Editor de Notas embutido com formatação (negrito, itálico, sublinhado).

### 🎨 Aparência e Temas
- Alternância entre modo claro e escuro.
- Papel de parede personalizável (inclusive via drag & drop).
- Efeito Parallax e Tilt no desktop.

### 🧮 Aplicativos Simulados
- Editor de Notas
- Explorador de Arquivos
- Configurações (tema, papel de parede, etc.)

### 📦 Sessão e Encerramento
- Tela de desligamento com animação de progresso (`shutdown.html`).
- Tela de agradecimento e redirecionamento final (`thanks.html`).

---

## 📁 Estrutura do Projeto

```
📁 / (raiz)
├── index.html           # Tela principal com o desktop
├── app.js               # Código principal do sistema MacIOS
├── style.css            # Estilo da interface e apps
├── TI.html              # Tela de login de usuários
├── TI.css / TI.js       # Estilo e lógica da tela de login
├── shutdown.html/css    # Tela de desligamento
├── thanks.html/css/js   # Tela final de agradecimento
```

---

## 🚀 Como Rodar o Projeto

1. Clone ou baixe os arquivos:
   ```bash
   git clone https://github.com/seu-usuario/macios.git
   cd macios
   ```

2. Abra `TI.html` em um navegador moderno (preferencialmente Google Chrome ou Edge).

---

## 👤 Usuários de Teste

| Nome           | Avatar | Senha       | Dica             |
|----------------|--------|-------------|------------------|
| Usuário Padrão | 👤     | `senha123`  | tente 'senha123' |
| Convidado      | 👋     | `convidado` | tente 'convidado'|
| Admin          | 👑     | `admin123`  | tente 'admin123' |
| Desenvolvedor  | 💻     | `dev123`    | tente 'dev123'   |

---

## 🛠️ Tecnologias

- HTML5, CSS3
- JavaScript (vanilla)
- Font Awesome (ícones)
- `localStorage` para persistência local

---

## 📝 Licença

Distribuído sob a Licença MIT. Sinta-se livre para usar e modificar.
