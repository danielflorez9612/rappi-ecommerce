import React, {Component} from 'react';
import {Dropdown} from "primereact/dropdown";
import {InputText} from "primereact/inputtext";
import {DataView, DataViewLayoutOptions} from "primereact/dataview";
import {Button} from "primereact/button";
import {Panel} from "primereact/panel";

class ProductTable extends Component{
    constructor() {
        super();
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

    componentDidMount() {
        //this.setState()
    }


    dataViewItemTemplate(car,layout) {
        if (!car) {
            return;
        }

        let src = "assets/demo/images/car/" + car.brand + ".png";

        if (layout === 'list') {
            return (
                <div className="p-g" style={{padding: '2em', borderBottom: '1px solid #d9d9d9'}}>
                    <div className="p-g-12 p-md-3">
                        <img src={src} alt={car.brand}/>
                    </div>
                    <div className="p-g-12 p-md-8 car-details">
                        <div className="p-g">
                            <div className="p-g-2 p-sm-6">Vin:</div>
                            <div className="p-g-10 p-sm-6">{car.vin}</div>

                            <div className="p-g-2 p-sm-6">Year:</div>
                            <div className="p-g-10 p-sm-6">{car.year}</div>

                            <div className="p-g-2 p-sm-6">Brand:</div>
                            <div className="p-g-10 p-sm-6">{car.brand}</div>

                            <div className="p-g-2 p-sm-6">Color:</div>
                            <div className="p-g-10 p-sm-6">{car.color}</div>
                        </div>
                    </div>

                    <div className="p-g-12 p-md-1 search-icon" style={{marginTop:'40px'}}>
                        <Button icon="pi pi-search"/>
                    </div>
                </div>
            );
        }

        if (layout === 'grid') {
            return (
                <div style={{ padding: '.5em' }} className="p-g-12 p-md-3">
                    <Panel header={car.vin} style={{ textAlign: 'center' }}>
                        <img src={`assets/demo/images/car/${car.brand}.png`} alt={car.brand} />
                        <div className="car-detail">{car.year} - {car.color}</div>
                        <Button icon="pi pi-search"/>
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
                        <h1>DataView</h1>
                        <DataView ref={el => this.dv = el} value={this.state.dataViewValue} filterBy="brand" itemTemplate={this.dataViewItemTemplate} layout={this.state.layout}
                                  paginatorPosition={'both'} paginator={true} rows={10} header={header} sortOrder={this.state.sortOrder} sortField={this.state.sortField}/>
                    </div>
                </div>



            </div>
        );
    }
}
export default ProductTable;