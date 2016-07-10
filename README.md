# BoomGo
>一个基于canvas的原生js图片爆炸插件

## 示例
https://bupt-hjm.github.io/BoomGo/
>博客地址：http://bupt-hjm.github.io/2016/07/10/boom/

## 如何使用

>因为图片爆炸时有颤动和缩小效果，所以依赖于`boom.css`，当然你也可以自行定义，或者直接不引入略去这些效果，分别是用到了`begin-shake`和`become-small`两个className

### 引入js/css
```
//可选，可以自定义修改begin-shake和become-small两个className
<link rel="stylesheet" href="css/boom.css">
```

```
//必须引入
<script src="js/boom.js"></script>
```

### 调用插件
```
//先构造boom实例，加载图片
//例：
//html
<canvas id="canvas1">
    当前浏览器不支持Canvas，请更换浏览器后再试
</canvas>
//js构造实例
var boom1 = boom("canvas1","imgs/test1.jpg");
//js调用爆炸图片
boom1.go();

```

```
//支持链式调用
//所以上面代码你也可以这么写
boom("canvas1","imgs/test1.jpg").go();
```

### 使用自定义参数
```
//默认参数
var argOptions = {
    'radius': 10,//小球大小
    'minVx': -30,//最小水平喷射速度
    'maxVx': 30,//最大水平喷射速度
    'minVy': -50,//最小垂直喷射速度
    'maxVy': 50,//最大垂直喷射速度
    'edgeOpacity': false//canvas是否边缘羽化
}
//爆炸go支持延时默认为立即爆炸即go(0)
```

```
//使用自定义参数，可以不写全
var argOptions = {
    'radius': 10,//小球大小
    'minVx': -30,//最小水平喷射速度
    'maxVx': 30,//最大水平喷射速度
    'minVy': -50,//最小垂直喷射速度
    'maxVy': 50,//最大垂直喷射速度
    'edgeOpacity': false//是否canvas边缘羽化
}
boom("canvas1","imgs/test1.jpg",argOptions).go(3000);
//3s后按argOptions参数爆炸id为canvas1的图片
```


### 参数介绍
>boom(canvasID, Src, options)
>//canvasID
>//Src图片路径
>//options参数

>go(delayOption)
>//delayOption为延时时间

## 感谢
>初学canvas，欢迎follow和star，pull request，提出您的宝贵意见
- 感谢@chokcoco与@xxycode带来的灵感和部分代码参考
- 感谢@kiki9611的建议
- 参考
 - https://github.com/chokcoco/boomJS
 - https://github.com/xxycode/UIViewXXYBoom

