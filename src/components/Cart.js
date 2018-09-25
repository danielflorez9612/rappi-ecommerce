import React, {Component} from 'react';
import {Button} from "primereact/button";
import {CartService} from "../service/CartService";

class Cart extends Component {
    productTemplate(item) {
        if (!item) {
            return null;
        }
        let src = "assets/demo/images/gift.png";
        const imageStyle = {height:100+'px', width: 100+'px'};
        return (
            <div className="p-g-12" key={item.id}>
                <div className="p-g-12 p-md-3">
                    <img src={src} alt='gift' style={imageStyle}/>
                </div>
                <div className="p-g-12 p-md-8 car-details">
                    <div className="p-g">
                        <div className="p-g-2 p-sm-6">Nombre:</div>
                        <div className="p-g-10 p-sm-6">{item.name}</div>

                        <div className="p-g-2 p-sm-6">Precio:</div>
                        <div className="p-g-10 p-sm-6">{item.price}</div>
                    </div>
                </div>
            </div>
        );
    }
    printCar() {
        const cart = CartService.products;
        return (
          <div className='p-g-12'>
              {cart.map(product => this.productTemplate(product))}
          </div>
        );
    }
    render() {
        const totalQuantity = CartService.size;
        const addedS = totalQuantity>1?'s':'';
        const total = '$'+CartService.totalPrice;
        return (
            <div className="p-g p-fluid">
                <div className="p-g-12 p-lg-7">
                    <div className="p-g card">
                        <h1 className='p-g-12'>Carrito de compras</h1>
                        {this.printCar()}
                    </div>
                </div>
                <div className="p-g-12 p-lg-5">
                    <div className="card p-g">
                            <Button className='p-g-12' label="Ir a Completar transacción" />
                            <div className="p-g-6 p-lg-6">
                                Articulo{addedS} ({totalQuantity})
                            </div>
                            <div className="p-g-6 p-lg-6">
                                {total}
                            </div>
                            <div className="p-g-6 p-lg-6">
                                Envío a domicilio
                            </div>
                            <div className="p-g-6 p-lg-6">
                                Gratis
                            </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default Cart