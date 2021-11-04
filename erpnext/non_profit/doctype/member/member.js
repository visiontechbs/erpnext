// Copyright (c) 2017, Frappe Technologies Pvt. Ltd. and contributors
// For license information, please see license.txt

frappe.ui.form.on('Member', {

	setup: function (frm) {
		frappe.db.get_single_value("Membership Settings", "enable_razorpay").then(val => {
			if (val && (frm.doc.subscription_id || frm.doc.customer_id)) {
				frm.set_df_property('razorpay_details_section', 'hidden', false);
			}
		})
	},
//+AU - VTBS-48
	after_save: function (frm) {
		frappe.call({
			args: {
				"member_id": frm.doc.name,
				"customer": frm.doc.customer
			},
			method: "erpnext.non_profit.doctype.member.member.update_member_department"
			// callback: function (r) {
			// 	if (r.message)
			// 		var doc = frappe.model.sync(r.message)[0];
			// 	frappe.set_route("Form", doc.doctype, doc.name);
			// }
		});
		frappe.call({
			method: 'frappe.client.get_value',
			args: {
				doctype: 'Contact',
				filters: {
					'nic': frm.doc.emp_nic,
				},
				fieldname: ['name', 'linked_with']
			},
			callback: function (data) {
				console.log(data);
				if (data.message && Object.keys(data.message).length !== 0) {
					console.log("2");
					if (data.message.linked_with == null) {
						console.log("3");
						frappe.call({
							"method": "frappe.client.set_value",
							"args": {
								"doctype": "Contact",
								"name": data.message.name,
								"fieldname": "linked_with",
								"value": frm.doc.name
							}
						});

						alert("Succesfully updated Contact " + data.message.name + " which referencce to " + frm.doc.emp_nic);
					}
				}
			}
		});
	},//End of +AU - VTBS-48

	

	refresh: function (frm) {


		frappe.dynamic_link = { doc: frm.doc, fieldname: 'name', doctype: 'Member' };

		frm.toggle_display(['address_html', 'contact_html'], !frm.doc.__islocal);

		
		if (!frm.doc.__islocal) {
			frappe.contacts.render_address_and_contact(frm);

			// custom buttons
			frm.add_custom_button(__('Accounting Ledger'), function () {
				frappe.set_route('query-report', 'General Ledger',
					{ party_type: 'Member', party: frm.doc.name });
			});

			frm.add_custom_button(__('Accounts Receivable'), function () {
				frappe.set_route('query-report', 'Accounts Receivable', { member: frm.doc.name });
			});

			if (!frm.doc.customer) {
				frm.add_custom_button(__('Create Customer'), () => {
					frm.call('make_customer_and_link').then(() => {
						frm.reload_doc();
					});
				});
			}

			// indicator
			erpnext.utils.set_party_dashboard_indicators(frm);

		} else {
			frappe.contacts.clear_address_and_contact(frm);
		}

		frappe.call({
			method: "frappe.client.get_value",
			args: {
				'doctype': "Membership",
				'filters': { 'member': frm.doc.name },
				'fieldname': [
					'to_date'
				]
			},
			callback: function (data) {
				if (data.message) {
					frappe.model.set_value(frm.doctype, frm.docname,
						"membership_expiry_date", data.message.to_date);
				}
			}
		});
	}
});