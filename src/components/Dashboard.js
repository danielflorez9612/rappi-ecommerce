import React, {Component} from 'react';

export class Dashboard extends Component {
    render() {
        return (
            <div style={{
                'height': '610px',
                'width': '1000px',
                'margin': 'auto',
                'backgroundImage': 'url(assets/layout/images/tienda_baraton.jpg)'
            }} className="p-g p-fluid dashboard"/>
        );
    }
}