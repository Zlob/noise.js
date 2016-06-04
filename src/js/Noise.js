define(["Word.js", 'Helper.js'], function(Word, Helper) {
    var TextNoise = function(selector, options){
        this.selector = selector;
        this.currentStep = 0;
        
        this.maxOpacityDuration = options.maxOpacityDuration || 150;
        this.maxCharsChangeDuration = options.maxCharsChangeDuration || 300;
        this.maxSplitRGDBDuration = options.maxSplitRGDBDuration || Infinity;
        this.size = 'M';
        this.setText();
        
        this.events = [];
        
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
        
        this.init();
    }
    
    TextNoise.prototype.init = function(){
        this.hideOldText();
        this.getWords();
        this.render();
        this.status = 'initialized';
    }
    
    TextNoise.prototype.start = function(){
        var self = this;
        if(self.status != 'started'){
            self.currentStep = 0;
            self.status = 'started';
            self.words.forEach(function(word){
                word.chars.forEach(function(char){
                    char.resetCurrentStep();
                });
            });
            self.animate();
        }
    }
    
    TextNoise.prototype.noise = function(){
        var self = this;
        if(self.status != 'started'){
            self.currentStep = 0;
            self.maxSplitRGDBDuration = Infinity;
            self.maxOpacityDuration = Infinity;
            self.maxCharsChangeDuration = Infinity;
            self.status = 'started';
            self.words.forEach(function(word){
                word.chars.forEach(function(char){
                    char.resetCurrentStep();
                    char.setChangeCharLastStep(Infinity);
                });
            });
            self.animate();
        }
    }
    

    TextNoise.prototype.stop = function(){
        var self = this;
        if(self.status == 'initialized'){
            self.start();
        }
        if(self.status == 'started'){
            self.currentStep = 0;
            self.maxSplitRGDBDuration = 60;
            self.maxOpacityDuration = 60;
            self.maxCharsChangeDuration = 60;
            self.words.forEach(function(word){
                word.chars.forEach(function(char){
                    char.resetCurrentStep();
                    char.setChangeCharLastStep(60);
                });
            });
        }
    }
    
    TextNoise.prototype.pause = function(){
        var self = this;
        self.status = 'paused';
    }
    
    TextNoise.prototype.resume = function(){
        var self = this;
        self.status = 'started';
        self.animate();
    }

    TextNoise.prototype.getWords = function(){
        var wordsArr = this.text.split(' ');
        wordsArr.forEach(function(wordStr){
            this.words.push(new Word(wordStr, this.height, this.maxOpacityDuration, this.maxCharsChangeDuration));
        }, this);
    };        

    TextNoise.prototype.render = function(){   
        var wrapper = document.createElement('div');
        wrapper.className += 'noise__wrapper';
        wrapper.style.height = this.height + 'px';

        var mainLayer = document.createElement('span');
        mainLayer.className += 'noise noise__main';
        mainLayer.style.height = this.height + 'px';

        var redLayer = document.createElement('span');
        redLayer.className += 'noise noise__red';
        redLayer.style.height = this.height + 'px';
        redLayer.style.top = -this.height + 'px';

        var greenLayer = document.createElement('span');
        greenLayer.className += 'noise noise__green';
        greenLayer.style.height = this.height + 'px';
        greenLayer.style.top = -this.height * 2 + 'px';

        var blueLayer = document.createElement('span');
        blueLayer.className += 'noise noise__blue';
        blueLayer.style.height = this.height + 'px';
        blueLayer.style.top = -this.height * 3 + 'px';

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
            if(self.currentStep == self.maxOpacityDuration){
                self.emit('fadeInFinished');
            }
            if(self.currentStep == self.maxCharsChangeDuration){
                self.emit('charsChangeFinished');
            }
            if(self.currentStep == self.maxSplitRGDBDuration){
                self.emit('splitRGBFinished');
            }
                        
            if(self.status == 'started'){
                if(self.currentStep <= self.maxSplitRGDBDuration){
                    self.getSplitRGB();  
                    self.setSplitRGB();  
                }

                self.words.forEach(function(word){
                    word.chars.forEach(function(char){
                        char.animate();
                    });
                });
                
                if(self.currentStep >= Math.max(self.maxOpacityDuration, self.maxCharsChangeDuration, self.maxSplitRGDBDuration)){
                    self.resetSplit();
                    self.status = 'stopped';
                    return;
                }

                self.currentStep++;

                requestAnimationFrame(step);
            }
        }
        step();
    }
    
    TextNoise.prototype.getSplitRGB = function(){
        var currentTime = Date.now();
        if(!this.__proto__.splitTime || (currentTime - this.__proto__.splitTime) > 10){
            this.__proto__.splitTime = currentTime;
            var action = Math.random();
            if( action < 0.2 ){
                this.__proto__.splitType = 'split';
                this.__proto__.colors = this.splitVariants[Helper.getRandomInt(0, this.splitVariants.length - 1)];
                this.__proto__.baseSplitInPixels = Helper.getRandomInt(-5, 5);             
            }
            else if( action < 0.3 ){
                this.__proto__.splitType = 'reset';
            }
            else{
                this.__proto__.splitType = 'nothing';
            }
        }

    }
    
    TextNoise.prototype.setSplitRGB = function(){
        if( this.__proto__.splitType == 'split'){
            this.resetSplit();
            for(var i = 0; i < this.__proto__.colors.length; i++){
                var base = this.__proto__.baseSplitInPixels;
                var rate = (i + 1);
                var direction = Math.pow(-1, (i+1));
                this.setSplit(this.__proto__.colors[i], base * rate * direction);    
            }                
        }
        else if( this.__proto__.splitType == 'reset' ){
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
        
        var hidenElement = document.createElement('div');
        hidenElement.innerHTML = this.text;
        hidenElement.style.visibility = 'hidden';
        hidenElement.style.position = 'absolute';
        element.appendChild(hidenElement);
    };

    TextNoise.prototype.setText = function(){
        var element = document.querySelector(this.selector);
        if(element == null){
            throw new Error('elemnt by selector "' + this.selector + '" is not exist');
        }
        var childes = element.children.length;
        if(childes !== 0){
            throw new Error('elemnt by selector "' + this.selector + '" has child elements');
        }
        var text = element.innerHTML;
        if(text.length === 0){
            throw new Error('elemnt by selector "' + this.selector + '" is empty');
        }
        this.height = element.offsetHeight;        
        this.text = text;
        element.innerHTML = '';
    };
    
    TextNoise.prototype.on = function(event, action, context, once){
        if(!this.events[event]){
            this.events[event] = [];
        }
        this.events[event].push({
            action: action.bind(context),
            isTriggered: false,
            isOnce: once || false
        });
    }
    
    TextNoise.prototype.emit = function(event){
        if(this.events[event]){
            this.events[event].forEach(function(event){
                if(event.isTriggered && event.isOnce){
                    return;
                }
                event.isTriggered = true;
                var f = event.action;
                f();
            })
        }
    }

    return TextNoise;
});