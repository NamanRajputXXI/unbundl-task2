let iconCart = document.querySelector(".iconCart");
let cart = document.querySelector(".cart");
let container = document.querySelector(".container");
let close = document.querySelector(".close");
let cartHeading = document.querySelector(".cart__heading");
iconCart.addEventListener("click", function () {
  if (cart.style.right == "-100%") {
    cart.style.right = "0";
    container.style.transform = "translateX(-400px)";
  } else {
    cart.style.right = "-100%";
    container.style.transform = "translateX(0)";
  }
});
close.addEventListener("click", function () {
  cart.style.right = "-100%";
  container.style.transform = "translateX(0)";
});
cartHeading.addEventListener("click", function () {
  cart.style.right = "-100%";
  container.style.transform = "translateX(0)";
});

let products = null;
// get data from file json
fetch("product.json")
  .then((response) => response.json())
  .then((data) => {
    products = data;
    addDataToHTML();
  });

//show datas product in list
function addDataToHTML() {
  // remove datas default from HTML
  let listProductHTML = document.querySelector(".listProduct");
  listProductHTML.innerHTML = "";

  // add new datas
  if (products != null) {
    // if has data
    products.forEach((product) => {
      let newProduct = document.createElement("div");
      newProduct.classList.add("item");
      newProduct.innerHTML = `<img src="${product.image}" alt="">
            <h2>${product.name}</h2>
            <div class="price">₹${product.price}</div>
            <button onclick="addCart(${product.id})">Add To Cart</button>`;

      listProductHTML.appendChild(newProduct);
    });
  }
}
//use cookie so the cart doesn't get lost on refresh page

let listCart = [];
function addCart($idProduct) {
  let productsCopy = JSON.parse(JSON.stringify(products));
  // If this product is not in the cart
  let totalQuantity = getTotalCartItems();
  if (!listCart[$idProduct]) {
    listCart[$idProduct] = productsCopy.filter(
      (product) => product.id == $idProduct
    )[0];
    listCart[$idProduct].quantity = 1;
  } else if (totalQuantity <= 7) {
    //If this product is already in the cart.
    //I just increased the quantity

    listCart[$idProduct].quantity++;
  } else if (totalQuantity == 8) {
    alert("Quantity should be less than 8");
  }

  addCartToHTML();
}
addCartToHTML();

function addCartToHTML() {
  // clear data default
  let listCartHTML = document.querySelector(".listCart");
  listCartHTML.innerHTML = "";
  let overallQuantity = document.querySelector(".overall__quantity");
  let overallPrice = document.querySelector(".overall__price");
  let totalHTML = document.querySelector(".totalQuantity");
  let totalQuantity = 0;
  let totalPrice = 0;

  // if has product in Cart
  if (listCart) {
    listCart.forEach((product) => {
      if (product) {
        let newCart = document.createElement("div");
        newCart.classList.add("item");
        newCart.innerHTML = `<img src="${product.image}">
                    <div class="content">
                        <div class="name">${product.name}</div>
                        <div class="price">₹${product.price} / ${product.quantity}</div>
                    </div>
                    <div class="quantity">
                        <button onclick="changeQuantity(${product.id}, '-')">-</button>
                        <span class="value">${product.quantity}</span>
                        <button onclick="changeQuantity(${product.id}, '+')">+</button>
                    </div>`;
        listCartHTML.appendChild(newCart);
        totalQuantity = totalQuantity + product.quantity;
        totalPrice = totalPrice + product.price * product.quantity;
      }
    });

    totalHTML.innerText = totalQuantity;
    if (totalQuantity <= 8) {
      overallQuantity.innerHTML = `Total Quantity -  ${totalQuantity}`;
      overallPrice.innerHTML = ` Total Price - ₹${totalPrice}`;
    }
    if (totalQuantity > 8) {
      alert("Quantity should be less than 8");
    }
  }
}

// Function to update the total price in the cart HTML
function changeQuantity($idProduct, $type) {
  // Check if the total quantity is less than 8 before changing the quantity
  let totalQuantity = getTotalCartItems();

  if ($type === "+" && totalQuantity < 8) {
    listCart[$idProduct].quantity++;
  } else if ($type === "-" && listCart[$idProduct].quantity >= 1) {
    // Allow decrementing the quantity if it's greater than 1
    listCart[$idProduct].quantity--;
  }

  addCartToHTML();
}

// Function to calculate the total quantity of items in the cart
function getTotalCartItems() {
  let totalQuantity = 0;
  for (let productId in listCart) {
    if (listCart.hasOwnProperty(productId)) {
      totalQuantity += listCart[productId].quantity;
    }
  }
  return totalQuantity;
}
