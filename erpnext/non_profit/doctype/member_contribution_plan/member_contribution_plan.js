// Copyright (c) 2021, Frappe Technologies Pvt. Ltd. and contributors
// For license information, please see license.txt

frappe.ui.form.on('Member Contribution Plan', {

	refresh: function (frm, cdt, cdn) {
		//add cutomer button
		if (!frm.doc.__islocal == 1 && frm.doc.doc_status == 0) {
			frm.add_custom_button(__('Submit'), function () {
				create_journel_entry(frm, cdt, cdn);
			}, __('Create'));
		}

		frappe.call({
			method: 'erpnext.non_profit.doctype.member_contribution_plan.member_contribution_plan.make_post_gl_entry'
		});
	},

	onload_post_render: function (frm, cdt, cdn) {
		
			if (frm.doc.doc_status == 2 || frm.doc.doc_status == 1) {
				
				//restric to press save on time
			    // frm.disable_save();

				//disable add new rows and delete lines
				frm.set_df_property("subscription_plan_table", "read_only", 1);
			}
		
	},

	onload: function (frm) {
		if (frm.doc.__islocal == 1) {
			frm.set_value("opening_date", frappe.datetime.nowdate());
		}
	},

	onsubmit: function (frm) {
		
	},

	// set member name
	member_id: function (frm) {
		frappe.call({
			method: 'frappe.client.get_value',
			args: {
				doctype: 'Member',
				filters: {
					'name': cur_frm.doc.member_id,
				},
				fieldname: ['member_name']
			},
			callback: function (data) {
				frm.set_value('member_name', data.message.member_name);
				frm.refresh_field('member_name');
			}
		});
	},		

});


frappe.ui.form.on('Member Contribution Plan Table', {

	member_subcription_plan: function (frm, cdt, cdn) {
		var row = locals[cdt][cdn]
		var row_index = row.idx;
		frappe.call({
			method: 'frappe.client.get_value',
			args: {
				doctype: 'Subscription Plan',
				filters: {
					'name': cur_frm.doc.subscription_plan_table[row_index-1].member_subcription_plan,
				},
				fieldname: ['cost']
			},
			callback: function (data) {
				frappe.model.set_value(cdt, cdn, "subscription_amount", data.message.cost);
				frm.refresh_field('subscription_amount');
			}
		});
	},


	subscription_amount: function (frm, cdt, cdn) {

		var row = locals[cdt][cdn]
		var row_index = row.idx;
		var total = 0;

		$.each(frm.doc.subscription_plan_table, function (i, d) {
			total = total + frm.doc.subscription_plan_table[i].subscription_amount;
		});

		frm.set_value("total_member_contribution", total)
		frm.refresh_field('total_member_contribution');

	}

});

function create_journel_entry(frm, cdt, cdn) {

	var data = locals[cdt][cdn];
	let je = {};
	var accounts = [];
	var journal_entry_no;

	//append the petty cash details
	$.each(data.subscription_plan_table, function (i, d) {
		accounts[i] = {
			"doctype": "Journal Entry Account",
			"account": d.credit_account,
			"party_type": "Member",
			"party": frm.doc.member_id,
			"debit_in_account_currency": 0,
			"credit_in_account_currency": d.subscription_amount,
			"user_remark": d.member_subcription_plan,
			"cost_center":""
		};
	});

	var index_count = accounts.length;

	//append the cash account with total amount
	accounts[index_count] = {
		"doctype": "Journal Entry Account",
		"account": "1301 - Members Receivable - EBS",
		"party_type": "Member",
		"party": frm.doc.member_id,
		"debit_in_account_currency": frm.doc.total_member_contribution,
		"credit_in_account_currency": 0,
		"user_remark": "",
		"cost_center": ""
	};
	console.log(accounts);
	// assign header detais to Journal Entry
	je["doctype"] = "Journal Entry";
	je["posting_date"] = frappe.datetime.add_days(frm.doc.opening_date, 0);
	je["company"] = frm.doc.company;
	je["accounts"] = accounts;
	console.log("4");
	frappe.db.insert(je)
		.then(function (doc) {
			frappe.call({
				"method": "frappe.client.submit",
				"args": {

					"doc": doc

				},
				"callback": (r) => {

					//write Journal Entry no in Reim Form
					journal_entry_no = r.message.name;
					frappe.db.set_value("Reimbursement Form", frm.doc.name, "journal_entry", journal_entry_no);
					frm.save();
					alert("New Journel Entry " + frm.doc.name + " was created successfully");
				}
			});
		});


	frm.set_value("doc_status", 1);
	frm.save();
}
