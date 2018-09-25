import React, {Component} from 'react';
import {Dropdown} from "primereact/dropdown";
import {InputText} from "primereact/inputtext";
import {DataView} from "primereact/dataview";
import {Button} from "primereact/button";
import {Panel} from "primereact/panel";
import {products} from '../jsonfiles/products'
import {categories} from '../jsonfiles/categories'
import {BreadCrumb} from "primereact/breadcrumb";
import {CartService} from "../service/CartService";
import {Growl} from "primereact/growl";
import {Slider} from "primereact/components/slider/Slider";
import Cart from "./Cart";

class ProductTable extends Component{
    constructor(props) {
        super(props);
        const mPrice = CartService.maxPrice;
        this.state = {
            maxPrice : mPrice,
            rangeValues:[0,mPrice],
            dataViewValue:[],
            filterOptions: [
                {label: 'Filtrar por nombre', value:'name'},
                {label: 'Filtrar por disponibilidad', value: 'available'},
                {label: 'Filtrar por rango de precio', value: 'price'},
                {label: 'Filtrar por cantidad en stock', value: 'stock'},
            ],
            filterKey:'name',
            sortOptions: [
                {label: 'Más económicos primero', value: 'price'},
                {label: 'Más caros primero', value: '!price'},
                {label: 'Disponibles primero', value: '!available'},
                {label: 'No disponibles primero', value: 'available'},
                {label: 'Más en stock primero', value: '!quantity'},
                {label: 'Más escasos primero', value: 'quantity'}
            ]
        };
        this.itemTemplate = this.itemTemplate.bind(this);
        this.onSortChange = this.onSortChange.bind(this);
    }
    showSuccess() {
        this.growl.show({severity: 'success', summary: 'Producto agregado', detail: 'Este producto se agregó a tu carrito'});
    }
    renderBuyGrid(item) {
        if(CartService.cart.has(item.id)){
            return (
                <Button label="En el carrito" className="p-button-success" disabled={true}/>
            );
        } else if(item.available){
            return (
                <Button icon="pi pi-plus" label="Agregar" onClick={(e)=>this.addItemToCart(item.id)}/>
            );
        } else {
            return (
                <Button label="No disponible" className="p-button-danger" disabled={true}/>
            );
        }
    }

    filterByName(products, name) {
        if(name) {
            return products.filter(product => {
                return product.name.includes(name);
            })
        } else {
            return products;
        }

    }
    refreshList(sublevelId, filter) {
        let productsLol = products.filter(product => parseInt(product.sublevel_id) === parseInt(sublevelId));
        if(filter) {
            if (filter[0]==='name'){
                productsLol = this.filterByName(productsLol, filter[1]);
            }
            if(filter[0]==='available') {
                productsLol = this.filterByAvailable(productsLol, filter[1]==='true');
            }
            if(filter[0]==='stock') {
                productsLol = this.filterByQuantity(productsLol, filter[1]);
            }
            if(filter[0]==='price') {
                productsLol = this.filterByPrice(productsLol, filter[1]);
            }
        }
        this.setState({dataViewValue:productsLol});
    }
    componentDidMount() {
        const sublevelId = this.props.match.params['subId'];
        this.refreshList(sublevelId);
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.location.pathname !== this.props.location.pathname) {
            this.refreshList(nextProps.match.params['subId']);
        }
    }
    itemTemplate(item) {
        if (!item) {
            return null;
        }
        let src = "assets/demo/images/gift.png";
        const imageStyle = {height:100+'px', width: 100+'px'};
        const header = (
            <div>
                <b>{item.name}</b><br/>
                <span style={{'fontSize':'0.8em'}}>{item.quantity} unidades</span>
            </div>

        );
        return (
            <div style={{ padding: '.5em' }} className="p-g-12 p-md-3">
                <Panel header={header} style={{ textAlign: 'center' }}>
                    <img src={src} alt='gift' style={imageStyle} />
                    <div className="car-detail">COP {item.price}</div>
                    <br/>
                    {this.renderBuyGrid(item)}
                </Panel>
            </div>
        );
    }
    findInCategory(cat, sublevel) {
        if(parseInt(cat.id) === parseInt(sublevel)) {
            return [cat];
        } else {
            for(let i = 0;cat.sublevels && i< cat.sublevels.length; i++ ){
                let found = this.findInCategory(cat.sublevels[i], sublevel);
                if(found.length>0) {
                    found.push(cat);
                    return found;
                }
            }
            return [];
        }
    }
    findSublevel(array, sublevel) {
        for(let i = 0; array && i< array.length; i++ ){
            let cat = array[i];
            let foundPath = this.findInCategory(cat, sublevel);
            if(foundPath.length>0) {
                return foundPath;
            }
        }
        return [];
    }
    findCategoryPathOf(sublevel) {
        const  path = this.findSublevel(categories, sublevel).reverse().map(cat => {
            return {
              label:cat.name
            };
        });
        return path;
    }
    breadCrumbShow() {
        const items = this.findCategoryPathOf(this.props.match.params['subId']);
        const home = {icon: 'pi pi-home', url: '/'};
        return (<BreadCrumb model={items} home={home}/>);
    }

    onSortChange(event) {
        let value = event.value;

        if (value.indexOf('!') === 0)
            this.setState({sortOrder: -1, sortField:value.substring(1, value.length), sortKey: value});
        else
            this.setState({sortOrder: 1, sortField:value, sortKey: value});
    }
    onFilterChange(event) {
        this.refreshList(this.props.match.params['subId']);
        let value = event.value;
        this.setState({filterKey:value})
    }
    render() {
        const header = (
            <div className="p-g">
                <div className="p-g-12 p-md-6" style={{textAlign:'left'}}>
                    <Dropdown options={this.state.sortOptions} value={this.state.sortKey} placeholder="Ordenar por" onChange={this.onSortChange} />
                </div>
                <div className="p-g-12 p-md-3" >
                    <Dropdown options={this.state.filterOptions} value={this.state.filterKey} placeholder="Filtrar por" onChange={(e)=>this.onFilterChange(e)} />
                </div>
                <div className="p-g-12 p-md-3">
                    {this.showFilter()}
                </div>
            </div>
        );
        return (
            <div className="p-g">
                <div className="p-g-12">
                    <div className="card card-w-title">
                        {this.breadCrumbShow()}
                        <DataView ref={el => this.dv = el}
                                  value={this.state.dataViewValue}
                                  itemTemplate={this.itemTemplate}
                                  layout='grid'
                                  emptyMessage='No se encontraron datos'
                                  paginatorPosition={'both'}
                                  paginator={true}
                                  rows={10}
                                  header={header}
                                  sortOrder={this.state.sortOrder}
                                  sortField={this.state.sortField}/>
                    </div>
                </div>
                <Growl ref={(el) => this.growl = el} />
            </div>
        );
    }

    addItemToCart(id) {
        CartService.modifyItemInCart(id,1);
        this.showSuccess();
    }

    showFilter() {
        const availableOptions = [{label:'Disponibles',value:'true'}, {label:'No disponibles', value:'false'}];
        const subId = this.props.match.params['subId'];
        switch (this.state.filterKey) {
            case 'name':
                return (
                    <InputText placeholder='Nombre' onKeyUp={event => {
                        const filter = ['name', event.target.value];
                        this.refreshList(this.props.match.params['subId'],filter);
                    }} />
                );
            case 'available':
                return (
                    <Dropdown placeholder='Disponibilidad' options={availableOptions} value={null}
                              onChange={event => {
                        const filter = ['available', event.value];
                        this.refreshList(subId,filter);
                    }} />
                );
            case 'stock':
                return (
                    <InputText placeholder='Al menos' onKeyUp={event => {
                        const filter = ['stock', event.target.value];
                        this.refreshList(subId,filter);
                    }} />
                );
            case 'price':
                return (
                    <div>
                        <div>Rango: {Cart.moneyFormat(this.state.rangeValues[0])} - {Cart.moneyFormat(this.state.rangeValues[1])}</div>
                        <Slider value={this.state.rangeValues}
                                range={true}
                                animate={true}
                                onChange={(e) => {
                                    this.setState({rangeValues:e.value});
                                    const range = {from:e.value[0], until: e.value[1]};
                                    const filter = ['price',range ];
                                    this.refreshList(subId,filter);
                                }}
                                min={0}
                                max={this.state.maxPrice}
                        />
                    </div>
                );
        }

    }

    filterByAvailable(productsLol, available) {
        return productsLol.filter(product => product.available === available);
    }

    filterByQuantity(productsLol, quantity) {
        return productsLol.filter(product => product.quantity >= quantity);
    }

    filterByPrice(productsLol, {from, until}) {
        return productsLol.filter(product => {
            const price = CartService.valueOf(product.id);
            return (isNaN(from) || price >= from) &&
                (isNaN(until)||price<=until);
        });
    }
}
export default ProductTable;