YUI.add('gallery-y-common-dom-fields-model', function (Y, NAME) {

Y.namespace('Common');

Y.Common.DomFieldsModel = Y.Base.create('gallery-y-common-dom-fields-model', Y.Base, [], {

    initializer: function () {
        var me = this;
    },

    /**
     * Saves fields data into model
     *
     */
    save: function () {
        if (this.get('configuration')) {
            this._saveUsingConfiguration();
        } else {
            this._save();
        }
    },

    _save: function () {
        var model = [];
        this.get('container').all(this.get('formFieldsSelector')).each(function (node) {
            var m = {};
            m['node'] = node;
            if (node.get('type') == Y.Common.DomFieldsModel.statics.RADIO || node.get('type') == Y.Common.DomFieldsModel.statics.CHECK) {
                m['value'] = node.get('checked');
            } else {
                m['value'] = node.get('value');
            }
            model.push(m);
        });
        this.set('model', model);
    },

    /**
     * Using passed configuration object
     * 
     */
    _saveUsingConfiguration: function () {
        var me = this;
        var model = {};
        Y.Array.each(this.get('configuration'), function (config) {
            if (config.type == Y.Common.DomFieldsModel.LIST) {
                model = me._saveList(config, model);
            } else {
                model[config.name] = me._retrieveFieldVal(me.get('container').one(me._getFieldSelector(config)), config);
            }
        });
        this.set('model', model);
    },

    /**
     * Loads data into fields
     *
     */
    load: function () {
        if (this.get('model')) {
            if (this.get('configuration')) {
                this._loadUsingConfiguration();
            } else {
                this._load();
            }
        }
    },

    /**
     * Load all the fields as it
     * 
     */
    _load: function () {
        Y.Array.each(this.get('model'), function (element) {
            if (element.node.get('type') == Y.Common.DomFieldsModel.statics.RADIO) {
                if (element.value) {
                    element.node.simulate('click');
                } else {
                    element.node.simulate('change');
                    return;
                }
            } else if (element.node.get('type') == Y.Common.DomFieldsModel.statics.CHECK) {
                element.node.set('checked', element.value);
            } else {
                element.node.set('value', element.value);
            }
            element.node.simulate('change');
        });
    },

    /**
     * Load the fields using configuration
     * 
     */
    _loadUsingConfiguration: function () {
        var me = this;
        Y.Array.each(this.get('configuration'), function (config) {
            if (config.type == Y.Common.DomFieldsModel.STATIC) {
                /* nothing to do here */
            } else if (config.type == Y.Common.DomFieldsModel.LIST) {

            } else {
                me._loadField(me.get('model')[config.name], config, me.get('container'));
            }
        });
    },

    /**
     * 
     */
    _loadField: function (value, config, container) {
        if (config.type == Y.Common.DomFieldsModel.RADIO) {

        } else {
            container.one(config.fieldSelector).set('value', value);
        }
    },

    /**
     * Saves the repeatable elements into a list
     *
     */
    _saveList: function (listConfig, model) {
        var me = this;
        model[listConfig.name] = [];
        this.get('container').all(listConfig.container).each(function (node) {
            var listItem = {};
            Y.Array.each(listConfig.fields, function (config) {
                listItem[config.name] = me._retrieveFieldVal(node.one(me._getFieldSelector(config)), config);
            });
            model[listConfig.name].push(listItem);
        });
        return model;
    },

    /**
     * 
     * 
     */
    _retrieveFieldVal: function (field, config) {
        var valueKey = (config.type == Y.Common.DomFieldsModel.STATIC) ? 'innerHTML' : 'value';
        var value = field ? field.get(valueKey) : null;
        return (Y.Lang.trim(value) == '') ? null : value;
    },

    /**
     * 
     */
    _getFieldSelector: function (config) {
        return (config.type == Y.Common.DomFieldsModel.RADIO) ? (config.fieldSelector + ':checked') : config.fieldSelector;
    },
    
    /**
     * Converts list of model fields into object, key are going to be fields names, for model using configuration, keys are going to be using
     * the defined one in configuration
     * 
     */
    retrieveModel: function() {
        if (this.get('configuration')) {
            return this.get('model');
        } else {
            var processedModel = {};
            var model = this.get('model');
            for (var i = 0; i < model.length; i++) {
                var field = model[i].node;
                var fieldName = field.get('name');
                if (field.get('type') == Y.Common.DomFieldsModel.statics.CHECK) {
                    processedModel[fieldName] = field.get('checked');
                } else if (field.get('type') == Y.Common.DomFieldsModel.statics.RADIO) {
                    processedModel[fieldName] = (field.get('checked') ? field.get('value') : (processedModel[fieldName] ? processedModel[fieldName] : null));
                } else {
                    processedModel[fieldName] = field.get('value');
                }
                
            }
            return processedModel;
        }
        
    },
    
    destructor: function () {

    }
}, {
    ATTRS: {

        /**
         * Container of the fields
         *
         * @type Y.Node
         *
         */
        container: {
            value: null
        },

        /**
         * Fields mapping configuration
         *
         * @comment This is a sample, type can be list, static, or radio
         * 
         * 
         * 
         */
        /*[{
                fieldSelector: '.selector',
                name: 'birthdate'
            }, {
                type: 'list',
                 repeatable section 
                container: '.repeatable-item-wrapper',
                name: 'dependents',
                fields: [{
                    fieldSelector: '.selector',
                    name: 'zipcode'
                }]
            }]*/

        configuration: {
            value: null
        },

        /**
         * Model that is going to be populated or used to load fields
         *
         * @type Object
         *
         */
        model: {
            value: null
        },

        formFieldsSelector: {
            value: 'input[type="text"],input[type="hidden"],input[type="radio"],input[type="checkbox"],select'
        }
    }
});

Y.Common.DomFieldsModel.statics = {
    LIST: 'list',
    STATIC: 'static',
    RADIO: 'radio',
    CHECK: 'checkbox'
};

}, '@VERSION@', {"requires": ["yui-base", "base-build", "node", "node-event-simulate"]});
