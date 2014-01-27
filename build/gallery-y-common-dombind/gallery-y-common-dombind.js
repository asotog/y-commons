YUI.add('gallery-y-common-dombind', function (Y, NAME) {


Y.namespace('Common');

var ATTRIBUTE_SELECTOR = '[{attributeName}]';
var LOOP_DATA_FILTER = '|';
var FILTER = ':';
var COMMA_SEPARATOR = ',';

var DATA_BIND_CHANGE_EVENT = 'data-{property}-changed';
var DATA_IS_BINDED = '-isbinded';
var LOG_PREFIX = '[Y.Common.DomBind] ';
var FIELD_TYPES = {
    'checkbox': 0,
    'radio': 1
};
var DATA_ARRAY = 'Array';
var SCOPE_VAR_TEMPLATE = 'var {scopeVarName} = scopeData["{scopeVarName}"];';

Y.Common.DomBind = Y.Base.create('y-common-dombind', Y.Base, [], {

    /**
     * Initializer
     */
    initializer: function () {
        this._init();
    },
    
    /**
     * 
     * Sets the current bind data and triggers events to refresh the ui elements related
     * 
     * @param {String} key The data key, often used in the html to define which data will be bind
     * @param {String} value New value that is going to be set in the data
     * @param {Object} scopeData Scope object and additional info, used in cases like, to set list elements when they are bind
     *  
     */ 
    setData: function (key, value, scopeData) {
        this._setData(key, value, scopeData);
        var uniqueKey = this._generateUniqueKey(key, scopeData);
        this.fire(Y.Lang.sub(DATA_BIND_CHANGE_EVENT, {property: uniqueKey}), {newValue: value});
    },
    
    /**
     * Listens specific data item changes by passing the given key
     * 
     */ 
    listen: function(key, callback) {
        this.on(Y.Lang.sub(DATA_BIND_CHANGE_EVENT, { property: key}), function (data) {
            callback(data);
        });
    },

    _init: function () {
        var me = this;
        this.after('dataChange', function () {
            me._processDirectives({});
        });
    },
    
    /**
     * 
     * Iterates over the available list of directives to start looking one by one
     * 
     * @param {Object} scopeObject Scope unit of data and dom information basically contains the following structure 
     *                 <code>{ scopeData: Object, containerNode: Y.Node }</code>
     * 
     */ 
    _processDirectives: function (scopeObject) {
        for (var directive in Y.Common.DomBind.Directives) {
            if (Y.Common.DomBind.Directives.hasOwnProperty(directive)) {
                var directiveCfg = Y.Common.DomBind.Directives[directive];
                this._executeDirective(scopeObject, directive, directiveCfg);
            }
        }
    },
    
    /**
     * Looks for specific directive in the dom and executes it
     */ 
    _executeDirective: function (scopeObject, directiveName, config) {
        var me = this;
        var c = (scopeObject && scopeObject.containerNode) ? scopeObject.containerNode : this.get('container');
        var scopeData = (scopeObject && scopeObject.scopeData) ? scopeObject.scopeData : {};
        var elements = c.all(Y.Lang.sub(ATTRIBUTE_SELECTOR, {
            attributeName: this.get('dataPrefix') + directiveName
        }));
        var directiveExecFn = Y.bind(config.directiveExecFn, this);
        elements.each(function (el) {
            Y.clone(directiveExecFn)(directiveName, el, scopeData);
        });
    },
    
    
    /**
     * Retrieves the list of filters to be applied to the list directive iteration
     */ 
    _tokenizeFilters: function (filters) {
        var tokenizedFilters = [];
        for (var i = 0; i < filters.length; i++) {
            var filter = filters[i].split(FILTER);
            tokenizedFilters.push({
                name: filter[0],
                executeFn: filter[1]
            });
        }
        return tokenizedFilters;
    },

    /**
     * Applies filters that are going to be executed before each item
     */ 
    _doBeforeEachDataItem: function (filters, dataItem) {
        for (var i = 0; i < filters.length; i++) {
            if (filters[i].name == 'onBeforeEach') {
                var filterFunction = this.get('filters')[filters[i].executeFn];
                dataItem = filterFunction(dataItem);
            }
        }
        return dataItem;
    },

    /**
     * 
     * Sets the element value, takes care of the type of the element if its a form element sets its value if not, it sets the
     * inner html
     * 
     * @param {Y.Node} el Element to be updated
     * @param {String} value New element value
     * 
     */
    _setElementValue: function (el, value) {
        if (el.get('localName') == 'input' || el.get('localName') == 'textarea' || el.get('localName') == 'select') {
            var fieldType = (typeof FIELD_TYPES[el.get('type')] == 'number') ? FIELD_TYPES[el.get('type')] : el.get('type');
            switch (fieldType) {
            case FIELD_TYPES['checkbox']:
                el.set('checked', value);
                break;
            case FIELD_TYPES['radio']:
                el.set('checked', (el.get('value') == value));
                break;
            default:
                el.set('value', value);
            }
        } else {
            el.set('innerHTML', value);
        }
    },

    /**
     * Gets form element value
     * 
     */
    _getElementValue: function (el) {
        if (el.get('localName') == 'input' || el.get('localName') == 'textarea' || el.get('localName') == 'select') {
            var fieldType = (typeof FIELD_TYPES[el.get('type')] == 'number') ? FIELD_TYPES[el.get('type')] : el.get('type');
            switch (fieldType) {
                case FIELD_TYPES['checkbox']:
                    return el.get('checked');
            }
            return el.get('value');
        }
        return null;
    },
    
    /**
     * 
     * Will generate javascript code as a string so then can be executed by eval function, will generated scope vars 
     * so inline functions called from directives from the html can use any variable placed in the scope
     * 
     * @param {Object} scopeData Any scope data for example such as an item from a list iteration
     * 
     */ 
    _generateScopeVarsCode: function(scopeData) {
        var varsString = '';
        for (var scopeVarName in scopeData) {
            if (scopeData.hasOwnProperty(scopeVarName)) {
                varsString += Y.Lang.sub(SCOPE_VAR_TEMPLATE, {scopeVarName: scopeVarName});
            }
        }
        return varsString;
    },
    
    /**
     * Data key should be unique representing the data in the main data object
     *
     * 
     */ 
    _generateUniqueKey: function(bindKey, scopeData) {
        var tokenizedKeys = bindKey.split('.');
        if (tokenizedKeys.length > 1 && typeof scopeData[tokenizedKeys[0]] != 'undefined') {
            var scopeItem = scopeData[tokenizedKeys[0]];
            bindKey = ((scopeItem._info && scopeItem._info.parentType == DATA_ARRAY) ? (scopeItem._info.parent + '.' + scopeItem._info.index) : '') + bindKey;
        } 
        return bindKey;
    },
    
    /**
     * Sets data directly in the main data object
     * 
     */ 
    _setData: function(bindKey, value, scopeData) {
        var tokenizedKeys = bindKey.split('.');
        // look first at the dynamic scope created for example loop scope
        if (tokenizedKeys.length > 1 && typeof scopeData[tokenizedKeys[0]] != 'undefined') {
            var scopeItem = scopeData[tokenizedKeys[0]];
            if (scopeItem && scopeItem._info && scopeItem._info.parentType == DATA_ARRAY) {
                tokenizedKeys.shift();
                var arrayItem = this.get('data')[scopeItem._info.parent][scopeItem._info.index];
                eval(this._generateObjectPropsAccessCode(tokenizedKeys, arrayItem));
                return;
            }
        }
        // look at main data object scope
        if (tokenizedKeys.length > 1 && typeof this.get('data')[tokenizedKeys[0]] != 'undefined') {
            var scopeItem = scopeData[tokenizedKeys[0]];
            //bindKey = ((scopeItem._info && scopeItem._info.parentType == DATA_ARRAY) ? scopeItem._info.index : '') + bindKey;
            return;
        } 
        // single key data setting
        this.get('data')[bindKey] = value;
    },
    
    /**
     * Retrieves data values using dot notation e.g person.name
     * 
     */ 
    _getData: function(bindKey, scopeData) {
        var tokenizedKeys = bindKey.split('.');
        if (tokenizedKeys.length > 1 && typeof scopeData[tokenizedKeys[0]] != 'undefined') {
            var property = scopeData;
            for (var i = 0; i < tokenizedKeys.length; i++) {
                property = property[tokenizedKeys[i]];
            }
            return property;
        }
        return this.get('data')[bindKey];
    },
    
    /**
     * Generates code to set specific array items by going inside the object
     * 
     */ 
    _generateObjectPropsAccessCode: function(tokenizedProperties, baseObject) {
        var code = 'this.get("data")[scopeItem._info.parent][scopeItem._info.index]';
        Y.Array.each(tokenizedProperties, function(item) {
            code += Y.Lang.sub('["{property}"]', {property: item});
        });
        return (code + ' = value');
    }

}, {
    ATTRS: {
        /**
         * Main container
         * @type Y.Node
         */ 
        container: {
            value: null
        },
        
        /**
         * Data that will be bind
         * 
         */ 
        data: {
            value: null
        },
        /**
         * controller methods
         */ 
        controller: {
            value: {}
        },
        
        /**
         * list of filter methods 
         * 
         */ 
        filters: {
            value: {}
        },
        // TODO: better use a map of templates to easily use multiple templates
        iterableTemplate: {
            value: ''
        },
        
        /**
         * prefix to be used in the directives
         */ 
        dataPrefix: {
            value: 'data-db'
        }
    }
});

Y.Common.DomBind.Directives = {

    '-bind': {
        directiveExecFn: function (directiveName, el, scopeData) {
            var val = el.getAttribute(this.get('dataPrefix') + directiveName);
            var scope = Y.clone(scopeData);
            /* check if element was already bind */
            if (typeof el.getData(this.get('dataPrefix') + DATA_IS_BINDED) == 'undefined') {
                var me = this;
                /* if element bind is inside of an array as an array item, it'll add the index as part of the key */
               
                var uniqueKey = this._generateUniqueKey(val, scopeData);
                /* listen field changes  */
                el.on(['keyup', 'change'], function () {
                    /* TODO: avoid re-set value if value does not change, for example after pressing select all text shortcuts */
                    me.setData(val, me._getElementValue(el), scope);
                });
                /* listen the data changes by using custom event */
                this.listen(uniqueKey, function(data) {
                    me._setElementValue(el, data.newValue);
                });
                
                /* sets initial flag to avoid add multiple events to the same element */
                el.setData(this.get('dataPrefix') + DATA_IS_BINDED, true)
            }
            /* inializes with the current data */
            this.setData(val, this._getData(val, scopeData), scope);
        }
    },

    '-onclick': {
        directiveExecFn: function (directiveName, el, scopeData) {
            var me = this;
            var val = el.getAttribute(this.get('dataPrefix') + directiveName);
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
            var me = this;
            var data = this.get('data');
            var val = el.getAttribute(this.get('dataPrefix') + directiveName);
            /* separates list iteration from list filters*/
            val = val.split(LOOP_DATA_FILTER);
            var filters = (val.length > 1) ? this._tokenizeFilters(val[1].split(COMMA_SEPARATOR)) : [];
            /* retrieve list iteration */
            val = val[0];
            /* tokenize the list iteration by item looped and list e.g "item in itemList" will be tokenized into ['item', 'in', 'itemList'] */
            val = val.match(/[^ ]+/g);
            var dataList = (data[val[2]] && data[val[2]].length > 0) ? data[val[2]] : [];
            Y.Array.each(dataList, function(item, index) {
                /* execute before each item filter */
                var dataItem = me._doBeforeEachDataItem(filters, item);
                /* creates the new node */
                var node = Y.Node.create(Y.Lang.sub(me.get('iterableTemplate'), dataItem));
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
                me._processDirectives(scopeObject);
                el.append(node);
                /* TODO: after node is ready call AfterEachDataItem filters or like it */
            
            });
            
        }
    }

};

}, '@VERSION@', {"requires": ["yui-base", "base-build", "node"]});
