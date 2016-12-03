/**
 * @author BUPT-HJM
 * @name  BoomGo 1.0.1
 * @description 基于canvas的原生js图片爆炸插件
 * @updateTime 2016/08/04
 */

(function(window, undefined) {

	var
		delayTime = 0,
		// 默认竖直速度数组
		//randomVy = [-50,-40,-30,-10,-20, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5,10,20,30,40,50],
		// 预设参数
		argOptions = {
			//小球大小
			'radius': 10,
			'minVx': -30,
			'maxVx': 30,
			'minVy': -50,
			'maxVy': 50,
			'edgeOpacity': false
		},
		//暴露的最终变量
		boom = function(canvasID, Src, options) {
			// 创建不同的对象，保证各自作用域独立
			return new boom.prototype.init(canvasID, Src, options);
		};

	/**
	 * canvas上装载图片
	 * @param  img    图像对象
	 * @param  canvas canvas元素
	 * @return ctx    绘图上下文
	 */
	function drawImg(img, canvas) {
		var ctx = canvas.getContext("2d");
		canvas.width = img.width;
		canvas.height = img.height;
		ctx.drawImage(img, 0, 0);
		return ctx;
	}

	/**
	 * 获取canvas像素值,构造colors数组
	 * @param   ctx    绘图上下文
	 * @param   canvas canvas元素
	 * @return  colors colors数组
	 */
	function initColors(ctx, canvas) {
		var colors = [];
		var imagedata = ctx.getImageData(0, 0, canvas.width, canvas.height);
		var data = imagedata.data;
		for (var x = 0; x < canvas.width; x++) {
			for (var y = 0; y < canvas.height; y++) {
				//获取进入数组的偏移量
				var i = ((y * canvas.width) + x) * 4;

				var r = data[i];
				var g = data[i + 1];
				var b = data[i + 2];
				var a = data[i + 3];
				var color = {
					r: r,
					g: g,
					b: b,
					a: a
				}
				colors.push(color);
			}
		}
		return colors;
	}

	function initRandomVy(options) {
		var randomVy = [];
		for (var i = options.minVy; i <= options.maxVy; i++) {
			randomVy.push(i);
		}
		return randomVy;
	}
	/**
	 * 根据参数初始化水平速度数组
	 * @return randomVx 水平速度数组
	 */
	function initRandomVx(options) {
		var randomVx = [];
		for (var i = options.minVx; i <= options.maxVx; i++) {
			randomVx.push(i);
		}
		return randomVx;
	}

	/**
	 * 初始化小球数组
	 */
	function initBalls(randomVx, randomVy, img, colors, options) {
		var balls = [];
		var radius = options.radius;
		var rowNumber = Math.floor((img.width * 0.5) / (2 * radius));
		var colNumber = Math.floor((img.height * 0.5) / (2 * radius));
		for (var i = 0; i < rowNumber; i++) {
			for (var j = 0; j < colNumber; j++) {
				var aBall = {
					x: img.width / 4 + radius * 2 * i,
					y: img.height / 4 + radius * 2 * j,
					g: 2.5 + Math.random(),
					vx: randomVx[Math.floor(Math.random() * randomVx.length)],
					vy: randomVy[Math.floor(Math.random() * randomVy.length)],
					color: randomColor(colors)
				}
				balls.push(aBall);
			}
		}
		return balls;
	}

	/**
	 * 在colors数组里随机返回一个rgba颜色
	 * @return rgba颜色字符串
	 */
	function randomColor(colors) {
		var i = Math.floor(Math.random() * colors.length);
		return "rgba(" + colors[i].r + "," + colors[i].g + "," + colors[i].b + "," + colors[i].a + ")";
	}


	/**
	 * 调用爆炸函数，构造定时器更新爆炸小球
	 */
	function IntervalBall(canvas, ctx, balls, options, that) {
		canvas.className += " become-small";
		var interval = setInterval(function() {
			boomBall(canvas, ctx, balls, options, interval, that);
			updateBalls(canvas, balls, options);
		}, 50);
	}

	/**
	 * 绘制爆炸小球
	 */
	function boomBall(canvas, ctx, balls, options, interval, that) {
		var count = 0;
		//更新画面
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		for (var i = 0; i < balls.length; i++) {
			ctx.fillStyle = balls[i].color;

			ctx.beginPath();
			ctx.arc(balls[i].x, balls[i].y, options.radius, 0, 2 * Math.PI);
			ctx.closePath();

			ctx.fill();

			if (balls[i].x < (0 - options.radius) || balls[i].x > (canvas.width + options.radius) || balls[i].y > (canvas.height + options.radius) || balls[i].y < (0 - options.radius)) {
				count++;
			}
		}
		if (count == balls.length) {
			clearInterval(interval);
			that.hasBoom = false;
			var CN = that.canvas.className;
			CN = CN.replace(" begin-shake become-small", "");
			that.canvas.className = CN;
			setTimeout(that._callback, 50);
		}
	}

	/**
	 * 根据参数水平速度和竖直速度更新小球位置
	 */
	function updateBalls(canvas, balls, options) {
		var count = 0;
		for (var i = 0; i < balls.length; i++) {
			if (balls[i].x < -options.radius || balls[i].x > canvas.width + options.radius || balls[i].y < -options.radius || balls[i].y > canvas.height + options.radius) {
				continue;
			}

			balls[i].x += balls[i].vx;
			balls[i].y += balls[i].vy;
			balls[i].vy += balls[i].g;
			if (options.edgeOpacity) {
				var re = /(rgba\(\d+,\d+,\d+,)(-?(\d+\.)?\d+)/g;
				var reArr = re.exec(balls[i].color);
				var beforeRgba = reArr[1];
				var opacity;
				if (parseInt(reArr[2] < 0.1)) {
					continue;
				}
				//var opacity = parseInt(reArr[2]);
				if (balls[i].x + options.radius <= canvas.width / 2 && balls[i].y + options.radius <= canvas.height / 2) {
					opacity = (balls[i].x / canvas.width * 2) * (balls[i].y / canvas.height * 2);
				} else if (balls[i].x + options.radius >= canvas.width / 2 && balls[i].y + options.radius <= canvas.height / 2) {
					opacity = ((canvas.width - balls[i].x) / canvas.width * 2) * (balls[i].y / canvas.height * 2);
				} else if (balls[i].x + options.radius <= canvas.width / 2 && balls[i].y + options.radius >= canvas.height / 2) {
					opacity = (balls[i].x / canvas.width * 2) * ((canvas.height - balls[i].y) / canvas.height * 2);
				} else {
					opacity = ((canvas.width - balls[i].x) / canvas.width * 2) * ((canvas.height - balls[i].y) / canvas.height * 2);
				}
				opacity = opacity * (1.2 + Math.random());
				balls[i].color = beforeRgba + opacity + ")";
			}
		}
	}


	// boom对象
	boom.prototype = {
		init: function(canvasID, Src, options) {
			var that = this;
			var len = arguments.length;

			if (typeof this.canvas == 'undefined') {
				var canvas = document.getElementById(canvasID);
				if (canvas == null) {
					console.error("Canvas is null.Check the canvasID.");
					return;
				}
				this.canvas = canvas;
			}
			var img = new Image();
			if (typeof this.img == 'undefined') {
				this.imgSrc = Src;
				this.img = img;
			}
			this.hasBoom = false;
			if (typeof arguments[2] !== 'undefined') {
				for (var key2 in argOptions) {
					if (typeof options[key2] == "undefined") {
						options[key2] = argOptions[key2];
					}
				}
				this.options = options;
			} else {
				this.options = argOptions;
			}
			img.src = this.imgSrc;
			img.onload = function() {
				//canvas上绘制图片
				that.ctx = drawImg(that.img, that.canvas);
			}
			return this;
		},
		go: function(delayOption, callback) {
			var that = this;
			if (that.hasBoom) {
				return;
			}
			this._callback = callback;
			var img = new Image();
			this.img = img;
			img.src = this.imgSrc;

			this.img.onload = function() {
				that.ctx = drawImg(that.img, that.canvas);
				if (typeof that.ctx == "undefined") {
					return;
				}
				if (that.hasBoom) {
					return;
				}
				// 获取canvas像素值,构造colors数组
				var colors = initColors(that.ctx, that.canvas);
				// 根据参数初始化水平速度数组
				var randomVx = initRandomVx(that.options);
				var randomVy = initRandomVy(that.options);
				// 初始化小球数组
				var balls = initBalls(randomVx, randomVy, that.img, colors, that.options);
				if (delayOption !== "undefined") {
					that.delayTime = delayOption;
				} else {
					that.delayTime = delayTime;
				}
				that.hasBoom = true;
				setTimeout(function() {
					that.hasBoom = true;
					that.canvas.className += " begin-shake";
					setTimeout(function() {
						IntervalBall(that.canvas, that.ctx, balls, that.options, that);
					}, 500);
				}, parseInt(that.delayTime));
			}
			return this;
		}
	}

	// A.prototype.init.prototype指向A.prototype
	boom.prototype.init.prototype = boom.prototype;

	//暴露变量
	window.boom = boom;
})(window)
