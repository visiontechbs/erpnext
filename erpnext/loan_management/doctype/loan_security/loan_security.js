// Copyright (c) 2019, Frappe Technologies Pvt. Ltd. and contributors
// For license information, please see license.txt

frappe.ui.form.on('Loan Security', {
	// refresh: function(frm) {

	// }
});


frappe.ui.form.on('Loan Guarantor Details', {

	loan_guarantor:function(frm,cdn,cdt){
		var data = locals[cdt][cdn];
		// var row_count = data.reimbursement_table.length;
		var row_index = $(data.loan_guarantor_details).parent().index();
		console.log(row_index);
	}
});