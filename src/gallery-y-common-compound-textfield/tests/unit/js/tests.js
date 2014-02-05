YUI.add('module-tests', function(Y) {

    var suite = new Y.Test.Suite('gallery-y-common-compound-textfield');

    suite.add(new Y.Test.Case({
        name: 'Automated Tests',
        'value is loaded properly on each field': function() {
            var c = Y.one('#phone-container1');
            var compoundValue = '';
            c.all('input[type="text"]').each(function(node) {
            	compoundValue += node.get('value');
            });
            Y.Assert.areEqual(c.one('input[type="hidden"]').get('value'), compoundValue, 'compound value matches with was is loaded in separate fields');
        }
    }));

    Y.Test.Runner.add(suite);


},'', { requires: [ 'test' ] });
