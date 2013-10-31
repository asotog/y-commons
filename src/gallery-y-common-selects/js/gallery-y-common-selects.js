Y.CommonSelects = Y.Base.create('gallery-y-common-selects', Y.Base, [], {
        initializer: function () {
            this.syncUIComponents();
        },
        
        syncUIComponents: function() {
            var me = this;
            Y.all(this.get('selectFieldSelector')).each(function (node, index) {
                var parent = node.get('parentNode');
                if (!parent.hasClass(me.get('containerClass'))) {
                    parent.addClass(me.get('containerClass'));
                    parent.prepend(me.get('maskHtml'));
                    me.bindSelect(parent);
                }
            });
        },
        
        bindSelect: function(node) {
            var me = this;
            var select = node.one('select');
            var mask = node.one(this.get('maskSelector'));
            mask.set('text', me.getOptionText(select));
            this.on('refresh', function() {
                mask.set('text', me.getOptionText(select));
            });
            select.on('change', function(e) {
                var optionText = me.getOptionText(select);
                mask.set('text', optionText);
            });
        },
        
        getOptionText: function(node) {
            var checkedOpt = node.one('option:checked');
            var text = '';
            if (checkedOpt) {
                text = checkedOpt.get('text');
            }
            return text;
        }
        
        
    }, {
        ATTRS: {
            selectFieldSelector: {
                value: 'select'
            },
            
            containerClass: {
                value: 'custom-select'
            },
            
            maskSelector: {
                value: '.custom-select-mask'
            },
            
            maskHtml: {
                value: '<span class="custom-select-mask"></span>'
            }
        }
    });