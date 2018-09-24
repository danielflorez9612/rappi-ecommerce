import React, {Component} from 'react';
import {Dropdown} from "primereact/dropdown";
import {InputText} from "primereact/inputtext";
import {DataView, DataViewLayoutOptions} from "primereact/dataview";
import {Button} from "primereact/button";
import {Panel} from "primereact/panel";
import {products} from '../jsonfiles/products'
import {categories} from '../jsonfiles/categories'
import {BreadCrumb} from "primereact/breadcrumb";
class ProductTable extends Component{
    constructor(props) {
        super(props);
        this.state = {
            dataViewValue:[],
            layout: 'list',
            sortOptions: [
                {label: 'Newest First', value: '!year'},
                {label: 'Oldest First', value: 'year'},
                {label: 'Brand', value: 'brand'}
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
    findInCategory(cat, sublevel) {
        if(cat.id ==sublevel) {
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
            let founPath = this.findInCategory(cat, sublevel);
            if(founPath.length>0) {
                return founPath;
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
        const home = {icon: 'pi pi-home', url: '/'}
        return (<BreadCrumb model={items} home={home}/>);
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
                    <Dropdown options={this.state.sortOptions} value={this.state.sortKey} placeholder="Sort By" onChange={this.onSortChange} />
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
                        {this.breadCrumbShow()}
                        <DataView ref={el => this.dv = el} value={this.state.dataViewValue} filterBy="brand" itemTemplate={this.dataViewItemTemplate} layout={this.state.layout}
                                  paginatorPosition={'both'} paginator={true} rows={10} header={header} sortOrder={this.state.sortOrder} sortField={this.state.sortField}/>
                    </div>
                </div>



            </div>
        );
    }
}
export default ProductTable;