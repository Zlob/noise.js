/**
* Created with Text-Noise.
* User: vamakin
* Date: 2016-05-21
* Time: 04:43 PM
* To change this template use Tools | Templates.
*/
define(['/noise.js/src/Char.js', '/noise.js/src/Helper.js'], function(Char, Helper) {
    var Word = function(wordStr, maxOpacityDuration, maxCharsChangeDuration){
        this.maxOpacityDuration = maxOpacityDuration;
        this.maxCharsChangeDuration = maxCharsChangeDuration;
        this.chars = this.getChars(wordStr)
        this.layers = [];
    }
    
    Word.prototype.getChars = function(wordStr){
        var result = [];
        for (var i = 0, len = wordStr.length; i < len; i++) {
            result.push( new Char(wordStr[i], this.maxOpacityDuration, this.maxCharsChangeDuration));
        }        
        return result;
    }
    
    Word.prototype.getElement= function(){
        var element = document.createElement('span');
        element.className += 'noise__word';
        this.layers.push(element);
        this.chars.forEach(function(char){
            element.appendChild(char.getElement());
        }, this);
        return element;
    }
    
    return Word;
});