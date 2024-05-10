import React from "react";
import { toast } from 'react-toastify';
import InputField from "./components/inputField";
import SelectBits from "./components/selectBit";
import './index.scss';
import { decimalToBinary, binaryToDecimal } from "../../utilites/convertDecBin";
import AddArithmetic from "./components/addArithmetic";
import SubArithmetic from "./components/subArithmetic";
import MulArithmetic from "./components/MulArithmetic";
import DivArithmetic from "./components/DivArithmetic";
class TestALU extends React.Component {
    state = {
        registerInputA_Dec: '',
        registerInputA_Bin: '',
        registerInputB_Dec: '',
        registerInputB_Bin: '',
        registerOutput: 0,
        registerA: [],
        registerQ: [],
        registerQ_1: 0,
        registerM: [],
        registerCount: 0,
        registerOverFlow: 0,
        numBits: 4,
        refeshState: false,
        activeComponent: 'AddArithmetic',
    }
    childRef = React.createRef();

    handleOnChange = (key, event) => {
        this.setState({
            [key]: event.target.value
        });
    }

    handleSelectBitsChange = (value) => {
        // Cập nhật số bit
        this.setState({ numBits: parseInt(value, 10) }, () => {
            // Chuyển đổi các giá trị của thanh ghi thành số bit mới
            this.convertRegistersToNewNumBits();
            // Cập nhật lại dữ liệu và giao diện theo số bit mới
            this.childRef.current.refreshStep();
        });
    }

    convertRegistersToNewNumBits = () => {
        const { registerInputA_Dec, registerInputB_Dec } = this.state;

        // Chuyển đổi các giá trị của thanh ghi A và B thành số bit mới
        const registerInputA_Bin = decimalToBinary(registerInputA_Dec, this.state.numBits);
        const registerInputB_Bin = decimalToBinary(registerInputB_Dec, this.state.numBits);

        // Cập nhật state với các giá trị mới
        this.setState({
            registerInputA_Bin,
            registerInputB_Bin,
        });
    }


    handleConvertToBin = () => {
        if (!this.state.registerInputA_Dec || !this.state.registerInputB_Dec) {
            toast.error(`Missing a Register!`)
            return;
        }
        let signDecA = false;
        let signDecB = false;
        if (this.state.registerInputA_Dec >= 0) {
            signDecA = true;
        }

        if (this.state.registerInputB_Dec >= 0) {
            signDecB = true;
        }

        const binA = decimalToBinary(this.state.registerInputA_Dec, this.state.numBits);
        const binB = decimalToBinary(this.state.registerInputB_Dec, this.state.numBits);
        this.setState({
            registerInputA_Bin: binA,
            registerInputB_Bin: binB,
            signA: signDecA,
            signB: signDecB,
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

    handleOptionButtonClick = (componentName) => {
        this.setState({ activeComponent: componentName });
    }

    render() {
        const {
            registerInputA_Dec,
            registerInputA_Bin,
            registerInputB_Dec,
            registerInputB_Bin,
            registerOutput_Bin,
            signA,
            signB,
            registerQ,
            registerQ_1,
            registerM,
            registerCount,
            flagCarry_out,
            flagZero,
            flagNegative,
            flagOverFlow,
            flagParity,
            activeComponent,
        } = this.state;

        const selectValueBits = [
            { value: '4', label: '4 bits' },
            { value: '5', label: '5 bits' },
            { value: '8', label: '8 bits' },
            { value: '16', label: '16 bits' },
            { value: '32', label: '32 bits' }
        ];

        return (
            <div className="app-arithmetic">
                <div className="input-value">
                    <table>
                        <tr>
                            <th>Hệ thập phân</th>
                            <th>Hệ nhị phân</th>
                        </tr>
                        <tr>
                            <td>
                                <InputField
                                    name="Decimal A"
                                    value={registerInputA_Dec}
                                    onChange={(event) => this.handleOnChange('registerInputA_Dec', event)}
                                />
                                <InputField
                                    name="Decimal B"
                                    value={registerInputB_Dec}
                                    onChange={(event) => this.handleOnChange('registerInputB_Dec', event)}
                                />
                            </td>

                            <td>
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
                            </td>
                        </tr>
                        <tr>
                            <td className="convert-button">
                                <button
                                    type="button"
                                    className="add_Dec"
                                    onClick={this.handleConvertToBin}
                                >
                                    Chuyển đổi sang nhị phân
                                </button>
                            </td>
                            <td className="convert-button">
                                <button
                                    type="button"
                                    className="add_Bin"
                                    onClick={this.handleConvertToDec}
                                >
                                    Chuyển đổi sang thập phân
                                </button>
                            </td>
                        </tr>
                    </table>
                </div> <hr />

                <div className="controll-menu">
                    <SelectBits options={selectValueBits} onChange={this.handleSelectBitsChange} /> <br /> <br />
                    {/* Set active class based on activeComponent */}
                    <button
                        className={`button ${activeComponent === 'AddArithmetic' ? 'active' : ''}`}
                        onClick={() => this.handleOptionButtonClick('AddArithmetic')}
                    >
                        Cộng
                    </button>
                    <button
                        className={`button ${activeComponent === 'SubArithmetic' ? 'active' : ''}`}
                        onClick={() => this.handleOptionButtonClick('SubArithmetic')}
                    >
                        Trừ
                    </button>
                    <button
                        className={`button ${activeComponent === 'MulArithmetic' ? 'active' : ''}`}
                        onClick={() => this.handleOptionButtonClick('MulArithmetic')}
                    >
                        Nhân
                    </button>
                    <button
                        className={`button ${activeComponent === 'DivArithmetic' ? 'active' : ''}`}
                        onClick={() => this.handleOptionButtonClick('DivArithmetic')}
                    >
                        Chia
                    </button>
                </div> <hr />
                <div className="mo-phong">
                    <a>Mô phỏng</a>
                </div>
                {/* Hiển thị component tùy thuộc vào giá trị của state */}
                {activeComponent === 'AddArithmetic' && (
                    <AddArithmetic
                        registerInputA_Bin={registerInputA_Bin}
                        registerInputB_Bin={registerInputB_Bin}
                        numBits={this.state.numBits}
                        registerQ={this.state.registerInputA_Bin}
                        onUpdateOutputRegister={this.handleUpdateOutputRegister}
                        registerOutput_Bin={registerOutput_Bin}
                        ref={this.childRef}
                    />
                )}
                {activeComponent === 'SubArithmetic' && (
                    <SubArithmetic
                        registerInputA_Bin={registerInputA_Bin}
                        registerInputB_Bin={registerInputB_Bin}
                        numBits={this.state.numBits}
                        onUpdateOutputRegister={this.handleUpdateOutputRegister}
                        registerOutput_Bin={registerOutput_Bin}
                        ref={this.childRef}
                    />
                )}
                {activeComponent === 'MulArithmetic' && (
                    <MulArithmetic
                        registerInputA_Bin={registerInputA_Bin}
                        registerInputB_Bin={registerInputB_Bin}
                        numA_Dec={registerInputA_Dec}
                        numB_Dec={registerInputB_Dec}
                        signA={this.state.signA}
                        signB={this.state.signB}
                        numBits={this.state.numBits}
                        onUpdateOutputRegister={this.handleUpdateOutputRegister}
                        registerOutput_Bin={registerOutput_Bin}
                        ref={this.childRef}
                    />
                )}
                {activeComponent === 'DivArithmetic' && (
                    <DivArithmetic
                        registerInputA_Bin={registerInputA_Bin}
                        registerInputB_Bin={registerInputB_Bin}
                        numA_Dec={registerInputA_Dec}
                        numB_Dec={registerInputB_Dec}
                        signA={this.state.signA}
                        signB={this.state.signB}
                        numBits={this.state.numBits}
                        onUpdateOutputRegister={this.handleUpdateOutputRegister}
                        registerOutput_Bin={registerOutput_Bin}
                        ref={this.childRef}
                    />)}
            </div>
        );
    }
}

export default TestALU;
