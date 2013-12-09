/**
 * Class that provides fields validation mechanisms that can be easily configured through configuration array
 * with the set of rules per field
 *
 * @class SimpleValidator
 * @namespace Common
 * @extends Base
 * @module gallery-y-common-simple-validator
 * @constructor
 */


Y.namespace('Common');

var VALIDATOR_EMPTY = 'empty';
var VALIDATOR_MIN_TEXT_LIMIT = 'min-text-limit';
var VALIDATOR_TEXT_LIMIT = 'text-limit';
var VALIDATOR_FOLLOW_PATTERN = 'follow-pattern';
var VALIDATOR_CUSTOM = 'custom';

Y.Common.SimpleValidator = Y.Base.create('gallery-y-common-simple-validator', Y.Base, [], {

    initializer: function () {
        var me = this;
        this.addFieldSet(this.get('configuration'));
    },
    
    /**
     * Add validations dynamically, validations added with this method will be only triggered with user events
     * on fields interaction
     * 
     * @method addFieldSet
     * @param Object configuration Object with the validation rules and the container of the fields 
     *
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
     * Iterates over configuration array
     * 
     * @param Y.Node container Fields container
     * @param {Object} configuration Object containing the set of fields validations rules
     * @param {Function} fn Function to apply while iterating each configuration element
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
     * Validates field applying the configured rules 
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
            
            if (!hasErrors && object.type == VALIDATOR_MIN_TEXT_LIMIT && field.get('value').length < object.textLength) {
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

    /**
     * Adds the required class to field wrapper after field validation
     *  
     */
    toggleWrapper: function (wrapper, hasErrors) {
        if (hasErrors) {
            wrapper.removeClass(this.get('passClass'));
            wrapper.addClass(this.get('failClass'));
        } else {
            wrapper.removeClass(this.get('failClass'));
            wrapper.addClass(this.get('passClass'));
        }
    },

    /**
     * Executes fields validation, usually this function can be called directly to know if fields are valid or not based
     * on the rules provided when creating the validation object
     * 
     * @method areFieldsValid
     * @return {Boolean} It returns <code>true</code> when fields are valid or <code>false</code> when not
     *
     */
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
         * Configuration that needs to be provided for the validations, please see further details of this class on
         * regular documentation
         *
         * @attribute configuration
         * @type {Object}
         */
        /**
         * {
         *   container: Y.Node,
         *   rules: [   ....   ]   // set of fields rules
         * }
         */
        configuration: {
            value: null
        },
        
        /**
         * Selector for the error message container for each field
         *
         * @attribute errorNodeSelector
         * @type {String}
         * @default '.err-msg'
         */
        errorNodeSelector: {
            value: '.err-msg'
        },

        
        /**
         * Css class added to the field wrapper after validation success
         *
         * @attribute passClass
         * @type {String}
         * @default 'pass'
         */
        passClass: {
            value: 'pass'
        },

        /**
         * Css class added to the field wrapper after validation fail
         *
         * @attribute failClass
         * @type {String}
         * @default 'fail'
         */
        failClass: {
            value: 'fail'
        }
    }
});