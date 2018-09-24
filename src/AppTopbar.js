import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Cart from "./components/Cart";

export class AppTopbar extends Component {

    static defaultProps = {
        onToggleMenu: null
    };

    static propTypes = {
        onToggleMenu: PropTypes.func.isRequired
    };

    render() {
        return (
            <div className="layout-topbar clearfix">
                <a className="layout-menu-button" onClick={this.props.onToggleMenu}>
                    <span className="pi pi-bars"/>
                </a>
            </div>
        );
    }
}