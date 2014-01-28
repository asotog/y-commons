YUI.add('module-tests', function (Y) {

    var suite = new Y.Test.Suite('gallery-y-common-dombind');
    var TASKS_LIST = {
        "userId": 1243,
        "name": "John Doe",
        "married": true,
        "gender": "male",
        "futureTasks": [],
        "tomorrowTasks": [],
        "todayTasks": [{
                "taskId": 2501,
                "description": "js trends and frontend",
                "name": "JS Conf 2014",
                "date": "2014-01-21",
                "isCompleted": false
            }, {
                "taskId": 2301,
                "description": "js conf",
                "name": "NodeJS Conffff 54545",
                "date": "2014-01-21",
                "isCompleted": true
            }],
        "previousTasks": [{
                "taskId": 2402,
                "description": "test test",
                "name": "Conffff 2015",
                "date": "2014-01-20",
                "isCompleted": false
            }, {
                "taskId": 1701,
                "description": "test test",
                "name": "LR 6.3 Conf 2013",
                "date": "2014-01-20",
                "isCompleted": false
            }]
    };
    
    var currentTask = null;
    
    var dombind = new Y.Common.DomBind({
        container: Y.one('.activities-list'),
        templates: {
            'task-template': Y.one('#task-list-item-template').get('innerHTML')
        },
        controller: {
            deleteTask: function(task) {
                currentTask = task;
                Y.log('delete button clicked');
            }
        },
        filters: {
            processTask: function(dataItem) {
                dataItem.done = (dataItem.isCompleted) ? "done" : "";
                return dataItem;
            },
            initTaskComponents: function(dataItem, node) {
                node.setAttribute('data-custom-test', 'unit test');
                Y.log(dataItem);
            }
        }
    });
    suite.add(new Y.Test.Case({
        name: 'Automated Tests',
        'Set data': function () {
            dombind.on('dataChange', function () {
                Y.log('Data has been changed');
            });
            //dombind.set('data', TASKS_LIST);
            //Y.Assert.pass('No Tests Provided For This Module');
        },
        
        'Verify number of items created in the list after data load': function() {
            dombind.set('data', TASKS_LIST);
            var n = Y.one('.activities-list').all('li').size();
            Y.Assert.areNotEqual (0, n, 'Items are empty');
        },
        
        'Change input that is using bind directive': function() {
            /* TODO: verify after value change that data has been changed too listening the custom event and accessing data directly */
            dombind.listen('name', function(data) {
                Y.log('name bind has been updated: ' + dombind.get('data').name);
            });
        },
        
        'Radio button data listener': function() {
            dombind.listen('gender', function(data) {
                Y.log('gender bind has been updated: ' + dombind.get('data').gender);
            });
        },
        
        'Checkbox button data listener': function() {
            dombind.listen('married', function(data) {
                Y.log('married bind has been updated: ' + dombind.get('data').married);
            });
        },
        
        'Simulate bind input field value change also on data bind': function() {
            var newval = 'Mrs Doe';
            Y.one('.activities-list').one('.name').set('value', newval);
            Y.one('.activities-list').one('.name').simulate('change');
            Y.Assert.areEqual(newval, dombind.get('data').name, 'Values binded are not matching');//
            Y.Assert.areEqual(newval, Y.one('.activities-list span[data-db-bind="name"]').get('innerHTML'), 'Values binded are not matching');
        },
        
        'After each item rendered in the list, is executing filter defined': function() {
            var li = Y.all('.today li');
            var customAttributeLi = Y.all('.today li[data-custom-test]');
            Y.Assert.areEqual(li.size(), customAttributeLi.size(), 'Items listed not matching');
        },
        
        'Simulate click on iterable item button and retrieve the item data': function() {
            var lis = Y.all('.today li');
            lis.item(0).one('.activity-delete').simulate('click');
            Y.Assert.areEqual(currentTask.taskId, TASKS_LIST.todayTasks[0].taskId, 'Are not containing same task id');
        },
        
        'Simulate value change of iterable input and check values according to main data object': function() {
        }
    }));

    Y.Test.Runner.add(suite);


}, '', {
    requires: ['test', 'gallery-y-common-dombind', 'node', 'node-event-simulate']
});