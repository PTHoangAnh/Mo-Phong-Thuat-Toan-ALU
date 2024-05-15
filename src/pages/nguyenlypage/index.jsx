import React from "react";
import './index.scss';

class NguyenLy extends React.Component {

    render() {
        return (
            <div className="nguyenly">
                <h1 class="center">Mô tả phép toán số học</h1>
                <p>
                <em><small><b>Mục lục:</b></small></em>
                    <ol>
                        <a href="#bocong"><li>Bộ cộng</li></a>
                        <a href="#congsonguyenkhongdau"><li>Cộng số nguyên không dấu</li></a>
                        <a href="#congtrusonguyencodau"><li>Cộng trừ số nguyên có dấu</li></a>
                        <a href="#nhansonguyen"><li>Nhân số nguyên</li></a>
                        <a href="#chiasonguyen"><li>Chia số nguyên</li></a>
                    </ol>
                </p>

                <p><em><small><b>ALU (Arthmetic Logic Unit)</b> là một mạch điện tử thực hiện phép tính số học và logic. ALU là thành phần cơ bản của CPU của một máy tính có chức năng thực hiện các phép toán số học và logic sau đó trả lại kết quả cho thanh ghi và bộ nhớ.</small></em></p>
                <h3 id="bocong">1. Bộ cộng </h3>
                <p>-  Bộ cộng 1 bit toàn phần (Full Adder)</p>
                <img src={require("../../assets/images/bocong.png")} /> <br />
                <img src={require("../../assets/images/bocong0.png")} />
                <p>-Bộ cộng n bit</p>
                <p>+Bộ cộng 4 bit</p>
                <img src={require("../../assets/images/bocong1.png")} /> <br />
                <img src={require("../../assets/images/bocongnbit.png")} />
                <h3 id="congsonguyenkhongdau">2. Cộng số nguyên không dấu</h3>
                <p>-  Nguyên tắc tổng quát: Để cộng 2 số nguyên không dấu n bit ta sử dụng 1 bộ cộng n bit.</p>
                <img src={require("../../assets/images/Cout.png")} />
                <h3 id="congtrusonguyencodau">3. Cộng trừ số nguyên có dấu</h3>
                <p>-  Nguyên tắc tổng quát
                    <br />+ Để cộng 2 số nguyên có dấu n bit, ta sử dụng bộ cộng n bit.
                    <br />+ Để trừ 2 số nguyên có dấu n bit, ta sử dụng một bộ cộng n bit và một bộ lấy số bù 2 n bit.
                    <br />X-Y=X+(-Y) <br /> Suy ra: Phép đảo dấu trong máy tính thực chất là lấy bù 2.</p>
                <img src={require("../../assets/images/congtrucodau.png")} /> <br />
                <img src={require("../../assets/images/over.png")} />
                <p><b>Kết luận:</b> <em>Khi cộng 2 số nguyên có cùng dấu, kết quả có dấu ngược lại thì xảy ra hiện tượng tràn (Overflow)</em></p>
                <h3 id="nhansonguyen">4. Nhân số nguyên</h3>
                <h4>a. Nhân số nguyên không dấu</h4>
                <p>+ Các tích riêng phần được xác đinh như sau
                    <br />+ Nếu bit của số nhân = 0,  tích riêng phần = 0
                    <br />+ Nếu bit của số nhân = 1,  tích riêng phần bằng số bị nhân
                    <br />+ Tích riêng phần tiếp theo được dịch trái 1 bit so với tích riêng phần trước đó
                </p>
                <p><b> Lưu đồ thực hiện phép nhân số nguyên không dấu</b></p>
                <img src={require("../../assets/images/nhansonguyen.png")} />
                <h4>b. Nhân số nguyên có dấu</h4>
                <p>-  Sử dụng thuật giải nhân số nguyên không dấu
                    <br/>  <em>B1: Chuyển đổi số nhân và số bị nhân thành số nguyên không dấu tương ứng (coi là số không dấu)</em>
                    <br/>  <em>B2: Nhân 2 số bằng thuật giải nhân số nguyên không dấu</em>
                    <br/>  <em>B3: Hiệu chỉnh dấu của tích</em>
                    <br/>+ Nếu 2 thừa số ban đầu cùng dấu thì tích nhận được ở bước 2 là kết quả cần tính.
                    <br/>+ Nếu 2 thừa số ban đầu khác dấu nhau thì kết quả là số bù 2 của tích nhận được ở bước 2.
                </p>
                <p><b>* Nhân số nguyên có dấu theo thuật toán Booth.</b></p>
                <img src={require("../../assets/images/Booth.png")} />
                <h3 id="chiasonguyen">5. Chia số nguyên</h3>
                <h4>a. Chia số nguyên không dấu</h4>
                <img src={require("../../assets/images/chia.png")} />
                <h4>b. Chia số nguyên có dấu</h4>
                <p>
                    B1: Coi số bị chia và số chia là số dương tương ứng
                    <br />B2: Sử dụng thuật giải chia số nguyên không dấu để chia 2 số dương, kết quả nhận được là thương Q, số dư R đều dương.
                    <br />B3: Hiệu chỉnh dấu kết quả theo nguyên tắc
                </p>
                <img src={require("../../assets/images/chiacodau.png")} />
                <p>
                    M: Là phần định trị (Mantissa )
                    <br />R: Là cơ số tự nhiên, là hằng số (2, 10, 16)- (Radix)
                    <br />E: Là phần mũ (Exponent)
                    <br />Cơ số thường được sử dụng là cơ số 2 hoặc cơ số 10, M và E thường được biểu diễn theo kiểu số nguyên. Như vậy, với cơ số R xác định, thay vì phải lưu trữ giá trị của X người ta chỉ cần lưu trữ hai giá trị M và E.
                    <br />Khi ta thực hiện phép toán với số dấu chấm động sẽ được tiến hành trên cơ sở các giá trị của phần định trị và phần mũ. Giả sử có hai số thực được biểu diễn bởi số dấu chấm động như sau:
                </p>
                <img src={require("../../assets/images/M.png")} />
                <p> Có nhiều chuẩn để biểu diễn khác nhau, nhưng chuẩn thông dụng gồm hai chuẩn định dạng dấu chấm trượt quan trọng đối với người lập trình là: Chuẩn MSBIN (Microsoft Binary Format) của Microsoft và chuẩn IEEE (Institute of Electrical and Electronic Engineering). Cả hai chuẩn này đều dùng hệ đếm R = 2. </p>
            </div>
        )
    }
}

export default NguyenLy;
