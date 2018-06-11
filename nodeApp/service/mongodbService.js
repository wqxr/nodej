const mongodb = require('mongodb');
const collectionName = require('../common/collectionName.js');
const Db = mongodb.Db;//引用类型，方便自动提示
let MongoClient = mongodb.MongoClient;
/**
 * @type {Db}
 */
let dbInstance = null;
class MongodbService{
    constructor(url){
        this.isConnect = false;
        this.url = url;
    }
    init(){
        let initPromise = new Promise((resovle,reject)=>{
            MongoClient.connect(this.url,(err,db)=>{
                if( err ){
                    reject(err);
                }else{
                    this.isConnect = true;
                    dbInstance = db;
                    resovle();
                }
            });
        });
        return initPromise;
    }
    close(){
        dbInstance.close();
    }
    /**
     * 获取指定的collection
     * @param {string} name 
     */
    getCollection( name ){
        return dbInstance.collection(name);
    }

    /**
     * 数据清理,开发用
     */
    // async clearData(){
    //     let collection = await dbInstance.collection(collectionName.depotDetail);
    //     await collection.deleteMany({});
    //     collection = await dbInstance.collection(collectionName.keyIndexes);
    //     await collection.deleteMany({});
    //     collection = await dbInstance.collection(collectionName.lackKeyDetail);
    //     await collection.deleteMany({});
    // }
}
module.exports = MongodbService;