
var Action = function ( target, name, args, options ) {

    var scope = this;
    var STATE = { CANCELLED: -1, NEW: 0, RUNNING: 1, DONE: 2 };

    this.target = target;
    this.name = name;
    this.args = args;
    this.options = options;

    // API

    this.successor = false;
    this.sequence = 0;

    this.state = STATE.NEW;
    this.tween = null;

    // internals

    // methods

    this.notify = function ( event ) {

        if ( event === 'done' )
            scope.state = STATE.DONE;
        else if ( event === 'run' )
            scope.state = STATE.RUNNING;
        else if ( event === 'stop' )
            scope.state = STATE.CANCELLED;
        else
            throw new Error( 'Unknown action state "' + event + '"' );

    };

    this.cancel = function () {
        if ( scope.state === STATE.RUNNING && scope.tween !== null )
            scope.tween.stop()
    };

    this.isPending = function () {
        return scope.state === STATE.NEW;
    };

    this.isRunning = function () {
        return scope.state === STATE.RUNNING;
    };

    this.isFinished = function () {
        return scope.state === STATE.DONE || scope.state === STATE.CANCELLED;
    };

};

Action.prototype = Object.create( {} )
Action.prototype.constructor = Action;

export default Action;
