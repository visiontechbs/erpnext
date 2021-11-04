# -*- coding: utf-8 -*-
# Copyright (c) 2021, Frappe Technologies Pvt. Ltd. and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document

class MemberNew(Document):
	def onload(self):
		frappe.msgprint("onload test")
		pass


	def validate(self):
		#frappe.throw("validation throw")
		pass

@frappe.whitelist(allow_guest=True)
def list_name():
	mem_count = 0
	try:
		mem_count = frappe.db.count('Member New')		
		#frappe.throw('Member count loaded successfully   ' + mem_count)
	except:
		#frappe.msgprint('Member count not loaded')
		frappe.log_error(frappe.get_traceback(), _("Contact Creation Failed"))
	return mem_count

	