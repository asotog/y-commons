YUI.add('module-tests', function (Y) {

    var suite = new Y.Test.Suite('gallery-y-common-ractive');

    suite.add(new Y.Test.Case({
        name: 'Automated Tests',
        
        'application initialized': function () {
            this.wait(function () {
                Y.Assert.isNull(Y.one('#el img'));
            }, 1000);
         }
    }));

    Y.Test.Runner.add(suite);


}, '', {
    requires: ['test', 'node']
});