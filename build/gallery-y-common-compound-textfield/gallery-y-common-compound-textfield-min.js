YUI.add("gallery-y-common-compound-textfield",function(e,t){e.namespace("Common"),e.Common.CompoundTextField=e.Base.create("gallery-y-common-compound-textfield",e.Widget,[],{initializer:function(){var e=this.get("srcNode").one(this.get("mainField"));if(e.get("value").length>0){var t=e.get("value");t=t.split(this.get("separator")).join(""),this.set("compoundValue",t);var n=this.get("srcNode").all(this.get("fieldsSelector"));n.each(function(e,n){var r=parseInt(e.getAttribute("maxlength")),i=t.slice(0,r);t=t.substr(r,t.length),e.set("value",i)})}},bindUI:function(){var e=this,t=this.get("srcNode").one(this.get("mainField"));this.get("srcNode").delegate("blur",function(){e.set("compoundValue",e.getCompoundValue()),t.simulate("change")},this.get("fieldsSelector")),this.get("srcNode").delegate("keyup",function(n){e.set("compoundValue",e.getCompoundValue()),t.simulate("change"),e._autoTab(n.currentTarget)},this.get("fieldsSelector")),this.after("compoundValueChange",this.syncUI,this)},syncUI:function(){var e=this.get("srcNode").one(this.get("mainField"));e.set("value",this.get("compoundValue"))},format:function(e,t){var n="";if(e){var r=this.get("srcNode").all(this.get("fieldsSelector"));r.each(function(i,s){var o=parseInt(i.getAttribute("maxlength")),u=e.slice(0,o);e=e.substr(o,e.length),n+=u,n+=s==r.size()-1?"":t})}return n},getCompoundValue:function(){var e=this.get("srcNode").all(this.get("fieldsSelector")),t="";return e.each(function(e,n){t+=e.get("value")}),this.format(t,this.get("separator"))},_autoTab:function(e){var t=e.get("value"),n=this.get("srcNode").all(this.get("fieldsSelector")),r=n.indexOf(e),i=parseInt(e.getAttribute("maxlength"));t.length==i&&n.size()-1>r&&r!=-1&&n.item(r+1).focus()}},{ATTRS:{fieldsSelector:{value:".compound-text-field"},separator:{value:""},mainField:{value:".main-compound-field"},compoundValue:{value:""}}})},"@VERSION@",{requires:["widget","base","node","node-event-simulate"],skinnable:!1});