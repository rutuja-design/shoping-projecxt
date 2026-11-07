// Get HTML Elements
const productContainer = document.getElementById("productContainer");

const searchInput = document.getElementById("searchInput");

const searchBtn = document.getElementById("searchBtn");

const cartBtn = document.getElementById("cartBtn");

const cartPanel = document.getElementById("cartPanel");

const closeCart = document.getElementById("closeCart");

const cartItems = document.getElementById("cartItems");

const cartCount = document.getElementById("cartCount");

const cartTotal = document.getElementById("cartTotal");

const checkoutBtn = document.getElementById("checkoutBtn");


// Store Products and Cart Data
let products = [];

let cart = [];


// 1. Fetch Products from JSON File
async function loadProducts() {

    try {

        const response = await fetch("products.json");

        if (!response.ok) {
            throw new Error("Unable to load products");
        }

        products = await response.json();

        displayProducts(products);

    }

    catch (error) {

        productContainer.innerHTML =
            `<p class="no-products">
                Error loading products. Please run the project
                using a local server.
            </p>`;

        console.error(error);

    }

}


// 2. Display Products Dynamically
function displayProducts(productList) {

    productContainer.innerHTML = "";

    if (productList.length === 0) {

        productContainer.innerHTML =
            `<p class="no-products">
                No products found!
            </p>`;

        return;

    }


    productList.forEach(product => {

        const productCard = document.createElement("div");

        productCard.className = "product-card";

        const image = document.createElement("img");

        image.src = product.image;

        image.alt = product.name;

        image.loading = "lazy";

        image.onerror = function () {
            this.src =
                "https://placehold.co/400x300?text=Product";
        };


        const details = document.createElement("div");

        details.className = "product-details";

        const category = document.createElement("p");

        category.className = "category";

        category.textContent = product.category;


        const name = document.createElement("h3");

        name.textContent = product.name;


        const rating = document.createElement("p");

        rating.className = "rating";

        rating.textContent =
            "⭐ " + product.rating + " / 5";


        const price = document.createElement("p");

        price.className = "price";

        price.textContent =
            "₹" + product.price.toLocaleString("en-IN");


        const addButton = document.createElement("button");

        addButton.className = "add-cart";

        addButton.textContent = "Add to Cart";

        addButton.addEventListener("click", function () {

            addToCart(product.id);

        });


        details.appendChild(category);

        details.appendChild(name);

        details.appendChild(rating);

        details.appendChild(price);

        details.appendChild(addButton);


        productCard.appendChild(image);

        productCard.appendChild(details);


        productContainer.appendChild(productCard);

    });

}


// 3. Search Products
function searchProducts() {

    const searchText =
        searchInput.value.toLowerCase().trim();

    const filteredProducts = products.filter(product => {

        return (
            product.name.toLowerCase().includes(searchText) ||

            product.category.toLowerCase().includes(searchText)
        );

    });

    displayProducts(filteredProducts);

}


// Search Button Event
searchBtn.addEventListener("click", searchProducts);


// Search While Typing
searchInput.addEventListener("input", searchProducts);


// 4. Add Products to Cart
function addToCart(productId) {

    const existingProduct = cart.find(
        item => item.id === productId
    );

    if (existingProduct) {

        existingProduct.quantity++;

    }

    else {

        const product = products.find(
            item => item.id === productId
        );

        if (!product) {
            return;
        }

        cart.push({

            id: product.id,

            name: product.name,

            price: product.price,

            quantity: 1

        });

    }

    updateCart();

}


// 5. Update Shopping Cart
function updateCart() {

    cartItems.innerHTML = "";

    let totalQuantity = 0;

    let totalPrice = 0;


    if (cart.length === 0) {

        cartItems.innerHTML =
            `<p class="empty-cart">
                Your cart is empty.
            </p>`;

    }


    cart.forEach(item => {

        totalQuantity += item.quantity;

        totalPrice += item.price * item.quantity;


        const cartItem = document.createElement("div");

        cartItem.className = "cart-item";


        const itemDetails = document.createElement("div");

        const itemName = document.createElement("h4");

        itemName.textContent =
            item.name + " × " + item.quantity;


        const itemPrice = document.createElement("p");

        itemPrice.textContent =
            "₹" +
            (item.price * item.quantity).toLocaleString("en-IN");


        itemDetails.appendChild(itemName);

        itemDetails.appendChild(itemPrice);


        const removeButton = document.createElement("button");

        removeButton.className = "remove-btn";

        removeButton.textContent = "Remove";

        removeButton.addEventListener("click", function () {

            removeFromCart(item.id);

        });


        cartItem.appendChild(itemDetails);

        cartItem.appendChild(removeButton);


        cartItems.appendChild(cartItem);

    });


    // Update Cart Count
    cartCount.textContent = totalQuantity;


    // Update Total Price
    cartTotal.textContent =
        totalPrice.toLocaleString("en-IN");

}


// 6. Remove Product from Cart
function removeFromCart(productId) {

    cart = cart.filter(item => item.id !== productId);

    updateCart();

}


// 7. Open Shopping Cart
cartBtn.addEventListener("click", function () {

    cartPanel.classList.add("active");

});


// 8. Close Shopping Cart
closeCart.addEventListener("click", function () {

    cartPanel.classList.remove("active");

});


// 9. Checkout Functionality
checkoutBtn.addEventListener("click", function () {

    if (cart.length === 0) {

        alert("Your cart is empty!");

        return;

    }

    const total = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    alert(
        "Thank you for shopping at ShopZone!\n" +
        "Your total amount is ₹" +
        total.toLocaleString("en-IN")
    );

    cart = [];

    updateCart();

    cartPanel.classList.remove("active");

});


// 10. Load Products When Page Opens
loadProducts();


// Initialize Cart
updateCart();