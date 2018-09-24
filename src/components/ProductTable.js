import React, {Component} from 'react';

class ProductTable extends Component{
    render() {
        return (
            <div>
                Hello Table of subLevel {this.props.match.params['subId']}
            </div>
        );
    }
}
export default ProductTable;