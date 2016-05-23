define(function() {
    var Helper =  {
        getRandomInt : function(min, max){
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },
        
        getRandomChar : function(min, max){
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            return possible.charAt(this.getRandomInt(0, possible.length));
        }
    }
    
    return Helper;
});