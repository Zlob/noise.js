define(['Helper.js'], function(Helper) {
    var Char = function(character, maxOpacityDuration, maxCharsChangeDuration){
        this.character = character;        
        this.maxOpacityDuration = maxOpacityDuration;
        this.maxCharsChangeDuration = maxCharsChangeDuration;
        this.currentOpacity = 0;
        this.opacityPerStep = this.getOpacityPerStep();
        this.currentStep = 0;
        this.changeCharLastStep = this.getChangeCharLastStep()
        this.layerElements = [];  
    }
    
    Char.prototype.getOpacityPerStep = function(){
        var steps = Helper.getRandomInt(1, this.maxOpacityDuration);
        return 1 / steps;
    }
    
    Char.prototype.getChangeCharLastStep = function(){
        var steps = Helper.getRandomInt(this.maxCharsChangeDuration * 0.5, this.maxCharsChangeDuration);
        return steps;
    }    
    
    Char.prototype.getElement = function(){
        var element = document.createElement('span');
        element.className += ' noise__char ';        
        
        this.layerElements.push(element);    
        
        return element;
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
                var randomChar = Helper.getRandomChar();
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
    
    return Char;
});