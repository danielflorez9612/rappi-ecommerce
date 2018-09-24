import React, {Component} from 'react';
import {Dropdown} from "primereact/dropdown";
import {InputText} from "primereact/inputtext";
import {DataView, DataViewLayoutOptions} from "primereact/dataview";
import {Button} from "primereact/button";
import {Panel} from "primereact/panel";
import {products} from '../jsonfiles/products'
class ProductTable extends Component{
    constructor(props) {
        super(props);
        this.state = {
            dataViewValue:[],
            layout: 'list',
            sortOptions: [
                {label: 'Más económicos primero', value: 'price'},
                {label: 'Más caros primero', value: '!price'},
                {label: 'Disponibles primero', value: '!available'},
                {label: 'No disponibles primero', value: 'available'},
                {label: 'Más en stock primero', value: '!quantity'},
                {label: 'Más escasos primero', value: 'quantity'}
            ]
        };


        this.dataViewItemTemplate = this.dataViewItemTemplate.bind(this);
        this.onSortChange = this.onSortChange.bind(this);
    }
    renderBuy(item) {
        if(item.available){
            return (
                <Button label="Agregar al carrito" icon="pi pi-plus"/>
            );
        } else {
            return (
                <Button label="No disponible" className="p-button-danger" disabled={true}/>
            );
        }
    }
    renderBuyGrid(item) {
        if(item.available){
            return (
                <Button icon="pi pi-plus"/>
            );
        } else {
            return (
                <Button label="No disponible" className="p-button-danger" disabled={true}/>
            );
        }
    }

    refreshList(sublevelId) {
        const productsLol = products.filter(product => parseInt(product.sublevel_id) === parseInt(sublevelId));
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
    dataViewItemTemplate(item,layout) {
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
                            <div className="p-g-2 p-sm-6">Nombre:</div>
                            <div className="p-g-10 p-sm-6">{item.name}</div>

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
                    <Panel header={'header'} style={{ textAlign: 'center' }}>
                        <img src={src} alt='gift' style={imageStyle} />
                        <div className="car-detail">{item.name} - {item.price}</div>
                        {this.renderBuyGrid(item)}
                    </Panel>
                </div>
            );
        }
    }

    onSortChange(event) {
        let value = event.value;

        if (value.indexOf('!') === 0)
            this.setState({sortOrder: -1, sortField:value.substring(1, value.length), sortKey: value});
        else
            this.setState({sortOrder: 1, sortField:value, sortKey: value});
    }
    render() {
        const header = (
            <div className="p-g">
                <div className="p-g-12 p-md-4" style={{textAlign:'left'}}>
                    <Dropdown options={this.state.sortOptions} value={this.state.sortKey} placeholder="Ordenar por" onChange={this.onSortChange} />
                </div>
                <div className="p-g-6 p-md-4">
                    <InputText placeholder="Search by brand" onKeyUp={event => this.dv.filter(event.target.value)} />
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
                        <h1>Productos (CAMBIAR)</h1>
                        <DataView ref={el => this.dv = el} value={this.state.dataViewValue} filterBy="brand" itemTemplate={this.dataViewItemTemplate} layout={this.state.layout}
                                  paginatorPosition={'both'} paginator={true} rows={10} header={header} sortOrder={this.state.sortOrder} sortField={this.state.sortField}/>
                    </div>
                </div>



            </div>
        );
    }
}
export default ProductTable;