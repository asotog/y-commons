YUI.add("gallery-y-common-dom-fields-model",function(e,t){e.namespace("Common"),e.Common.DomFieldsModel=e.Base.create("gallery-y-common-dom-fields-model",e.Base,[],{initializer:function(){var e=this},save:function(){this.get("configuration")?this._saveUsingConfiguration():this._save()},_save:function(){var t=[];this.get("container").all(this.get("formFieldsSelector")).each(function(n){var r={};r.node=n,n.get("type")==e.Common.DomFieldsModel.statics.RADIO||n.get("type")==e.Common.DomFieldsModel.statics.CHECK?r.value=n.get("checked"):r.value=n.get("value"),t.push(r)}),this.set("model",t)},_saveUsingConfiguration:function(){var t=this,n={};e.Array.each(this.get("configuration"),function(r){r.type==e.Common.DomFieldsModel.LIST?n=t._saveList(r,n):n[r.name]=t._retrieveFieldVal(t.get("container").one(t._getFieldSelector(r)),r)}),this.set("model",n)},load:function(){this.get("model")&&(this.get("configuration")?this._loadUsingConfiguration():this._load())},_load:function(){e.Array.each(this.get("model"),function(t){if(t.node.get("type")==e.Common.DomFieldsModel.statics.RADIO){if(!t.value){t.node.simulate("change");return}t.node.simulate("click")}else t.node.get("type")==e.Common.DomFieldsModel.statics.CHECK?t.node.set("checked",t.value):t.node.set("value",t.value);t.node.simulate("change")})},_loadUsingConfiguration:function(){var t=this;e.Array.each(this.get("configuration"),function(n){n.type!=e.Common.DomFieldsModel.STATIC&&n.type!=e.Common.DomFieldsModel.LIST&&t._loadField(t.get("model")[n.name],n,t.get("container"))})},_loadField:function(t,n,r){n.type!=e.Common.DomFieldsModel.RADIO&&r.one(n.fieldSelector).set("value",t)},_saveList:function(t,n){var r=this;return n[t.name]=[],this.get("container").all(t.container).each(function(i){var s={};e.Array.each(t.fields,function(e){s[e.name]=r._retrieveFieldVal(i.one(r._getFieldSelector(e)),e)}),n[t.name].push(s)}),n},_retrieveFieldVal:function(t,n){var r=n.type==e.Common.DomFieldsModel.STATIC?"innerHTML":"value",i=t?t.get(r):null;return e.Lang.trim(i)==""?null:i},_getFieldSelector:function(t){return t.type==e.Common.DomFieldsModel.RADIO?t.fieldSelector+":checked":t.fieldSelector},retrieveModel:function(){if(this.get("configuration"))return this.get("model");var t={},n=this.get("model");for(var r=0;r<n.length;r++){var i=n[r].node,s=i.get("name");i.get("type")==e.Common.DomFieldsModel.statics.CHECK?t[s]=i.get("checked"):i.get("type")==e.Common.DomFieldsModel.statics.RADIO?t[s]=i.get("checked")?i.get("value"):t[s]?t[s]:null:t[s]=i.get("value")}return t},destructor:function(){}},{ATTRS:{container:{value:null},configuration:{value:null},model:{value:null},formFieldsSelector:{value:'input[type="text"],input[type="hidden"],input[type="radio"],input[type="checkbox"],select'}}}),e.Common.DomFieldsModel.statics={LIST:"list",STATIC:"static",RADIO:"radio",CHECK:"checkbox"}},"@VERSION@",{requires:["yui-base","base-build","node","node-event-simulate"]});
