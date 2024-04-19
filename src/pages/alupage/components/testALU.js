import React from "react";
import { toast } from 'react-toastify';
import InputField from "./inputField";
import SelectBits from "./selectBit";
import { decimalToBinary, binaryToDecimal } from "../../../utilites/convertDecBin";
import AddArithmetic from "./addArithmetic";

class TestALU extends React.Component {
    state = {
        registerInputA_Dec: '',
        registerInputA_Bin: '',
        registerInputB_Dec: '',
        registerInputB_Bin: '',
        registerOutput: 0,
        registerA: 0,
        registerQ: 0,
        registerQ_1: 0,
        registerM: 0,
        registerCount: 0,
        registerOverFlow: 0,
        numBits: 4,
        refeshState: false,
    }
    childRef = React.createRef();

    handleOnChange = (key, event) => {
        this.setState({
            [key]: event.target.value
        });
    }

    handleSelectBitsChange = (value) => {
        this.setState({ numBits: parseInt(value, 10) });
    }

    handleConvertToBin = () => {
        if (!this.state.registerInputA_Dec || !this.state.registerInputB_Dec) {
            toast.error(`Missing a Register!`)
            return;
        }
        const binA = decimalToBinary(this.state.registerInputA_Dec, this.state.numBits);
        const binB = decimalToBinary(this.state.registerInputB_Dec, this.state.numBits);
        this.setState({
            registerInputA_Bin: binA,
            registerInputB_Bin: binB,
        });
        this.childRef.current.refreshStep();
    }

    handleConvertToDec = () => {
        if (!this.state.registerInputA_Bin || !this.state.registerInputB_Bin) {
            toast.error(`Missing a Register!`)
            return;
        }

        const decA = binaryToDecimal(this.state.registerInputA_Bin);
        const decB = binaryToDecimal(this.state.registerInputB_Bin);

        this.setState({
            registerInputA_Dec: decA,
            registerInputB_Dec: decB,
        });
        this.childRef.current.refreshStep();
    }

    handleUpdateOutputRegister = (value) => {
        this.setState({ registerOutput_Bin: value });
    }


    render() {
        const {
            registerInputA_Dec,
            registerInputA_Bin,
            registerInputB_Dec,
            registerInputB_Bin,
            registerOutput_Bin,
            registerA,
            registerQ,
            registerQ_1,
            registerM,
            registerCount,
            flagCarry_out,
            flagZero,
            flagNegative,
            flagOverFlow,
            flagParity,
        } = this.state;

        const selectValueBits = [
            { value: '4', label: '4 bits' },
            { value: '8', label: '8 bits' },
            { value: '16', label: '16 bits' },
            { value: '32', label: '32 bits' }
        ];

        return (
            <div className="add-todo">
                <div>
                    <InputField
                        name="Register A"
                        value={registerInputA_Dec}
                        onChange={(event) => this.handleOnChange('registerInputA_Dec', event)}
                    />

                    <InputField
                        name="Register B"
                        value={registerInputB_Dec}
                        onChange={(event) => this.handleOnChange('registerInputB_Dec', event)}
                    />
                    <button
                        type="button"
                        className="add_Dec"
                        onClick={this.handleConvertToBin}
                    >
                        Chuyển đổi sang nhị phân
                    </button>
                </div>
                <div>
                    <InputField
                        name="Register A_Bin"
                        value={registerInputA_Bin}
                        onChange={(event) => this.handleOnChange('registerInputA_Bin', event)}
                    />
                    <InputField
                        name="Register B_Bin"
                        value={registerInputB_Bin}
                        onChange={(event) => this.handleOnChange('registerInputB_Bin', event)}
                    />
                    <button
                        type="button"
                        className="add_Bin"
                        onClick={this.handleConvertToDec}
                    >
                        Chuyển đổi sang thập phân
                    </button>
                </div>
                <div>
                    <SelectBits options={selectValueBits} onChange={this.handleSelectBitsChange} />
                </div>
               
                <AddArithmetic
                    registerInputA_Bin={registerInputA_Bin}
                    registerInputB_Bin={registerInputB_Bin}
                    numBits={this.state.numBits}
                    onUpdateOutputRegister={this.handleUpdateOutputRegister} 
                    registerOutput_Bin={registerOutput_Bin}
                    ref={this.childRef}
                />
            </div>
        );
    }
}

export default TestALU;
