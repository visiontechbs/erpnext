// Copyright (c) 2017, Frappe Technologies Pvt. Ltd. and contributors
// For license information, please see license.txt
// 2021/06/20 AU VTBS-88 Adding Subscription total amount.
// 2021/09/26 AU VTBS-45 Adding membership Code.

frappe.ui.form.on('Membership', {
	setup: function (frm) {
		frappe.db.get_single_value("Membership Settings", "enable_razorpay").then(val => {
			if (val) frm.set_df_property("razorpay_details_section", "hidden", false);
		})
	},

	// VTBS-45 by +AU 
	member: function (frm) {
		var customer;
		frappe.call({
			method: 'frappe.client.get_value',
			args: {
				doctype: 'Member',
				filters: {
					'name': cur_frm.doc.member,
				},
				fieldname: ['name', 'customer']
			},
			callback: function (data) {
				frm.set_value('department_customer', data.message.customer);
				frm.refresh_field('department_customer');
				customer = data.message.customer
			}
		});
	},

	validate: function (frm) {
// stat of +AU VTBS-45
		var member_id = frm.doc.member;
		var mem_code;
		frappe.call({
			method: 'frappe.client.get_value',
			args: {
				doctype: 'Customer',
				filters: {
					'name': frm.doc.department_customer,
				},
				fieldname: ['customer_code']
			},
			callback: function (data) {
				mem_code = data.message.customer_code + member_id;
				frm.set_value("membership_code", mem_code );
		        frm.refresh_field("membership_code");
			}
		});
// end of +AU VTBS-45
	},

	refresh: function (frm) {

		if (frm.doc.__islocal)
			return;

		!frm.doc.invoice && frm.add_custom_button("Generate Invoice", () => {
			frm.call({
				doc: frm.doc,
				method: "generate_invoice",
				args: { save: true },
				freeze: true,
				freeze_message: __("Creating Membership Invoice"),
				callback: function (r) {
					if (r.invoice)
						frm.reload_doc();
				}
			});
		});

		frappe.db.get_single_value("Membership Settings", "send_email").then(val => {
			if (val) frm.add_custom_button("Send Acknowledgement", () => {
				frm.call("send_acknowlement").then(() => {
					frm.reload_doc();
				});
			});
		})
	},

	onload: function (frm) {
		// frm.add_fetch("membership_type", "amount", "amount"); --AU - VTBS-88 
	}
});


// +AU VTBS-88

frappe.ui.form.on("Contribution List Table", {
	//when exit from the amout feild
	amount: function (frm, cdt, cdn) {
		calculate_subcription_tatoal(frm);
	},

	// when delete a row
	contribution_list_table_remove: function (frm) {
		calculate_subcription_tatoal(frm);
	}
});

function calculate_subcription_tatoal(frm){
	var amount_list = frm.doc.contribution_list_table;
	var total = 0;

	for (var i in amount_list) {
		if (amount_list[i].amount) {
			total = total + amount_list[i].amount;
		}
	}
	frm.set_value("amount", total);
}
// END OF +AU VTBS-88