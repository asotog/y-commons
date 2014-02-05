YUI.add('module-tests', function(Y) {

    var suite = new Y.Test.Suite('gallery-y-common-accordion');

    suite.add(new Y.Test.Case({
        name: 'Automated Tests',
        'accordion items gets expanded': function() {
        	var acc = Y.one('#sample-accordion2');
        	acc.one('.accordion-item .accordion-item-link').simulate('click');
            Y.Assert.areEqual(true, acc.one('.accordion-item').hasClass('selected'), 'accordion expands item');
        }
    }));

    Y.Test.Runner.add(suite);


},'', { requires: [ 'test', 'node', 'node-event-simulate' ] });
