
/* TODO: directives priorities int to control execution order and sorting mechanism based on that value */
Y.Common.DomBind.Directives = {
	
	/**
	* Definition for '-bind' directive, model can be associated to dom element or viceversa, reflecting changes on both sides,
	* meaning that it will provide two way binding
	* 
	* @property Directives['-bind']
	* @type {Object}
	* @static
	*/
    '-bind': {
        directiveExecFn: function (directiveName, el, scopeModel) {
            var val = el.getAttribute(this._getDirectiveName(directiveName));
            /* check if element was already bind */
            if (typeof el.getData(this.get('prefix') + DATA_IS_BINDED) == 'undefined') {
                var me = this;
                /* if element bind is inside of an array as an array item, it'll add the index as part of the key */
               
                var uniqueKey = this._generateUniqueKey(val, scopeModel);
                Y.log(LOG_PREFIX + 'Processing ' + directiveName + ' : ' + val, 'info');
                /* listen field changes  */
                el.on(['keyup', 'change', 'click'], function () {
                    /* if value is different than previous sets the model */
                    if (me._getElementValue(el) != el.getData('previousValue')) {
                        el.setData('previousValue', me._getElementValue(el));
                        me.setModel(val, me._getElementValue(el), scopeModel, el);
                    }
                });
                /* listen the model changes by using custom event */
                this.listen(uniqueKey, function(model) {
					/* avoid reset same element */
					if (typeof model.triggerElement == 'undefined' || !model.triggerElement.compareTo(el)) {
						el.setData('previousValue', model.newValue);
						/* sets element value */
						me._setElementValue(el, model.newValue);
					}
                });
                
                /* sets initial flag to avoid add multiple events to the same element */
                el.setData(this.get('prefix') + DATA_IS_BINDED, true)
            }
            /* inializes with the current model */
            this.setModel(val, this._getModel(val, scopeModel), scopeModel);
        }
    },

    '-onclick': {
        directiveExecFn: function (directiveName, el, scopeModel) {
            var me = this;
            var val = el.getAttribute(this._getDirectiveName(directiveName));
            el.on('click', function (e) {
                // TODO: be able to call multiple methods from the same directive
                e.preventDefault();
				me.execControllerMethodExpression(val, scopeModel, el);
            });
        }
    },

    '-container-loop-model': {
        directiveExecFn: function (directiveName, el, scopeModel) {
            el.empty();
            /* TODO: listen list changes */
            var me = this;
            var model = this.get('model');
            var val = el.getAttribute(this._getDirectiveName(directiveName));
            Y.log(LOG_PREFIX + 'Processing ' + directiveName + ' : ' + val);
            /* separates list iteration from list filters*/
            val = val.split(LOOP_DATA_FILTER);
            var filters = (val.length > 1) ? this._tokenizeFilters(val[1].split(COMMA_SEPARATOR)) : [];
            /* retrieve list iteration */
            val = val[0];
            /* tokenize the list iteration by item looped and list e.g "item in itemList" will be tokenized into ['item', 'in', 'itemList'] */
            val = val.match(/[^ ]+/g);
            var modelList = (model[val[2]] && model[val[2]].length > 0) ? model[val[2]] : [];
            var listItemTemplate = this.get('templates')[el.getAttribute(me._getDirectiveName(TEMPLATE))];
            Y.Array.each(modelList, function(item, index) {
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
                    parent: val[2],
                    parentType: DATA_ARRAY,
                    index: index
                };
                scopeObject.scopeModel[val[0]] =  modelItem;
                me._compileDirectives(scopeObject);
                el.append(node);
                me._doAfterEachItem(filters, item, node);
            });
            
        }
    }

};
