#!/bin/usr/env python
#-*- coding: utf8 -*-

import cx_Oracle

connection = cx_Oracle.connect("kjecsel","kjecsel","10.53.1.194/ZNHG")

cursor = connection.cursor()
cursor.execute("""
    SELECT ROWNUM,
    ORDERDOCID as "receiver_id",
    CHILDORDERNO as "order_id",
    TRANSPORT_NO as "freight_id",
    HANDLE_DATE as "last_updated",
    EBSTATUS as "status",
    RATEABLE_TOTAL as "tax_total",
    PRINT_DATE as "date_of_issue",
    TAX_NUMBER as "tax_bill_id"
    from KJECCUS.V_EBILL_FOR_WECHAT
    where ORDERDOCID = '320981198706300469'
    order by HANDLE_DATE desc
    """)

results = [];
groups = {};

for item in cursor:
    if(item[8] is not None):
        if( item[8] not in groups):
            groups[item[8]] = {
                "tax_bill_id" : item[8],
                "tax_total" : item[6],
                "date_of_issue" : item[7],
                "orders" : []
            }
        groups[item[8]]["orders"].append({
            "order_id" : item[2],
            "freight_id" : item[3],
            "status" : item[5],
            "last_updated" : item[4]
            })
    else:
        results.append({
            "tax_bill_id": None,
            "tax_total" : 0,
            "date_of_issue" : item[4],
            "orders" : [{
                "order_id" : item[2],
                "freight_id" : item[3],
                "status" : item[5],
                "last_updated" : item[4]
                },]
            })

for value in groups.itervalues():
    results.append(value)

print filter(lambda a:a["date_of_issue"] is None,results)

def sort_date(a,b):
    if a["date_of_issue"] is None:
        return -1
    elif  b["date_of_issue"] is None:
        return 1
    else:
        return cmp(a["date_of_issue"],b["date_of_issue"])
results.sort(sort_date)

for r in results:
    print r