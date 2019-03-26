/*
@license
dhtmlxScheduler v.4.3.25 Professional Evaluation

This software is covered by DHTMLX Evaluation License. Contact sales@dhtmlx.com to get Commercial or Enterprise license. Usage without proper license is prohibited.

(c) Dinamenta, UAB.
*/
Scheduler.plugin(function(e){e.attachEvent("onTemplatesReady",function(){var t,a=new dhtmlDragAndDropObject,n=a.stopDrag;a.stopDrag=function(e){return t=e||event,n.apply(this,arguments)},a.addDragLanding(e._els.dhx_cal_data[0],{_drag:function(a,n,i,r){if(!e.checkEvent("onBeforeExternalDragIn")||e.callEvent("onBeforeExternalDragIn",[a,n,i,r,t])){var s=e.attachEvent("onEventCreated",function(n){e.callEvent("onExternalDragIn",[n,a,t])||(this._drag_mode=this._drag_id=null,this.deleteEvent(n))}),d=e.getActionData(t),_={
start_date:new Date(d.date)};if(e.matrix&&e.matrix[e._mode]){var o=e.matrix[e._mode];_[o.y_property]=d.section;var l=e._locate_cell_timeline(t);_.start_date=o._trace_x[l.x],_.end_date=e.date.add(_.start_date,o.x_step,o.x_unit)}e._props&&e._props[e._mode]&&(_[e._props[e._mode].map_to]=d.section),e.addEventNow(_),e.detachEvent(s)}},_dragIn:function(e,t){return e},_dragOut:function(e){return this}})})});