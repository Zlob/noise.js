/**
* Created with Text-Noise.
* User: vamakin
* Date: 2016-05-12
* Time: 05:13 PM
* To change this template use Tools | Templates.
*/
define([], function() {
    var TextNoise = function(selector, text, steps){
        this.selector = selector;
        this.text = text;
        this.currentStep = 0;
        this.steps = steps;
        this.words = [];
                
        this.start = function(){
            this.init();
            this.render();
            this.animate()
        }
        
        this.init = function(){
            this.getWords();
        }
        
        this.getWords = function(){
            var wordsArr = this.text.split(' ');
            wordsArr.forEach(function(wordStr){
                this.words.push(new Word(wordStr, this.steps));
            }, this);
        };
        
        
        this.render = function(){          
            this.element = document.createElement('span');
            this.element.className += 'text-noise';
            this.words.forEach(function(word){
                this.element.appendChild(word.getElement());
            }, this);
            //clear all nodes
            var parentNode = document.querySelector(selector);
            while (parentNode.firstChild) {
                parentNode.removeChild(parentNode.firstChild);
            }
            //add our element to dome
            parentNode.appendChild(this.element);
        }
        
        this.animate = function(){
            var self = this;
            this.layers = {
                'red'   : document.querySelectorAll('.text-noise__red'),
                'green' : document.querySelectorAll('.text-noise__green'),
                'blue'  : document.querySelectorAll('.text-noise__blue')
            };

            function step() {
                requestAnimationFrame(step);
                self.sliceRGB();
                self.words.forEach(function(word){
                    word.chars.forEach(function(char){
                        char.animate();
                    });
                });
            }
            step();
        }
        
        this.sliceRGB = function(){
            var action = Math.random();
            if( action < 0.2 ){
                this.resetSlice();
                //get number of colors  to slice
                var colorsNumber = Math.floor(Math.random() * 3);
                var baseSliceInPixels = 3 - Math.floor(Math.random() * 6);
                
                this.setSlice('red', baseSliceInPixels);
                this.setSlice('green', baseSliceInPixels * 2);
                this.setSlice('blue', baseSliceInPixels * 3);
//                 for( var i = 0; i < colorsNumber; i++){

//                 }
                
            }
            else if( action < 0.3 ){
                this.resetSlice();
            }
            else{
                //nothing
            }
//             var self = this;
//             if(self.currentStep < self.steps){
//                 chars = document.querySelectorAll();
//             }
        }
        
        this.setSlice = function(color, slice){
            for(var i = 0; i < this.layers[color].length; i++){
                this.layers[color][i].style.marginLeft = slice + 'px';   
            }
        }
        
        this.resetSlice = function(){
            this.setSlice('red', 0);
            this.setSlice('green', 0);
            this.setSlice('blue', 0);
        }
        
        
    }
    
    var Word = function(wordStr, steps){
        this.steps = steps;
        this.chars = this.getChars(wordStr)
    }
    
    Word.prototype.getChars = function(wordStr){
        var result = [];
        for (var i = 0, len = wordStr.length; i < len; i++) {
            result.push( new Char(wordStr[i], this.steps));
        }        
        return result;
    }
    
    Word.prototype.getElement= function(){
        this.element = document.createElement('span');
        this.element.className += 'text-noise__word';
        this.chars.forEach(function(char){
            this.element.appendChild(char.getElement());
        }, this);
        return this.element;
    }
    
    var Char = function(character, steps){
        this.character = character;        
        this.steps = steps;
        this.currentOpacity = 0;
        this.opacityPerStep = this.getOpacityPerStep();
        this.currentStep = 0;
        this.changeCharLastStep = this.getChangeCharLastStep()
    }
    
    Char.prototype.getOpacityPerStep = function(){
        var steps = this.getRandomInt(1, this.steps / 3);
        return 1 / steps;
    }
    
    Char.prototype.getChangeCharLastStep = function(){
        var steps = this.getRandomInt(this.steps * (1 / 3), this.steps * (2 / 3));
        return steps;
    }    
    
    Char.prototype.getElement = function(){
        this.element = document.createElement('span');
        this.element.className += ' text-noise__char ';
        
        this.layerElements = [];        

        this.layerElements.push(this.getCharLayer(' text-noise__layer text-noise__red'));
        this.layerElements.push(this.getCharLayer(' text-noise__layer text-noise__green'));
        this.layerElements.push(this.getCharLayer(' text-noise__layer text-noise__blue'));
        this.layerElements.push(this.getCharLayer(' text-noise__layer text-noise__main-layer'));
        
        this.layerElements.forEach(function(layer){
            this.element.appendChild(layer); 
        }, this);   
        
        return this.element;
    }
    
    Char.prototype.getCharLayer = function(style){
        var charLayer  = document.createElement('span');
        charLayer.className += style;
        charLayer.innerHTML = '';
        charLayer.style.opacity = 0;
        return charLayer;
    }
    
    Char.prototype.animate = function(){
        //animate opacity
        this.changeOpacity();
        //animate chars changing
        this.changeChar();
        this.currentStep ++;            
    }
    
    Char.prototype.changeOpacity = function(){
        if(this.currentOpacity < 1){
            this.currentOpacity = this.currentOpacity + parseFloat(this.opacityPerStep);
            this.layerElements.forEach(function(layer){
                layer.style.opacity = this.currentOpacity;
            }, this)       
        }  
    }
    
    Char.prototype.changeChar = function(){
        if(this.currentStep < this.changeCharLastStep){
            if(Math.random() > 0.5){
                var randomChar = this.getRandomChar();
                this.layerElements.forEach(function(layer){
                    layer.innerHTML = randomChar;
                }, this) 
            }
        }
        else if(this.currentStep == this.changeCharLastStep){
            this.layerElements.forEach(function(layer){
                layer.innerHTML = this.character;
            }, this) 
        }
    }

    // использование Math.round() даст неравномерное распределение!
    Char.prototype.getRandomChar = function(min, max)
    {
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        return possible.charAt(this.getRandomInt(0, possible.length));
    }
    
    // использование Math.round() даст неравномерное распределение!
    Char.prototype.getRandomInt = function(min, max)
    {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    return TextNoise;
});