var ruler = {
    initPlugin: function (params) {
        var initParams = {
            el: params.el,
            height: params.height || 60,
            maxScale: params.maxScale || 200,
            startValue: params.startValue || 0,
            region: params.region || false,
            background: params.background || false,
            color: params.color || false,
            markColor: params.markColor || "#FFCC33",
            isConstant: params.isConstant || false
        };

        if (!initParams.el) {
            console.warn("Parameters without container elements");
            return false;
        }

        var rulerWrap = document.getElementById(initParams.el);
        rulerWrap.style.height = initParams.height < 50 ? 50 + "px" : initParams.height + "px";

        initParams.maxScale = initParams.maxScale < 50 ? 50 : initParams.maxScale;

        if (initParams.startValue > initParams.maxScale) {
            initParams.startValue = initParams.maxScale;
        }

        var minSildeNum = 0;
        var maxSildeNum = initParams.maxScale;

        if (initParams.region) {
            minSildeNum = Math.floor(initParams.region[0]);
            maxSildeNum = Math.floor(initParams.region[1]);
        }

        var count = initParams.startValue;

        var winWidth = rulerWrap.offsetWidth;
        var division = winWidth / 50;

        var scaleValueList = [];
        for (var i = 0; i <= initParams.maxScale; i += 10) {
            scaleValueList.push(i);
        }

        var canvas = rulerWrap.getElementsByTagName("canvas")[0];

        if (!canvas) {
            canvas = document.createElement("canvas");
            canvas.width = winWidth;
            canvas.height = initParams.height;
            rulerWrap.appendChild(canvas);
        }
        var cxt = canvas.getContext("2d");

        if (window.devicePixelRatio) {
            canvas.width = window.devicePixelRatio * winWidth;
            canvas.height = window.devicePixelRatio * initParams.height;
            cxt.scale(window.devicePixelRatio, window.devicePixelRatio);
        }

        function drawRuler(count) {
            count = count - 25;


            cxt.clearRect(0, 0, winWidth, initParams.height);


            if (initParams.background) {
                cxt.fillStyle = initParams.background;
                cxt.fillRect(0, 0, canvas.width, initParams.height);
            }


            for (var i = 0; i < initParams.maxScale; i++) {
                cxt.beginPath();
                cxt.save();
                cxt.strokeStyle = initParams.color ? initParams.color : "#bbb";
                cxt.lineWidth = 1;
                cxt.lineCap = "round";
                cxt.moveTo(division * i - count * division, 0);
                cxt.lineTo(division * i - count * division, Math.floor(initParams.height * 0.3));

                if (i % 2 === 0) {
                    cxt.strokeStyle = initParams.color ? initParams.color : "#999";
                    cxt.lineTo(division * i - count * division, Math.floor(initParams.height * 0.35));
                }
                if (i % 10 === 0) {
                    cxt.strokeStyle = initParams.color ? initParams.color : "#666";
                    cxt.lineTo(division * i - count * division, Math.floor(initParams.height * 0.52));
                }

                cxt.stroke();
                cxt.restore();
                cxt.closePath();
            }


            cxt.beginPath();
            cxt.font = "14px Arial";
            cxt.fillStyle = initParams.color ? initParams.color : "#333";
            cxt.textAlign = "center";
            cxt.textBaseline = "middle";
            scaleValueList.forEach(function (num, i) {
                cxt.fillText(num.toString(), (division * i * 10) - (count * division), Math.floor(initParams.height * 0.78));
            });
            cxt.closePath();


            cxt.beginPath();
            cxt.save();
            cxt.strokeStyle = initParams.markColor;
            cxt.lineWidth = 2;
            cxt.lineCap = "round";
            cxt.moveTo((winWidth / 2), 0);
            cxt.lineTo((winWidth / 2), Math.floor(initParams.height * 0.52));
            cxt.stroke();
            cxt.restore();
            cxt.closePath();

        }

        if (window.devicePixelRatio) {
            canvas.style.transform = "scale(" + 1 / window.devicePixelRatio + ")";
            canvas.style.transformOrigin = "left top";
        }

        drawRuler(count);


        var initX = 0,
            endX = 0,
            distanceX = 0,
            _distanceX = 0,
            lastX = count;

        if (!canvas) return false;


        canvas.addEventListener("touchstart", function (e) {
            initX = e.targetTouches[0].pageX;

        }, false);


        canvas.addEventListener("touchmove", function (e) {
            endX = e.targetTouches[0].pageX;
            moveEvent();
        }, false);


        canvas.addEventListener("touchend", function (e) {
            lastX = count;
            overEvent();
        }, false);

        var isMouseDown = false;


        canvas.addEventListener("mousedown", function (e) {
            isMouseDown = true;
            initX = e.layerX;
        }, false);


        canvas.addEventListener("mousemove", function (e) {
            if (!isMouseDown) {
                return false;
            }
            endX = e.layerX;
            moveEvent();
        }, false);



        canvas.addEventListener("mouseup", function (e) {
            lastX = count;
            isMouseDown = false;
            overEvent();
        }, false);

        canvas.addEventListener("mouseleave", function (e) {
            if (isMouseDown) {
                lastX = count;
                isMouseDown = false;
                overEvent();
            }
        }, false);



        function moveEvent() {
            distanceX = Math.floor((endX - initX) / (winWidth / 50));
            if (distanceX === _distanceX) {
                return false;
            }
            _distanceX = distanceX;
            count = lastX + distanceX;

            if (count >= initParams.maxScale || count <= 0) {
                count = count >= initParams.maxScale ? initParams.maxScale : 0;
            }
            drawRuler(count);

            if (initParams.isConstant) {
                params.success && params.success(count);
            }
        }

        function overEvent() {
            if (count > maxSildeNum) {
                lastX = count = count > maxSildeNum ? maxSildeNum : count;
            } else if (count < minSildeNum) {
                lastX = count = count < minSildeNum ? minSildeNum : count;
            } else {

            }
            drawRuler(count);

            params.success && params.success(count);
        }

    }
};