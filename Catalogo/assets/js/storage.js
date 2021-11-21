class Storage {
    static saveProducts(products) {
        localStorage.setItem("products",JSON.stringify(products))
    };

    static getAllProducts() {
        localStorage.getItem('products') ? JSON.parse(localStorage.getItem('products')) : []
    }

    static getProduct(id) {
        let products = JSON.parse(localStorage.getItem('cart'));
        return products.find(product => product.id === id)
    };

    static saveCart(cart) {
        localStorage.setItem('cart', JSON.stringify(cart));
    };

    static getCart() {
        return localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : []
    };

    static saveTotal(total) {
        localStorage.setItem("total", JSON.stringify(total))
    };

    static getTotal() {
        return localStorage.getItem('total') ? JSON.parse(Number(localStorage.getItem('total'))) : 0;
    };

    static removeProduct(item) {
        let cart = this.getCart()
        cart = cart.filter(product => product.id !== item.id)
        this.saveCart(cart)
        
    }

    static updateProduct(item) {
        let cart = this.getCart()

        for (let prod in cart) {
            if (cart[prod].id == item.id) {
                cart[prod] = item
            }
        }
       
        this.saveCart(cart)
        
    }
}

export {
    Storage,
}