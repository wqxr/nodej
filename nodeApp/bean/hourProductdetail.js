class Hourproductdetail {
    constructor() {
        this.total = 0; //成品总数量
        this.goodproduct = 0;  //良数
        this.failproduct = 0; //
        this.failCTtime=0;
        this.passCTtime=0;
        this.type = "hourProduct";
    }
}
module.exports = Hourproductdetail;