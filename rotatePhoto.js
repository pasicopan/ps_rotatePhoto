/**
 * rotatePhoto.js
 * @authors pansijia_gz (pasico@163.com)
 * @date    2014-12-18 15:57:12
 */
define(['exif.min'],function (){
    
    /**
    * return canvas
    */
    function init(a_options){
        if(a_options.inputElement){
            getImageEXIF({
                inputElement:a_options.inputElement,
                callback:rotate
            })
        }else{
            console.error('image is required')
        }
        function rotate(a_EXIFInfo){
            var imageOrientation = a_EXIFInfo.orientation || 1
            console.log('imageOrientation:',imageOrientation)
            var img = a_EXIFInfo.image
            var canvas = document.createElement('canvas');
            // var canvas = a_options.canvas || document.createElement('canvas');
            var ctx = canvas.getContext('2d')
            var imageWidth = img.width
            var imageHeight = img.height
            // var canvasWidth = a_options.longSide
            // var canvasHeight = a_options.shortSide
            var orientation = a_options.orientation || 0;
            console.log('orientation is:',orientation)
            if(a_options.longSide && a_options.shortSide){          
                if(1<imageWidth/imageHeight){
                    var canvasWidth = a_options.longSide
                    var canvasHeight = a_options.shortSide
                    // 横
                }else{
                    var canvasWidth = a_options.shortSide
                    var canvasHeight = a_options.longSide
                }

                if(0==orientation || 2==orientation){
                    canvas.width = a_options.shortSide
                    canvas.height = a_options.longSide
                }else{
                    canvas.width = a_options.longSide
                    canvas.height = a_options.shortSide
                }
            }else if(a_options.longSide && !a_options.shortSide){
                if(1<imageWidth/imageHeight){
                    var canvasWidth = a_options.longSide
                    var canvasHeight = canvasWidth/(imageWidth/imageHeight)
                    var shortSide = canvasHeight
                    // 横
                }else{
                    var canvasHeight = a_options.longSide
                    var canvasWidth = canvasHeight/(imageHeight/imageWidth)
                    var shortSide = canvasWidth
                }

                if(0==orientation || 2==orientation){
                    canvas.height = a_options.longSide
                    canvas.width = shortSide
                }else{
                    canvas.width = a_options.longSide
                    canvas.height = shortSide
                }
            }else if(!a_options.longSide && a_options.shortSide){
                if(1<imageWidth/imageHeight){
                    var canvasHeight = a_options.shortSide
                    var canvasWidth = canvasHeight/(imageHeight/imageWidth)
                    var longSide = canvasWidth
                    // 横
                }else{
                    var canvasWidth = a_options.shortSide
                    var canvasHeight = canvasWidth/(imageWidth/imageHeight)
                    var longSide = canvasHeight
                }

                if(0==orientation || 2==orientation){
                    canvas.width = a_options.shortSide
                    canvas.height = longSide
                }else{
                    canvas.height = a_options.shortSide
                    canvas.width = longSide
                }
            }else{
                var canvasWidth = imageWidth
                var canvasHeight = imageHeight
            }
            
                
            var _orientation;
            switch(imageOrientation){
                case 1:
                    _orientation = 0;
                    break;
                case 8:
                    _orientation = 1;
                    break;
                case 3:
                    _orientation = 2;
                    break;
                case 6:
                    _orientation = -1;
                    break;
                default:
                    break;
            }
            var rotateDegree = (orientation-_orientation) * 90 * Math.PI / 180;
            // ctx.rotate(rotateDegree);
            console.log('rotateDegree is:',(orientation-_orientation))
            var _o = (orientation-_orientation)
            _o = _o<0?_o+4:_o
            

            

            ctx.rotate(rotateDegree);
            switch(_o){
                case 0:
                    ctx.drawImage(img, 0, 0,imageWidth,imageHeight,0,0,canvasWidth,canvasHeight);
                    break;
                case 1:
                    ctx.drawImage(img, 0, 0,imageWidth,imageHeight,0,-canvasHeight,canvasWidth,canvasHeight);
                    break;
                case 2:
                    ctx.drawImage(img, 0,0,imageWidth,imageHeight,-canvasWidth, -canvasHeight,canvasWidth,canvasHeight);
                    break;
                case 3:
                    ctx.drawImage(img, 0, 0,imageWidth,imageHeight,-canvasWidth,0,canvasWidth,canvasHeight); 
                    break;
                default:
                    alert('wrong orientation')
                    break;
            }
            var outputImg = a_options.image || new Image()
            outputImg.onload = a_options.callback
            outputImg.src = canvas.toDataURL("image/png");
        }
        
    }
    /**
    * return int:orientation
    */
    function getImageEXIF(a_options){
        // console.log('a_options.inputElement is:',a_options.inputElement)
        var file = a_options.inputElement.files[0]
        var reader = new FileReader();
        reader.onload = function(){
            var img = new Image()
            img.onload = function(){
                // console.log('img is:',img)
                EXIF.getData(img, function(){
                    // var b = EXIF.getAllTags(img)
                    // alert(b.Orientation)
                    a_options.callback({
                        image:img,
                        orientation:EXIF.getAllTags(img).Orientation
                    })
                });
            }
            console.log('this.result is:',this.result)
            img.src = this.result;
            // detect(this.result, true)
        }
        reader.readAsDataURL(file)
    }

    return {init:init}
});