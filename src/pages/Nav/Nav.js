import React from 'react';
import './Nav.scss';
import { NavLink } from "react-router-dom";

class Nav extends React.Component {
    render() {
        return (
            <div className="topnav">
                <NavLink to="/" activeClassName="active" exact={true}>
                    Mô phỏng
                </NavLink>
                <NavLink to="/nguyenly" activeClassName="active">
                    Nguyên lý
                </NavLink>
            </div>
        )
    }
}
export default Nav;
