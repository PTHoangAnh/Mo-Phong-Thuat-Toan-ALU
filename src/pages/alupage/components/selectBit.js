import React from 'react';

class SelectBits extends React.Component {
    handleOnChange = (event) => {
        const value = event.target.value;
        if (this.props.onChange) {
            this.props.onChange(value);
        }
    }

    render() {
        return (
            <>
                <a>Nhập số bit cần tính: </a>
                <select value={this.props.selectValue} onChange={this.handleOnChange}>
                    {this.props.options.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                </select>
            </>
        );
    }
}

export default SelectBits;

