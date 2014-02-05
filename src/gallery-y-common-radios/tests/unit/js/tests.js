YUI.add('module-tests', function(Y) {

    var suite = new Y.Test.Suite('gallery-y-common-radios');

    suite.add(new Y.Test.Case({
        name: 'Automated Tests',
        'verify generated dom': function() {
            Y.Assert.areEqual(2, Y.all('.radio-mask').size(), 'required html not generated');
        }
    }));

    Y.Test.Runner.add(suite);


},'', { requires: [ 'test' ] });
