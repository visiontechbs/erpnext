# Copyright (c) 2013, Frappe Technologies Pvt. Ltd. and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import erpnext
from frappe import _
from frappe.utils import flt

def execute(filters=None):
	columns = get_columns(filters)
	data = get_data(filters)
	return columns, data

def get_columns(filters):
	columns = [
		{"label": _("Loan Security"), "fieldname": "loan_security", "fieldtype": "Link", "options": "Loan Security", "width": 160},
		{"label": _("Loan Security Code"), "fieldname": "loan_security_code", "fieldtype": "Data", "width": 100},
		{"label": _("Loan Security Name"), "fieldname": "loan_security_name", "fieldtype": "Data", "width": 150},
		{"label": _("Haircut"), "fieldname": "haircut", "fieldtype": "Percent", "width": 100},
		{"label": _("Loan Security Type"), "fieldname": "loan_security_type", "fieldtype": "Link", "options": "Loan Security Type", "width": 120},
		{"label": _("Disabled"), "fieldname": "disabled", "fieldtype": "Check", "width": 80},
		{"label": _("Total Qty"), "fieldname": "total_qty", "fieldtype": "Float", "width": 100},
		{"label": _("Latest Price"), "fieldname": "latest_price", "fieldtype": "Currency", "options": "currency", "width": 100},
		{"label": _("Price Valid Upto"), "fieldname": "price_valid_upto", "fieldtype": "Datetime", "width": 100},
		{"label": _("Current Value"), "fieldname": "current_value", "fieldtype": "Currency", "options": "currency", "width": 100},
		{"label": _("% Of Total Portfolio"), "fieldname": "portfolio_percent", "fieldtype": "Percentage", "width": 100},
		{"label": _("Pledged Applicant Count"), "fieldname": "pledged_applicant_count", "fieldtype": "Percentage", "width": 100},
		{"label": _("Currency"), "fieldname": "currency", "fieldtype": "Currency", "options": "Currency", "hidden": 1, "width": 100},
	]

	return columns
    
def get_data(filters):
	data = []
	return data

