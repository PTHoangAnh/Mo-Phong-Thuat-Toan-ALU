import React from "react";

class InputField extends React.Component {
    render() {
        const { name, value, onChange } = this.props;
        return (
            <>
                <div>
                    <a>{name}: </a>
                    <input
                        type="number"
                        placeholder="Input"
                        value={value}
                        onChange={onChange}
                    />
                </div>
            </>
        );
    }
}

export default InputField;