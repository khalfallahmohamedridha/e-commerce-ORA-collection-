// Initialize an empty array to store cart items
let cartItems = [];

// Function to update the cart modal content
function updateCartModal() {
  const modalBody = document.querySelector(".modal-body");
  const modalFooter = document.querySelector(".modal-footer");

  // Check if cart is empty
  if (cartItems.length === 0) {
    modalBody.innerHTML =
      "Looks like you haven’t added anything yet. Browse our products and add some items to your cart!";
    modalFooter.innerHTML = ""; // Clear footer when empty
  } else {
    // Populate modal body with cart items
    modalBody.innerHTML = cartItems
      .map(
        (item, index) => `
      <div class="d-flex align-items-center mb-3 justify-content-between" data-index="${index}">
      <div class="d-flex">
        <img src="${item.image}" alt="${item.title}" style="width: 80px; height: 80px; object-fit: cover; margin-right: 10px;" />
        <div class="pr-5">
          <p class="fs-6 m-0">${item.title}</p>
          <p class="fs-7 m-0">Quantity: <span class="quantity">${item.quantity}</span></p>
          <p class="fs-7 m-0">Price: ${item.totalPrice} DT</p>
        </div>
      </div>
        <div class="row">
          <div class="col">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-dash-circle subtract-icon" viewBox="0 0 16 16">
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
              <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8"/>
            </svg>
          </div>
          <div class="col">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-circle add-icon" viewBox="0 0 16 16">
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
              <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
            </svg>
          </div>
          <div class="col">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="red" class="bi bi-trash3 remove-icon" viewBox="0 0 16 16">
              <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
            </svg>
          </div>
        </div>
      </div>
    `
      )
      .join("");

    // Update footer with total price and checkout button
    const totalPrice = calculateTotalPrice();
    modalFooter.innerHTML = `
      <div class="row">
        <button class="btn btn-dark ${
          cartItems.length === 0 ? "disabled" : ""
        }">
          Total Price: ${totalPrice} DT
        </button>
        <div style="height: 15px;"></div>
        <button class="btn btn-primary ${
          cartItems.length === 0 ? "disabled" : ""
        }" id="checkoutButton">Proceed to Checkout</button>
      </div>
    `;

    attachEventListeners(); // Attach event listeners for cart actions
  }
}

// Function to calculate the total price of all items in the cart
function calculateTotalPrice() {
  return cartItems
    .reduce((total, item) => total + item.totalPrice, 0)
    .toFixed(2);
}

// Function to attach event listeners to the Add, Subtract, and Remove icons
function attachEventListeners() {
  // Add item quantity
  document.querySelectorAll(".add-icon").forEach((icon) => {
    icon.addEventListener("click", function () {
      const index = this.closest(".d-flex").getAttribute("data-index");
      updateItemQuantity(index, 1);
    });
  });

  // Subtract item quantity
  document.querySelectorAll(".subtract-icon").forEach((icon) => {
    icon.addEventListener("click", function () {
      const index = this.closest(".d-flex").getAttribute("data-index");
      updateItemQuantity(index, -1);
    });
  });

  // Remove item from cart
  document.querySelectorAll(".remove-icon").forEach((icon) => {
    icon.addEventListener("click", function () {
      const index = this.closest(".d-flex").getAttribute("data-index");
      cartItems.splice(index, 1);
      updateCartModal();
    });
  });

  // Checkout button
  const checkoutButton = document.getElementById("checkoutButton");
  if (checkoutButton) {
    checkoutButton.addEventListener("click", () => {
      // Show the checkout modal
      const checkoutModal = new bootstrap.Modal(
        document.getElementById("checkoutModal")
      );
      checkoutModal.show();
    });
  }
}

// Confirm Checkout button (validate form and show success alert)
const confirmCheckoutButton = document.getElementById("confirmCheckoutButton");
if (confirmCheckoutButton) {
  confirmCheckoutButton.addEventListener("click", () => {
    const checkoutForm = document.getElementById("checkoutForm");

    // Check if the form is valid
    if (checkoutForm.checkValidity()) {
      // Close the checkout modal
      const checkoutModal = bootstrap.Modal.getInstance(
        document.getElementById("checkoutModal")
      );
      checkoutModal.hide();

      // Show the thank you alert
      alert(
        "Thank you for choosing us, we will contact you as soon as possible."
      );
    } else {
      // If form is not valid, trigger the HTML5 validation
      checkoutForm.reportValidity();
    }
  });
}

// Helper function to update item quantity and total price
function updateItemQuantity(index, delta) {
  const item = cartItems[index];
  if (item.quantity + delta > 0) {
    item.quantity += delta;
    item.totalPrice = item.price * item.quantity;
    updateCartModal();
  }
}

// Event listener for "Add to Cart" buttons
document.querySelectorAll(".add-to-cart").forEach((button) => {
  button.addEventListener("click", function () {
    const title = this.getAttribute("data-title");
    const price = parseFloat(this.getAttribute("data-price"));
    const image = this.getAttribute("data-image");

    // Check if the item is already in the cart
    const existingItemIndex = cartItems.findIndex(
      (item) => item.title === title
    );

    if (existingItemIndex === -1) {
      // Add new item to cart
      cartItems.push({ title, price, image, quantity: 1, totalPrice: price });
    } else {
      // Update quantity of existing item
      updateItemQuantity(existingItemIndex, 1);
    }

    // Update the cart modal
    updateCartModal();
  });
});

// Call updateCartModal when the page is loaded to initialize the cart state
document.addEventListener("DOMContentLoaded", updateCartModal);
