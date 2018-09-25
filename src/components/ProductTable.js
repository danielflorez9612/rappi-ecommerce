import React, {Component} from 'react';
import {Dropdown} from "primereact/dropdown";
import {InputText} from "primereact/inputtext";
import {DataView, DataViewLayoutOptions} from "primereact/dataview";
import {Button} from "primereact/button";
import {Panel} from "primereact/panel";
import {products} from '../jsonfiles/products'
import {categories} from '../jsonfiles/categories'
import {BreadCrumb} from "primereact/breadcrumb";
import {CartService} from "../service/CartService";
import {Growl} from "primereact/growl";

class ProductTable extends Component{
    constructor(props) {
        super(props);
        this.state = {
            dataViewValue:[],
            layout: 'list',
            filterOptions: [
                {label: 'Filtrar por nombre', value:'name'},
                {label: 'Filtrar por disponibilidad', value: 'available'},
                {label: 'Filtrar por rango de precio', value: 'price'},
                {label: 'Filtrar por cantidad en stock', value: 'stock'},
            ],
            filterKey:'price',
            range: {
                from:'',
                until:''
            },
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
    renderBuy(item) {
        if(CartService.cart.has(item.id)){
            return (
                <Button label="En el carrito" className="p-button-success" disabled={true}/>
            );
        } else if(item.available){
            return (
                <Button label="Agregar al carrito" icon="pi pi-plus" onClick={(e)=>this.addItemToCart(item.id)}/>
            );
        } else {
            return (
                <Button label="No disponible" className="p-button-danger" disabled={true}/>
            );
        }
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
    itemTemplate(item, layout) {
        if (!item) {
            return null;
        }
        let src = "assets/demo/images/gift.png";
        const imageStyle = {height:100+'px', width: 100+'px'};
        if (layout === 'list') {
            return (
                <div className="p-g" style={{padding: '2em', borderBottom: '1px solid #d9d9d9'}}>
                    <div className="p-g-12 p-md-3">
                        <img src={src} alt='gift' style={imageStyle}/>
                    </div>
                    <div className="p-g-12 p-md-8 car-details">
                        <div className="p-g">
                            <div className="p-g-12 p-sm-12" style={{'fontWeight':'bold','fontSize':'1.5em'}}>{item.name}</div>

                            <div className="p-g-2 p-sm-6">Cantidad:</div>
                            <div className="p-g-10 p-sm-6">{item.quantity}</div>

                            <div className="p-g-2 p-sm-6">Precio:</div>
                            <div className="p-g-10 p-sm-6">{item.price}</div>
                        </div>
                    </div>
                    {this.renderBuy(item)}
                </div>
            );
        }

        if (layout === 'grid') {
            return (
                <div style={{ padding: '.5em' }} className="p-g-12 p-md-3">
                    <Panel header={item.name} style={{ textAlign: 'center' }}>
                        <img src={src} alt='gift' style={imageStyle} />
                        <div className="car-detail">{item.price}</div>
                        {this.renderBuyGrid(item)}
                    </Panel>
                </div>
            );
        }
    }
    findInCategory(cat, sublevel) {
        if(parseInt(cat.id) === parseInt(sublevel)) {
            return [cat];
        } else {
            for(let i = 0;cat.sublevels && i< cat.sublevels.length; i++ ){
                let found = this.findInCategory(cat.sublevels[i], sublevel);
                if(found.length>0) {
                    found.push(cat)
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
                <div className="p-g-12 p-md-4" style={{textAlign:'left'}}>
                    <Dropdown options={this.state.sortOptions} value={this.state.sortKey} placeholder="Ordenar por" onChange={this.onSortChange} />
                </div>
                <div className="p-g-6 p-md-4">
                    <div className='p-g'>
                        <div className='p-g-12'><Dropdown options={this.state.filterOptions} value={this.state.filterKey} placeholder="Filtrar por" onChange={(e)=>this.onFilterChange(e)} /></div>
                        <div className='p-g-12'>{this.showFilter(this.state.filterKey)}</div>
                    </div>
                </div>
                <div className="p-g-6 p-md-4" style={{textAlign: 'right'}}>
                    <DataViewLayoutOptions layout={this.state.layout} onChange={event => this.setState({layout: event.value})} />
                </div>
            </div>
        );
        return (
            <div className="p-g">
                <div className="p-g-12">
                    <div className="card card-w-title">
                        {this.breadCrumbShow()}
                        <DataView ref={el => this.dv = el} value={this.state.dataViewValue} filterBy="name" itemTemplate={this.itemTemplate} layout={this.state.layout}
                                  paginatorPosition={'both'} paginator={true} rows={10} header={header} sortOrder={this.state.sortOrder} sortField={this.state.sortField}/>
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
                let range = this.state.range;
                const buttonStyle = {'height':'30px','padding':0};
                return (
                    <div className='p-g'>
                        <InputText className='p-g-6' placeholder='Desde' value={this.state.range.from} onChange={event => {
                            range.from = event.target.value;
                            this.setState({range});
                        }} />
                        <InputText className='p-g-6' placeholder='Hasta' value={this.state.range.until} onChange={event => {
                            range.until = event.target.value;
                            this.setState({range});
                        }} />
                        <Button style={buttonStyle} className='p-g-6' label='Buscar' onClick={e=>{
                            this.setState({range});
                            const filter = ['price', range];
                            this.refreshList(subId,filter);
                        }}/>
                        <Button style={buttonStyle} className='p-g-6 p-button-secondary' label='Limpiar' onClick={e=>{
                            range.from ='';
                            range.until = '';
                            this.setState({range});
                            this.refreshList(subId);
                        }}/>
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
            return (from==='' || price >= from) &&
                (until===''||price<=until);
        });
    }
}
export default ProductTable;