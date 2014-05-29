YUI.add('module-tests', function(Y) {

    var suite = new Y.Test.Suite('gallery-y-common-infinite-scroll');

    suite.add(new Y.Test.Case({
        name: 'Automated Tests',
        'rendering test': function() {
            this.wait(function () {
                Y.Assert.isTrue(Y.all('.item').size() > 0);
                
            }, 1000);
        }
    }));

    Y.Test.Runner.add(suite);


},'', { requires: [ 'test', 'node'] });
