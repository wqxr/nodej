const XLSX = require("xlsx");
const fs = require("fs");
//const dir = "W:/keyboard/doc/Re_ 打样设备资料22/残tray信息300/残tray信息100/同一物料殘tray待拼150/";
//const directory = "E:/keyboard/残tray信息100/不同物料殘tray待拼150";
//const workbook = XLSX.readFile(dir+"AB604-10929-5304IARABI161008N6D1089-G0503 - 複製 (2) - 複製.xlsx");
const ROW = ["A", "B"];
const columnMax = 79;

let keycapArrary = [];
let totalFile = [];


function todo(directory) {
    return new Promise(function (resolve, reject) {
        fs.readdir(directory, function (err, files) {
            if (err) {
                console.info("读取文件失败");
                reject(err);
            } else {
                for (let i = 0; i < files.length; i++) {
                    let book = XLSX.readFile(directory + "/" + files[i]);
                    let keyboardItem = {
                        type: 1,
                        language: "Arabic",
                        color: "Black",
                        keycapDetail: []
                    };
                    for (let i = 0; i < book.SheetNames.length; i++) {
                        let sheetName = book.SheetNames[i];
                        let Sheet = book.Sheets[sheetName];
                        for (let col = 2; col <= columnMax; ++col) {
                            let cellA = "A" + col;
                            let cellB = "B" + col;
                            if (Sheet[cellB].v == "Y") {
                                Sheet[cellB].v = 1;
                            } else if (Sheet[cellB].v == "N") {
                                Sheet[cellB].v = 0;
                            }
                            keyboardItem.keycapDetail.push(Sheet[cellB].v);
                        }
                    }
                    totalFile.push(keyboardItem);
                }
                resolve(totalFile);
            }
        })
    });

}


module.exports = todo;

// todo("E:/keyboard/残tray信息100/不同物料殘tray待拼150")
// .then(function(data){
//     console.log(data);
// }).catch(function(err){
//     console.log(err);
// });