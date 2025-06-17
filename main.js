
// Global variables
let currentUser = null;
let cart = [];
let appliedDiscount = 0;
let freeShipping = false;
let hasSpunWheel = false;

// Products data
const products = [
    {
        id: 1,
        name: "Mouse Gamer RGB",
        description: "Mouse gamer com iluminação RGB e precisão profissional",
        price: 129.99,
        image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300&h=200&fit=crop",
        reviews: [
            { user: "João Silva", rating: 5, comment: "Produto excelente! Super preciso para jogos." },
            { user: "Maria Santos", rating: 4, comment: "Chegou rápido e funcionando perfeitamente." },
            { user: "Pedro Costa", rating: 5, comment: "Melhor mouse que já tive, recomendo!" }
        ]
    },
    {
        id: 2,
        name: "Teclado Mecânico",
        description: "Teclado mecânico com switches Cherry MX e backlight",
        price: 299.99,
        image: "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=300&h=200&fit=crop",
        reviews: [
            { user: "Ana Lima", rating: 5, comment: "Switches muito responsivos, adorei!" },
            { user: "Carlos Oliveira", rating: 4, comment: "Qualidade excelente, vale cada centavo." },
            { user: "Lucia Ferreira", rating: 5, comment: "Perfeito para programação e jogos." }
        ]
    },
    {
        id: 3,
        name: "Headset Gamer 7.1",
        description: "Headset com som surround 7.1 e microfone noise cancelling",
        price: 199.99,
        image: "https://images.unsplash.com/photo-1599669454699-248893623440?w=300&h=200&fit=crop",
        reviews: [
            { user: "Rafael Souza", rating: 5, comment: "Som incrível, sinto como se estivesse no jogo!" },
            { user: "Fernanda Alves", rating: 4, comment: "Confortável para longas sessões de jogo." },
            { user: "Bruno Machado", rating: 5, comment: "Microfone muito claro, perfeito para streams." }
        ]
    },
    {
        id: 4,
        name: "Monitor 24' Full HD",
        description: "Monitor LED 24 polegadas com taxa de atualização 144Hz",
        price: 599.99,
        image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=300&h=200&fit=crop",
        reviews: [
            { user: "Thiago Rocha", rating: 5, comment: "Cores vibrantes e zero input lag!" },
            { user: "Camila Nunes", rating: 4, comment: "Excelente para trabalho e entretenimento." },
            { user: "Diego Cardoso", rating: 5, comment: "144Hz faz toda a diferença nos jogos." }
        ]
    },
    {
        id: 5,
        name: "Caixa de Som Bluetooth",
        description: "Caixa de som portátil com alta qualidade e graves potentes",
        price: 159.99,
        image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300&h=200&fit=crop",
        reviews: [
            { user: "Juliana Pereira", rating: 5, comment: "Som muito limpo e graves excelentes!" },
            { user: "Roberto Silva", rating: 4, comment: "Bateria dura bastante, muito prática." },
            { user: "Patricia Gomes", rating: 5, comment: "Design bonito e som de qualidade." }
        ]
    },
    {
        id: 6,
        name: "Webcam Full HD",
        description: "Webcam com resolução Full HD e microfone integrado",
        price: 89.99,
        image: "https://images.unsplash.com/photo-1587826080692-b5b8bec6ff7d?w=300&h=200&fit=crop",
        reviews: [
            { user: "Marcos Antonio", rating: 4, comment: "Imagem muito nítida para videochamadas." },
            { user: "Carla Mendes", rating: 5, comment: "Fácil de instalar e usar, recomendo." },
            { user: "André Ribeiro", rating: 4, comment: "Boa qualidade pelo preço, satisfeito." }
        ]
    }
];

// AI Chat responses
const chatResponses = {
    "mouse": "Recomendo o Mouse Gamer RGB! Ele tem precisão profissional e iluminação linda. Perfeito para jogos e trabalho.",
    "teclado": "O Teclado Mecânico é incrível! Os switches Cherry MX proporcionam uma digitação muito satisfatória.",
    "headset": "O Headset Gamer 7.1 é excelente! Som surround incrível e microfone com cancelamento de ruído.",
    "monitor": "O Monitor 24' Full HD com 144Hz é perfeito para jogos! Taxa de atualização alta elimina o lag.",
    "caixa": "A Caixa de Som Bluetooth tem graves potentes e é super portátil. Ideal para festas e viagens!",
    "webcam": "A Webcam Full HD é perfeita para home office e streams. Imagem nítida e microfone integrado.",
    "melhor": "Depende do seu uso! Para jogos: Mouse + Teclado + Headset. Para trabalho: Monitor + Webcam.",
    "preço": "Temos produtos para todos os orçamentos! O mais barato é a Webcam por R$ 89,99.",
    "desconto": "Que sorte! Se você girou a roleta, pode ter ganhado desconto. Todos os produtos têm ótimo custo-benefício!",
    "entrega": "Entregamos para todo o Brasil! Frete grátis pode ser conquistado na roleta de prêmios.",
    "default": "Posso ajudar você a escolher entre Mouse, Teclado, Headset, Monitor, Caixa de Som ou Webcam. Qual categoria te interessa?"
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    loadUserData();
    renderProducts();
    setupEventListeners();
    
    // Show wheel modal if user hasn't spun yet and is logged in
    if (currentUser && !hasSpunWheel) {
        setTimeout(() => {
            showWheelModal();
        }, 1000);
    }
});

// Load user data from localStorage
function loadUserData() {
    const userData = localStorage.getItem('techshop_user');
    const wheelData = localStorage.getItem('techshop_wheel');
    const cartData = localStorage.getItem('techshop_cart');
    const discountData = localStorage.getItem('techshop_discount');
    const shippingData = localStorage.getItem('techshop_shipping');
    
    if (userData) {
        currentUser = JSON.parse(userData);
        updateLoginButton();
    }
    
    if (wheelData) {
        hasSpunWheel = JSON.parse(wheelData);
    }
    
    if (cartData) {
        cart = JSON.parse(cartData);
        updateCartCount();
    }
    
    if (discountData) {
        appliedDiscount = JSON.parse(discountData);
    }
    
    if (shippingData) {
        freeShipping = JSON.parse(shippingData);
    }
}

// Save data to localStorage
function saveUserData() {
    if (currentUser) {
        localStorage.setItem('techshop_user', JSON.stringify(currentUser));
    }
    localStorage.setItem('techshop_wheel', JSON.stringify(hasSpunWheel));
    localStorage.setItem('techshop_cart', JSON.stringify(cart));
    localStorage.setItem('techshop_discount', JSON.stringify(appliedDiscount));
    localStorage.setItem('techshop_shipping', JSON.stringify(freeShipping));
}

// Setup event listeners
function setupEventListeners() {
    // Login/Logout button
    document.getElementById('loginBtn').addEventListener('click', handleLoginClick);
    
    // Auth modal
    document.getElementById('closeLogin').addEventListener('click', () => hideModal('loginModal'));
    document.getElementById('authForm').addEventListener('submit', handleAuth);
    document.getElementById('authSwitchLink').addEventListener('click', toggleAuthMode);
    
    // Cart button
    document.getElementById('cartBtn').addEventListener('click', showCartModal);
    document.getElementById('closeCart').addEventListener('click', () => hideModal('cartModal'));
    document.getElementById('checkoutBtn').addEventListener('click', showCheckoutModal);
    
    // Product modal
    document.getElementById('closeProduct').addEventListener('click', () => hideModal('productModal'));
    
    // Checkout modal
    document.getElementById('closeCheckout').addEventListener('click', () => hideModal('checkoutModal'));
    document.getElementById('checkoutForm').addEventListener('submit', handleCheckout);
    
    // Wheel modal
    document.getElementById('spinBtn').addEventListener('click', spinWheel);
    
    // Chat widget
    document.getElementById('chatToggle').addEventListener('click', toggleChat);
    document.getElementById('closeChat').addEventListener('click', toggleChat);
    document.getElementById('chatSend').addEventListener('click', sendChatMessage);
    document.getElementById('chatInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendChatMessage();
        }
    });
    
    // Close modals when clicking outside
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal-overlay')) {
            e.target.classList.remove('active');
        }
    });
}

// Render products
function renderProducts() {
    const grid = document.getElementById('productsGrid');
    grid.innerHTML = products.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h4 class="product-name">${product.name}</h4>
                <p class="product-description">${product.description}</p>
                <div class="product-price">R$ ${product.price.toFixed(2).replace('.', ',')}</div>
                <div class="product-actions">
                    <button class="btn-details" onclick="showProductDetails(${product.id})">Saiba mais</button>
                    <button class="btn-add-cart" onclick="addToCart(${product.id})">Adicionar</button>
                </div>
            </div>
        </div>
    `).join('');
}

// Show product details modal
function showProductDetails(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const detailsHtml = `
        <img src="${product.image}" alt="${product.name}" class="product-detail-image">
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <div class="product-price">R$ ${product.price.toFixed(2).replace('.', ',')}</div>
        
        <div class="reviews-section">
            <h4>⭐ Avaliações dos Clientes</h4>
            ${product.reviews.map(review => `
                <div class="review">
                    <div class="review-header">
                        <strong>${review.user}</strong>
                        <span class="review-stars">${'★'.repeat(review.rating)}${'☆'.repeat(5-review.rating)}</span>
                    </div>
                    <p>${review.comment}</p>
                </div>
            `).join('')}
        </div>
        
        <button class="btn-primary" onclick="addToCart(${product.id}); hideModal('productModal');" style="width: 100%; margin-top: 1rem;">
            Adicionar ao Carrinho
        </button>
    `;
    
    document.getElementById('productDetails').innerHTML = detailsHtml;
    showModal('productModal');
}

// Add product to cart
function addToCart(productId) {
    if (!currentUser) {
        showModal('loginModal');
        return;
    }
    
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    updateCartCount();
    saveUserData();
    showSuccessMessage(`${product.name} adicionado ao carrinho!`);
}

// Update cart count
function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    document.getElementById('cartCount').textContent = count;
}

// Show cart modal
function showCartModal() {
    if (!currentUser) {
        showModal('loginModal');
        return;
    }
    
    const cartItemsHtml = cart.length === 0 ? 
        '<p style="text-align: center; color: #666;">Seu carrinho está vazio</p>' :
        cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-info">
                    <strong>${item.name}</strong><br>
                    <span>R$ ${item.price.toFixed(2).replace('.', ',')}</span>
                </div>
                <div class="cart-item-controls">
                    <button class="qty-btn" onclick="updateCartQuantity(${item.id}, -1)">-</button>
                    <span style="margin: 0 1rem;">${item.quantity}</span>
                    <button class="qty-btn" onclick="updateCartQuantity(${item.id}, 1)">+</button>
                    <button class="qty-btn" onclick="removeFromCart(${item.id})" style="background: #ff6b6b; margin-left: 1rem;">🗑️</button>
                </div>
            </div>
        `).join('');
    
    document.getElementById('cartItems').innerHTML = cartItemsHtml;
    
    // Update totals
    updateCartTotals();
    showModal('cartModal');
}

// Update cart totals
function updateCartTotals() {
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const discountAmount = subtotal * (appliedDiscount / 100);
    const shippingCost = freeShipping ? 0 : 15;
    const total = subtotal - discountAmount + shippingCost;
    
    // Show discount info
    const discountInfo = document.getElementById('discountInfo');
    if (appliedDiscount > 0 || freeShipping) {
        let infoText = '';
        if (appliedDiscount > 0) {
            infoText += `🎉 Desconto de ${appliedDiscount}% aplicado! `;
        }
        if (freeShipping) {
            infoText += `🚚 Frete Grátis Ativado! `;
        }
        discountInfo.textContent = infoText;
        discountInfo.style.display = 'block';
    } else {
        discountInfo.style.display = 'none';
    }
    
    document.getElementById('cartTotal').textContent = total.toFixed(2).replace('.', ',');
    document.getElementById('checkoutTotal').textContent = total.toFixed(2).replace('.', ',');
}

// Update cart quantity
function updateCartQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;
    
    item.quantity += change;
    if (item.quantity <= 0) {
        removeFromCart(productId);
        return;
    }
    
    updateCartCount();
    showCartModal();
    saveUserData();
}

// Remove item from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartCount();
    showCartModal();
    saveUserData();
}

// Handle login/logout click
function handleLoginClick() {
    if (currentUser) {
        // Logout
        currentUser = null;
        hasSpunWheel = false;
        cart = [];
        appliedDiscount = 0;
        freeShipping = false;
        
        localStorage.removeItem('techshop_user');
        localStorage.removeItem('techshop_wheel');
        localStorage.removeItem('techshop_cart');
        localStorage.removeItem('techshop_discount');
        localStorage.removeItem('techshop_shipping');
        
        updateLoginButton();
        updateCartCount();
        showSuccessMessage('Logout realizado com sucesso!');
    } else {
        showModal('loginModal');
    }
}

// Update login button
function updateLoginButton() {
    const loginBtn = document.getElementById('loginBtn');
    if (currentUser) {
        loginBtn.textContent = `Sair (${currentUser.name})`;
        loginBtn.className = 'btn-secondary';
    } else {
        loginBtn.textContent = 'Entrar';
        loginBtn.className = 'btn-secondary';
    }
}

// Handle authentication
function handleAuth(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const name = document.getElementById('name').value;
    const isLogin = document.getElementById('authTitle').textContent === 'Entrar';
    
    if (isLogin) {
        // Simple login simulation
        const users = JSON.parse(localStorage.getItem('techshop_users') || '[]');
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            currentUser = user;
            saveUserData();
            updateLoginButton();
            hideModal('loginModal');
            showSuccessMessage('Login realizado com sucesso!');
            
            // Show wheel modal if user hasn't spun yet
            if (!hasSpunWheel) {
                setTimeout(() => {
                    showWheelModal();
                }, 1000);
            }
        } else {
            alert('Email ou senha incorretos!');
        }
    } else {
        // Registration
        if (!name.trim()) {
            alert('Por favor, preencha o nome!');
            return;
        }
        
        const users = JSON.parse(localStorage.getItem('techshop_users') || '[]');
        const existingUser = users.find(u => u.email === email);
        
        if (existingUser) {
            alert('Email já cadastrado!');
            return;
        }
        
        const newUser = { email, password, name: name.trim() };
        users.push(newUser);
        localStorage.setItem('techshop_users', JSON.stringify(users));
        
        currentUser = newUser;
        saveUserData();
        updateLoginButton();
        hideModal('loginModal');
        showSuccessMessage('Cadastro realizado com sucesso!');
        
        // Show wheel modal for new users
        setTimeout(() => {
            showWheelModal();
        }, 1000);
    }
    
    // Reset form
    document.getElementById('authForm').reset();
}

// Toggle auth mode (login/register)
function toggleAuthMode(e) {
    e.preventDefault();
    
    const title = document.getElementById('authTitle');
    const submitBtn = document.getElementById('authSubmit');
    const nameGroup = document.getElementById('nameGroup');
    const switchText = document.getElementById('authSwitchText');
    const switchLink = document.getElementById('authSwitchLink');
    
    if (title.textContent === 'Entrar') {
        title.textContent = 'Cadastrar';
        submitBtn.textContent = 'Cadastrar';
        nameGroup.style.display = 'block';
        switchText.textContent = 'Já tem conta?';
        switchLink.textContent = 'Entre aqui';
    } else {
        title.textContent = 'Entrar';
        submitBtn.textContent = 'Entrar';
        nameGroup.style.display = 'none';
        switchText.textContent = 'Não tem conta?';
        switchLink.textContent = 'Cadastre-se';
    }
}

// Show wheel modal
function showWheelModal() {
    if (!currentUser || hasSpunWheel) {
        return;
    }
    showModal('wheelModal');
}

// Spin the wheel
function spinWheel() {
    if (hasSpunWheel) {
        alert('Você já girou a roleta!');
        return;
    }
    
    const wheel = document.getElementById('wheel');
    const prizes = [
        { text: "10% de desconto", discount: 10 },
        { text: "15% de desconto", discount: 15 },
        { text: "Frete grátis", freeShipping: true },
        { text: "5% de desconto", discount: 5 },
        { text: "Cupom Especial", discount: 20 },
        { text: "Nada :(", nothing: true }
    ];
    
    // Random spin between 5-10 full rotations plus random position
    const spins = Math.floor(Math.random() * 6) + 5; // 5-10 full rotations
    const finalRotation = spins * 360 + Math.floor(Math.random() * 360);
    
    wheel.style.transform = `rotate(${finalRotation}deg)`;
    
    // Disable spin button
    document.getElementById('spinBtn').disabled = true;
    document.getElementById('spinBtn').textContent = 'Girando...';
    
    // Calculate result after animation
    setTimeout(() => {
        // Calculate which sector the pointer is pointing to
        const normalizedRotation = finalRotation % 360;
        const sectorAngle = 360 / 6; // 6 sectors
        const pointerPosition = (360 - normalizedRotation + (sectorAngle / 2)) % 360;
        const winningIndex = Math.floor(pointerPosition / sectorAngle);
        
        const prize = prizes[winningIndex];
        
        // Apply prize
        if (prize.discount) {
            appliedDiscount = prize.discount;
        }
        if (prize.freeShipping) {
            freeShipping = true;
        }
        
        // Show result
        const resultDiv = document.getElementById('prizeResult');
        resultDiv.innerHTML = `
            <h4>🎉 Parabéns!</h4>
            <p>Você ganhou: <strong>${prize.text}</strong></p>
            ${prize.nothing ? '<p>Que pena! Mas continue navegando, temos ótimas ofertas!</p>' : '<p>Sua premiação já foi aplicada!</p>'}
        `;
        resultDiv.style.display = 'block';
        
        // Mark as spun
        hasSpunWheel = true;
        saveUserData();
        
        // Update cart totals if cart is open
        updateCartTotals();
        
        // Close modal after 3 seconds
        setTimeout(() => {
            hideModal('wheelModal');
        }, 3000);
        
    }, 4000); // Wait for wheel animation to complete
}

// Show checkout modal
function showCheckoutModal() {
    if (cart.length === 0) {
        alert('Seu carrinho está vazio!');
        return;
    }
    
    hideModal('cartModal');
    showModal('checkoutModal');
}

// Handle checkout
function handleCheckout(e) {
    e.preventDefault();
    
    // Simulate checkout process
    cart = [];
    updateCartCount();
    saveUserData();
    
    hideModal('checkoutModal');
    showSuccessMessage('🎉 Compra realizada com sucesso! Obrigado por comprar conosco!');
    
    // Reset form
    document.getElementById('checkoutForm').reset();
}

// Chat functionality
function toggleChat() {
    const chatWindow = document.getElementById('chatWindow');
    chatWindow.classList.toggle('active');
}

function sendChatMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Add user message
    addChatMessage(message, 'user');
    input.value = '';
    
    // Generate bot response
    setTimeout(() => {
        const response = generateChatResponse(message);
        addChatMessage(response, 'bot');
    }, 1000);
}

function addChatMessage(message, sender) {
    const messagesContainer = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = sender === 'user' ? 'user-message' : 'bot-message';
    messageDiv.textContent = message;
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function generateChatResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    // Check for keywords in the message
    for (const [keyword, response] of Object.entries(chatResponses)) {
        if (lowerMessage.includes(keyword)) {
            return response;
        }
    }
    
    return chatResponses.default;
}

// Utility functions
function showModal(modalId) {
    document.getElementById(modalId).classList.add('active');
}

function hideModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

function showSuccessMessage(message) {
    const successDiv = document.getElementById('successMessage');
    document.getElementById('successText').textContent = message;
    successDiv.classList.add('show');
    
    setTimeout(() => {
        successDiv.classList.remove('show');
    }, 3000);
}
