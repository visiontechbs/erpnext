# -*- coding: utf-8 -*-
# Copyright (c) 2021, Frappe Technologies Pvt. Ltd. and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import json
import frappe
from frappe.model.document import Document
from frappe import _
import erpnext

class MonthlyAbatementReport(Document):
    def test():
            pass

@frappe.whitelist()
def	 fetch_subscription_list():
  try:
       subscription_plan_list = frappe.db.sql("Select name from `tabSubscription Plan`")
      #  subscription_plan_list = frappe.db.sql("""Select t2.name from `tabMembership` t1 INNER JOIN `tabContribution List Table` t2 ON t2.parent = t1.name""")
      #  loan_type_list = frappe.db.sql("Select name from `tabLoan Type`")
       return subscription_plan_list
  except:
	   return None

@frappe.whitelist()
def	 fetch_child_data(from_date,to_date):
  try:
       return frappe.db.sql("""
			SELECT
        t1.member as member,
        t1.member_name as member_name,
        t1.department_customer as department,
        t2.contribution_type as contribution_type,
        t2.amount as contribution_amount,
        t3.applicant as loan_applicant,
        t3.monthly_repayment_amount as monthly_repayment_amount,
        t3.name as loan,
        t2.credit_account,
        t3.loan_type,
        t4.total_payment,
        t1.membership_type,
        t1.membership_status,
        t1.amount
      FROM
        (
          `tabMembership` t1
          INNER JOIN `tabContribution List Table` t2 ON t2.parent = t1.name
        )
        LEFT JOIN 
        (  tabLoan t3 
           INNER JOIN `tabRepayment Schedule` t4 ON t4.parent = t3.name
        ) ON t1.member = t3.applicant
        AND (
          t3.status <> "Closed"
          OR t3.status <> "Loan Closure Requested"
        ) 
        AND t3.repayment_start_date >= %(from_date)s
        AND t4.payment_date BETWEEN %(from_date)s AND %(to_date)s
      WHERE 
        (t1.to_date >= %(from_date)s AND t1.from_date <= %(to_date)s ) OR (t3.name IS NOT NULL AND t1.to_date <= %(from_date)s)
      ORDER BY 
        t1.department_customer,
        t1.name,
        t3.name """,
					{"from_date": from_date, "to_date": to_date})
        
  except:
	   return None



 





















#  1).

    #  frappe.db.sql("""
		# 	SELECT
    #     t1.member as member,
    #     t1.member_name as member_name,
    #     t1.department_customer as department,
    #     t2.contribution_type as contribution_type,
    #     t2.amount as contribution_amount,
    #     t3.applicant as loan_applicant,
    #     t3.monthly_repayment_amount as monthly_repayment_amount,
    #     t3.name as loan,
    #     t2.credit_account,
    #     t3.loan_type,
    #     t4.total_payment
    #   FROM
    #     (
    #       `tabMembership` t1
    #       INNER JOIN `tabContribution List Table` t2 ON t2.parent = t1.name
    #     )
    #     LEFT JOIN tabLoan t3 ON t1.member = t3.applicant
    #     INNER JOIN `tabRepayment Schedule` t4 ON t4.parent = t3.name
    #     AND (
    #       t3.status <> "Closed"
    #       OR t3.status <> "Loan Closure Requested"
    #     ) 
    #     AND t3.posting_date >= %(from_date)s 
    #     AND t3.posting_date <= %(to_date)s
    #     AND t3.repayment_start_date <= %(to_date)s
    #     AND t4.payment_date BETWEEN %(from_date)s AND %(to_date)s
    #   WHERE 
    #     t1.from_date >= %(from_date)s 
    #     AND t1.to_date >= %(to_date)s
    #   ORDER BY 
    #     t1.department_customer,
    #     t1.name """,
		# 			{"from_date": from_date, "to_date": to_date})





    # 2).
    # frappe.db.sql("""
		# 	SELECT
    #     t1.member as member,
    #     t1.member_name as member_name,
    #     t1.department_customer as department,
    #     t2.contribution_type as contribution_type,
    #     t2.amount as contribution_amount,
    #     t3.applicant as loan_applicant,
    #     t3.monthly_repayment_amount as monthly_repayment_amount,
    #     t3.name as loan,
    #     t2.credit_account,
    #     t3.loan_type,
    #     t4.total_payment,
    #     t1.membership_type
    #   FROM
    #     (
    #       `tabMembership` t1
    #       INNER JOIN `tabContribution List Table` t2 ON t2.parent = t1.name
    #     )
    #     LEFT JOIN tabLoan t3 ON t1.member = t3.applicant
    #     INNER JOIN `tabRepayment Schedule` t4 ON t4.parent = t3.name
    #     AND (
    #       t3.status <> "Closed"
    #       OR t3.status <> "Loan Closure Requested"
    #     ) 
    #     AND t3.repayment_start_date >= %(from_date)s
    #     AND t4.payment_date BETWEEN %(from_date)s AND %(to_date)s
    #   WHERE 
    #     (t1.from_date <= %(to_date)s AND t1.to_date >= %(from_date)s) 
    #     OR (t4.payment_date BETWEEN %(from_date)s AND %(to_date)s)
    #   ORDER BY 
    #     t1.department_customer,
    #     t1.name """,
		# 			{"from_date": from_date, "to_date": to_date})



    # 3).
    # SELECT
    #     t1.member as member,
    #     t1.member_name as member_name,
    #     t1.department_customer as department,
    #     t2.contribution_type as contribution_type,
    #     t2.amount as contribution_amount,
    #     t3.applicant as loan_applicant,
    #     t3.monthly_repayment_amount as monthly_repayment_amount,
    #     t3.name as loan,
    #     t2.credit_account,
    #     t3.loan_type,
    #     t4.total_payment,
    #     t1.membership_type,
    #     t1.membership_status,
    #     t1.amount
    #   FROM
    #     (
    #       `tabMembership` t1
    #       INNER JOIN `tabContribution List Table` t2 ON t2.parent = t1.name
    #     )
    #     LEFT JOIN 
    #     (  tabLoan t3 
    #        INNER JOIN `tabRepayment Schedule` t4 ON t4.parent = t3.name
    #     ) ON t1.member = t3.applicant
    #     AND (
    #       t3.status <> "Closed"
    #       OR t3.status <> "Loan Closure Requested"
    #     ) 
    #     AND t3.repayment_start_date >= %(from_date)s
    #     AND t4.payment_date BETWEEN %(from_date)s AND %(to_date)s
    #   WHERE 
    #     ((t1.from_date <= %(to_date)s AND t1.to_date >= %(from_date)s) 
    #     OR (t4.payment_date BETWEEN %(from_date)s AND %(to_date)s))
    #   ORDER BY 
    #     t1.department_customer,
    #     t1.name

    # 4). return frappe.db.sql("""
		# 	SELECT
    #     t1.member as member,
    #     t1.member_name as member_name,
    #     t1.department_customer as department,
    #     t2.contribution_type as contribution_type,
    #     t2.amount as contribution_amount,
    #     t3.applicant as loan_applicant,
    #     t3.monthly_repayment_amount as monthly_repayment_amount,
    #     t3.name as loan,
    #     t2.credit_account,
    #     t3.loan_type,
    #     t4.total_payment,
    #     t1.membership_type,
    #     t1.membership_status,
    #     t1.amount,
    #     t1.salary_code_and_scale
    #   FROM
    #     (
    #       `tabMembership` t1
    #       INNER JOIN `tabContribution List Table` t2 ON t2.parent = t1.name
    #     )
    #     LEFT JOIN 
    #     (  tabLoan t3 
    #        INNER JOIN `tabRepayment Schedule` t4 ON t4.parent = t3.name
    #     ) ON t1.member = t3.applicant
    #     AND (
    #       t3.status <> "Closed"
    #       OR t3.status <> "Loan Closure Requested"
    #     ) 
    #     AND t3.repayment_start_date >= %(from_date)s
    #     AND t4.payment_date BETWEEN %(from_date)s AND %(to_date)s
    #   WHERE 
    #     (t1.to_date >= %(from_date)s AND t1.from_date <= %(to_date)s ) OR (t3.name IS NOT NULL AND t1.to_date <= %(from_date)s)
    #   ORDER BY 
    #     t1.department_customer,
    #     t1.name """,
		# 			{"from_date": from_date, "to_date": to_date})