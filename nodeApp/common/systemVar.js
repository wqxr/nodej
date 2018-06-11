const msgType = {
    UI_HANDLER                :'ui_handler',
    COUNTINFO                 :"countinfo",
    SEND_TO_PAGE              :"send_to_page",
    SEND_TO_MID               :"send_to_mid",
    FEED_MATERIAL             :"feederinfomation",//上料信息
    OUT_MATERIAL              :"outmaterial",
    PAGE_READY_RESULT         :"page_readyResult",

    
};




let hourproduct={
    totalnumber:0,
    goodnumber:0,
    failnumber:0,
}
const dbName = "keycap_psa";
module.exports = {
    msgType:msgType,
    Hourproduct:hourproduct,
    isDebug:false,
    midExePath:"D:/CORE/distribute/Debug/octopus.exe",
    midExeDir:"D:/CORE/distribute/Debug",
    wsURL:"ws://127.0.0.1:8000",
    mongodbURL:"mongodb://localhost:27017/"+dbName,
}
