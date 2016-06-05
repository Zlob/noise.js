requirejs.config({
    baseUrl: '/',
    paths: {
        Noise: "noise.js/dist/Noise.min",
    }
});


requirejs(["Noise"], function(Noise){   
 
    var noise1 = new Noise({
        selector: '.first-noise',
        maxOpacityDuration: 75,
        maxCharsChangeDuration: 100,
        maxSplitRGDBDuration: 300,
    });
    var noise2 = new Noise({
        selector: '.second-noise',
        maxOpacityDuration: 75,
        maxCharsChangeDuration: 100,        
        maxSplitRGDBDuration: 200,
    });
    
    var noise3 = new Noise({
        selector: '.third-noise',
        maxOpacityDuration: 75,
        maxCharsChangeDuration: 100,  
        maxSplitRGDBDuration: 100,
    });
    
    noise1.on('charsChangeFinished', noise2.start, noise2, true);
    noise2.on('charsChangeFinished', noise3.start, noise3, true);
    noise3.on('charsChangeFinished', function(){
        $('.main-view').fadeIn(1200);
        $('#footer').fadeIn(1200)
        $('.first-noise').hover(function(){noise1.noise()}, function(){noise1.stop()});
        $('.second-noise').hover(function(){noise2.noise()}, function(){noise2.stop()});
        $('.third-noise').hover(function(){noise3.noise()}, function(){noise3.stop()});
    }, undefined, true);
    

    
    noise1.start();
    
    $('.skip').click(function(e){
        noise1.stop();
        noise2.stop();
        noise3.stop();
    });
    

});