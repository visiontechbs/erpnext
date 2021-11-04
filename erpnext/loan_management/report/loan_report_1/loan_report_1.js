// Copyright (c) 2016, Frappe Technologies Pvt. Ltd. and contributors
// For license information, please see license.txt
/* eslint-disable */

frappe.query_reports["Loan Report 1"] = {
    "filters": [
       
        {
            "fieldname": "loan_type",
            "label": __("Loan Type"),
            "fieldtype": "Link",
            "options": "Loan Type",
            "default": "",
            on_change: function () {
                frappe.query_report.set_filter_value('loan', "");
            }
        }, 
        {
            "fieldname": "loan",
            "label": __("Loan"),
            "fieldtype": "Dynamic Link",
            "get_options": function () {
                var loan_type = frappe.query_report.get_filter_value('loan_type');
                var loan = frappe.query_report.get_filter_value('loan');
                if (loan && !loan_type) {
                    frappe.throw(__("Please select Applicant Type first"));
                }
                return loan_type;
            }
        }
    ]
};
