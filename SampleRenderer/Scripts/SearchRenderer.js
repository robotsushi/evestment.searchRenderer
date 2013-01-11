evestment = window.evestment || {};
evestment.searchRenderer = evestment.searchRenderer || {};

(function(namespace){
    
    var ctx;
    var focused_circle, lastX, lastY ; 
    var currentUniverse;

    var mainCircle = { 
        x: 150,
        y: 150,
        r: 75 
    };

    var circles = [
        { x:  50, y:  50, r: 25 },
        { x: 250, y:  50, r: 25 },
        { x: 250, y: 250, r: 25 },
        { x:  50, y: 250, r: 25 }
    ];


    namespace.initialize = function(canvasSelector){
        ctx = $(canvasSelector).get(0).getContext('2d');

        //render the main universe
        namespace.drawCircle(mainCircle);

        $(canvasSelector).mousedown( function( e ){
            lastX = e.pageX - $(this).offset().left;
            lastY = e.pageY - $(this).offset().top;
            $.each( circles, namespace.test_distance );
        });

        //test
        namespace.renderChildren(circles);
    };   

    namespace.drawCircle = function(data){
        ctx.beginPath();
        ctx.arc(data.x, data.y, data.r, 0, Math.PI * 2);
        ctx.fill();
    };

    namespace.drawLine = function(from, to){
        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.stroke();
    };

    namespace.renderChildren = function(childData){
        $.each(childData, function() {
            namespace.drawCircle(this);
            namespace.drawLine(mainCircle, this);
        });
    };

    namespace.test_distance = function(n, test_circle){
        if( focused_circle ) {
          return false;
        }

        var dx = lastX - test_circle.x;
        var dy = lastY - test_circle.y;

        //see if the distance between the click is less than radius
        if( dx * dx + dy * dy < test_circle.r * test_circle.r  ){
            focused_circle = n;
            $(document).bind( 'mousemove.move_circle' , namespace.drag_circle );
            $(document).bind( 'mouseup.move_circle' , namespace.clear_bindings);
            return false; // in jquery each, this is like break; stops checking future circles
        }
    };

    namespace.clear_bindings = function( e ){

        // mouse up event, clear the moving and mouseup bindings
        $(document).unbind( 'mousemove.move_circle mouseup.move_circle' );
        focused_circle=undefined;
    };


    namespace.drag_circle = function( e ){
        var    newX = e.pageX - $('#cv').offset().left
        var newY = e.pageY - $('#cv').offset().top;
        
        //set new values
        circles[ focused_circle ].x += newX - lastX;
        circles[ focused_circle ].y += newY - lastY;

        //remember these for next time
        lastX = newX, lastY = newY;

        //clear canvas and redraw everything
        ctx.clearRect( 0, 0, ctx.canvas.width, ctx.canvas.height );
        
        namespace.drawCircle(mainCircle);
        
        $.each(circles, function() {
            namespace.drawCircle(this);
            namespace.drawLine(mainCircle, this);
        });

    };   

})(evestment.searchRenderer);