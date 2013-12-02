YUI.add('gallery-y-common-simple-validator', function (Y, NAME) {

Y.namespace('Common');

var VALIDATOR_EMPTY = 'empty';
var VALIDATOR_TEXT_LIMIT = 'text-limit';
var VALIDATOR_FOLLOW_PATTERN = 'follow-pattern';
var VALIDATOR_CUSTOM = 'custom';

Y.Common.SimpleValidator = Y.Base.create('gallery-y-common-simple-validator', Y.Base, [], {

    initializer: function () {
        var me = this;
        this.addFieldSet(this.get('configuration'));
    },

    /**
     * Add validation dynamically
     * 
     * @param Object configuration Object with the validation rules and the container of the fields 
     */
    addFieldSet: function (configuration) {
        var me = this;
        var ctner = configuration.container;
        this.iterateConfig(ctner, configuration, function (validationType, node, field) {
            /* fix for radio button event delegation bug */
            if (field.get('type') == 'radio') {
                node.all('input[type="radio"]').each(function (radio) {
                    radio.on('change', function (e) {
                        me.validate(radio, node, validationType);
                    });
                });
            } else {
                field.on('change', function (e) {
                    me.validate(field, node, validationType);
                });
                field.on('blur', function (e) {
                    me.validate(field, node, validationType);
                });
            }
        });
    },

    /**
     * fn : function to apply while iterating each configuration element
     * 
     */
    iterateConfig: function (container, configuration, fn) {
        Y.Array.each(configuration.rules, function (element) {
            var validationType = element.type;
            var node = container.one(element.node);
            var field = (element.field) ? node.one(element.field) : node.one('input');
            fn(validationType, node, field);
        });
    },

    /**
     * Validates field apply the configured rules 
     *
     */
    validate: function (field, wrapper, validationType) {
        var me = this;
        var errorNode = wrapper.one(me.get('errorNodeSelector'));
        errorNode.empty();
        var hasErrors = false;
        Y.Array.each(validationType, function (object) {

            if (object.type == VALIDATOR_EMPTY && field.get('value').length <= 0) {
                errorNode.append(object.message);
                hasErrors = true;
            }

            if (object.type == VALIDATOR_EMPTY && (field.get('type') == 'radio' || field.get('type') == 'checkbox') && !field.get('checked')) {
                errorNode.append(object.message);
                hasErrors = true;
            }

            if (!hasErrors && object.type == VALIDATOR_TEXT_LIMIT && field.get('value').length > object.textLength) {
                errorNode.append(object.message);
                hasErrors = true;
            }

            if (!hasErrors && object.type == VALIDATOR_FOLLOW_PATTERN && !(field.get('value').search(object.regexPattern) != -1)) {
                errorNode.append(object.message);
                hasErrors = true;
            }

            if (!hasErrors && object.type == VALIDATOR_CUSTOM && typeof object.isValidFn == 'function') {
                if (!object.isValidFn(field.get('value'))) {
                    errorNode.append(object.message);
                    hasErrors = true;
                }
            }

        });
        this.toggleWrapper(wrapper, hasErrors);
        return !hasErrors;
    },

    toggleWrapper: function (wrapper, hasErrors) {
        if (hasErrors) {
            wrapper.removeClass(this.get('passClass'));
            wrapper.addClass(this.get('failClass'));
        } else {
            wrapper.removeClass(this.get('failClass'));
            wrapper.addClass(this.get('passClass'));
        }
    },

    areFieldsValid: function () {
        var me = this;
        var fieldsValid = true;
        var ctner = this.get('configuration').container;
        this.iterateConfig(ctner, this.get('configuration'), function (validationType, node, field) {
            var fieldValid = true;
            if (field.get('type') == 'radio') {
                var radioChecked = node.one('input[type="radio"]:checked');
                var radio = (radioChecked) ? radioChecked : node.one('input[type="radio"]');
                fieldValid = me.validate(radio, node, validationType);
            } else {
                fieldValid = me.validate(field, node, validationType);
            }
            fieldsValid = fieldValid ? fieldsValid : false;
        });
        return fieldsValid;
    },

    destructor: function () {

    }
}, {
    ATTRS: {


        /**
         * {
         *   container: Y.Node,
         *   rules: [   ....   ]   // set of fields rules
         * }
         */
        configuration: {
            value: null
        },

        errorNodeSelector: {
            value: '.err-msg'
        },

        passClass: {
            value: 'pass'
        },

        failClass: {
            value: 'fail'
        }
    }
});

}, '@VERSION@', {"requires": ["yui-base", "base-build", "node"]});
