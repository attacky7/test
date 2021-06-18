from selenium import webdriver
from lxml import etree
import time
import requests
import xlrd,xlwt
import re
import tushare as ts


def GetPrice(out_time,row):
    while 1:
        url="http://api.money.126.net/data/feed/0000001,money.api"
        r = requests.get(url)

        priceStr = re.findall(r'price": \d{4}.\d{0,2}, "open":', str(r.content))
        price = re.findall(r'\d{4}.\d{0,2}', str(priceStr))[0]

        nowTimes = time.strftime('%H.%M',time.localtime())
        print(nowTimes,price)
        #将数据写入xls表格
        sheet.write(row[0],0,nowTimes)
        sheet.write(row[0],1,float(price))
        row[0] = row[0]+1
        if float(nowTimes)>=out_time:
            print('时间到，下班喽')
            break
        time.sleep(60)

def Relax(start_time):
    while 1:
        nowTimes = time.strftime('%H.%M',time.localtime())
        print('当前时间：'+nowTimes,end=' ')
        if float(nowTimes)>=start_time:
            print('醒醒，该起床干活了，爬数据去...')
            break
        print('还早着呢，多睡会儿吧...')
        time.sleep(60)

if __name__=='__main__':

    #创建储存数据的表格
    row = [1]
    workbook = xlwt.Workbook()
    sheet = workbook.add_sheet("sheet")
    sheet.write(0,0,'时间')
    sheet.write(0,1,'上证指数')

    #爬取数据
    Relax(9.30)
    GetPrice(11.30,row)
    Relax(13.00)
    GetPrice(15.00,row)

    print('保存数据')
    today = time.strftime('%Y-%m-%d',time.localtime())
    workbook.save("{}.xls".format(today))