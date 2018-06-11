export enum IOType {
    OUT, IN
}
export class IOData {
    public name: string;//io名字
    public cardId: number;//卡id
    public value: number;//值
    public type: number;//输入输出
    public index: number;//Io所在卡索引

    constructor(name: string, cardId: number,index: number, value: number, type: number) {
        this.name = name;
        this.cardId = cardId;
        this.index = index;
        this.value = value;
        this.type = type;

    }
}

//气缸
export class Cylinder {
    name: string;
    activity: IOData;   //动位
    original: IOData;   //原位
    activityReact: IOData; //动位感应
    originalReact: IOData; //原位感应
    constructor(name: string, activity?: IOData, original?: IOData, activityReact?: IOData, originalReact?: IOData) {
        this.name = name;
        this.activity = activity;
        this.original = original;
        this.activityReact = activityReact;
        this.originalReact = originalReact;
    }
}
//真空
export class Nozzle {
    control: IOData;
    react: IOData;
    controlreact: IOData;
    constructor(control?: IOData, react?: IOData, controlreact?: IOData) {
        this.control = control;
        this.react = react;
        this.controlreact = controlreact;
    }
}

export class IoPanelItem {
    hidden: boolean = true;
    nozzleList: Nozzle[];  //真空
    cylinderIOList: Cylinder[]; //气缸
    reactIOList: IOData[];  //感应
    otherIoList: IOData[]; //其他
    constructor() {
        this.cylinderIOList = [];
        this.nozzleList = [];
        this.reactIOList = [];
        this.otherIoList = [];
    }
}

export class Card {
    cardId: number;
    input: number[];
    output: number[];
    constructor() {
        this.cardId = -1;
        this.input = [];
        this.output = [];
    }
}


export const IOList: IoPanelItem[] = [];
let tempItem = new IoPanelItem();//感应类 
tempItem.reactIOList = [

    new IOData("下料盘有料感应", 0, 0,0, IOType.IN),
    new IOData("上料盘有料感应", 0, 1, 0, IOType.IN),
    new IOData("膜到位光纤检测1", 0, 2, 0, IOType.IN),
    new IOData("膜到位光纤检测2", 0, 3, 0, IOType.IN),
    new IOData("吸膜位移传感器", 0, 12, 0, IOType.IN),
    new IOData("上料门禁", 0, 14, 0, IOType.IN),

]
tempItem.cylinderIOList = [
    new Cylinder("上膜滑料气缸",
        new IOData("上膜滑料气缸原位", 0, 0, 0, IOType.OUT),
        new IOData("", 0, 0, 0, IOType.OUT),
        new IOData("上膜滑料气缸原位检测", 0,6, 0, IOType.IN),
        new IOData("", 0, 0, 0, IOType.IN),

    ),
    new Cylinder("上膜滑料气缸",
        new IOData("上膜滑料气缸动位", 0, 0, 0, IOType.OUT),
        new IOData("", 0, 0, 0, IOType.OUT),
        new IOData("上膜滑料气缸动位检测", 0, 7, 0, IOType.IN),
        new IOData("", 0, 0, 0, IOType.IN),

    ),

]
tempItem.nozzleList = [
    new Nozzle(
        new IOData("吸膜真空电磁阀1", 0, 0, 0, IOType.OUT),
        new IOData("", 0, 0, 0, IOType.OUT),
        new IOData("吸膜真空检测1", 0, 4, 0, IOType.IN),

    ),

    new Nozzle(
        new IOData("吸膜真空电磁阀2", 0, 0, 0, IOType.OUT),
        new IOData("", 0, 0, 0, IOType.OUT),
        new IOData("吸膜真空检测2", 0, 5, 0, IOType.IN),


    ),
    new Nozzle(
        new IOData("取料真空电磁阀1", 0, 0, 0, IOType.OUT),
        new IOData("", 0, 0, 0, IOType.OUT),
        new IOData("取料真空1", 0, 8, 0, IOType.IN),

    ),
    new Nozzle(
        new IOData("取料真空电磁阀2", 0, 0, 0, IOType.OUT),
        new IOData("", 0, 0, 0, IOType.OUT),
        new IOData("取料真空2", 0, 9, 0, IOType.IN),
    ),
    new Nozzle(
        new IOData("取料真空电磁阀3", 0, 0, 0, IOType.OUT),
        new IOData("", 0, 0, 0, IOType.OUT),
        new IOData("取料真空3", 0, 13, 0, IOType.IN),
    ),
    new Nozzle(
        new IOData("前端平台真空电磁阀1", 0, 0, 0, IOType.OUT),
        new IOData("", 0, 0, 0, IOType.OUT),
        new IOData("前端平台真空检测1", 0, 10, 0, IOType.IN),
    ),
    new Nozzle(
        new IOData("前端平台真空电磁阀2", 0, 0, 0, IOType.OUT),
        new IOData("", 0, 0, 0, IOType.OUT),
        new IOData("前端平台真空检测2", 0, 11, 0, IOType.IN),
    ),
]
tempItem.otherIoList = [
    new IOData("红灯", 0, 0, 0, IOType.OUT),
    new IOData("黄灯", 0, 0, 0, IOType.OUT),
    new IOData("绿灯", 0, 0, 0, IOType.OUT),
    new IOData("蜂鸣器", 0, 0, 0, IOType.OUT),

]

IOList[0] = tempItem;


tempItem = new IoPanelItem();
tempItem.reactIOList = [
    new IOData("来料光电感应", 1, 0, 0, IOType.IN),
    new IOData("来料阻挡到位光纤", 1, 2, 0, IOType.IN),
    new IOData("前端光电感应", 1, 3, 0, IOType.IN),
    new IOData("前端阻挡到位光纤", 1, 5, 0, IOType.IN),
    new IOData("后端光电感应", 1, 6, 0, IOType.IN),
    new IOData("后端阻挡到位光纤", 1, 8, 0, IOType.IN),

]
tempItem.cylinderIOList = [
    new Cylinder("来料阻挡",
        new IOData("来料阻挡气缸", 1, 0, 0, IOType.OUT),
        new IOData("", 1, 0, 0, IOType.OUT),
        new IOData("来料阻挡气缸原位检测", 1, 9, 0, IOType.IN),
        new IOData("来料阻挡气缸动位检测", 1, 10, 0, IOType.IN),
    ),
    new Cylinder("流水线前端",
        new IOData("流水线前端阻挡气缸", 1, 0, 0, IOType.OUT),
        new IOData("", 1, 0, 0, IOType.OUT),
        new IOData("流水线前端气缸原位检测", 1, 11, 0, IOType.IN),
        new IOData("流水线前端气缸动位检测", 1, 12, 0, IOType.IN),
    ),
    new Cylinder("流水线后端",
        new IOData("流水线后端阻挡气缸", 1, 0, 0, IOType.OUT),
        new IOData("", 1, 0, 0, IOType.OUT),
        new IOData("流水线后端气缸原位检测", 1, 13, 0, IOType.IN),
        new IOData("流水线后端气缸动位检测", 1, 14, 0, IOType.IN),
    ),
]
tempItem.nozzleList = [];
tempItem.otherIoList = [];
IOList[1] = tempItem;

tempItem = new IoPanelItem();
tempItem.otherIoList = [
    new IOData("等离子风电磁阀1", 2, 0, 0, IOType.OUT),
    new IOData("等离子风电磁阀2", 2, 0, 0, IOType.OUT),
    new IOData("保压吹气", 2, 0, 0, IOType.OUT),

]
tempItem.cylinderIOList = [
    new Cylinder("二次定位X方向气缸",
        new IOData("二次定位X方向气缸", 2, 0, 0, IOType.OUT),
        new IOData("", 2, 0, 0, IOType.OUT),
        new IOData("二次定位X方向气缸原位检测", 2, 3, 0, IOType.IN),
        new IOData("二次定位X方向气缸动位检测", 2, 4, 0, IOType.IN),

    ),
    new Cylinder("二次定位Y方向气缸",
        new IOData("二次定位Y方向气缸", 2, 0, 0, IOType.OUT),
        new IOData("", 2, 0, 0, IOType.OUT),
        new IOData("二次定位Y方向气缸原位检测", 2,5, 0, IOType.IN),
        new IOData("二次定位Y方向气缸动位检测", 2, 6, 0, IOType.IN),
    ),
    new Cylinder("二次定位夹钳气缸",
        new IOData("二次定位夹钳气缸", 2, 0, 0, IOType.OUT),
        new IOData("", 2, 0, 0, IOType.OUT),
        new IOData("二次定位夹钳气缸原位检测", 2,9, 0, IOType.IN),
        new IOData("二次定位夹钳气缸动位检测", 2, 10, 0, IOType.IN),

    ),
    new Cylinder("二次定位斜拉气缸",
        new IOData("二次定位斜拉气缸", 2, 0, 0, IOType.OUT),
        new IOData("", 2, 0, 0, IOType.OUT),
        new IOData("二次定位斜拉气缸原位检测", 2, 11, 0, IOType.IN),
        new IOData("二次定位斜拉气缸动位检测", 2, 12, 0, IOType.IN),

    ),
    new Cylinder("二次定位前后气缸",
        new IOData("二次定位前后气缸", 2, 0, 0, IOType.OUT),
        new IOData("", 2, 0, 0, IOType.OUT),
        new IOData("二次定位前后气缸原位检测", 2, 13, 0, IOType.IN),
        new IOData("二次定位前后气缸动位检测", 2, 14, 0, IOType.IN),

    ),
    new Cylinder("二次定位旋转气缸动位",
        new IOData("二次定位旋转气缸动位", 3, 0, 0, IOType.OUT),
        new IOData("", 3, 0, 0, IOType.OUT),
        new IOData("二次定位旋转气缸原位检测", 3, 0, 0, IOType.IN),
        new IOData("二次定位旋转气缸动位检测", 3, 15, 0, IOType.IN),

    ),
    new Cylinder("二次定位拨膜气缸原位",
        new IOData("二次定位拨膜气缸原位", 2, 0, 0, IOType.OUT),
        new IOData("", 2, 0, 0, IOType.OUT),
        new IOData("二次定位拨膜气缸原位检测", 2, 8, 0, IOType.IN),
        new IOData("", 2, 0, 0, IOType.IN),
    ),
   
    new Cylinder("二次定位拨膜上下气缸原位",
         new IOData("二次定位拨膜上下气缸原位", 3, 0, 0, IOType.OUT),
         new IOData("", 3, 0, 0, IOType.OUT),
         new IOData("二次定位拨膜上下气缸原位检测", 3, 1, 0, IOType.IN),
         new IOData("", 3, 0, 0, IOType.IN),
),
  
    new Cylinder("二次定位拨膜气缸动位",
        new IOData("二次定位拨膜气缸动位", 2, 0, 0, IOType.OUT),
        new IOData("", 2, 0, 0, IOType.OUT),
        new IOData("二次定位拨膜气缸动位检测", 2, 7, 0, IOType.IN),
        new IOData("", 2, 0, 0, IOType.IN),
),
    new Cylinder("二次定位拨膜上下气缸动位",
       new IOData("二次定位拨膜上下气缸动位", 3, 0, 0, IOType.OUT),
       new IOData("", 3, 0, 0, IOType.OUT),
       new IOData("二次定位拨膜上下气缸动位检测", 3, 2, 0, IOType.IN),
       new IOData("", 3, 0, 0, IOType.IN),
),
]
tempItem.nozzleList = [
    new Nozzle(
        new IOData("二次定位真空电磁阀1", 2, 0, 0, IOType.OUT),
        new IOData("", 2, 0, 0, IOType.OUT),
        new IOData("二次定位真空检测1", 2, 0, 0, IOType.IN),
    ),
    new Nozzle(
        new IOData("二次定位真空电磁阀2", 2, 0, 0, IOType.OUT),
        new IOData("",2,0,0,IOType.OUT),
        new IOData("二次定位真空检测2", 2,1, 0, IOType.IN),
    ),
    new Nozzle(
        new IOData("二次定位拨膜杆真空电磁阀", 3, 0, 0, IOType.OUT),
        new IOData("", 3, 0, 0, IOType.OUT),
        new IOData("二次定位剥膜杆真空检测", 3, 12, 0, IOType.IN),
    ),
    new Nozzle(
        new IOData("后端平台真空电磁阀", 3, 0, 0, IOType.OUT),
        new IOData("", 3, 0, 0, IOType.OUT),
        new IOData("后端平台真空检测", 3,4, 0, IOType.IN),
    ),
]
tempItem.reactIOList = [
    new IOData("二维码感应器", 3, 3, 0, IOType.IN),
    new IOData("轨道来料有料等待",3,9, 0, IOType.IN),
    new IOData("轨道出料有料等待", 3, 10, 0, IOType.IN),
    new IOData("安全门", 3, 11, 0, IOType.IN),
    new IOData("二次定位有料感应", 2, 2, 0, IOType.IN),
    new IOData("料仓", 3,10, 0, IOType.IN),
]
IOList[2] = tempItem;