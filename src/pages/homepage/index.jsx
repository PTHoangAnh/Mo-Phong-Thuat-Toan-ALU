import React from 'react';
import AddTest from './components/add/addTest';
import { toast } from 'react-toastify';

class Home extends React.Component {
    render() {
        return (
            <>
                <div>
                    <h1>This is Home Page</h1>
                    <p>Edit in here</p>
                </div>
                <div className="home">
                    <AddTest />
                </div>
            </>
        )
    }
}

export default (Home);