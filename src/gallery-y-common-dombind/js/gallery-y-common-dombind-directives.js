
/* TODO: directives priorities int to control execution order and sorting mechanism based on that value */

Y.Common.DomBind.Directives = {

    '-bind': {
        directiveExecFn: function (directiveName, el, scopeData) {
            var val = el.getAttribute(this._getDirectiveName(directiveName));
            var scope = Y.clone(scopeData);
            /* check if element was already bind */
            if (typeof el.getData(this.get('prefix') + DATA_IS_BINDED) == 'undefined') {
                var me = this;
                /* if element bind is inside of an array as an array item, it'll add the index as part of the key */
               
                var uniqueKey = this._generateUniqueKey(val, scopeData);
                Y.log(LOG_PREFIX + 'Processing ' + directiveName + ' : ' + val, 'info');
                /* listen field changes  */
                el.on(['keyup', 'change'], function () {
                    /* if value is different than previous sets the data */
                    if (me._getElementValue(el) != el.getData('previousValue')) {
                        el.setData('previousValue', me._getElementValue(el));
                        me.setData(val, me._getElementValue(el), scope);
                    }
                });
                /* listen the data changes by using custom event */
                this.listen(uniqueKey, function(data) {
                    /* BUGFIX: needs to set previous value of current element on every radio button bind  to the same data */
                    el.setData('previousValue', data.newValue);
                    /* sets element value */
                    me._setElementValue(el, data.newValue);
                });
                
                /* sets initial flag to avoid add multiple events to the same element */
                el.setData(this.get('prefix') + DATA_IS_BINDED, true)
            }
            /* inializes with the current data */
            this.setData(val, this._getData(val, scopeData), scope);
        }
    },

    '-onclick': {
        directiveExecFn: function (directiveName, el, scopeData) {
            var me = this;
            var val = el.getAttribute(this._getDirectiveName(directiveName));
            var methodName = val.split('(')[0];
            eval(me._generateScopeVarsCode(Y.clone(scopeData)));
            el.on('click', function (e) {
                // TODO: be able to call multiple methods from the same directive
                e.preventDefault();
                eval(Y.Lang.sub('me.get("controller").{methodName} = Y.bind(me.get("controller").{methodName}, el);', {methodName: methodName}));
                eval('me.get("controller").' + val);
            });
        }
    },

    '-container-loop-data': {
        directiveExecFn: function (directiveName, el, scopeData) {
            el.empty();
            /* TODO: listen list changes */
            var me = this;
            var data = this.get('data');
            var val = el.getAttribute(this._getDirectiveName(directiveName));
            Y.log(LOG_PREFIX + 'Processing ' + directiveName + ' : ' + val);
            /* separates list iteration from list filters*/
            val = val.split(LOOP_DATA_FILTER);
            var filters = (val.length > 1) ? this._tokenizeFilters(val[1].split(COMMA_SEPARATOR)) : [];
            /* retrieve list iteration */
            val = val[0];
            /* tokenize the list iteration by item looped and list e.g "item in itemList" will be tokenized into ['item', 'in', 'itemList'] */
            val = val.match(/[^ ]+/g);
            var dataList = (data[val[2]] && data[val[2]].length > 0) ? data[val[2]] : [];
            var listItemTemplate = this.get('templates')[el.getAttribute(me._getDirectiveName(TEMPLATE))];
            Y.Array.each(dataList, function(item, index) {
                /* execute before each item filter */
                var dataItem = me._doBeforeEachItem(filters, item);
                /* creates the new node */
                var node = Y.Node.create(Y.Lang.sub(listItemTemplate, dataItem));
                var scopeObject = {
                    containerNode: node,
                    scopeData: scopeData
                };
                /* passes additional information in the data item */
                dataItem._info = {
                    parent: val[2],
                    parentType: DATA_ARRAY,
                    index: index
                };
                scopeObject.scopeData[val[0]] =  dataItem;
                me._compileDirectives(scopeObject);
                el.append(node);
                me._doAfterEachItem(filters, item, node);
            });
            
        }
    }

};