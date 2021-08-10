// Copyright (c) 2021, Frappe Technologies Pvt. Ltd. and contributors
// For license information, please see license.txt

frappe.ui.form.on('Member New', {
	 refresh: function(frm) {
		 console.log(frm);
		 
	 },

	 after_save: function (frm) {
		frappe.call({
			method: "erpnext.non_profit.doctype.member_new.member_new.list_name"	,
			callback: function (data) {
				console.log(data);
				alert("Succesfully updated Contact " + data);				
			}
					
		})
		
	 },
	 onload: function (frm){
		 
	 }
});
