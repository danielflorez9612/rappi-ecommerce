import React, {Component} from 'react';
import {Button} from "primereact/button";
import {CartService} from "../service/CartService";
import {InputText} from "primereact/inputtext";
import {Growl} from "primereact/growl";

class Cart extends Component {
    constructor() {
        super();
        this.state = {
            cart:CartService.cart,
            errors:new Set()
        };
    }
    updateCart(id,quantity) {
        try {
            CartService.modifyItemInCart(id,quantity);
            this.setState({errors:new Set()})
        } catch (e) {
            let errors = this.state.errors;
            errors.add(id);
           this.setState({errors})
        }
        let modifiedCart = this.state.cart;
        modifiedCart.set(id, quantity);
        this.setState({cart:modifiedCart});
    }

    deleteFromCart(id) {
        CartService.deleteProduct(id);
        this.setState({cart:CartService.loadedCart});
        this.showSuccess();
    }
    productTemplate(item) {
        if (!item) {
            return null;
        }
        let src = "assets/demo/images/gift.png";
        const imageStyle = {height:100+'px', width: 100+'px'};
        return (
            <div className="p-g-12" key={item.id} style={{margin:'4px 0',borderBottom:'solid 1px lightGrey'}}>
                <div className="p-g-12 p-md-3" style={{'textAlign':'center'}}>
                    <img src={src} alt='gift' style={imageStyle}/>
                </div>
                <div className="p-g-12 p-md-9 car-details">
                    <div className="p-g">
                        <div className="p-md-7 p-g-7" style={{'fontWeight':'bold','fontSize':1.5+'em'}}>{item.name}</div>
                        <div  className="p-md-5 p-g-5" style={{'textAlign':'right', 'fontSize':1.5+'em','borderBottom':'solid 1px grey'}}>COP {item.price}</div>
                        <div className='p-md-7 p-g-6' />
                        <div className='p-md-2 p-g-3' ><span style={{'verticalAlign':'sub'}}>Cant.</span></div>
                        <div className='p-md-3 p-g-3' >
                            <InputText  type="text" keyfilter="pint" value={this.state.cart.get(item.id)} onChange={(e) => this.updateCart(item.id, e.target.value)}/>
                            {this.showError(item.id)}
                        </div>
                    </div>
                </div>
                <div className='p-g-12' style={{'height':1+'px'}}/>
                <div className='p-g-8' />
                <div className='p-g-4' style={{'textAlign':'right'}}>
                    <span onClick={(e)=>this.deleteFromCart(item.id)} style={{'cursor':'pointer', 'color':'red'}}>Eliminar del carrito</span>
                </div>
            </div>
        );
    }
    showSuccess() {
        this.growl.show({severity: 'success', summary: 'Producto eliminado', detail: 'Este producto fué eliminado de tu carrito'});
    }
    printCar() {
        const cart = CartService.products;
        return (
          <div className='p-g-12'>
              {cart.map(product => this.productTemplate(product))}
          </div>
        );
    }
    static moneyFormat(number) {
        return '$'+number.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    }
    render() {
        const totalQuantity = CartService.size;
        const addedS = totalQuantity===1?'':'s';
        const totalStyle ={'fontWeight':'bold','fontSize':1.5+'em'};
        const total = Cart.moneyFormat(CartService.totalPrice);
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
                            <Button className='p-g-12' label="Ir a Completar transacción" disabled={this.state.errors.size}/>
                            <div className="p-g-6 p-lg-6">
                                Articulo{addedS} ({parseInt(totalQuantity)})
                            </div>
                            <div className="p-g-6 p-lg-6">
                                {this.state.errors.size?'-':total}
                            </div>
                            <div className="p-g-6 p-lg-6">
                                Envío a domicilio
                            </div>
                            <div className="p-g-6 p-lg-6">
                                Gratis
                            </div>
                            <div className='p-g-12' style={{'borderTop':'solid 1px grey', 'marginTop':4+'px'}}>
                                <div className="p-g-6 p-lg-6" style={totalStyle}>
                                    Total:
                                </div>
                                <div className="p-g-6 p-lg-6" style={totalStyle}>
                                    {this.state.errors.size?'-':total}
                                </div>
                            </div>
                    </div>
                </div>
                <Growl ref={(el) => this.growl = el} />
            </div>
        );
    }

    showError(id) {
        if(this.state.errors.has(id)){
            return (
                <span style={{'fontSize':'0.8em', 'color':'red'}}>¡No tenemos tantos de este!</span>
            );
        } else {
            return null;
        }
    }
}
export default Cart