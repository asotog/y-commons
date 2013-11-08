YUI.add('gallery-y-common-compound-textfield', function (Y, NAME) {

/**
 * This module is a widget that syncs multiple fields into one field usually a hidden field to store a compound value
 * for example a social security number or phone number where usually needs like 3 different fields
 *
 * @class CompoundTextField
 * @namespace Common
 * @extends Widget
 * @module gallery-y-common-compound-textfield
 * @constructor
 */

Y.namespace('Common');

Y.Common.CompoundTextField = Y.Base.create('gallery-y-common-compound-textfield', Y.Widget, [], {

    initializer: function () {
        var mainField = this.get('srcNode').one(this.get('mainField'));
        if (mainField.get('value').length > 0) {
            var value = mainField.get('value');
            /* removes separator of main field */
            value = value.split(this.get('separator')).join('');
            this.set('compoundValue', value);
            var inputs = this.get('srcNode').all(this.get('fieldsSelector'));
            inputs.each(function (node, index) {
                var length = parseInt(node.getAttribute('maxlength'));
                var part = value.slice(0, length);
                value = value.substr(length, value.length);
                node.set('value', part);
            });
        }
    },

    bindUI: function () {
        var me = this;
        var mainField = this.get('srcNode').one(this.get('mainField'));

        this.get('srcNode').delegate('blur', function () {
            me.set('compoundValue', me.getCompoundValue());
            mainField.simulate('change');
        }, this.get('fieldsSelector'));

        this.get('srcNode').delegate('keyup', function (e) {
            me._autoTab(e.currentTarget);
        }, this.get('fieldsSelector'));

        this.after('compoundValueChange', this.syncUI, this);
    },

    syncUI: function () {
        var mainField = this.get('srcNode').one(this.get('mainField'));
        mainField.set('value', this.get('compoundValue'));
    },

    /**
     * Format string based on the configured compound text field but using a separator char
     * 
     * @param {String} text Text to be formatted
     * @param {String } separator Char that is going to be used as separator e.g: -, _, ...
     * 
     * @method format
     * @return {String} Formatted string
     */
    format: function (text, separator) {
        var formatted = '';
        if (text) {
            var inputs = this.get('srcNode').all(this.get('fieldsSelector'));
            inputs.each(function (node, index) {
                var length = parseInt(node.getAttribute('maxlength'));
                var part = text.slice(0, length);
                text = text.substr(length, text.length);
                formatted += part;
                formatted += (index == (inputs.size() - 1)) ? '' : separator;
            });
        }
        return formatted;
    },

    /**
     * Gets based on the compounds fields the main field compound value
     * 
     * @method getCompoundValue
     * @return {String} Compound value
     */
    getCompoundValue: function () {
        var inputs = this.get('srcNode').all(this.get('fieldsSelector'));
        var compound = '';
        inputs.each(function (node, index) {
            compound += node.get('value');
        });
        return this.format(compound, this.get('separator'));
    },

    _autoTab: function (field) {
        var value = field.get('value');
        var allFields = this.get('srcNode').all(this.get('fieldsSelector'));
        var indexOfField = allFields.indexOf(field);
        var length = parseInt(field.getAttribute('maxlength'));
        if (value.length == length && (allFields.size() - 1) > indexOfField && indexOfField != -1) {
            allFields.item(indexOfField + 1).focus();
        };
    }

}, {
    ATTRS: {
        
        /**
         * Compounds fields selector
         *
         * @attribute fieldsSelector
         * @type String
         * @default '.compound-text-field'
         */
        fieldsSelector: {
            value: '.compound-text-field'
        },

        /**
         * Compound value separator, usual value is '-' as separator, to make hidden field contain compound values such as
         * <code>901-234-678</code>
         *
         * @attribute separator
         * @type String
         * @default ''
         */
        separator: {
            value: ''
        },

        /**
         * Main field selector, this field will contain the compound value
         *
         * @attribute mainField
         * @type String
         * @default '.main-compound-field'
         */
        mainField: {
            value: '.main-compound-field'
        },

        /**
         * Compound value
         *
         * @attribute compoundValue
         * @type String
         */
        compoundValue: {
            value: ''
        }
    }
});

}, '@VERSION@', {"requires": ["widget", "base", "node", "node-event-simulate"], "skinnable": false});
