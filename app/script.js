// =============================================
// STRUCTURE GÉNÉRALE - Fonctions communes
// =============================================

// Fonction pour afficher les messages de confirmation
function showConfirmation(message) {
    // Récupération des éléments DOM par ID
    var overlay = document.getElementById('confirmationOverlay');
    var confirmationMessage = document.getElementById('confirmationMessage');
    var confirmationText = document.getElementById('confirmationText');
    
    // Modification du contenu et affichage
    confirmationText.innerHTML = message;
    overlay.style.display = 'block';
    confirmationMessage.style.display = 'block';
    
    // Masquage automatique après délai
    setTimeout(function() {
        overlay.style.display = 'none';
        confirmationMessage.style.display = 'none';
    }, 3000);
}

// Initialisation au chargement de la page
window.onload = function() {
    // Vérification des éléments présents sur la page
    if (document.getElementById('inscriptionForm')) {
        initInscriptionForm();
    }
    
    if (document.getElementById('productsGrid')) {
        initProductsPage();
    }
    
    initCommonInteractions();
};

// Interactions communes
function initCommonInteractions() {
    // Sélection de tous les champs de texte par balise
    var inputs = document.getElementsByTagName('input');
    var textareas = document.getElementsByTagName('textarea');
    
    // Application des styles pour chaque input
    for (var i = 0; i < inputs.length; i++) {
        var input = inputs[i];
        
        if (input.type == 'text' || input.type == 'email' || input.type == 'tel' || input.type == 'password') {
            applyInputStyles(input);
        }
    }
    
    // Application des styles pour les textareas
    for (var i = 0; i < textareas.length; i++) {
        applyInputStyles(textareas[i]);
    }
}

function applyInputStyles(element) {
    // Style par défaut
    element.style.color = '#666';
    
    // Événement focus
    element.onfocus = function() {
        this.style.color = '#333';
        this.style.borderColor = '#4CAF50';
    };
    
    // Événement blur
    element.onblur = function() {
        if (this.value === '') {
            this.style.color = '#666';
        }
        this.style.borderColor = '#ddd';
    };
    
    // Événement input
    element.oninput = function() {
        this.style.color = '#333';
    };
}

// =============================================
// PAGE INSCRIPTION - Gestion du formulaire
// =============================================

// Initialisation du formulaire d'inscription
function initInscriptionForm() {
    var form = document.getElementById('inscriptionForm');
    var passwordInput = document.getElementById('password');
    var confirmPasswordInput = document.getElementById('confirmPassword');
    var resetBtn = document.getElementById('resetBtn');
    
    // Ajout des écouteurs d'événements
    passwordInput.oninput = validatePasswordStrength;
    confirmPasswordInput.oninput = validatePasswordConfirmation;
    form.onsubmit = handleFormSubmit;
    resetBtn.onclick = resetForm;
    
    initCheckboxAndRadioStyles();
}

// Validation de la force du mot de passe
function validatePasswordStrength() {
    var password = document.getElementById('password').value;
    var strengthBar = document.getElementById('passwordStrengthBar');
    var validationMessage = document.getElementById('password').parentNode.getElementsByClassName('validation-message')[0];
    
    // Définition des règles
    var hasMinLength = password.length >= 8;
    var hasUpperCase = /[A-Z]/.test(password);
    var hasNumber = /[0-9]/.test(password);
    var hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    // Calcul du score
    var strength = 0;
    var message = '';
    
    if (hasMinLength) strength += 25;
    if (hasUpperCase) strength += 25;
    if (hasNumber) strength += 25;
    if (hasSpecialChar) strength += 25;
    
    // Mise à jour de l'interface
    strengthBar.style.width = strength + '%';
    
    if (strength === 0) {
        strengthBar.style.backgroundColor = '#f44336';
        message = '';
    } else if (strength <= 50) {
        strengthBar.style.backgroundColor = '#ff9800';
        message = 'Mot de passe faible';
    } else if (strength <= 75) {
        strengthBar.style.backgroundColor = '#ffeb3b';
        message = 'Mot de passe moyen';
    } else {
        strengthBar.style.backgroundColor = '#4CAF50';
        message = 'Mot de passe fort';
    }
    
    validationMessage.innerHTML = message;
    validationMessage.className = 'validation-message';
    
    if (strength > 0 && strength < 100) {
        validationMessage.className += ' visible';
    }
}

// Validation de la confirmation du mot de passe
function validatePasswordConfirmation() {
    var password = document.getElementById('password').value;
    var confirmPassword = document.getElementById('confirmPassword').value;
    var validationMessage = document.getElementById('confirmPassword').parentNode.getElementsByClassName('validation-message')[0];
    
    if (confirmPassword === '') {
        validationMessage.innerHTML = '';
        validationMessage.className = 'validation-message';
        return;
    }
    
    if (password !== confirmPassword) {
        validationMessage.innerHTML = 'Les mots de passe ne correspondent pas';
        validationMessage.className = 'validation-message error visible';
    } else {
        validationMessage.innerHTML = 'Les mots de passe correspondent';
        validationMessage.className = 'validation-message success visible';
    }
}

// Gestion de la soumission du formulaire
function handleFormSubmit(event) {
    event.preventDefault();
    
    if (validateForm()) {
        showConfirmation('Inscription réussie ! Bienvenue chez FitWave.');
        document.getElementById('inscriptionForm').reset();
        resetFormStyles();
    }
}

// Validation complète du formulaire
function validateForm() {
    var isValid = true;
    var form = document.getElementById('inscriptionForm');
    
    // Validation des champs obligatoires
    var requiredFields = form.getElementsByTagName('input');
    for (var i = 0; i < requiredFields.length; i++) {
        var field = requiredFields[i];
        if (field.hasAttribute('required') && !validateField(field)) {
            isValid = false;
        }
    }
    
    // Validation spécifique email
    var emailField = document.getElementById('email');
    if (emailField.value && !validateEmail(emailField.value)) {
        showFieldError(emailField, 'Format d\'email invalide');
        isValid = false;
    }
    
    // Validation téléphone
    var phoneField = document.getElementById('phone');
    if (phoneField.value && !validatePhone(phoneField.value)) {
        showFieldError(phoneField, 'Format de téléphone invalide');
        isValid = false;
    }
    
    // Validation mot de passe
    var passwordField = document.getElementById('password');
    if (!validatePassword(passwordField.value)) {
        showFieldError(passwordField, 'Le mot de passe ne respecte pas les critères de sécurité');
        isValid = false;
    }
    
    // Validation confirmation mot de passe
    var confirmPasswordField = document.getElementById('confirmPassword');
    if (passwordField.value !== confirmPasswordField.value) {
        showFieldError(confirmPasswordField, 'Les mots de passe ne correspondent pas');
        isValid = false;
    }
    
    return isValid;
}

// Validation d'un champ individuel
function validateField(field) {
    var value = field.value.trim();
    var validationMessage = field.parentNode.getElementsByClassName('validation-message')[0];
    
    validationMessage.innerHTML = '';
    validationMessage.className = 'validation-message';
    
    if (field.type === 'checkbox') {
        if (!field.checked) {
            showFieldError(field, 'Ce champ est obligatoire');
            return false;
        }
    } else if (value === '') {
        showFieldError(field, 'Ce champ est obligatoire');
        return false;
    }
    
    // Validation selon le type
    switch (field.type) {
        case 'email':
            if (!validateEmail(value)) {
                showFieldError(field, 'Format d\'email invalide');
                return false;
            }
            break;
        case 'tel':
            if (value && !validatePhone(value)) {
                showFieldError(field, 'Format de téléphone invalide');
                return false;
            }
            break;
    }
    
    showFieldSuccess(field);
    return true;
}

// Fonctions de validation
function validateEmail(email) {
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePhone(phone) {
    var phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
}

function validatePassword(password) {
    var hasMinLength = password.length >= 8;
    var hasUpperCase = /[A-Z]/.test(password);
    var hasNumber = /[0-9]/.test(password);
    var hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    return hasMinLength && hasUpperCase && hasNumber && hasSpecialChar;
}

// Gestion des messages de validation
function showFieldError(field, message) {
    var validationMessage = field.parentNode.getElementsByClassName('validation-message')[0];
    field.style.borderColor = '#f44336';
    validationMessage.innerHTML = message;
    validationMessage.className = 'validation-message error visible';
}

function showFieldSuccess(field) {
    var validationMessage = field.parentNode.getElementsByClassName('validation-message')[0];
    field.style.borderColor = '#4CAF50';
    validationMessage.innerHTML = '✓ Valide';
    validationMessage.className = 'validation-message success visible';
}

// Styles pour cases à cocher et boutons radio
function initCheckboxAndRadioStyles() {
    // Cases à cocher
    var checkboxes = document.getElementsByTagName('input');
    for (var i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].type === 'checkbox') {
            checkboxes[i].onchange = function() {
                if (this.checked) {
                    this.parentNode.style.border = '2px solid #4CAF50';
                    this.parentNode.style.backgroundColor = '#f0f9f0';
                } else {
                    this.parentNode.style.border = '1px solid #ddd';
                    this.parentNode.style.backgroundColor = '';
                }
            };
        }
    }
    
    // Boutons radio - méthode comme dans le cours
    var allInputs = document.getElementsByTagName('input');
    var radioGroups = {};
    
    // Organiser les boutons radio par groupe
    for (var i = 0; i < allInputs.length; i++) {
        if (allInputs[i].type === 'radio') {
            var groupName = allInputs[i].name;
            if (!radioGroups[groupName]) {
                radioGroups[groupName] = [];
            }
            radioGroups[groupName].push(allInputs[i]);
        }
    }
    
    // Appliquer les événements à chaque groupe
    for (var groupName in radioGroups) {
        var radios = radioGroups[groupName];
        for (var j = 0; j < radios.length; j++) {
            radios[j].onchange = function() {
                var myGroup = radioGroups[this.name];
                for (var k = 0; k < myGroup.length; k++) {
                    myGroup[k].parentNode.style.border = '1px solid #ddd';
                    myGroup[k].parentNode.style.backgroundColor = '';
                }
                
                if (this.checked) {
                    this.parentNode.style.border = '2px solid #4CAF50';
                    this.parentNode.style.backgroundColor = '#f0f9f0';
                }
            };
        }
    }
}

// Réinitialisation
function resetForm() {
    resetFormStyles();
    var validationMessages = document.getElementsByClassName('validation-message');
    for (var i = 0; i < validationMessages.length; i++) {
        validationMessages[i].innerHTML = '';
        validationMessages[i].className = 'validation-message';
    }
    
    var strengthBar = document.getElementById('passwordStrengthBar');
    if (strengthBar) {
        strengthBar.style.width = '0%';
        strengthBar.style.backgroundColor = '#f44336';
    }
}

function resetFormStyles() {
    var inputs = document.getElementById('inscriptionForm').getElementsByTagName('input');
    for (var i = 0; i < inputs.length; i++) {
        inputs[i].style.borderColor = '#ddd';
        inputs[i].style.backgroundColor = '';
        inputs[i].style.color = '#666';
    }
    
    var checkboxes = document.getElementsByTagName('input');
    for (var i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].type === 'checkbox' || checkboxes[i].type === 'radio') {
            checkboxes[i].parentNode.style.border = '1px solid #ddd';
            checkboxes[i].parentNode.style.backgroundColor = '';
        }
    }
}

// =============================================
// PAGE PRODUITS - Gestion du panier
// =============================================

var cart = [];

function initProductsPage() {
    var addToCartButtons = document.getElementsByClassName('add-to-cart');
    for (var i = 0; i < addToCartButtons.length; i++) {
        addToCartButtons[i].onclick = addToCart;
    }
    updateCartDisplay();
}

function addToCart(event) {
    var button = event.target;
    
    // CORRECTION : Trouver la carte produit CORRECTEMENT
    var productCard = button.parentNode.parentNode.parentNode;
    
    var productId = productCard.getAttribute('data-id');
    var priceAttr = productCard.getAttribute('data-price');
    
    var productPrice = parseFloat(priceAttr);
    var productName = productCard.getElementsByTagName('h3')[0].innerHTML;
    var quantityInput = productCard.getElementsByClassName('quantity-input')[0];
    var quantity = parseInt(quantityInput.value);
    
    // VÉRIFICATION finale
    if (isNaN(productPrice)) {
        alert("ERREUR: Impossible de lire le prix pour: " + productName);
        return;
    }
    
    // Recherche produit existant
    var existingItemIndex = -1;
    for (var i = 0; i < cart.length; i++) {
        if (cart[i].id == productId) {
            existingItemIndex = i;
            break;
        }
    }
    
    if (existingItemIndex !== -1) {
        cart[existingItemIndex].quantity += quantity;
    } else {
        cart.push({
            id: productId,
            name: productName,
            price: productPrice,
            quantity: quantity
        });
    }
    
    updateCartDisplay();
    alert(quantity + ' ' + productName + ' ajouté(s) au panier - Prix: ' + productPrice + ' €');
    quantityInput.value = 1;
}

function updateCartDisplay() {
    var cartItems = document.getElementById('cartItems');
    var cartTotal = document.getElementById('cartTotal');
    var cartSummary = document.getElementById('cartSummary');
    
    cartItems.innerHTML = '';
    var total = 0;
    
    for (var i = 0; i < cart.length; i++) {
        var item = cart[i];
        var itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        var cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = '<div class="cart-item-info">' +
            '<span class="cart-item-name">' + item.name + '</span>' +
            '<span class="cart-item-details">' + item.quantity + ' x ' + item.price.toFixed(2) + ' €</span>' +
            '</div>' +
            '<div class="cart-item-total">' + itemTotal.toFixed(2) + ' €</div>' +
            '<div class="cart-item-actions">' +
            '<button onclick="updateQuantity(' + item.id + ', ' + (item.quantity - 1) + ')">-</button>' +
            '<span>' + item.quantity + '</span>' +
            '<button onclick="updateQuantity(' + item.id + ', ' + (item.quantity + 1) + ')">+</button>' +
            '<button onclick="removeItem(' + item.id + ')">×</button>' +
            '</div>';
        
        cartItems.appendChild(cartItem);
    }
    
    cartTotal.innerHTML = total.toFixed(2) + ' €';
    
    if (cart.length > 0) {
        cartSummary.style.display = 'block';
    } else {
        cartSummary.style.display = 'none';
    }
}

function updateQuantity(productId, newQuantity) {
    if (newQuantity < 1) {
        removeItem(productId);
        return;
    }
    
    for (var i = 0; i < cart.length; i++) {
        if (cart[i].id == productId) {
            cart[i].quantity = newQuantity;
            updateCartDisplay();
            break;
        }
    }
}

function removeItem(productId) {
    var newCart = [];
    for (var i = 0; i < cart.length; i++) {
        if (cart[i].id != productId) {
            newCart.push(cart[i]);
        }
    }
    cart = newCart;
    updateCartDisplay();
    alert('Produit retiré du panier');
}

function validateOrder() {
    if (cart.length === 0) {
        alert('Votre panier est vide');
        return;
    }
    
    var total = 0;
    var message = 'Commande validée!\n\n';
    
    for (var i = 0; i < cart.length; i++) {
        var item = cart[i];
        var itemTotal = item.price * item.quantity;
        total += itemTotal;
        message += '- ' + item.name + ' : ' + item.quantity + ' x ' + item.price.toFixed(2) + ' € = ' + itemTotal.toFixed(2) + ' €\n';
    }
    
    message += '\nTotal: ' + total.toFixed(2) + ' €';
    alert(message);
    
    cart = [];
    updateCartDisplay();
}

function resetOrder() {
    if (cart.length === 0) {
        alert('Panier déjà vide');
        return;
    }
    
    cart = [];
    updateCartDisplay();
    alert('Panier vidé');
}