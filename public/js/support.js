// Panel de Soporte - Funcionalidad para admin/staff
class SupportPanel {
    constructor() {
        this.socket = null;
        this.isConnected = false;
        this.userInfo = null;
        this.selectedClient = null;
        this.clients = new Map();
        this.typingTimeout = null;
        
        // Elementos del DOM
        this.clientsList = document.getElementById('clients-list');
        this.supportMessages = document.getElementById('support-messages');
        this.messageInput = document.getElementById('support-message-input');
        this.sendButton = document.getElementById('support-send-button');
        this.selectedClientName = document.getElementById('selected-client-name');
        this.selectedClientStatus = document.getElementById('selected-client-status');
        this.endChatButton = document.getElementById('end-chat');
        this.refreshButton = document.getElementById('refresh-clients');
        this.activeClientsCount = document.getElementById('active-clients');
        this.pendingMessagesCount = document.getElementById('pending-messages');
        this.charCount = document.getElementById('support-char-count');
        
        // Estadísticas
        this.stats = {
            totalMessages: 0,
            avgResponseTime: 0,
            satisfactionRate: 0
        };
        
        this.init();
    }

    init() {
        this.connectSocket();
        this.setupEventListeners();
        this.loadUserInfo();
        this.setupQuickResponses();
    }

    connectSocket() {
        this.socket = io();
        
        this.socket.on('connect', () => {
            console.log('Panel de soporte conectado');
            this.isConnected = true;
            
            if (this.userInfo) {
                console.log('Enviando información de soporte:', this.userInfo);
                this.socket.emit('support_connect', {
                    userId: this.userInfo.id,
                    username: this.userInfo.username,
                    role: this.userInfo.role
                });
            }
        });

        this.socket.on('disconnect', () => {
            console.log('Panel de soporte desconectado');
            this.isConnected = false;
        });

        this.socket.on('clients_update', (data) => {
            console.log('Recibida actualización de clientes:', data);
            this.updateClientsList(data.clients);
        });

        this.socket.on('client_message', (data) => {
            console.log('Mensaje recibido de cliente:', data);
            this.handleClientMessage(data);
        });

        this.socket.on('client_typing', (data) => {
            console.log('Cliente escribiendo:', data);
            this.showClientTyping(data.clientId);
        });

        this.socket.on('client_stop_typing', (data) => {
            console.log('Cliente dejó de escribir:', data);
            this.hideClientTyping(data.clientId);
        });

        this.socket.on('client_disconnect', (data) => {
            console.log('Cliente desconectado:', data);
            this.handleClientDisconnect(data.clientId);
        });
    }

    setupEventListeners() {
        // Enviar mensaje
        this.sendButton.addEventListener('click', () => {
            this.sendMessage();
        });

        // Enviar con Enter
        this.messageInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Contador de caracteres
        this.messageInput.addEventListener('input', () => {
            this.updateCharCount();
            this.toggleSendButton();
        });

        // Auto-resize
        this.messageInput.addEventListener('input', () => {
            this.autoResize();
        });

        // Finalizar chat
        this.endChatButton.addEventListener('click', () => {
            this.endChat();
        });

        // Refrescar lista de clientes
        this.refreshButton.addEventListener('click', () => {
            this.refreshClients();
        });

        // Typing indicator
        this.messageInput.addEventListener('input', () => {
            this.handleTyping();
        });
    }

    loadUserInfo() {
        // Obtener información del usuario desde window.userData
        if (window.userData) {
            try {
                // Si userData ya es un objeto, usarlo directamente
                if (typeof window.userData === 'object') {
                    this.userInfo = window.userData;
                } else {
                    // Si es string, parsearlo
                    this.userInfo = JSON.parse(window.userData);
                }
            } catch (e) {
                console.error('Error al parsear datos del usuario:', e);
            }
        }

        // Si no hay datos en window.userData, intentar obtenerlos de localStorage
        if (!this.userInfo) {
            const storedUser = localStorage.getItem('userInfo');
            if (storedUser) {
                try {
                    this.userInfo = JSON.parse(storedUser);
                } catch (e) {
                    console.error('Error al parsear datos del usuario de localStorage:', e);
                }
            }
        }

        // Asegurar que username siempre tenga un valor válido
        if (this.userInfo && (!this.userInfo.username || this.userInfo.username.trim() === '')) {
            this.userInfo.username = 'Soporte';
        }

        console.log('Datos del usuario de soporte cargados:', this.userInfo);
        
        // Si ya estamos conectados, enviar la información del usuario
        if (this.isConnected && this.userInfo) {
            this.socket.emit('support_connect', {
                userId: this.userInfo.id,
                username: this.userInfo.username,
                role: this.userInfo.role
            });
        }
    }

    updateClientsList(clients) {
        console.log('Actualizando lista de clientes:', clients);
        this.clients.clear();
        this.clientsList.innerHTML = '';

        if (!clients || clients.length === 0) {
            console.log('No hay clientes conectados');
            this.showNoClients();
            this.updateStats();
            return;
        }

        clients.forEach(client => {
            console.log('Agregando cliente a la lista:', client);
            this.clients.set(client.id, client);
            this.addClientToList(client);
        });

        this.updateStats();
    }

    addClientToList(client) {
        const clientElement = document.createElement('div');
        clientElement.className = 'client-item';
        clientElement.dataset.clientId = client.id;
        
        const avatar = document.createElement('div');
        avatar.className = 'client-avatar';
        
        // Validar que username existe y no sea null/undefined
        const username = client.username || 'Cliente';
        avatar.textContent = username.charAt(0).toUpperCase();

        const info = document.createElement('div');
        info.className = 'client-info';
        info.innerHTML = `
            <div class="client-name">${this.escapeHtml(username)}</div>
            <div class="client-status ${client.online ? 'online' : 'offline'}">
                ${client.online ? 'En línea' : 'Desconectado'}
            </div>
        `;

        const indicator = document.createElement('div');
        indicator.className = 'message-indicator';

        clientElement.appendChild(avatar);
        clientElement.appendChild(info);
        clientElement.appendChild(indicator);

        clientElement.addEventListener('click', () => {
            this.selectClient(client.id);
        });

        this.clientsList.appendChild(clientElement);
    }

    selectClient(clientId) {
        console.log('selectClient llamado con clientId:', clientId);
        
        // Deseleccionar cliente anterior
        const previousActive = this.clientsList.querySelector('.client-item.active');
        if (previousActive) {
            previousActive.classList.remove('active');
        }

        // Seleccionar nuevo cliente
        const clientElement = this.clientsList.querySelector(`[data-client-id="${clientId}"]`);
        if (clientElement) {
            clientElement.classList.add('active');
            clientElement.classList.remove('has-messages');
        }

        this.selectedClient = this.clients.get(clientId);
        console.log('Cliente seleccionado:', this.selectedClient);
        
        if (this.selectedClient) {
            const username = this.selectedClient.username || 'Cliente';
            this.selectedClientName.textContent = username;
            this.selectedClientStatus.textContent = this.selectedClient.online ? 'En línea' : 'Desconectado';
            this.selectedClientStatus.className = this.selectedClient.online ? 'online' : 'offline';
            
            console.log('Llamando enableChat...');
            this.enableChat();
            this.loadChatHistory(clientId);
        } else {
            console.log('No se encontró el cliente con ID:', clientId);
            console.log('Clientes disponibles:', Array.from(this.clients.keys()));
        }
    }

    enableChat() {
        console.log('enableChat llamado');
        this.messageInput.disabled = false;
        this.sendButton.disabled = false;
        this.endChatButton.disabled = false;
        this.messageInput.placeholder = 'Escribe tu respuesta...';
        
        console.log('Estado después de enableChat:', {
            messageInputDisabled: this.messageInput.disabled,
            sendButtonDisabled: this.sendButton.disabled,
            endChatButtonDisabled: this.endChatButton.disabled
        });
    }

    disableChat() {
        this.messageInput.disabled = true;
        this.sendButton.disabled = true;
        this.endChatButton.disabled = true;
        this.messageInput.placeholder = 'Selecciona un cliente para chatear';
        this.selectedClientName.textContent = 'Selecciona un cliente';
        this.selectedClientStatus.textContent = '';
    }

    sendMessage() {
        console.log('sendMessage llamado:', {
            selectedClient: this.selectedClient,
            isConnected: this.isConnected,
            messageValue: this.messageInput.value.trim()
        });
        
        if (!this.selectedClient || !this.isConnected) {
            console.log('No se puede enviar mensaje:', {
                hasSelectedClient: !!this.selectedClient,
                isConnected: this.isConnected
            });
            return;
        }

        const message = this.messageInput.value.trim();
        if (!message) {
            console.log('Mensaje vacío, no se envía');
            return;
        }

        console.log('Enviando mensaje al servidor:', message);

        // Enviar mensaje al servidor
        this.socket.emit('support_message', {
            message: message,
            clientId: this.selectedClient.id,
            supportId: this.userInfo.id,
            supportName: this.userInfo.username
        });

        // Mostrar mensaje localmente
        this.displayMessage(message, 'support', new Date().toISOString());

        // Limpiar input
        this.messageInput.value = '';
        this.updateCharCount();
        this.toggleSendButton();
        this.autoResize();

        // Actualizar estadísticas
        this.stats.totalMessages++;
        this.updateStats();
    }

    handleClientMessage(data) {
        console.log('handleClientMessage llamado con:', data);
        
        // Mostrar mensaje del cliente
        this.displayMessage(data.message, 'client', data.timestamp);

        // Marcar cliente como que tiene mensajes si no está seleccionado
        if (this.selectedClient && this.selectedClient.id !== data.clientId) {
            console.log('Cliente no seleccionado, marcando como que tiene mensajes');
            const clientElement = this.clientsList.querySelector(`[data-client-id="${data.clientId}"]`);
            if (clientElement) {
                clientElement.classList.add('has-messages');
            }
        } else {
            console.log('Cliente seleccionado o mismo cliente, no se marca como que tiene mensajes');
        }

        // Actualizar estadísticas
        this.stats.totalMessages++;
        this.updateStats();

        // Mostrar notificación si la ventana no está activa
        if (document.hidden) {
            const username = data.username || 'Cliente';
            this.showNotification(`Nuevo mensaje de ${username}`, data.message);
        }
    }

    displayMessage(message, sender, timestamp) {
        const messageElement = document.createElement('div');
        messageElement.className = `message ${sender}`;
        
        const time = new Date(timestamp).toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit'
        });

        messageElement.innerHTML = `
            <div class="message-content">
                ${this.escapeHtml(message)}
            </div>
            <div class="message-time">${time}</div>
        `;

        // Remover mensaje de bienvenida si es el primer mensaje real
        const welcomeMessage = this.supportMessages.querySelector('.welcome-support');
        if (welcomeMessage && sender === 'client') {
            welcomeMessage.remove();
        }

        this.supportMessages.appendChild(messageElement);
        this.scrollToBottom();
    }

    showClientTyping(clientId) {
        if (this.selectedClient && this.selectedClient.id === clientId) {
            this.showTypingIndicator();
        }
    }

    hideClientTyping(clientId) {
        if (this.selectedClient && this.selectedClient.id === clientId) {
            this.hideTypingIndicator();
        }
    }

    showTypingIndicator() {
        let typingIndicator = this.supportMessages.querySelector('.typing-indicator');
        
        if (!typingIndicator) {
            typingIndicator = document.createElement('div');
            typingIndicator.className = 'typing-indicator';
            const username = this.selectedClient.username || 'Cliente';
            typingIndicator.innerHTML = `
                <span>${username} está escribiendo</span>
                <div class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            `;
            this.supportMessages.appendChild(typingIndicator);
        }
        
        typingIndicator.style.display = 'flex';
        this.scrollToBottom();
    }

    hideTypingIndicator() {
        const typingIndicator = this.supportMessages.querySelector('.typing-indicator');
        if (typingIndicator) {
            typingIndicator.style.display = 'none';
        }
    }

    handleTyping() {
        if (!this.selectedClient) return;

        // Emitir evento de typing
        this.socket.emit('support_typing', {
            clientId: this.selectedClient.id,
            supportId: this.userInfo.id
        });

        // Limpiar timeout anterior
        if (this.typingTimeout) {
            clearTimeout(this.typingTimeout);
        }

        // Establecer nuevo timeout
        this.typingTimeout = setTimeout(() => {
            this.socket.emit('support_stop_typing', {
                clientId: this.selectedClient.id,
                supportId: this.userInfo.id
            });
        }, 1000);
    }

    handleClientDisconnect(clientId) {
        const client = this.clients.get(clientId);
        if (client) {
            client.online = false;
            
            // Actualizar elemento en la lista
            const clientElement = this.clientsList.querySelector(`[data-client-id="${clientId}"]`);
            if (clientElement) {
                const statusElement = clientElement.querySelector('.client-status');
                statusElement.textContent = 'Desconectado';
                statusElement.className = 'client-status offline';
            }

            // Si es el cliente seleccionado, actualizar header
            if (this.selectedClient && this.selectedClient.id === clientId) {
                this.selectedClientStatus.textContent = 'Desconectado';
                this.selectedClientStatus.className = 'offline';
            }
        }
    }

    endChat() {
        if (!this.selectedClient) return;

        if (confirm('¿Estás seguro de que quieres finalizar este chat?')) {
            this.socket.emit('end_chat', {
                clientId: this.selectedClient.id,
                supportId: this.userInfo.id
            });

            // Mostrar mensaje de chat finalizado
            this.displayMessage('Chat finalizado por el soporte', 'support', new Date().toISOString());
            
            // Deshabilitar chat
            this.disableChat();
            
            // Limpiar mensajes
            this.supportMessages.innerHTML = `
                <div class="welcome-support">
                    <div class="message-content">
                        <h3>Panel de Soporte</h3>
                        <p>Selecciona un cliente de la lista para comenzar a chatear</p>
                    </div>
                    <div class="message-time">${new Date().toLocaleTimeString('es-ES', {hour: '2-digit', minute: '2-digit'})}</div>
                </div>
            `;
        }
    }

    refreshClients() {
        this.socket.emit('request_clients_update');
    }

    loadChatHistory(clientId) {
        // Limpiar mensajes actuales
        this.supportMessages.innerHTML = `
            <div class="welcome-support">
                <div class="message-content">
                    <h3>Chat con ${this.selectedClient.username}</h3>
                    <p>Inicia la conversación</p>
                </div>
                <div class="message-time">${new Date().toLocaleTimeString('es-ES', {hour: '2-digit', minute: '2-digit'})}</div>
            </div>
        `;

        // Aquí se podría cargar el historial de mensajes desde el servidor
        // Por ahora, solo mostramos el mensaje de bienvenida
    }

    setupQuickResponses() {
        console.log('setupQuickResponses llamado');
        const quickResponses = document.querySelectorAll('.quick-response');
        console.log('Respuestas rápidas encontradas:', quickResponses.length);
        
        quickResponses.forEach(button => {
            console.log('Configurando respuesta rápida:', button.dataset.response);
            button.addEventListener('click', () => {
                console.log('Respuesta rápida clickeada:', button.dataset.response);
                const response = button.dataset.response;
                this.messageInput.value = response;
                this.updateCharCount();
                this.toggleSendButton();
                this.autoResize();
                this.messageInput.focus();
            });
        });
    }

    updateStats() {
        const activeClients = Array.from(this.clients.values()).filter(c => c.online).length;
        const pendingMessages = this.clientsList.querySelectorAll('.has-messages').length;

        this.activeClientsCount.textContent = activeClients;
        this.pendingMessagesCount.textContent = pendingMessages;

        // Actualizar estadísticas en el panel
        document.getElementById('total-messages').textContent = this.stats.totalMessages;
        document.getElementById('avg-response-time').textContent = this.stats.avgResponseTime;
        document.getElementById('satisfaction-rate').textContent = this.stats.satisfactionRate + '%';
    }

    updateCharCount() {
        const count = this.messageInput.value.length;
        this.charCount.textContent = `${count}/500`;
        
        if (count > 450) {
            this.charCount.style.color = '#f44336';
        } else if (count > 400) {
            this.charCount.style.color = '#ff9800';
        } else {
            this.charCount.style.color = '#666';
        }
    }

    toggleSendButton() {
        const hasText = this.messageInput.value.trim().length > 0;
        const hasClient = this.selectedClient !== null;
        const shouldDisable = !hasText || !hasClient || !this.isConnected;
        
        console.log('toggleSendButton:', {
            hasText,
            hasClient,
            isConnected: this.isConnected,
            shouldDisable,
            currentDisabled: this.sendButton.disabled
        });
        
        this.sendButton.disabled = shouldDisable;
    }

    autoResize() {
        this.messageInput.style.height = 'auto';
        this.messageInput.style.height = Math.min(this.messageInput.scrollHeight, 120) + 'px';
    }

    scrollToBottom() {
        this.supportMessages.scrollTop = this.supportMessages.scrollHeight;
    }

    showNoClients() {
        this.clientsList.innerHTML = `
            <div class="no-clients">
                <p>No hay clientes conectados en este momento</p>
                <div class="empty-state">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                        <circle cx="9" cy="7" r="4"/>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                    </svg>
                </div>
            </div>
        `;
    }

    showNotification(title, body) {
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(title, { body });
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Inicializar panel cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new SupportPanel();
});

// Manejar visibilidad de la página
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Página oculta - podríamos pausar algunas actualizaciones
        console.log('Panel de soporte oculto');
    } else {
        // Página visible - reanudar actualizaciones
        console.log('Panel de soporte visible');
    }
}); 