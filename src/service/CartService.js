import {products} from "../jsonfiles/products";

export class CartService {
    static loadedCart =CartService.cart;
    static get cart() {
       const cCart = localStorage.getItem('cart');
       return new Map(JSON.parse(cCart));
    }
    static updateCart() {
        localStorage.setItem('cart', JSON.stringify(CartService.loadedCart));
    }
   static get products() {
       let productsInCart = [];
       for (const key of CartService.loadedCart.keys()) {
           const prod = this.findProduct(key);
           productsInCart.push(prod);
       }
       return productsInCart;
   }
   static deleteProduct(id) {
        this.loadedCart.delete(id);
        this.updateCart();
   }
   static findProduct(productId) {
        const prod = products.find(product => product.id ===productId);
        if(!prod) throw 'No hay un producto con este id';
        return prod;
   }
    static valueOf(productId) {
       const product = this.findProduct(productId);
        return parseFloat(product.price.substr(1).replace(/,/g, ''))
    }
   static get totalPrice() {
       const cart = CartService.loadedCart;
       let count = 0;
       for (const key of cart.keys()) {
           const unityPrice = CartService.valueOf(key);
           count+=unityPrice*cart.get(key);
       }
       return count;
   }
   static get size() {
       let count = 0;
       const cart = CartService.loadedCart;
       for (const key of cart.keys()) {
           count+=parseInt(cart.get(key));
       }
       return count;
   }
   static modifyItemInCart(id, quantity) {
        const prod = this.findProduct(id);
        if(quantity>prod.quantity) throw 'No hay tantos de este producto';
        CartService.loadedCart.set(id, quantity);
        this.updateCart();
   }
   static buy() {
        CartService.clearCart();
   }

    static clearCart() {
        localStorage.removeItem('cart');
    }
}