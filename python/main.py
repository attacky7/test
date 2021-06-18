#!/usr/bin/python
# -*- coding: UTF-8 -*-
 
import smtplib
from email.mime.text import MIMEText
from email.header import Header

from pandas.core.indexing import convert_to_index_sliceable
# import pandas as pd
from strategy import Trace
import tushare as ts
from threading import Thread

from datetime import datetime
import time
import xlrd,xlwt
import os
import copy

codes = [
'sz002384', 'sz002959', 'sz002511', 'sz002007', 'sh603538', 'sz000157', 'sh603899', 'sz002311', 'sz000063', 'sz000100',
'sh600161', 'sh600900', 'sz000513', 'sh600276', 'sz002352', 'sh601012', 'sh601318', 'sz000977', 'sz000651', 'sh600305',
'sz000002', 'sz002191', 'sz002475', 'sh601066', 'sz002415', 'sz002507', 'sz002946', 'sh605009', 'sh600380', 'sz002624', 
'sh603368', 'sh600570', 'sh600703', 'sh600298', 'sh601966', 'sh601985', 'sz002891', 'sh600887', 'sz002001', 'sh600009'
]
names = ['东山精密: sz002384', '小熊电器: sz002959', '中顺洁柔: sz002511', '华兰生物: sz002007', '美诺华(: sh603538', '中联重科: sz000157', '晨光文具: sh603899', '海大集团: sz002311', '中兴通讯: sz000063', 'TCL科: sz000100', '天坛生物: sh600161', '长江电力: sh600900', '丽珠集团: sz000513', '恒瑞医药: sh600276', '顺丰控股: sz002352', '隆基股份: sh601012', '中国平安: sh601318', '浪潮信息: sz000977', '格力电器: sz000651', '恒顺醋业: sh600305', '万  科: sz000002', '劲嘉股份: sz002191', '立讯精密: sz002475', '中信建投: sh601066', '海康威视: sz002415', '涪陵榨菜: sz002507', '新乳业(: sz002946', '豪悦护理: sh605009', '健康元(: sh600380', '完美世界: sz002624', '柳药股份: sh603368', '恒生电子: sh600570', '三安光电: sh600703', '安琪酵母: sh600298', '玲珑轮胎: sh601966', '中国核电: sh601985', '中宠股份: sz002891', '伊利股份: sh600887', '新 和 : sz002001', '上海机场: sh600009']

hasBuy = []
NODE = {
    'code':-1,
    'name':'',
    'bBuy':-1,
    'buyPrice':-1,
    'money': 0
}

wordName = 'traceCode.xls'
buySellStr = ''
enterIndex = 0

def sendEmail(msg):
    # 第三方 SMTP 服务
    mail_host="smtp.qq.com"  #设置服务器
    mail_user="574707688@qq.com"    #用户名
    mail_pass="tionfqucaytxbegc"   #口令 
    
    receivers = ['zhangshuailei@sina.cn', '742050624@qq.com', 'q1059141323@163.com']  # 接收邮件，可设置为你的QQ邮箱或者其他邮箱
    
    message = MIMEText(msg, 'plain', 'utf-8')
    message['From'] = Header(mail_user)
    # message['To'] =  Header("测试", 'utf-8')
    
    subject = 'trace_strategy'
    message['Subject'] = Header(subject, 'utf-8')
    
    
    try:
        smtpObj = smtplib.SMTP() 
        smtpObj.connect(mail_host, 25)    # 25 为 SMTP 端口号
        smtpObj.login(mail_user,mail_pass)  
        smtpObj.sendmail(mail_user, receivers, message.as_string())
        print("邮件发送成功")
    except smtplib.SMTPException:
        print("Error: 无法发送邮件")


def GetPrice(code, name, index):

    while True:

        nowTimes = time.strftime('%H.%M',time.localtime())
        weekday = datetime.now().weekday()
        nowTimes = float(nowTimes)

        #星期一到星期五，9:30到11:30， 1:00到3:00
        if weekday != 5 and weekday != 6 and\
        ((nowTimes>9.30 and nowTimes<11.30) or\
        (nowTimes>13.00 and nowTimes<16.00)):   
            row = getCodeData(code)
            
            global enterIndex
            if(enterIndex == 0):
                global buySellStr
                buySellStr = ''
                print('进入计算：...................................进入计算:'+str(nowTimes))

            if(float(hasBuy[index]['buyPrice']) > 0):
                row['buyPrice'] = float(hasBuy[index]['buyPrice'])
                
            if Trace.chengjiaoliangTrace(row)==1 and hasBuy[index]['bBuy']!=1:
                print('buy: '+ name + ': ' +  code)
                hasBuy[index]['bBuy']=1
                hasBuy[index]['buyPrice']=row['price']
                buySellStr = buySellStr + '\n  buy: ' + code + " name: " + name + ' price:' + str(row['price'])
            elif Trace.chengjiaoliangTrace(row)==0 and hasBuy[index]['bBuy']==1:
                print('sell: ' + name + ': ' +  code)
                hasBuy[index]['bBuy']=-1
                hasBuy[index]['money'] += ((row['price'] - hasBuy[index]['buyPrice'])*100)
                hasBuy[index]['buyPrice']=-1
                buySellStr = buySellStr + '\n  sell: ' + code + " name: " + name + ' price:' + str(row['price'])

            if enterIndex == len(codes)-1 and buySellStr != '':
                print('发送邮件：' + buySellStr)
                writeWord(wordName, hasBuy)
                sendEmail(buySellStr)

            if(enterIndex == len(codes)-1):
                print('结束计算。。。。。。。。。。。。。。。。。。。结束计算:' + str(nowTimes))

            enterIndex = (enterIndex + 1)%len(codes)

        time.sleep(30*59)


def getCodeData(code):
    data = ts.get_hist_data(code, ktype='D')
    df = ts.get_realtime_quotes(code)
    ma5 = float(data['ma5'][0])
    ma10 = float(data['ma10'][0])
    ma20 = float(data['ma20'][0])
    v_ma5 = float(data['v_ma5'][0])
    v_ma10 = float(data['v_ma10'][0])
    v_ma20 = float(data['v_ma20'][0])

    price = float(df['price'][0])
    high = float(df['high'][0])
    close = float(df['pre_close'][0])
    low = float(df['low'][0])
    open = float(df['open'][0])
    
    #加入今天的数据
    if round(price,2) != round(float(data['close'][0]),2):
        ma5 = round((ma5*5+price)/6, 2)
        ma10 = round((ma10*10+price)/11, 2)
        ma20 = round((ma20*20+price)/21, 2)

        #最后一小时的时候加入今天的成交量
        nowTimes = time.strftime('%H.%M',time.localtime())
        nowTimes = float(nowTimes)
        if(nowTimes>14.00 and nowTimes<15.00):
            v_ma5 = round((v_ma5*5 + float(df['volume'][0])/100)/6, 2)
            v_ma10 = round((v_ma10*10 + float(df['volume'][0])/100)/11, 2)
            v_ma20 = round((v_ma20*20 + float(df['volume'][0])/100)/21, 2)

    row = {
        'high':high,
        'low':low,
        'open':open,
        'close':close,
        'ma5':ma5,
        'ma10':ma10,
        'ma20':ma20,
        'price':price,
        'v_ma5':v_ma5,
        'v_ma10':v_ma10,
        'v_ma20':v_ma20
    }

    return row

def onListenCodes():
    index = 0
    arr = readWord(wordName)
    if(len(arr) != 0 and type(arr[0]) == dict and type(arr[len(arr)-1]) == dict):
        global hasBuy
        hasBuy = arr

    for key in codes:
        t = Thread(target=GetPrice, args=(key, names[index],index))
        t.start()
        index = index + 1

def createWord(name):
    if(not os.path.exists(name)):
        writeWord(wordName, hasBuy)

def readWord(name):
    arr = []
    table = xlrd.open_workbook(name)
    sheet = table.sheet_by_index(0)
    rows = sheet.nrows
    for i in range(1, rows):
        node = copy.deepcopy(NODE)
        node['code'] = sheet.cell(i,0).value
        node['name'] = sheet.cell(i, 1).value
        node['bBuy'] = sheet.cell(i,2).value
        node['buyPrice'] = sheet.cell(i,3).value
        node['money'] = sheet.cell(i, 4).value
        arr.append(node)
    return arr

def writeWord(name, arr):
    workbook = xlwt.Workbook()
    sheet = workbook.add_sheet("sheet")
    sheet.write(0,0,'code')
    sheet.write(0,1, 'name')
    sheet.write(0,2,'bBuy')
    sheet.write(0,3, 'buyPrice')
    sheet.write(0,4, 'money')
    index = 1
    for v in arr:
        indexTemp = 0
        for k in v:
            sheet.write(index, indexTemp, v[k])
            indexTemp = indexTemp + 1
        index = index + 1
    workbook.save(name)


if __name__ == "__main__":
    # sendEmail('我要发送一个邮件！')
    print('启动..............启动')
    index = 0
    for v in codes:
        node = copy.deepcopy(NODE)
        node['code'] = v
        node['name'] = names[index]
        hasBuy.append(node)
        index = index + 1
    createWord(wordName)
    onListenCodes()


