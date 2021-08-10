# -*- coding: utf-8 -*-
# Copyright (c) 2021, Frappe Technologies Pvt. Ltd. and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document
from erpnext.accounts.general_ledger import make_gl_entries
from frappe.utils import nowdate

class MemberContributionPlan(Document):
	def test():
            pass

@frappe.whitelist()
def set_expired_status():
	try:
	#   subject = frappe.db.sql("""UPDATE `tabMember Contribution Plan` SET doc_status = 2 WHERE doc_status = 3""")
	   subject = frappe.db.sql("""UPDATE `tabMember Contribution Plan` SET closed = '1' WHERE doc_status = 2 AND closed = '0' AND closing_date <= %s""",(nowdate()))
	#    subject = frappe.db.sql("""SELECT closed FROM `tabMember Contribution Plan` WHERE (doc_status = 2) AND (closed = 0) AND closing_date <= %s""",(nowdate()))
	except:
		frappe.msgprint("Petty Cash Request not successfully Updated{1}",format(subject))

@frappe.whitelist()
def make_post_gl_entry(self):
	gl_entries = []
	parent_name = ""
	new_parent_name = ""
	total_subcription_amount = 0

	try:
	#    assets = frappe.db.sql("""
	# 		SELECT t1.company as company,t1.member_id as member_id, t2.member_subcription_plan as member_subcription_plan, 
	# 		t2.credit_account as credit_account, t2.subscription_amount as subscription_amount, 
	# 		t2.member_subcription_plan as member_subcription_plan
	# 		FROM `tabMember Contribution Plan` t1, `tabMember Contribution Plan Table` t2
	# 		WHERE
	# 			t2.parent = t1.name AND t1.closed = '0' """)
	   details = frappe.get_all("Member Contribution Plan", 
	            fields="`tabMember Contribution Plan`.name,`tabMember Contribution Plan`.member_id, `tabMember Contribution Plan Table`.subscription_amount, `tabMember Contribution Plan Table`.credit_account, `tabMember Contribution Plan Table`.member_subcription_plan",
				filters={"closed": 0},
				order_by="`tabMember Contribution Plan`.name")
		
	#    journal_entry = frappe.new_doc('Journal Entry')
	#    journal_entry.voucher_type = voucher_type
	#    journal_entry.company = company
	#    journal_entry.posting_date = nowdate()
	   for detail in details:

		   new_parent_name = detail.name

		   if new_parent_name == parent_name or parent_name == "":

		    gl_entries.append(self.get_gl_dict({
					"account": "Journal Entry Account",
					"against": detail.credit_account,
					"remarks": detail.member_subcription_plan,
					"posting_date": nowdate(),
					"credit_in_account_currency": detail.subcription_amount,
					"debit_in_account_currency":0,
					"cost_center": ""
				}, detail=self))

		    parent_name = detail.name
		    total_subcription_amount = total_subcription_amount + detail.credit_account
		   else :
		    gl_entries.append(self.get_gl_dict({
					"account": "Journal Entry Account",
					"against": cwip_account,
					"remarks": "",
					"posting_date": nowdate(),
					"credit_in_account_currency": 0,
					"debit_in_account_currency": total_subcription_amount,
					"cost_center": ""
				}, item=self))
		    frappe.msgprint("Petty Cash Request not successfully Updated{1}",format(gl_entries))
	   
	except:
		frappe.msgprint("Petty Cash Request not successfully Updated{1}",format(doc1))
			# for asset in assets:
			# 	doc = frappe.get_doc('Asset', asset)
			# 	doc.make_gl_entries()

def make_gl_entries(self):
		gl_entries = []

		purchase_document = self.get_purchase_document()
		fixed_asset_account, cwip_account = self.get_fixed_asset_account(), self.get_cwip_account()

		if (purchase_document and self.purchase_receipt_amount and self.available_for_use_date <= nowdate()):

			gl_entries.append(self.get_gl_dict({
				"account": cwip_account,
				"against": fixed_asset_account,
				"remarks": self.get("remarks") or _("Accounting Entry for Asset"),
				"posting_date": self.available_for_use_date,
				"credit": self.purchase_receipt_amount,
				"credit_in_account_currency": self.purchase_receipt_amount,
				"cost_center": self.cost_center
			}, item=self))

			gl_entries.append(self.get_gl_dict({
				"account": fixed_asset_account,
				"against": cwip_account,
				"remarks": self.get("remarks") or _("Accounting Entry for Asset"),
				"posting_date": self.available_for_use_date,
				"debit": self.purchase_receipt_amount,
				"debit_in_account_currency": self.purchase_receipt_amount,
				"cost_center": self.cost_center
			}, item=self))

		if gl_entries:
			from erpnext.accounts.general_ledger import make_gl_entries

			make_gl_entries(gl_entries)
			self.db_set('booked_fixed_asset', 1)




# def make_post_gl_entry():

# 	asset_categories = frappe.db.get_all('Asset Category', fields = ['name', 'enable_cwip_accounting'])

# 	for asset_category in asset_categories:
# 		if cint(asset_category.enable_cwip_accounting):
# 			assets = frappe.db.sql_list(""" select name from `tabAsset`
# 				where asset_category = %s and ifnull(booked_fixed_asset, 0) = 0
# 				and available_for_use_date = %s""", (asset_category.name, nowdate()))

# 			for asset in assets:
# 				doc = frappe.get_doc('Asset', asset)
# 				doc.make_gl_entries()

# def make_gl_entries(self):
# 		gl_entries = []

# 		purchase_document = self.get_purchase_document()
# 		fixed_asset_account, cwip_account = self.get_fixed_asset_account(), self.get_cwip_account()

# 		if (purchase_document and self.purchase_receipt_amount and self.available_for_use_date <= nowdate()):

# 			gl_entries.append(self.get_gl_dict({
# 				"account": cwip_account,
# 				"against": fixed_asset_account,
# 				"remarks": self.get("remarks") or _("Accounting Entry for Asset"),
# 				"posting_date": self.available_for_use_date,
# 				"credit": self.purchase_receipt_amount,
# 				"credit_in_account_currency": self.purchase_receipt_amount,
# 				"cost_center": self.cost_center
# 			}, item=self))

# 			gl_entries.append(self.get_gl_dict({
# 				"account": fixed_asset_account,
# 				"against": cwip_account,
# 				"remarks": self.get("remarks") or _("Accounting Entry for Asset"),
# 				"posting_date": self.available_for_use_date,
# 				"debit": self.purchase_receipt_amount,
# 				"debit_in_account_currency": self.purchase_receipt_amount,
# 				"cost_center": self.cost_center
# 			}, item=self))

# 		if gl_entries:
# 			from erpnext.accounts.general_ledger import make_gl_entries

# 			make_gl_entries(gl_entries)
# 			self.db_set('booked_fixed_asset', 1)