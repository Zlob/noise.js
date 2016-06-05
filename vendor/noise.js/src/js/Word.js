define(['Char.js', 'Helper.js'], function(Char, Helper) {
    var Word = function(wordStr, height, maxOpacityDuration, maxCharsChangeDuration){
        this.height = height;
        this.maxOpacityDuration = maxOpacityDuration;
        this.maxCharsChangeDuration = maxCharsChangeDuration;
        this.chars = this.getChars(wordStr)
        this.layers = [];
    }
    
    Word.prototype.getChars = function(wordStr){
        var result = [];
        for (var i = 0, len = wordStr.length; i < len; i++) {
            result.push( new Char(wordStr[i], this.height, this.maxOpacityDuration, this.maxCharsChangeDuration));
        }        
        return result;
    }
    
    Word.prototype.getElement= function(){
        var element = document.createElement('span');
        element.className += 'noise__word';
        var margin = Math.ceil(this.height * 2/3);
        element.style.marginLeft = margin + 'px';
        element.style.marginLeft = margin + 'px';
        this.layers.push(element);
        this.chars.forEach(function(char){
            element.appendChild(char.getElement());
        }, this);
        return element;
    }
    
    return Word;
});