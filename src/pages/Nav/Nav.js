import React from 'react';
import './Nav.scss';
import { NavLink } from "react-router-dom";

class Nav extends React.Component {
    render() {
        return (
            <div className="topnav">
                <NavLink to="/" activeClassName="active" exact={true}>
                    Trang chủ
                </NavLink>
                <NavLink to="/about" activeClassName="active">
                    About
                </NavLink>
                <NavLink to="/testALU" activeClassName="active">
                    Mô phỏng thuật toán
                </NavLink>
            </div>
        )
    }
}
export default Nav;
