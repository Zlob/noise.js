define(['Helper.js'], function(Helper) {
    var Char = function(character, size, maxOpacityDuration, maxCharsChangeDuration){
        this.character = character;
        this.size = size;
        this.currentOpacity = 0;        
        this.currentStep = 0;
        this.setOpacityPerStep(maxOpacityDuration);
        this.setChangeCharLastStep(maxCharsChangeDuration);
        this.layerElements = [];  
    }
    
    Char.prototype.setOpacityPerStep = function(maxOpacityDuration){
        var steps = Helper.getRandomInt(1, maxOpacityDuration);
        this.opacityPerStep = 1 / steps;
    }
    
    Char.prototype.setChangeCharLastStep = function(maxCharsChangeDuration){
        var steps = Helper.getRandomInt(maxCharsChangeDuration * 0.5, maxCharsChangeDuration);
        this.changeCharLastStep = steps;
    }    
    
    Char.prototype.getElement = function(){
        var element = document.createElement('span');
        element.className += ' noise__char-' + this.size;        
        
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
    
    Char.prototype.resetCurrentStep = function(){
        this.currentStep = 0;
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
            if(Math.random() > 0.75){
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