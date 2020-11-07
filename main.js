"ui";
auto();

ui.layout(
    <vertical bg="#FFFAFA">
        <frame  gravity="center" w="*" h="auto" padding="10 20 30 40"> 
            <text textSize="20sp" textColor="#000000" text="闪现一下APP 我回答脚本" gravity="center" w="*" h="auto" />
        </frame>
       
        
        <horizontal >
        <text textColor="#000000" >* 请设置每一次回答的间隔时间（最好5秒以上）</text>
        <input id="ms" w="80" text="5"/>
        <text >秒</text>
        </horizontal >
        <horizontal >
        <text textColor="#000000" >* 请设置执行次数 0次为无限执行</text>
        <input id="num" w="80" text="0"/>
        <text >次</text>
        </horizontal >
        <horizontal gravity="center|left">
            <text textColor="#000000" >* txt文本路径：</text>
            <text id="path" text="/sdcard/Pictures/ss/闪一下文本.txt"></text>
            <button  id="calc" align="center">txt文件选择</button>
        </horizontal >
        <text >（txt文本注意项:每一行为一条，建议多写几条 降低被封号几率）</text>
        <button  gravity="center" w="200" id="start" align="center" margin="10 20 30 40">开始执行</button>
        <vertical>
       
        
    </vertical>
    </vertical>
    
);


function SuperSS() {
    // app名字
    this.appName = '闪现一下'
}
// 启动app
SuperSS.prototype.startAPP = function() {
    var packageName =  getPackageName(this.appName)
    var startPackgeName = className("android.widget.FrameLayout").depth(0).findOne().packageName()
    console.log('闪现一下APP包名是' + packageName)
    console.log('当前打开应用的包名是' + startPackgeName)
    if (packageName == startPackgeName) {
        console.log('已经打开了'+ this.appName)
    } else {
        app.launchApp(this.appName)
        toastLog('打开APP' + this.appName)
        sleep(2000)
    }
}
// 随机获得一个数值 传入一个范围 比如1~10
SuperSS.prototype.newRandom = function(min,max) {
    return (Math.floor(random() * max + min)) - 1
}
// text文本直接找到上层能点击那个
SuperSS.prototype.textClick = function(str) {
    var textButton = typeof str === 'string' ? text(str).findOne() : str;
    var textButtonClick = textButton.click();
    if (!textButtonClick) {
        this.textClick(textButton.parent())
    } else {
        console.log(textButtonClick)
        return false;
        
    }
}
function subSS() {
    SuperSS.call(this)
    // 这里约定 发送的内容可以多条每一条内容 以回车为标准
    this.ssTxt = files.read(this.getPath());
    this.page = {
        editTextDom: className("android.widget.EditText").depth(7).indexInParent(0),
        myPage: className("android.view.ViewGroup").depth(16).indexInParent(5)
    }
}
subSS.prototype = new SuperSS();
subSS.prototype.constructor = subSS;

subSS.prototype.getPath = function() {
    return ui.path.getText()
}
// 随机获得一条文本
subSS.prototype.getTxt = function() {
    if (this.ssTxt.length > 0) {
        var txtArray = this.ssTxt.split('\r\n').filter(function(item){
            return item.length > 0
        })
        var random = this.newRandom(1, txtArray.length);
        return txtArray[random]
    }
}
// 查找我来答的按钮
subSS.prototype.meAnswerDom = function() {
    var parent = className('android.widget.FrameLayout').depth(9).indexInParent(5)
    var returnJG = null
    className("androidx.recyclerview.widget.RecyclerView").findOne().children().forEach(function(child) {
        var target = child.findOne(parent);
        if (target) {
            target.children().forEach(function(child) {
                var chi = child.findOne(className("android.view.ViewGroup").depth(16).drawingOrder(5).indexInParent(4))
                if (chi) {
                    returnJG = chi
                }
                
            })
        }
        
    });
    return returnJG
}
subSS.prototype.goMyPage = function() {
    this.textClick('我的')
}
// 点击我回答
subSS.prototype.clickMeAnswer = function () {
    this.page.myPage.findOne().click()
}
subSS.prototype.setContent = function () {
    this.txtCon = this.getTxt()
    this.page.editTextDom = className("android.widget.EditText").depth(7).indexInParent(0)
    if (this.page.editTextDom.findOne().text() != this.txtCon) {
        this.page.editTextDom.findOne().setText(this.txtCon)
        toastLog('正在写入指定的文本内容' + this.txtCon)
        sleep(2000)
    } 
}
subSS.prototype.publishButton = function () {
    // 判断输入框内容 和 文本的内容一致
    this.page.editTextDom = className("android.widget.EditText").depth(7).indexInParent(0)
    if (this.page.editTextDom.findOne().text() == this.txtCon) {
        className("android.widget.Button").depth(5).indexInParent(6).findOne().click()
        toastLog('提交按钮')
        sleep(2000)
        
    }
    
}

subSS.prototype.init = function () {
    initSS.startAPP()
    this.page.editTextDom = className("android.widget.EditText").depth(7).indexInParent(0)
    console.log(className("android.widget.EditText").depth(7).indexInParent(0).exists())
    if (className("android.widget.EditText").depth(7).indexInParent(0).exists()) {
        toastLog('当前正在输入界面')
        sleep(2000)
        this.setContent()
        this.publishButton()
    } else if (!this.page.myPage.exists()) {
        toastLog('打开我的界面')
        sleep(2000)
        this.goMyPage()

    } else if (this.meAnswerDom() ) {
        toastLog('点开大神 我回答')
        sleep(2000)
        this.meAnswerDom().click()
    } 
    
}

function pathToArray(dir) {
    current_dir_array = new Array();
    current_dir_array = ["返回上级目录"];
    files.listDir(dir.join("")).forEach((i) => {
        if (files.isDir(dir.join("") + i)) {
            current_dir_array.push(i + "/");
        } else if (files.isFile(dir.join("") + i)) {
            current_dir_array.push(i);
        }
    });
    return current_dir_array;
}



ui.calc.click(() => {
    var current_dir_array, dir = ["/", "sdcard", "/"]; //存储当前目录
    function file_select(select_index) {
        switch (select_index) {
            case undefined:
                break;
            case -1:
                return;
            case 0:
                if (dir.length > 3) {
                    dir.pop();
                }
                break;
            default:
                if (files.isFile(files.join(dir.join(""), current_dir_array[select_index]))) {
                    let file_name = (files.join(dir.join(""), current_dir_array[select_index]))
                    toast(file_name)
                    ui.path.setText(file_name);
                    return;

                } else if (files.isDir(files.join(dir.join(""), current_dir_array[select_index]))) {
                    dir.push(current_dir_array[select_index])
                }

        };
        current_dir_array = pathToArray(dir)
        dialogs.select("文件选择", current_dir_array).then(n => {
            file_select(n)
        });
    };
    file_select();
});

var initSS = new subSS()
ui.start.click(() => {

    threads.start(function() {
        // 执行多少次 0 就是无数次
        var uiData = {
            ms: ui.ms.getText() * 1000,
            num: ui.num.getText()
        }

        var number = uiData.num;
        var implementNum = 0;
        
        toastLog('开始执行')
        sleep(2000)
        var toastIner = setInterval(function() {
            initSS.init()
            // 判断执行的次数
            implementNum ++
            toastLog("当前执行第"+implementNum+"次")
            sleep(2000)
        }, uiData.ms)
        // 有执行的次数
        if ( number > 0) {
            if ( implementNum <= number) {
                
                clearInterval(toastIner)
            }
            
        }
        
    })
})








