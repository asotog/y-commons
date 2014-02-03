 Y.Common.DomBind.Directives = {};

 /**
  * Creates a directive, by adding it to Y.Common.DomBind.Directives object, on directives compilation phase, this object will be retrieved in order to start 
  * the initialization of all the directives difined in the dom
  * 
  * @method createDirective 
  * 
  * @param {String} keyName Attribute name that will be used on directive declaration in the html
  * @param {Function} directiveExecFn Callback function that will be executed on directive compilation e.g <code>function(directiveName, el, attribute, scopeModel) { }</code>
  * @static
  */
 Y.Common.DomBind.createDirective = function (keyName, directiveExecFn) {
     keyName = '-' + keyName;
     Y.Common.DomBind.Directives[keyName] = {
         directiveExecFn: directiveExecFn
     };
 }

 /**
  * Definition for <code>-onclick</code> directive, provides click event that can be defined from markup and call methods defined in the controller
  * 
  * @property Directives['-onclick']
  * @type {Object}
  */
 Y.Common.DomBind.createDirective('onclick', function (directiveName, el, attribute, scopeModel) {
     var me = this;
     this.attachEvent(el, 'click', function(e) {
         // TODO: be able to call multiple methods from the same directive
         e.preventDefault();
         me.execControllerMethodExpression(attribute, scopeModel, el);
     });
 });

 /**
  * Definition for <code>-onchange</code> directive, provides change event that can be defined from markup and call methods defined in the controller
  * 
  * @property Directives['-onchange']
  * @type {Object}
  */
 Y.Common.DomBind.createDirective('onchange', function (directiveName, el, attribute, scopeModel) {
     var me = this;
     this.attachEvent(el, 'change', function(e) {
         e.preventDefault();
         me.execControllerMethodExpression(attribute, scopeModel, el);
     });
 });

 /**
  * Definition for <code>-onfocus</code> directive, provides focus event that can be defined from markup and call methods defined in the controller
  * 
  * @property Directives['-onfocus']
  * @type {Object}
  */
 Y.Common.DomBind.createDirective('onfocus', function (directiveName, el, attribute, scopeModel) {
     var me = this;
     this.attachEvent(el, 'focus', function(e) {
         e.preventDefault();
         me.execControllerMethodExpression(attribute, scopeModel, el);
     });
 });

 /**
  * Definition for <code>-onblur</code> directive, provides blur event that can be defined from markup and call methods defined in the controller
  * 
  * @property Directives['-onblur']
  * @type {Object}
  */
 Y.Common.DomBind.createDirective('onblur', function (directiveName, el, attribute, scopeModel) {
     var me = this;
     this.attachEvent(el, 'blur', function(e) {
         e.preventDefault();
         me.execControllerMethodExpression(attribute, scopeModel, el);
     });
 });

 /**
  * Definition for <code>-bind</code> directive, model properties can be associated to dom element or viceversa, reflecting changes on both sides,
  * meaning that it will provide two-way binding
  * 
  * @property Directives['-bind']
  * @type {Object}
  */
 Y.Common.DomBind.createDirective('bind', function (directiveName, el, attribute, scopeModel) {
     /* check if element was already bind */
     if (typeof el.getData(this.get('prefix') + DATA_IS_BINDED) == 'undefined') {
         var me = this;
         /* if element bind is inside of an array as an array item, it'll add the index as part of the key */
         var uniqueKey = this._generateUniqueKey(attribute, scopeModel);
         Y.log(LOG_PREFIX + 'Processing ' + directiveName + ' : ' + attribute, 'info');
         /* listen field changes  */
         el.on(['keyup', 'change', 'click'], function () {
             /* if value is different than previous sets the model */
             if (me._getElementValue(el) != el.getData('previousValue')) {
                 el.setData('previousValue', me._getElementValue(el));
                 me.setModel(attribute, me._getElementValue(el), scopeModel, el);
             }
         });
         /* listen the model changes by using custom event */
         var modelEventHandle = this.listen(uniqueKey, function (model) {
             if (el._node != null) {
                 /* avoid reset same element */
                 if (typeof model.triggerElement == 'undefined' || !model.triggerElement.compareTo(el)) {
                     el.setData('previousValue', model.newValue);
                     /* sets element value */
                     me._setElementValue(el, model.newValue);
                 }
             } else {
                 /* stop listening if node was removed */
                 modelEventHandle.detach();
             }
         });

         /* sets initial flag to avoid add multiple events to the same element */
         el.setData(this.get('prefix') + DATA_IS_BINDED, true)
     }
     /* inializes with the current model if value in model is there and not undefined */
     if (this._getModel(attribute, scopeModel)) {
         this.setModel(attribute, this._getModel(attribute, scopeModel), scopeModel);
     }
 });

 /**
  * Definition for <code>-container-loop-model</code> directive, array list iterator, each element iterated has its own scope so this item can be passed through
  * controller methods, the iteration elements will be shown according to the template provided by the directive <code>-template</code>
  * 
  * @property Directives['-container-loop-model']
  * @type {Object}
  */
 Y.Common.DomBind.createDirective('container-loop-model', function (directiveName, el, attribute, scopeModel) {
     var me = this;
     var model = this.get('model');
     Y.log(LOG_PREFIX + 'Processing ' + directiveName + ' : ' + attribute);
     /* separates list iteration from list filters*/
     attribute = attribute.split(LOOP_DATA_FILTER);
     var filters = (attribute.length > 1) ? this._tokenizeFilters(attribute[1].split(COMMA_SEPARATOR)) : [];
     /* retrieve list iteration */
     attribute = attribute[0];
     /* tokenize the list iteration by item looped and list e.g "item in itemList" will be tokenized into ['item', 'in', 'itemList'] */
     attribute = attribute.match(/[^ ]+/g);
     var listProperty = attribute[2];
     var modelList = (model[listProperty] && model[listProperty].length > 0) ? model[listProperty] : [];
     var listItemTemplate = this.get('templates')[el.getAttribute(me._getDirectiveName(TEMPLATE))];
     /* iterates with the given list */
     var iterateList = function (list) {
         el.empty();
         Y.Array.each(list, function (item, index) {
             /* execute before each item filter */
             var modelItem = me._doBeforeEachItem(filters, item);
             /* creates the new node */
             var node = Y.Node.create(Y.Lang.sub(listItemTemplate, modelItem));
             var scopeObject = {
                 containerNode: node,
                 scopeModel: scopeModel
             };
             /* passes additional information in the model item */
             modelItem._info = {
                 parent: attribute[2],
                 parentType: DATA_ARRAY,
                 index: index
             };
             scopeObject.scopeModel[attribute[0]] = modelItem;
             me._compileDirectives(scopeObject);
             el.append(node);
             me._doAfterEachItem(filters, item, node);
         });
     };
     iterateList(modelList);
     /* listens list property changes */
     this.listen(listProperty, function () {
         iterateList(me.get('model')[listProperty]);
     });
 });

 /* TODO: directives priorities int to control execution order and sorting mechanism based on that value */
 /* TODO: add more directive for example for blur, focus, etc */