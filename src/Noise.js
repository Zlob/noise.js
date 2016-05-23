define(["/noise.js/src/Word.js", '/noise.js/src/Helper.js'], function(Word, Helper) {
    var TextNoise = function(selector, options){
        this.selector = selector;
        this.currentStep = 0;
        
        this.maxOpacityDuration = options.maxOpacityDuration || 150;
        this.maxCharsChangeDuration = options.maxCharsChangeDuration || 300;
        this.maxSplitRGDBDuration = options.maxSplitRGDBDuration || Infinity;
        this.text = options.text || this.getText();
        
        this.status = '';
        this.words = [];
        this.splitVariants = [
            ['red'],
            ['green'],
            ['blue'],
            ['red', 'green'],
            ['green', 'blue'],
            ['red', 'green', 'blue']
        ];               
    }
    
    TextNoise.prototype.start = function(){
        var self = this;
        var promise = new Promise(function(resolve, reject) {
            self.status = 'started';
            self.resolve = resolve;
            self.init();
            self.render();
            self.animate();                
        });
        return promise;
    }

    TextNoise.prototype.init = function(){
        this.hideOldText();
        this.getWords();
        this.status = 'initialized';
    }

    TextNoise.prototype.stop = function(){
        this.resetSplit();
        this.status = 'stopped';
        this.resolve();
    }

    TextNoise.prototype.getWords = function(){
        var wordsArr = this.text.split(' ');
        wordsArr.forEach(function(wordStr){
            this.words.push(new Word(wordStr, this.maxOpacityDuration, this.maxCharsChangeDuration));
        }, this);
    };        

    TextNoise.prototype.render = function(){   
        var wrapper = document.createElement('div');
        wrapper.className += 'noise__wrapper';

        var mainLayer = document.createElement('span');
        mainLayer.className += 'noise noise__main';

        var redLayer = document.createElement('span');
        redLayer.className += 'noise noise__red';

        var greenLayer = document.createElement('span');
        greenLayer.className += 'noise noise__green';

        var blueLayer = document.createElement('span');
        blueLayer.className += 'noise noise__blue';

        this.layers = {
            'red'   : redLayer,
            'green' : greenLayer,
            'blue'  : blueLayer
        };

        this.words.forEach(function(word){
            mainLayer.appendChild(word.getElement());
            redLayer.appendChild(word.getElement());
            greenLayer.appendChild(word.getElement());
            blueLayer.appendChild(word.getElement());
        }, this);

        var parentNode = document.querySelector(this.selector);
        //add our element to dom
        wrapper.appendChild(mainLayer);
        wrapper.appendChild(redLayer);
        wrapper.appendChild(greenLayer);
        wrapper.appendChild(blueLayer);
        parentNode.appendChild(wrapper);
    }

    TextNoise.prototype.animate = function(){
        var self = this;


        function step() {
            if(self.currentStep >= self.maxOpacityDuration && self.currentStep >= self.maxCharsChangeDuration && self.currentStep >= self.maxSplitRGDBDuration){
                self.stop();
            }

            if(self.status == 'stopped'){
                return;
            }

            requestAnimationFrame(step);

            if(self.currentStep <= self.maxSplitRGDBDuration){
                self.splitRGB();    
            }

            if(self.currentStep <= self.maxOpacityDuration || self.currentStep <= self.maxCharsChangeDuration){
                self.words.forEach(function(word){
                    word.chars.forEach(function(char){
                        char.animate();
                    });
                });
            }

            self.currentStep++;
        }
        step();
    }

    TextNoise.prototype.splitRGB = function(){
        var action = Math.random();
        if( action < 0.4 ){
            this.resetSplit();
            var baseSplitInPixels = Helper.getRandomInt(-4, 4);
            var colors = this.splitVariants[Helper.getRandomInt(0, this.splitVariants.length - 1)];

            for(var i = 0; i < colors.length; i++){
                this.setSplit(colors[i], baseSplitInPixels * i);    
            }                
        }
        else if( action < 0.6 ){
            this.resetSplit();
        }
        else{
            //nothing
        }
    }


    TextNoise.prototype.setSplit = function(color, split){
        this.layers[color].style.marginLeft = split + 'px';   
    }

    TextNoise.prototype.resetSplit = function(){
        this.setSplit('red', 0);
        this.setSplit('green', 0);
        this.setSplit('blue', 0);
    }    


    TextNoise.prototype.hideOldText = function(){
        var element = document.querySelector(this.selector);
        element.innerHTML = '';
        
        var hidenElement = document.createElement('div');
        hidenElement.innerHTML = this.text;
        hidenElement.style.display = 'none';
        element.appendChild(hidenElement);
    };

    TextNoise.prototype.getText = function(){
        var element = document.querySelector(this.selector);
        var text = element.innerHTML;
        element.innerHTML = '';

        return text;
    };

    return TextNoise;
});