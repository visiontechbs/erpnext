// Copyright (c) 2021, Frappe Technologies Pvt. Ltd. and contributors
// For license information, please see license.txt

frappe.ui.form.on('Monthly Abatement Report', {
	validate: function (frm, cdn, cdt) {
		var loadRecods = frm.doc.monthly_abatement_table;
		if (loadRecods.length == 0) {
			frappe.msgprint("Cannot save with empty rows in the table");
			frappe.validated = false;
		}
	},

	onload_post_render: function (frm) {
		if (frm.doc.__islocal == 1) {
			//load data into child table,when click the load button
			frm.add_custom_button(__("Load"), function () {
				// clear table 
				frm.clear_table("monthly_abatement_table");
				frm.refresh_fields();

				//set the month first date and end date
				if (frm.doc.month && frm.doc.year) {
					if (frm.doc.month == 1 || frm.doc.month == 3 || frm.doc.month == 5 || frm.doc.month == 7 || frm.doc.month == 8) {
						var from_date = frm.doc.year + "-0" + frm.doc.month + "-01";
						var to_date = frm.doc.year + "-0" + frm.doc.month + "-31";
					}
					else if (frm.doc.month == 10 || frm.doc.month == 12) {
						var from_date = frm.doc.year + "-" + frm.doc.month + "-01";
						var to_date = frm.doc.year + "-" + frm.doc.month + "-30";
					}
					else if (frm.doc.month == 4 || frm.doc.month == 6 || frm.doc.month == 9 || frm.doc.month == 11) {
						var from_date = frm.doc.year + "-0" + frm.doc.month + "-01";
						var to_date = frm.doc.year + "-0" + frm.doc.month + "-30";
					}
					else {
						var from_date = frm.doc.year + "-0" + frm.doc.month + "-01";
						var to_date = frm.doc.year + "-0" + frm.doc.month + "-29";
					}
					
					frappe.call({
						method: "erpnext.non_profit.doctype.monthly_abatement_report.monthly_abatement_report.fetch_child_data",
						args: {
							from_date: from_date,
							to_date: to_date
						},
						//disable btn,till complete the request
						btn: $('.load'),
						//freezr the screen,complete the request
						freeze: true,
						callback: function (data) {
							if (data.message) {
								console.log(data);
								var child;
								var previous_department;
								var memeber_id;
								var member_total_deduction = 0;
								var deaprtment_total = 0;
								var total_loan_amount = 0;
								var department_loan_total = 0;

								$.each(data.message, function (i, d) {

									//if it is in first iteration OR new member_ID
									if (d[0] != memeber_id || i == 0) {

										//if New memeber_ID and new Department,adding "Sub TOtal" for previous
										if (previous_department != null && previous_department != d[2]) {
											child = frappe.model.add_child(cur_frm.doc, "Monthly Abatement Report Table", "monthly_abatement_table");
											child.department = "Sub Total";
											child.total_deductions = deaprtment_total + department_loan_total;
											deaprtment_total = 0;
											department_loan_total = 0;
											total_loan_amount = 0;
											member_total_deduction = 0;
										}

										//if New memeber_ID and NOT new Department,adding NEW member_ID row
										child = frappe.model.add_child(cur_frm.doc, "Monthly Abatement Report Table", "monthly_abatement_table");
										child.department = d[2];
										child.department_name = d[2];
										child.member = d[0];
										child.member_name = d[1];
										member_total_deduction = 0;
										var loan_amount_added = false;
										var loan_amount_added_to_deaprtment_total = false;
									}
									//if it is not in first iteration OR NOT new member_ID
									else if (d[0] = memeber_id || i != 0) {

										//NOT new member_ID but new Deartment,then adding "Sub total" and new member_ID row
										if (previous_department != null && previous_department != d[2]) {
											child = frappe.model.add_child(cur_frm.doc, "Monthly Abatement Report Table", "monthly_abatement_table");
											child.department = "Sub Total";
											child.total_deductions = deaprtment_total + department_loan_total;
											deaprtment_total = 0;
											department_loan_total = 0;
											total_loan_amount = 0;
											member_total_deduction = 0;

											//addding new row
											child = frappe.model.add_child(cur_frm.doc, "Monthly Abatement Report Table", "monthly_abatement_table");
											child.department = d[2];
											child.department_name = d[2];
											child.member = d[0];
											child.member_name = d[1];
											var loan_amount_added = false;
											var loan_amount_added_to_deaprtment_total = false;
										}

									}

									previous_department = d[2];

									// calculate member total dedction & update the feild
									member_total_deduction = member_total_deduction + d[4];

									// adding loan_amount to the memeber total deduction
									if (d[6] != null && loan_amount_added === false) {
										member_total_deduction = member_total_deduction + d[6];
										loan_amount_added == true;
									}
									child.total_deductions = member_total_deduction;
									deaprtment_total = deaprtment_total + d[4];

									// adding loan_amount to the department total deduction
									if (d[6] != null && loan_amount_added_to_deaprtment_total === false) {
										deaprtment_total = deaprtment_total + d[6];
										loan_amount_added_to_deaprtment_total == true;
									}

									memeber_id = d[0];
									child.payroll_number = d[14];

									//assign subcription amount 
									if (d[3] == "Monthly DUe") {
										child.subscription_1 = d[4];
										//separat credit_acount by "~" into a string
										if (child.credit_account_list == undefined) {
											child.credit_account_list = d[8];
										}
										else {
											child.credit_account_list = child.credit_account_list + "~" + d[8];
										}
									}
									if (d[3] == "InsuranceSubscription") {
										child.subscription_2 = d[4];
										//separat credit_acount by "~" into a string
										if (child.credit_account_list == undefined) {
											child.credit_account_list = d[8];
										}
										else {
											child.credit_account_list = child.credit_account_list + "~" + d[8];
										}
									}
									if (d[3] == "subtest2") {
										child.subscription_3 = d[4];
										//separat credit_acount by "~" into a string
										if (child.credit_account_list == undefined) {
											child.credit_account_list = d[8];
										}
										else {
											child.credit_account_list = child.credit_account_list + "~" + d[8];
										}
									}
									if (d[3] == "DeathBenefits") {
										child.subscription_4 = d[4];
										//separat credit_acount by "~" into a string
										if (child.credit_account_list == undefined) {
											child.credit_account_list = d[8];
										}
										else {
											child.credit_account_list = child.credit_account_list + "~" + d[8];
										}
									}
									if (d[3] == "HealthRewards") {
										child.subscription_5 = d[4];
										//separat credit_acount by "~" into a string
										if (child.credit_account_list == undefined) {
											child.credit_account_list = d[8];
										}
										else {
											child.credit_account_list = child.credit_account_list + "~" + d[8];
										}
									}

									// assign loan amount
									if (d[6] != null) {
										if (d[9] == "Education") {
											child.loan_amount_1 = d[6];
											total_loan_amount = total_loan_amount + d[6]; 
										} else if (d[9] == "Emergency") {
											child.loan_amount_2 = d[6];
											total_loan_amount = total_loan_amount + d[6];
										} else if (d[9] == "Term Loan 2") {
											child.loan_amount_3 = d[6];
											total_loan_amount = total_loan_amount + d[6];
										} else if (d[9] == "detest2") {
											child.loan_amount_4 = d[6];
											total_loan_amount = total_loan_amount + d[6];
										} else if (d[9] == "LOANTYPE00000001") {
											child.loan_amount_5 = d[6];
											total_loan_amount = total_loan_amount + d[6];
										}
									}

									if (data.message.length - 1 == i) {
										child = frappe.model.add_child(cur_frm.doc, "Monthly Abatement Report Table", "monthly_abatement_table");
										child.department = "Sub Total";
										child.total_deductions = deaprtment_total;
										deaprtment_total = 0;
									}

									frm.refresh_field("monthly_abatement_table");

								});
							}
							else {
								alert("No Records for the given Month");
							}
						}
					});
				}else{
					alert("Please enter both a Year and a Month");
				}
			});
		}


		//enable 'Post' btn, after save the document
		if (!frm.doc.__islocal && !frm.doc.journal_entry_created) {
			// adding post button
			frm.add_custom_button(__("Post"), function () {

				var journal_entry_created = 0;

				//get the "subscription_length" varaible value in the header section as a reference
				var sub_lenght;
				sub_lenght = cur_frm.doc.subscription_length;

				//loop abatement table list
				$.each(frm.doc.monthly_abatement_table, function (i, d) {

					//ignoring "sub total" lines
					if (d.department != "Sub Total") {

						let je = {};
						var tot_amount = 0;
						var accounts = [];
						var journal_entry_no = 0;

						// split cerdit_account list by "~"
						var input = d.credit_account_list;
						var fields = input.split('~');



						//set the total_amount,according to loan amount availability
						if (d.loan_amount == undefined) {
							tot_amount = parseInt(d.total_deductions);
							console.log("1-" + tot_amount);
						} else {
							tot_amount = parseInt(d.total_deductions - d.loan_amount);
							console.log("2-" + tot_amount);
						}

						//looping journel entry table lines according to the header subscrition.length
						for (var i = 1; i <= sub_lenght; i++) {

							var sub_name = "subscription_" + i;

							// append journel entry table lines, only when "d" object subscription property name equal to "sub_name"
							if (d.hasOwnProperty(sub_name) && d[sub_name] != 0) {
								// console.log(d[sub_name]);
								accounts[journal_entry_no] = {
									"doctype": "Journal Entry Account",
									"account": fields[journal_entry_no],
									"party_type": "Member",
									"party": d.member,
									"debit_in_account_currency": 0,
									"credit_in_account_currency": d[sub_name],
									"user_remark": ""
								}
								// increament journel entry table index no
								journal_entry_no++;
							}
						}
						//get already addded table line count
						var index_count = accounts.length;

						//append last line with total amount for debit
						accounts[index_count] = {
							"doctype": "Journal Entry Account",
							"account": "Cash In Hand - ABC",
							"debit_in_account_currency": tot_amount,
							"credit_in_account_currency": 0,
							"user_remark": ""
						};

						// assign header detais to Journal Entry
						je["doctype"] = "Journal Entry";
						je["abatement_entry"] = true;
						je["posting_date"] = frappe.datetime.add_days(frm.doc.process_date, 0);
						je["accounts"] = accounts;
						console.log(je);
						frappe.db.insert(je)
							.then(function (doc) {
								frappe.call({
									"method": "frappe.client.submit",
									"args": {

										"doc": doc

									},
									"callback": (r) => {
										if (r.message.name) {
											// update journal_entry_created
											journal_entry_created = 1;

											journal_entry_no = r.message.name;
											msgprint("New Journel Entry " + journal_entry_no + " was created successfully for + frm.doc.name");
										} else {
											msgprint("New Journel Entry was not created successfully for + frm.doc.name");
										}
									}
								});
							});

						// if journal entry creates, set 'journal_entry_created' as true
						if (journal_entry_created == 1) {
							console.log(frm.doc.name);
							frappe.db.set_value("Monthly Abatement Report", frm.doc.name, "journal_entry_created", true);
							frm.refresh_field("journal_entry_created");
						}
					}
				});
			});
		}

		// fill Subscription types into header feilds,when the initail load
		frappe.call({
			method: "erpnext.non_profit.doctype.monthly_abatement_report.monthly_abatement_report.fetch_subscription_list",
			callback: function (data) {
				console.log(data);
				var j = 1;
				var k = 1;
				var name = "";
				var subscription = "";
				var loan_type = "";

				var subscription_array = [];
				var loan_type_array = [];

				if (data.message) {

					frm.set_value("subscription_length", data.message[0].length);
					frm.set_value("loan_type_length", data.message[1].length);

					//below types have been hardcoded
					subscription_array = ["Monthly DUe", "InsuranceSubscription", "subtest2", "DeathBenefits", "HealthRewards"];
					loan_type_array = ["Land Loan", "Members Loan", "Term Loan 1te", "Term Loan 2", "Emergency", "Housing Loan", "Housing Loan-1", "Education", "Housing Loan-2", "Defaulter Testing 1", "Defaulter Testing ", "Defaul test3", "Defaul test4", "detest1", "detest2", "LOAN00001", "LOANTYPE00000001", "LOANTYPE00000002"];

					//write subcription types
					for (var x in subscription_array) {
						name = "Subscription" + j;
						subscription = subscription.concat(name + " : " + subscription_array[x]) + "\n";
						j++;

					}

					// // { start comment
					// //write subcription types
					// for (var x in data.message[0]) {
					// 	name = "subscription_" + j;
					// 	subscription = subscription.concat(name + ":" + data.message[0][x][0]) + "\n";
					// 	j++;
					// }
					// // end of comment} 

					//assign subcription list into varaible
					frm.set_value('subscription_list', subscription);
					// $("[data-fieldname='subscription_list']").val(subscription);

					//write loan types
					for (var y in loan_type_array) {
						name = "Subscription-" + k;
						loan_type = loan_type.concat(name + " : " + loan_type_array[y]) + "\n";
						k++;

					}

					// // { start comment
					// //write loan types
					// for (var y in data.message[1]) {
					// 	name = "loan_type_" + k;
					// 	loan_type = loan_type.concat(name + ":" + data.message[1][y][0]) + "\n";
					// 	k++;
					// }
					// // end of comment} 

					//assign subcription list into varaible
					frm.set_value('loan_type_list', loan_type);
					// $("[data-fieldname='loan_type_list']").val(loan_type);

				}
				else {
					alert("No Subscription Plans");
				}
			}
		});
	},

	refresh: function (data, frm) {


	}
});

