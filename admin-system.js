// Sistema de Autenticação e Admin para Sunset 2025

// ========================
// CONFIGURAÇÃO E DADOS
// ========================

// Simulação de base de dados (em produção usar backend real)
const DB_KEY = 'sunset_users';
const ADMIN_KEY = 'sunset_admin_session';
const EVENT_DATA_KEY = 'sunset_event_data';

// Utilizadores pré-definidos (incluindo admin)
const defaultUsers = [
    {
        id: 1,
        name: 'Administrador',
        email: 'admin@sunset.pt',
        password: hashPassword('admin123'), // Em produção usar bcrypt
        role: 'admin',
        created: new Date().toISOString()
    },
    {
        id: 2,
        name: 'Utilizador Teste',
        email: 'user@sunset.pt',
        password: hashPassword('user123'),
        role: 'user',
        created: new Date().toISOString()
    }
];

// Dados do evento (podem ser editados pelo admin)
let eventData = {
    title: 'SUNSET 2025',
    subtitle: 'Celebre o Ano Novo na Praia da Barra',
    location: 'Praia da Barra, Gafanha da Nazaré, Aveiro',
    date: '2025-12-31T21:00',
    price: 25,
    includes: '2 bebidas + Ovos Moles',
    description: 'Uma noite mágica na Praia da Barra junto ao Farol mais alto de Portugal',
    program: [
        { icon: '🎵', title: 'DJ ao Vivo', description: 'Música eletrónica com os melhores DJs locais', time: '21:00 - 03:00' },
        { icon: '🎆', title: 'Fogo de Artifício', description: 'Espetáculo pirotécnico à meia-noite sobre o mar', time: '00:00' },
        { icon: '🍹', title: 'Bar na Praia', description: 'Cocktails tropicais e bebidas geladas', time: '20:00 - 04:00' }
    ],
    colors: {
        primary: '#667eea',
        secondary: '#764ba2',
        accent: '#ff6b6b'
    }
};

// ========================
// FUNÇÕES DE SEGURANÇA
// ========================

// Hash simples (em produção usar bcrypt ou argon2)
function hashPassword(password) {
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
        const char = password.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return 'hash_' + Math.abs(hash).toString(36);
}

// Validar email
function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Validar password (mínimo 6 caracteres)
function validatePassword(password) {
    return password.length >= 6;
}

// ========================
// GESTÃO DE UTILIZADORES
// ========================

// Inicializar base de dados
function initializeDB() {
    if (!localStorage.getItem(DB_KEY)) {
        localStorage.setItem(DB_KEY, JSON.stringify(defaultUsers));
    }
    if (!localStorage.getItem(EVENT_DATA_KEY)) {
        localStorage.setItem(EVENT_DATA_KEY, JSON.stringify(eventData));
    }
}

// Obter todos os utilizadores
function getUsers() {
    return JSON.parse(localStorage.getItem(DB_KEY) || '[]');
}

// Guardar utilizadores
function saveUsers(users) {
    localStorage.setItem(DB_KEY, JSON.stringify(users));
}

// Encontrar utilizador por email
function findUserByEmail(email) {
    const users = getUsers();
    return users.find(u => u.email === email);
}

// Registar novo utilizador
function registerUser(name, email, password) {
    if (!validateEmail(email)) {
        throw new Error('Email inválido');
    }
    if (!validatePassword(password)) {
        throw new Error('Password deve ter no mínimo 6 caracteres');
    }
    
    const users = getUsers();
    
    if (findUserByEmail(email)) {
        throw new Error('Email já registado');
    }
    
    const newUser = {
        id: users.length + 1,
        name,
        email,
        password: hashPassword(password),
        role: 'user',
        created: new Date().toISOString()
    };
    
    users.push(newUser);
    saveUsers(users);
    return newUser;
}

// Login de utilizador
function loginUser(email, password) {
    const user = findUserByEmail(email);
    
    if (!user) {
        throw new Error('Utilizador não encontrado');
    }
    
    if (user.password !== hashPassword(password)) {
        throw new Error('Password incorreta');
    }
    
    // Criar sessão
    const session = {
        userId: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        loginTime: new Date().toISOString()
    };
    
    localStorage.setItem(ADMIN_KEY, JSON.stringify(session));
    return session;
}

// Verificar se está logado
function isLoggedIn() {
    return localStorage.getItem(ADMIN_KEY) !== null;
}

// Obter sessão atual
function getCurrentSession() {
    return JSON.parse(localStorage.getItem(ADMIN_KEY) || 'null');
}

// Logout
function logout() {
    localStorage.removeItem(ADMIN_KEY);
    window.location.reload();
}

// Verificar se é admin
function isAdmin() {
    const session = getCurrentSession();
    return session && session.role === 'admin';
}

// ========================
// GESTÃO DE EVENTOS
// ========================

// Obter dados do evento
function getEventData() {
    return JSON.parse(localStorage.getItem(EVENT_DATA_KEY) || JSON.stringify(eventData));
}

// Guardar dados do evento
function saveEventData(data) {
    localStorage.setItem(EVENT_DATA_KEY, JSON.stringify(data));
    showSaveIndicator();
    updateMainSite();
}

// Atualizar site principal com novos dados
function updateMainSite() {
    const data = getEventData();
    
    // Criar script para atualizar index.html
    const updateScript = `
        // Atualizar título
        document.querySelector('.hero h1').textContent = '🌅 ${data.title} 🌅';
        document.querySelector('.hero p').textContent = '${data.subtitle}';
        
        // Atualizar preço
        const priceElements = document.querySelectorAll('[data-price]');
        priceElements.forEach(el => el.textContent = '${data.price}€');
        
        // Atualizar localização
        const locationElements = document.querySelectorAll('[data-location]');
        locationElements.forEach(el => el.textContent = '${data.location}');
        
        // Atualizar cores
        document.documentElement.style.setProperty('--primary-color', '${data.colors.primary}');
        document.documentElement.style.setProperty('--secondary-color', '${data.colors.secondary}');
        document.documentElement.style.setProperty('--accent-color', '${data.colors.accent}');
    `;
    
    // Guardar script de atualização
    localStorage.setItem('sunset_update_script', updateScript);
}

// ========================
// INTERFACE DO ADMIN
// ========================

// Mostrar indicador de guardado
function showSaveIndicator() {
    const indicator = document.getElementById('saveIndicator');
    if (indicator) {
        indicator.style.display = 'block';
        setTimeout(() => {
            indicator.style.display = 'none';
        }, 2000);
    }
}

// Carregar dados no formulário
function loadEventFormData() {
    const data = getEventData();
    
    document.getElementById('eventTitle').value = data.title;
    document.getElementById('eventSubtitle').value = data.subtitle;
    document.getElementById('eventLocation').value = data.location;
    document.getElementById('eventDate').value = data.date;
    document.getElementById('ticketPrice').value = data.price;
    document.getElementById('ticketIncludes').value = data.includes;
    document.getElementById('eventDescription').value = data.description;
    
    // Carregar cores
    document.getElementById('primaryColor').value = data.colors.primary;
    document.getElementById('secondaryColor').value = data.colors.secondary;
    document.getElementById('accentColor').value = data.colors.accent;
    
    // Carregar programa
    loadProgramItems();
}

// Carregar items do programa
function loadProgramItems() {
    const data = getEventData();
    const container = document.getElementById('programList');
    container.innerHTML = '';
    
    data.program.forEach((item, index) => {
        const itemHTML = `
            <div class="card mb-2">
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-1">
                            <input type="text" class="form-control" value="${item.icon}" id="icon${index}">
                        </div>
                        <div class="col-md-3">
                            <input type="text" class="form-control" value="${item.title}" id="title${index}" placeholder="Título">
                        </div>
                        <div class="col-md-4">
                            <input type="text" class="form-control" value="${item.description}" id="desc${index}" placeholder="Descrição">
                        </div>
                        <div class="col-md-2">
                            <input type="text" class="form-control" value="${item.time}" id="time${index}" placeholder="Horário">
                        </div>
                        <div class="col-md-2">
                            <button class="btn btn-danger btn-sm" onclick="removeProgramItem(${index})">🗑️</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        container.innerHTML += itemHTML;
    });
}

// Adicionar item ao programa
function addProgramItem() {
    const data = getEventData();
    data.program.push({
        icon: '🎉',
        title: 'Novo Item',
        description: 'Descrição',
        time: '00:00'
    });
    saveEventData(data);
    loadProgramItems();
}

// Remover item do programa
function removeProgramItem(index) {
    const data = getEventData();
    data.program.splice(index, 1);
    saveEventData(data);
    loadProgramItems();
}

// Aplicar cores
function applyColors() {
    const data = getEventData();
    data.colors.primary = document.getElementById('primaryColor').value;
    data.colors.secondary = document.getElementById('secondaryColor').value;
    data.colors.accent = document.getElementById('accentColor').value;
    saveEventData(data);
    alert('Cores aplicadas! Recarregue a página principal para ver as alterações.');
}

// ========================
// EVENT LISTENERS
// ========================

document.addEventListener('DOMContentLoaded', () => {
    initializeDB();
    
    // Verificar se está logado
    if (isLoggedIn()) {
        const session = getCurrentSession();
        document.getElementById('loginContainer').style.display = 'none';
        document.getElementById('adminPanel').style.display = 'block';
        document.getElementById('userName').textContent = session.name;
        document.getElementById('userRole').textContent = session.role === 'admin' ? '👑 Administrador' : '👤 Utilizador';
        
        // Carregar dados se for admin
        if (session.role === 'admin') {
            loadEventFormData();
            loadPurchasesData();
            loadPastEvent();
            loadSocialMedia();
            loadAllTickets();
        } else {
            // Redirecionar não-admins
            alert('Acesso negado! Redirecionando...');
            window.location.href = 'index.html';
        }
    }
    
    // Carregar dados de compras
    function loadPurchasesData() {
        const purchases = JSON.parse(localStorage.getItem('sunset_purchases') || '[]');
        const tbody = document.getElementById('purchasesList');
        
        if (purchases.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted">Nenhuma compra ainda</td></tr>';
            return;
        }
        
        tbody.innerHTML = '';
        let totalSold = 0;
        let totalRevenue = 0;
        
        purchases.reverse().slice(0, 10).forEach(purchase => {
            totalSold += parseInt(purchase.quantity);
            totalRevenue += parseInt(purchase.total);
            
            const date = new Date(purchase.date).toLocaleString('pt-PT');
            const row = `
                <tr>
                    <td>${date}</td>
                    <td>${purchase.userName}</td>
                    <td>${purchase.phone}</td>
                    <td>${purchase.quantity}</td>
                    <td><strong>${purchase.total}€</strong></td>
                </tr>
            `;
            tbody.innerHTML += row;
        });
        
        // Atualizar estatísticas
        document.getElementById('totalSold').textContent = totalSold;
        document.getElementById('totalRevenue').textContent = totalRevenue + '€';
        document.getElementById('totalAvailable').textContent = 500 - totalSold;
    }
    
    // Form de login (ADMIN APENAS)
    document.getElementById('loginForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        try {
            const session = loginUser(email, password);
            
            // Verificar se é admin
            if (session.role !== 'admin') {
                alert('❌ Acesso Negado!\n\nEsta área é exclusiva para administradores.\n\nUtilizadores normais devem usar o site principal para comprar bilhetes.');
                logout();
                return;
            }
            
            alert(`Bem-vindo ao painel admin, ${session.name}!`);
            window.location.reload();
        } catch (error) {
            alert('Erro: ' + error.message);
        }
    });
    
    // Form de registo
    document.getElementById('registerForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const passwordConfirm = document.getElementById('registerPasswordConfirm').value;
        
        if (password !== passwordConfirm) {
            alert('As passwords não coincidem!');
            return;
        }
        
        try {
            registerUser(name, email, password);
            alert('Conta criada com sucesso! Pode fazer login agora.');
            document.getElementById('login-tab').click();
            document.getElementById('registerForm').reset();
        } catch (error) {
            alert('Erro: ' + error.message);
        }
    });
    
    // Form de evento
    document.getElementById('eventForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (!isAdmin()) {
            alert('Apenas administradores podem editar!');
            return;
        }
        
        const data = getEventData();
        data.title = document.getElementById('eventTitle').value;
        data.subtitle = document.getElementById('eventSubtitle').value;
        data.location = document.getElementById('eventLocation').value;
        data.date = document.getElementById('eventDate').value;
        data.price = parseInt(document.getElementById('ticketPrice').value);
        data.includes = document.getElementById('ticketIncludes').value;
        data.description = document.getElementById('eventDescription').value;
        
        // Atualizar items do programa
        data.program = data.program.map((item, index) => ({
            icon: document.getElementById(`icon${index}`)?.value || item.icon,
            title: document.getElementById(`title${index}`)?.value || item.title,
            description: document.getElementById(`desc${index}`)?.value || item.description,
            time: document.getElementById(`time${index}`)?.value || item.time
        }));
        
        saveEventData(data);
        alert('Evento atualizado com sucesso!');
    });
});

// ========================
// FUNÇÕES PARA EVENTOS ANTERIORES
// ========================

function savePastEvent() {
    const pastEventData = {
        name: document.getElementById('pastEventName').value,
        location: document.getElementById('pastEventLocation').value,
        description: document.getElementById('pastEventDescription').value,
        participants: document.getElementById('pastEventParticipants').value,
        djs: document.getElementById('pastEventDJs').value,
        rating: document.getElementById('pastEventRating').value
    };
    
    localStorage.setItem('sunset_past_event', JSON.stringify(pastEventData));
    showSaveIndicator();
    alert('✅ Evento anterior guardado com sucesso!');
}

function loadPastEvent() {
    const saved = localStorage.getItem('sunset_past_event');
    if (saved) {
        const data = JSON.parse(saved);
        document.getElementById('pastEventName').value = data.name || 'W PARTY';
        document.getElementById('pastEventLocation').value = data.location || 'CCD de Cacia, Aveiro';
        document.getElementById('pastEventDescription').value = data.description || '';
        document.getElementById('pastEventParticipants').value = data.participants || '+500 participantes';
        document.getElementById('pastEventDJs').value = data.djs || '4 DJs';
        document.getElementById('pastEventRating').value = data.rating || '5/5 avaliação';
    }
}

// ========================
// FUNÇÕES PARA REDES SOCIAIS
// ========================

function saveSocialMedia() {
    const socialData = {
        instagram: document.getElementById('instagramUrl').value,
        tiktok: document.getElementById('tiktokUrl').value,
        facebook: document.getElementById('facebookUrl').value
    };
    
    localStorage.setItem('sunset_social_media', JSON.stringify(socialData));
    showSaveIndicator();
    alert('✅ Redes sociais guardadas com sucesso!');
}

function loadSocialMedia() {
    const saved = localStorage.getItem('sunset_social_media');
    if (saved) {
        const data = JSON.parse(saved);
        document.getElementById('instagramUrl').value = data.instagram || 'https://www.instagram.com/sunset2025aveiro';
        document.getElementById('tiktokUrl').value = data.tiktok || 'https://www.tiktok.com/@sunset2025aveiro';
        document.getElementById('facebookUrl').value = data.facebook || 'https://www.facebook.com/sunset2025aveiro';
    }
}

// ========================
// SISTEMA DE VALIDAÇÃO DE BILHETES
// ========================

function validateTicket() {
    const code = document.getElementById('manualTicketCode').value.trim();
    const resultDiv = document.getElementById('ticketValidationResult');
    
    if (!code) {
        resultDiv.innerHTML = '<div class="alert alert-warning">⚠️ Insira um código de bilhete</div>';
        return;
    }
    
    // Extrair ID do código
    const ticketId = code.replace('SUNSET2025-', '');
    
    // Procurar o bilhete em todas as compras
    const purchases = JSON.parse(localStorage.getItem('sunset_purchases') || '[]');
    let foundTicket = null;
    let foundUserId = null;
    
    for (const purchase of purchases) {
        if (purchase.tickets) {
            const ticket = purchase.tickets.find(t => t.id === ticketId);
            if (ticket) {
                foundTicket = ticket;
                foundUserId = purchase.userId;
                break;
            }
        }
    }
    
    if (!foundTicket) {
        resultDiv.innerHTML = `
            <div class="alert alert-danger">
                <h5>❌ BILHETE INVÁLIDO</h5>
                <p>Este código não foi encontrado no sistema.</p>
                <p><strong>Código:</strong> ${code}</p>
            </div>
        `;
        return;
    }
    
    if (foundTicket.status === 'used') {
        resultDiv.innerHTML = `
            <div class="alert alert-warning">
                <h5>⚠️ BILHETE JÁ UTILIZADO</h5>
                <p>Este bilhete já foi validado anteriormente.</p>
                <p><strong>Nome:</strong> ${foundTicket.userName}</p>
                <p><strong>Validado em:</strong> ${foundTicket.usedDate || 'Data não disponível'}</p>
            </div>
        `;
        return;
    }
    
    // Marcar bilhete como usado
    foundTicket.status = 'used';
    foundTicket.usedDate = new Date().toISOString();
    
    // Atualizar no localStorage
    localStorage.setItem('sunset_purchases', JSON.stringify(purchases));
    
    // Atualizar nos bilhetes do utilizador
    const userTickets = JSON.parse(localStorage.getItem(`sunset_tickets_${foundUserId}`) || '[]');
    const userTicket = userTickets.find(t => t.id === ticketId);
    if (userTicket) {
        userTicket.status = 'used';
        userTicket.usedDate = foundTicket.usedDate;
        localStorage.setItem(`sunset_tickets_${foundUserId}`, JSON.stringify(userTickets));
    }
    
    resultDiv.innerHTML = `
        <div class="alert alert-success">
            <h5>✅ BILHETE VÁLIDO</h5>
            <p><strong>Nome:</strong> ${foundTicket.userName}</p>
            <p><strong>Evento:</strong> ${foundTicket.eventName}</p>
            <p><strong>Data:</strong> ${foundTicket.eventDate}</p>
            <p><strong>Local:</strong> ${foundTicket.location}</p>
            <hr>
            <p class="mb-0"><strong>✅ Entrada autorizada!</strong></p>
        </div>
    `;
    
    // Limpar input
    document.getElementById('manualTicketCode').value = '';
    
    // Recarregar lista de bilhetes
    loadAllTickets();
}

function loadAllTickets() {
    const purchases = JSON.parse(localStorage.getItem('sunset_purchases') || '[]');
    const tbody = document.getElementById('allTicketsList');
    
    let allTickets = [];
    purchases.forEach(purchase => {
        if (purchase.tickets) {
            purchase.tickets.forEach(ticket => {
                allTickets.push(ticket);
            });
        }
    });
    
    if (allTickets.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">Nenhum bilhete vendido ainda</td></tr>';
        return;
    }
    
    tbody.innerHTML = '';
    allTickets.forEach(ticket => {
        const statusBadge = ticket.status === 'valid' 
            ? '<span class="badge bg-success">Válido</span>' 
            : '<span class="badge bg-secondary">Usado</span>';
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><code>${ticket.id.substring(0, 10)}...</code></td>
            <td>${ticket.userName}</td>
            <td>${ticket.eventName}</td>
            <td>${new Date(ticket.purchaseDate).toLocaleDateString('pt-PT')}</td>
            <td>${statusBadge}</td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="viewTicketDetails('${ticket.id}')">
                    👁️ Ver
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function viewTicketDetails(ticketId) {
    const purchases = JSON.parse(localStorage.getItem('sunset_purchases') || '[]');
    let ticket = null;
    
    for (const purchase of purchases) {
        if (purchase.tickets) {
            ticket = purchase.tickets.find(t => t.id === ticketId);
            if (ticket) break;
        }
    }
    
    if (ticket) {
        alert(`🎟️ Detalhes do Bilhete\n\nID: ${ticket.id}\nNome: ${ticket.userName}\nEvento: ${ticket.eventName}\nData: ${ticket.eventDate}\nLocal: ${ticket.location}\nStatus: ${ticket.status === 'valid' ? 'Válido' : 'Usado'}\nCódigo QR: ${ticket.qrData}`);
    }
}

// Expor funções globais
window.logout = logout;
window.addProgramItem = addProgramItem;
window.removeProgramItem = removeProgramItem;
window.applyColors = applyColors;
window.savePastEvent = savePastEvent;
window.saveSocialMedia = saveSocialMedia;
window.validateTicket = validateTicket;
window.loadAllTickets = loadAllTickets;
window.viewTicketDetails = viewTicketDetails;
