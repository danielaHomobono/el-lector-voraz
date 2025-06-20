// Chat del cliente - Funcionalidad principal
class ClientChat {
    constructor() {
        this.socket = null;
        this.isConnected = false;
        this.userInfo = null;
        this.messageInput = document.getElementById('message-input');
        this.sendButton = document.getElementById('send-button');
        this.messagesContainer = document.getElementById('chat-messages');
        this.statusIndicator = document.getElementById('status-indicator');
        this.statusText = document.getElementById('status-text');
        this.charCount = document.getElementById('char-count');
        
        this.init();
    }

    init() {
        this.connectSocket();
        this.setupEventListeners();
        this.loadUserInfo();
    }

    connectSocket() {
        // Conectar a Socket.IO
        this.socket = io();
        
        this.socket.on('connect', () => {
            console.log('Conectado al servidor de chat');
            this.isConnected = true;
            this.updateStatus('Conectado', 'connected');
            
            // Enviar información del usuario al conectarse
            if (this.userInfo) {
                console.log('Enviando información de cliente:', this.userInfo);
                this.socket.emit('client_connect', {
                    userId: this.userInfo.id,
                    username: this.userInfo.username,
                    role: this.userInfo.role
                });
            }
        });

        this.socket.on('disconnect', () => {
            console.log('Desconectado del servidor de chat');
            this.isConnected = false;
            this.updateStatus('Desconectado', 'disconnected');
        });

        this.socket.on('message_received', (data) => {
            console.log('Mensaje recibido del soporte:', data);
            this.displayMessage(data.message, 'support', data.timestamp);
        });

        this.socket.on('typing_start', (data) => {
            console.log('Soporte está escribiendo');
            this.showTypingIndicator();
        });

        this.socket.on('typing_stop', () => {
            console.log('Soporte dejó de escribir');
            this.hideTypingIndicator();
        });

        this.socket.on('chat_ended', () => {
            console.log('Chat finalizado');
            this.handleChatEnded();
        });
    }

    setupEventListeners() {
        // Enviar mensaje con botón
        this.sendButton.addEventListener('click', () => {
            this.sendMessage();
        });

        // Enviar mensaje con Enter (Shift+Enter para nueva línea)
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

        // Auto-resize del textarea
        this.messageInput.addEventListener('input', () => {
            this.autoResize();
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

        // Si aún no hay datos, crear un usuario temporal
        if (!this.userInfo) {
            this.userInfo = {
                id: 'temp_' + Date.now(),
                username: 'Cliente',
                role: 'client'
            };
        }

        // Asegurar que username siempre tenga un valor válido
        if (!this.userInfo.username || this.userInfo.username.trim() === '') {
            this.userInfo.username = 'Cliente';
        }

        console.log('Datos del usuario cargados:', this.userInfo);
        
        // Si ya estamos conectados, enviar la información del usuario
        if (this.isConnected && this.userInfo) {
            this.socket.emit('client_connect', {
                userId: this.userInfo.id,
                username: this.userInfo.username,
                role: this.userInfo.role
            });
        }
    }

    sendMessage() {
        const message = this.messageInput.value.trim();
        if (!message || !this.isConnected) {
            console.log('No se puede enviar mensaje:', { message: !!message, connected: this.isConnected });
            return;
        }

        console.log('Enviando mensaje:', message);

        // Enviar mensaje al servidor
        this.socket.emit('client_message', {
            message: message,
            userId: this.userInfo.id,
            username: this.userInfo.username
        });

        // Mostrar mensaje localmente
        this.displayMessage(message, 'client', new Date().toISOString());

        // Limpiar input
        this.messageInput.value = '';
        this.updateCharCount();
        this.toggleSendButton();
        this.autoResize();
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
        const welcomeMessage = this.messagesContainer.querySelector('.welcome-message');
        if (welcomeMessage && sender === 'client') {
            welcomeMessage.remove();
        }

        this.messagesContainer.appendChild(messageElement);
        this.scrollToBottom();
    }

    showTypingIndicator() {
        let typingIndicator = this.messagesContainer.querySelector('.typing-indicator');
        
        if (!typingIndicator) {
            typingIndicator = document.createElement('div');
            typingIndicator.className = 'typing-indicator';
            typingIndicator.innerHTML = `
                <span>Soporte está escribiendo</span>
                <div class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            `;
            this.messagesContainer.appendChild(typingIndicator);
        }
        
        typingIndicator.style.display = 'flex';
        this.scrollToBottom();
    }

    hideTypingIndicator() {
        const typingIndicator = this.messagesContainer.querySelector('.typing-indicator');
        if (typingIndicator) {
            typingIndicator.style.display = 'none';
        }
    }

    updateStatus(text, status) {
        this.statusText.textContent = text;
        this.statusIndicator.className = `status-indicator ${status}`;
    }

    updateCharCount() {
        const count = this.messageInput.value.length;
        this.charCount.textContent = `${count}/500`;
        
        // Cambiar color si se acerca al límite
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
        this.sendButton.disabled = !hasText || !this.isConnected;
    }

    autoResize() {
        this.messageInput.style.height = 'auto';
        this.messageInput.style.height = Math.min(this.messageInput.scrollHeight, 120) + 'px';
    }

    scrollToBottom() {
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }

    handleChatEnded() {
        // Mostrar mensaje de chat finalizado
        const endMessage = document.createElement('div');
        endMessage.className = 'message support';
        endMessage.innerHTML = `
            <div class="message-content">
                <strong>Chat finalizado</strong><br>
                Gracias por contactarnos. Si necesitas más ayuda, no dudes en iniciar una nueva conversación.
            </div>
            <div class="message-time">${new Date().toLocaleTimeString('es-ES', {hour: '2-digit', minute: '2-digit'})}</div>
        `;
        
        this.messagesContainer.appendChild(endMessage);
        this.scrollToBottom();
        
        // Deshabilitar input
        this.messageInput.disabled = true;
        this.sendButton.disabled = true;
        this.messageInput.placeholder = 'Chat finalizado';
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Inicializar chat cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new ClientChat();
});

// Manejar reconexión automática
window.addEventListener('online', () => {
    console.log('Conexión a internet restaurada');
});

window.addEventListener('offline', () => {
    console.log('Conexión a internet perdida');
});

// Notificaciones del navegador (si está permitido)
if ('Notification' in window) {
    Notification.requestPermission();
}

// Función para mostrar notificación
function showNotification(title, body) {
    if (Notification.permission === 'granted' && document.hidden) {
        new Notification(title, { body });
    }
} 