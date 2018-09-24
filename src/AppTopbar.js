import React, {Component} from 'react';
import PropTypes from 'prop-types';

export class AppTopbar extends Component {

    static defaultProps = {
        onToggleMenu: null
    }

    static propTypes = {
        onToggleMenu: PropTypes.func.isRequired
    }

    render() {
        return (
            <div className="layout-topbar clearfix">
                <a className="layout-menu-button" onClick={this.props.onToggleMenu}>
                    <span className="pi pi-bars"/>
                </a>
                <div className="layout-topbar-icons">
                    <a>
                        <span className="layout-topbar-item-text">Events</span>
                        <span className="layout-topbar-icon pi pi-inbox"/>
                        <span className="layout-topbar-badge">5</span>
                    </a>
                </div>
            </div>
        );
    }
}