 Y.CommonRadios = Y.Base.create('gallery-y-common-radios', Y.Base, [], {
     
     initializer: function () {
         var me = this;
         Y.all(this.get('radioFieldSelector')).each(function (node, index) {
             me.bindRadio(node);
         });
     },

     bindRadio: function (node) {
         var me = this;
         /* init */
         node.all(this.get('radioInputSelector')).each(function (node) {
             var parent = node.get('parentNode');
             if (!parent.hasClass(me.get('radioSelector'))) {
                 parent.addClass(me.get('radioSelector'));
                 var checkedClass = node.get('checked') ? ' checked' : '';
                 parent.prepend(Y.Lang.sub(me.get('maskHtml'), {
                     checked: checkedClass
                 }));
             }
         });
         
         /* binds events */
         node.delegate('click', function (e) {
             node.all(me.get('maskSelector')).removeClass('checked');
             var parent = e.currentTarget.get('parentNode');
             parent.one(me.get('maskSelector')).addClass('checked');
         }, this.get('radioInputSelector'));
         
         /* listen refresh */
         this.on('refresh', function () {
             node.all('input').each(function (radio) {
                 var checked = radio.get('checked');
                 var parent = radio.get('parentNode');
                 if (!checked) {
                     parent.one(me.get('maskSelector')).removeClass('checked');
                 } else {
                     parent.one(me.get('maskSelector')).addClass('checked');
                 }
             });
         });
     }


 }, {
     ATTRS: {
         radioFieldSelector: {
             value: '.custom-radio-buttons'
         },

         maskSelector: {
             value: '.radio-mask'
         },

         radioSelector: {
             value: 'radio'
         },

         radioInputSelector: {
             value: 'input[type="radio"]'
         },

         maskHtml: {
             value: '<span class="radio-mask {checked}"></span>'
         }
     }
 });