document.addEventListener("DOMContentLoaded", function () {

    const registerForm = document.getElementById("registerForm");

    if (registerForm) {
        registerForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const name = document.getElementById("name").value.trim();
            const email = document.getElementById("email").value.trim();
            const password = document.getElementById("password").value;
            const confirmPassword = document.getElementById("confirmPassword").value;

            if (password !== confirmPassword) {
                alert("Passwords do not match.");
                return;
            }

            localStorage.setItem("userName", name);
            localStorage.setItem("userEmail", email);
            localStorage.setItem("userPassword", password);

            alert("Registration successful.");
            window.location.href = "login.html";
        });
    }

    const loginForm = document.getElementById("loginForm");

    if (loginForm) {
        loginForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const email = document.getElementById("loginEmail").value.trim();
            const password = document.getElementById("loginPassword").value;

            const savedEmail = localStorage.getItem("userEmail");
            const savedPassword = localStorage.getItem("userPassword");

            if (email === savedEmail && password === savedPassword) {
                localStorage.setItem("loggedIn", "true");
                alert("Login successful.");
                window.location.href = "profile.html";
            } else {
                alert("Invalid email or password.");
            }
        });
    }

    const addButtons = document.querySelectorAll(".add-cart");

    addButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            const productCard = button.closest(".product-card");
            const productName = productCard.querySelector("h3").textContent;
            const productPrice = productCard.querySelector("p").textContent;
            const price = parseInt(productPrice.replace(/[^\d]/g, ""), 10);

            let cart = JSON.parse(localStorage.getItem("cart")) || [];

            cart.push({
                name: productName,
                price: price
            });

            localStorage.setItem("cart", JSON.stringify(cart));

            alert(productName + " added to cart.");
        });
    });

    const wishlistButtons = document.querySelectorAll(".wishlist-btn");

    wishlistButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            const productCard = button.closest(".product-card");
            const productName = productCard.querySelector("h3").textContent;
            const productPrice = productCard.querySelector("p").textContent;
            const price = parseInt(productPrice.replace(/[^\d]/g, ""), 10);

            let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

            const exists = wishlist.some(function (item) {
                return item.name === productName;
            });

            if (!exists) {
                wishlist.push({
                    name: productName,
                    price: price
                });

                localStorage.setItem("wishlist", JSON.stringify(wishlist));
                alert(productName + " added to wishlist.");
            } else {
                alert("Product is already in your wishlist.");
            }
        });
    });

    displayCart();
    displayWishlist();
    displayProfile();

    const paymentForm = document.getElementById("paymentForm");

    if (paymentForm) {
        paymentForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const cart = JSON.parse(localStorage.getItem("cart")) || [];

            if (cart.length === 0) {
                alert("Your cart is empty.");
                return;
            }

            alert("Order placed successfully.");
            localStorage.removeItem("cart");
            window.location.href = "index.html";
        });
    }

    const contactForm = document.getElementById("contactForm");

    if (contactForm) {
        contactForm.addEventListener("submit", function (event) {
            event.preventDefault();
            alert("Your message has been sent successfully.");
            contactForm.reset();
        });
    }
});

function displayCart() {
    const cartItems = document.getElementById("cartItems");
    const cartTotal = document.getElementById("cartTotal");

    if (!cartItems || !cartTotal) {
        return;
    }

    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    cartItems.innerHTML = "";

    if (cart.length === 0) {
        cartItems.innerHTML = "<p style='text-align:center'>Your cart is empty.</p>";
        cartTotal.textContent = "0";
        return;
    }

    let total = 0;

    cart.forEach(function (item, index) {
        total += item.price;

        const div = document.createElement("div");
        div.className = "cart-item";

        div.innerHTML = `
            <div>
                <h3>${item.name}</h3>
                <p>₹${item.price}</p>
            </div>
            <button onclick="removeCartItem(${index})">Remove</button>
        `;

        cartItems.appendChild(div);
    });

    cartTotal.textContent = total;
}

function removeCartItem(index) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    cart.splice(index, 1);

    localStorage.setItem("cart", JSON.stringify(cart));

    displayCart();
}

function displayWishlist() {
    const wishlistItems = document.getElementById("wishlistItems");

    if (!wishlistItems) {
        return;
    }

    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

    wishlistItems.innerHTML = "";

    if (wishlist.length === 0) {
        wishlistItems.innerHTML = "<p>No products in your wishlist.</p>";
        return;
    }

    wishlist.forEach(function (item, index) {
        const div = document.createElement("div");
        div.className = "product-card";

        div.innerHTML = `
            <h3>${item.name}</h3>
            <p>₹${item.price}</p>
            <button class="btn" onclick="moveToCart(${index})">Add to Cart</button>
            <button class="wishlist-btn" onclick="removeWishlistItem(${index})">Remove</button>
        `;

        wishlistItems.appendChild(div);
    });
}

function moveToCart(index) {
    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    cart.push(wishlist[index]);

    wishlist.splice(index, 1);

    localStorage.setItem("cart", JSON.stringify(cart));
    localStorage.setItem("wishlist", JSON.stringify(wishlist));

    displayWishlist();

    alert("Product moved to cart.");
}

function removeWishlistItem(index) {
    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

    wishlist.splice(index, 1);

    localStorage.setItem("wishlist", JSON.stringify(wishlist));

    displayWishlist();
}

function displayProfile() {
    const profileName = document.getElementById("profileName");
    const profileEmail = document.getElementById("profileEmail");

    if (!profileName || !profileEmail) {
        return;
    }

    const name = localStorage.getItem("userName");
    const email = localStorage.getItem("userEmail");

    if (name) {
        profileName.textContent = name;
    }

    if (email) {
        profileEmail.textContent = email;
    }
}

function logout() {
    localStorage.removeItem("loggedIn");
    alert("You have been logged out.");
    window.location.href = "login.html";
}