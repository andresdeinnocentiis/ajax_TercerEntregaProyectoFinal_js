import { Storage } from "./storage.js";

//let cart = [];
const cartTotal = document.querySelector(".cart-total");
const cartItems = document.querySelector(".cart-items");
const cartContent = document.querySelector(".cart-content");
const cartBtn = document.querySelector(".cart-btn");
const closeCartBtn = document.querySelector(".close-cart");
const cartOverlay = document.querySelector(".cart-overlay");
const cartDOM = document.querySelector(".cart");

const clearBtn = document.querySelector(".clear-cart");

let btnsDOM = [];


class Catalogo {
    constructor() {
        this.listaProductos = []
        this.contenedorMain = $(".contenedorMain");
        this.cart = Storage.getCart();
        
        this.eventListeners();
    }

    eventListeners() {
        this.addBoxes();
        //this.eventsHandler();
        this.closeCart();
        cartBtn.addEventListener("click", this.showCart);
        clearBtn.addEventListener("click", this.clearCart);
    }

    addBoxes() {
       
        fetch("https://mocki.io/v1/aba3cbae-ba9e-464b-82c9-96ab3a594c87") // Cargué mi JSON en una Fake API que cree en mocki.io
            .then((response) => response.json())
            .then((data) => {
                for (const product of data) {
                    this.listaProductos.push(product)
                    let count = 0;
                    let div = document.createElement("div");
        
                    div.classList.add(`cajaProducto`);
                    div.innerHTML = `
                            <img class="imageProducto" src="assets/images/products/${product.img}" alt="${product.nombre}">
                            <div class="elementsCaja" id="elemento-${product.id}">
                                <p class="nombreProducto">${product.nombre}</p>
                                <p class="precioProducto">$ ${product.precio}</p>
                                <div class="seleccion">
                                    <button class="btn-retirar" id="retirar-elemento-${product.id}" data-id="${product.id}">-</button>
                                    <p class="contador" id="contador-${product.id}" data-id="${product.id}">${count}</p>
                                    <button class="btn-sumar" id="sumar-elemento-${product.id}" data-id="${product.id}">+</button>
                                </div>    
                                <button class="addToCart" id="addElemento-${product.id}" data-id="${product.id}">Add to Cart</button>
                            </div>
                        
                        `;
                    
                    this.contenedorMain.append(div);
                    
                }

                this.restar();
                this.sumar();
                this.addToCart();
                this.updateFromStorage()
                this.eventsHandler()

            })
            
            
            
        }//)
        
        
    //}

    restar() {
        const btnsRetirar = $(".btn-retirar");
        
        for (let i = 0; i < btnsRetirar.length; i++) {   
            let button = btnsRetirar[i];

            button.addEventListener("click", function (event) {
                let buttonClicked = event.target;
                console.log(("BOTON RESTAR: ",buttonClicked))
                let p = buttonClicked.nextElementSibling;
                if (p.innerHTML > 0) {
                    p.innerHTML = Number(p.innerHTML) - 1;
                }
            });
        }
    }
    sumar() {
        const btnsSumar = $(".btn-sumar");
        for (let i = 0; i < btnsSumar.length; i++) {
            let button = btnsSumar[i];

            button.addEventListener("click", function (event) {
                let buttonClicked = event.target;
                
                let p = buttonClicked.previousElementSibling;

                p.innerHTML = Number(p.innerHTML) + 1;
            });
        }
    }
   
    addToCart() {
        
        const btnsAdd = [...document.querySelectorAll(".addToCart")];
        btnsDOM = btnsAdd;
        btnsAdd.forEach((btn) => {
            let id = btn.dataset.id;
            

            btn.addEventListener("click", (event) => {
                
                this.cart = Storage.getCart()
                
                let amount = Number(
                    btn.previousElementSibling.firstChild.nextElementSibling
                        .nextElementSibling.innerText
                );
                let btnSumar =
                    btn.previousElementSibling.firstChild.nextElementSibling
                        .nextElementSibling.nextElementSibling;

                let btnRestar =
                    btn.previousElementSibling.firstChild.nextElementSibling;

                if (amount != 0) {
                    event.target.innerText = "In Cart";
                    event.target.disabled = true;
                    btnSumar.disabled = true;
                    btnRestar.disabled = true;
                    // Agarrar el producto desde productos del Local Storage:
                    let item = this.listaProductos.find((element) => element.id == id);
                    let cartItem = {
                        id: item.id,
                        amount: amount,
                        precio: item.precio,
                    };

                    // Agrego el item al objeto cart del script
                    this.cart.push(cartItem);

                    // Guardo el carrito en el Storage
                    Storage.saveCart(this.cart);

                    // Creo la imagen del producto (la caja) dentro del carrito
                    this.productImgInCart(cartItem);
                    
                    // ACTUALIZO EL TOTAL A PAGAR
                    this.actualizarTotal();
                    // ACTUALIZO EL TOTAL (CANTIDAD) DE ITEMS (EL NRO. DE ITEMS EN EL ICONO DEL CARRITO EN EL NAV)
                    this.getTotalItems();

                    // MUESTRO EL CARRITO CADA VEZ QUE SE AGREGA UN PRODUCTO:
                    this.showCart();

                }
            });
        });
    }

    // ACTUALIZA EL TOTAL (CANTIDAD) DE ITEMS (EL NRO. DE ITEMS EN EL ICONO DEL CARRITO EN EL NAV)
    getTotalItems() {
        const cartStor = Storage.getCart();
        let total = 0;
        cartStor.forEach((item) => {
            let amount = item.amount;
            total += amount;
        });
        cartItems.innerText = total;
    }

    productImgInCart(cartItem) {
        let id = cartItem.id;
        let amount = cartItem.amount;
        let item = this.listaProductos.find((element) => element.id == id);
        let img = item.img;
        let nombre = item.nombre;
        let precio = item.precio;
        let div = document.createElement("div");
        div.classList.add(`boxCartItem`);
        div.setAttribute("data-id", `${id}`);
        div.setAttribute("id", `item-${id}`);
        div.innerHTML = `
			<img class="imgCart" src="assets/images/products/${img}" alt="${nombre}">
			<h4>${nombre}</h4>
			<h5 class="precioCart">$${precio * amount}</h5>
			<div class="divCant">
				<i class="fas fa-chevron-up" data-id="${id}"></i>
				<p class="cant">${amount}</p>
				<i class="fas fa-chevron-down" data-id="${id}"></i>
			</div> 
			<i class="fas fa-trash btnRemove" data-id="${id}"></i>
		`;
        cartContent.appendChild(div);
    }
    

    // ACTUALIZA EL TOTAL DENTRO DEL CARRITO (SUMA TOTAL A PAGAR)
    actualizarTotal() {
        const cartStorage = Storage.getCart();
        let total = 0;
		
		cartStorage.forEach((prod) => {
			let precioItem = prod.precio;
			let cantItem = prod.amount;

			total += precioItem * cantItem;
		});
		Storage.saveTotal(total);
		cartTotal.innerText = Number(Storage.getTotal());
		
    }

    showCart() {
        cartOverlay.classList.add("transparentBcg");
        cartDOM.classList.add("showCart");
    }
    closeCart() {
        document.addEventListener("DOMContentLoaded", () => {
            closeCartBtn.addEventListener("click", (event) => {
                cartOverlay.classList.remove("transparentBcg");
                cartDOM.classList.remove("showCart");
            });
            document.addEventListener("click", (event) => {
                if (event.target.className == "cart-overlay transparentBcg") {
                    cartOverlay.classList.remove("transparentBcg");
                    cartDOM.classList.remove("showCart");
                }
            });
        })
    }

    removeItem(id) {
        const buttonsAdd = document.querySelectorAll(".addToCart");
        const buttonsSumar = document.querySelectorAll(".btn-sumar");
        const buttonsRestar = document.querySelectorAll(".btn-retirar");
        let cartStorage = Storage.getCart();
        
        // REESTABLEZCO EN CATÁLOGO
        
        cartStorage.forEach((itemCart) => {
            let idItem = itemCart.id;

            let index = idItem - 1;
            const button = buttonsAdd.item(index);

            const btnSumar = buttonsSumar.item(index);
            const btnRestar = buttonsRestar.item(index);
            // Si ya está en el carrito recuperado de Local Store, lo deshabilito del catálogo:
            if (idItem == id) {
                button.innerText = "Add to Cart";
                button.disabled = false;
                btnSumar.disabled = false;
                btnRestar.disabled = false;
                // Al item del catálogo le pongo la cantidad que figura en el Local Storage:
                button.previousElementSibling.firstChild.nextElementSibling.nextElementSibling.innerText = 0;
            }
            
        });

        // REMUEVO EL ITEM DEL CART DEL STORAGE Y DEL OBJETO CART
        this.cart = this.cart.filter(function (obj) {
            return obj.id !== Number(id);
        });
        cartStorage = cartStorage.filter(function (obj) {
            return obj.id !== Number(id);
        });
            
        Storage.saveCart(cartStorage);

        // ACTUALIZO EL TOTAL A PAGAR
        this.actualizarTotal();
        // ACTUALIZO EL TOTAL (CANTIDAD) DE ITEMS (EL NRO. DE ITEMS EN EL ICONO DEL CARRITO EN EL NAV)
        this.getTotalItems();
                
        
    }

    // -----------------------------------------------
    
    clearCart() {
        this.cart = [];
		Storage.saveCart(this.cart);
        
		const buttonsAdd = document.querySelectorAll(".addToCart");
        const buttonsSumar = document.querySelectorAll(".btn-sumar");
        const buttonsRestar = document.querySelectorAll(".btn-retirar");
        const buttonsContador = document.querySelectorAll(".contador");
		
        while (cartContent.children.length > 0) {
            cartContent.removeChild(cartContent.children[0]);
        }
		Storage.saveTotal(0);
		cartTotal.innerText = Number(Storage.getTotal());
		cartItems.innerText = 0
		

		buttonsSumar.forEach(btn => {
			btn.disabled = false
		})
		buttonsRestar.forEach(btn => {
			btn.disabled = false
		})
		buttonsContador.forEach(btn => {
			btn.innerText = 0
		})
		buttonsAdd.forEach(btn => {
			btn.disabled = false
			btn.innerText = "Add to Cart"
		})

    }

    updateFromStorage() {
        //Actualizo el total a pagar con los datos del Storage
        this.actualizarTotal();
        

        const cartStorage = Storage.getCart();
        const buttonsAdd = document.querySelectorAll(".addToCart");
        const buttonsSumar = document.querySelectorAll(".btn-sumar");
        const buttonsRestar = document.querySelectorAll(".btn-retirar");

        cartStorage.forEach((itemCart) => {
            this.productImgInCart(itemCart);
            let id = itemCart.id;

            let index = id - 1;
            const button = buttonsAdd.item(index);

            const btnSumar = buttonsSumar.item(index);
            const btnRestar = buttonsRestar.item(index);
            // Si ya está en el carrito recuperado de Local Store, lo deshabilito del catálogo:
            button.innerText = "In Cart";
            button.disabled = true;
            btnSumar.disabled = true;
            btnRestar.disabled = true;
            // Al item del catálogo le pongo la cantidad que figura en el Local Storage:
            button.previousElementSibling.firstChild.nextElementSibling.nextElementSibling.innerText =
                itemCart.amount;
        });
        // Actualizo el iconito con el nro de la cantidad de productos elegidos
        this.getTotalItems();
    }

    
    eventsHandler() {
        cartContent.addEventListener('click', (event) => {
            if (event.target.classList.contains('btnRemove')) { // BOTON PARA REMOVER UN PRODUCTO DENTRO DEL CART
                
                let removeItem = event.target;
                let id = removeItem.dataset.id;
                
                cartContent.removeChild(removeItem.parentElement)
                this.removeItem(id);
            } else if (event.target.classList.contains('fa-chevron-up')) { //BOTON PARA SUMAR 1 ITEM DE UN PRODUCTO DENTRO DEL CART
                let sumarItem = event.target
                const carStor = Storage.getCart();
                let sumaPrecio = sumarItem.parentElement.previousElementSibling;
                let item = Storage.getProduct(
                    Number(sumarItem.dataset.id)
                );
                let precio = item.precio;
                let amount = item.amount;
                let id = item.id;

                const cantItemCat = document.querySelector(
                    `#contador-${id}`
                );

                const cant = sumarItem.nextElementSibling;
                cant.innerHTML = Number(cant.innerHTML) + 1;
                amount = Number(cant.innerHTML);
                sumaPrecio.innerHTML = `$ ${precio * amount}`;
                carStor.forEach((item) => {
                    if (item.id === id) {
                        item.amount = amount;
                    }
                });
                cantItemCat.innerText = amount;

                // GUARDO EL CARRITO EN EL LOCALSTORAGE
                Storage.saveCart(carStor);

                // ACTUALIZO EL TOTAL A PAGAR
                this.actualizarTotal();
                // ACTUALIZO EL TOTAL (CANTIDAD) DE ITEMS (EL NRO. DE ITEMS EN EL ICONO DEL CARRITO EN EL NAV)
                this.getTotalItems();

            } else if (event.target.classList.contains('fa-chevron-down')) { //BOTON PARA REMOVER 1 ITEM DE UN PRODUCTO DENTRO DEL CART
                let restarItem = event.target
                const carStor = Storage.getCart();
                let restaPrecio = restarItem.parentElement.previousElementSibling;
                let item = Storage.getProduct(
                    Number(restarItem.dataset.id)
                );
                let precio = item.precio;
                let amount = item.amount;
                let id = item.id;

                const cantItemCat = document.querySelector(
                    `#contador-${id}`
                );

                const cant = restarItem.previousElementSibling;

                // MIENTRAS LA CANTIDAD SEA MAYOR A 0, PUEDO SEGUIR RETIRANDO ITEMS
                if (cant.innerHTML > 0) {
                    cant.innerHTML = Number(cant.innerHTML) - 1;
                    amount = Number(cant.innerHTML);
                    // Actualizo el precio en HTML
                    restaPrecio.innerHTML = `$ ${precio * amount}`;
                    item.amount = amount
                    // Actualizo la cantidad en HTML
                    cantItemCat.innerText = amount;
                    // Actualizo el cart del Storage
                    Storage.updateProduct(item)
                    // Actualizo el objeto cart del script
                    this.cart = Storage.getCart()   
                }

                // SI RESTANDO ITEMS LLEGO A 0, REMUEVO EL ITEM DEL CART
                if (cant.innerHTML == 0) {
                    const conteinerItem = document.querySelector(
                        `#item-${id}`
                    );
                    Storage.removeProduct(item)
                    this.cart = Storage.getCart()
                    cartContent.removeChild(conteinerItem)
                    
                    const button = document.querySelector(`#addElemento-${id}`);

                    const btnSumar = document.querySelector(`#sumar-elemento-${id}`);
                    const btnRestar = document.querySelector(`#retirar-elemento-${id}`);

                    // Lo vuelvo a habilitar en el catálogo:
                    button.innerText = "Add to Cart";
                    button.disabled = false;
                    btnSumar.disabled = false;
                    btnRestar.disabled = false;

                    // Al item del catálogo le restablezco la cantidad a 0:
                    button.previousElementSibling.firstChild.nextElementSibling.nextElementSibling.innerText = 0;
                    
                    // ACTUALIZO EL TOTAL A PAGAR
                    this.actualizarTotal();
                }
               
                // ACTUALIZO EL TOTAL A PAGAR
                this.actualizarTotal();
                // ACTUALIZO EL TOTAL (CANTIDAD) DE ITEMS (EL NRO. DE ITEMS EN EL ICONO DEL CARRITO EN EL NAV)
                this.getTotalItems();
            }
        } )
    }
}

new Catalogo();
