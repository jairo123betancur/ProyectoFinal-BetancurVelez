
let products = [];
let cart = [];

async function loadProducts(category = '') {
    try {
        const response = await fetch(`https://fakestoreapi.com/products${category ? `/category/${category}` : ''}`);
        products = await response.json();
        renderProducts();
    } catch (error) {
        console.error('Error al cargar los productos:', error);
    }
}

function renderProducts() {
    const productsSection = document.getElementById('products');
    productsSection.innerHTML = '';
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');

        const productTitle = document.createElement('h2');
        productTitle.textContent = product.title;

        const productImage = document.createElement('img');
        productImage.src = product.image;
        productImage.alt = product.title;
        productImage.style.maxWidth = '150px';
        productImage.style.alignSelf = 'center';

        const productPrice = document.createElement('p');
        productPrice.textContent = `$${product.price.toFixed(2)}`;

        const productDescription = document.createElement('p');
        productDescription.textContent = product.description;

        const titleCantidad = document.createElement('p');
        titleCantidad.textContent = 'Cantidad:';

        const productQuantity = document.createElement('input');        
        productQuantity.type = 'number';
        productQuantity.value = 1;
        productQuantity.min = 1;
        productQuantity.style.alignSelf = 'left';
        productQuantity.style.marginBottom = '15px';
        productQuantity.style.width = '150px';

        const addToCartButton = document.createElement('button');
        addToCartButton.textContent = 'Agregar al carrito';
        addToCartButton.addEventListener('click', () => {
            addToCart(product, productQuantity.value);
            showNotification('Producto agregado al carrito');
        });

        productCard.appendChild(productTitle);
        productCard.appendChild(productImage);
        productCard.appendChild(productPrice);
        productCard.appendChild(productDescription);
        productCard.appendChild(titleCantidad);
        productCard.appendChild(productQuantity);
        productCard.appendChild(addToCartButton);
        productsSection.appendChild(productCard);
    });
}

function addToCart(product, quantity) {
    const existingItem = cart.find(item => item.product.id === product.id);

    if (existingItem) {
        existingItem.quantity += parseInt(quantity, 10);
    } else {
        cart.push({ product, quantity: parseInt(quantity, 10) });
    }

    updateCart();
}

function updateCart() {
    
    const cartItemsDropdown = document.getElementById('cart-items-dropdown');
    const cartTotalDropdown = document.getElementById('cart-total-dropdown');

    
    cartItemsDropdown.innerHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
        
        const cartItemDropdown = document.createElement('li');
        cartItemDropdown.innerHTML = `
            <span>${item.product.title}</span><br>
            <span>Cantidad: ${item.quantity}</span><br>
            <span>Total: $${(item.product.price * item.quantity).toFixed(2)}</span>
            <div class="container-buttons">
            <button class="modify-quantity" data-index="${index}">Modificar</button>
            <button class="remove-from-cart" data-index="${index}">Eliminar</button></div>
        `;
        cartItemsDropdown.appendChild(cartItemDropdown);

        total += item.product.price * item.quantity;
    });

    
    cartTotalDropdown.textContent = total.toFixed(2);

    

    const cartDropdown = document.getElementById('cart-dropdown');
    if (cart.length > 0) {
        cartDropdown.classList.remove('hidden');
    } else {
        cartDropdown.classList.add('hidden');
    }

    document.querySelectorAll('.modify-quantity').forEach(button => {
        button.addEventListener('click', (e) => {
            const index = e.target.getAttribute('data-index');

            Swal.fire({
                title: 'Modificar cantidad',
                input: 'number',
                inputLabel: 'Nueva cantidad',
                inputValue: cart[index].quantity,
                inputAttributes: {
                    min: '1',
                    step: '1'
                },
                showCancelButton: true,
                confirmButtonText: 'Guardar',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    cart[index].quantity = parseInt(result.value, 10);
                    updateCart();
                }
            });
        });
    });

    document.querySelectorAll('.remove-from-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            const index = e.target.getAttribute('data-index');
            cart.splice(index, 1);
            updateCart();
        });
    });
}

function showNotification(message) {
    Swal.fire({
        icon: 'success',
        title: message,
        showConfirmButton: false,
        timer: 1500
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const categoryMenu = document.getElementById('category-menu');
    const cartMenu = document.getElementById('cart-menu');
    const cartIcon = document.getElementById('cart-icon');
    const cartDropdown = document.getElementById('cart-dropdown');
    const checkoutFormSection = document.getElementById('checkout-form-section');
    const checkoutForm = document.getElementById('checkout-form');
    const confirmarPedidoBtn = document.getElementById('confirmar-pedido-btn');
    
   
    const nameInput = document.getElementById('name');
    const addressInput = document.getElementById('address');
    const emailInput = document.getElementById('email');

 
    const datosPreCargados = {
        nombre: "Andres Betancur",
        direccion: "Calle Principal 123",
        email: "andres@example.com"
    };


    nameInput.value = datosPreCargados.nombre;
    addressInput.value = datosPreCargados.direccion;
    emailInput.value = datosPreCargados.email;

    fetch('https://fakestoreapi.com/products/categories')
        .then(res => res.json())
        .then(categories => {
            categories.forEach(category => {
                const categoryButton = document.createElement('button');
                categoryButton.textContent = category;
                categoryButton.classList.add('category-item');
                categoryButton.addEventListener('click', () => loadProducts(category.toLowerCase()));
                categoryMenu.appendChild(categoryButton);
            });
        });

    cartMenu.addEventListener('click', () => {
        updateCart();
        cartDropdown.classList.toggle('hidden');
    });

    cartIcon.addEventListener('click', () => {
        updateCart();
        const cartDropdown = document.getElementById('cart-dropdown');
        cartDropdown.classList.toggle('hidden');
    });

   
    confirmarPedidoBtn.addEventListener('click', () => {
        checkoutFormSection.classList.remove('hidden');
        checkoutForm.classList.remove('hidden');
   
        checkoutFormSection.scrollIntoView({ behavior: 'smooth' });
    });
    
   

    checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const address = document.getElementById('address').value;
        const email = document.getElementById('email').value;

        Swal.fire({
            icon: 'success',
            title: `Compra realizada por ${name}`,
            text: `Dirección: ${address}\nCorreo Electrónico: ${email}`,
            showConfirmButton: false,
            timer: 2000
        });
        resetCart();
    });

    loadProducts();
});

function resetCart() {
    cart.length = 0;
    updateCart();
    document.getElementById('checkout-form').classList.add('hidden');
}
