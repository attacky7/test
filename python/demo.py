from selenium import webdriver
from lxml import etree
import time
import requests
import xlrd,xlwt
import re
import tushare as ts
import pandas as pd
from strategy import Trace

# code = 'sz002511'#'sh601318'

codes = [
'sz002384', 'sz002959', 'sz002511', 'sz002007', 'sh603538', 'sz000157', 'sh603899', 'sz002311', 'sz000063', 'sz000100',
'sh600161', 'sh600900', 'sz000513', 'sh600276', 'sz002352', 'sh601012', 'sh601318', 'sz000977', 'sz000651', 'sh600305',
'sz000002', 'sz002191', 'sz002475', 'sh601066', 'sz002415', 'sz002507', 'sz002946', 'sh605009', 'sh600380', 'sz002624', 
'sh603368', 'sh600570', 'sh600703', 'sh600298', 'sh601966', 'sh601985', 'sz002891', 'sh600887', 'sz002001'
]
names = ['东山精密: sz002384', '小熊电器: sz002959', '中顺洁柔: sz002511', '华兰生物: sz002007', '美诺华(: sh603538', '中联重科: sz000157', '晨光文具: sh603899', '海大集团: sz002311', '中兴通讯: sz000063', 'TCL科: sz000100', '天坛生物: sh600161', '长江电力: sh600900', '丽珠集团: sz000513', '恒瑞医药: sh600276', '顺丰控股: sz002352', '隆基股份: sh601012', '中国平安: sh601318', '浪潮信息: sz000977', '格力电器: sz000651', '恒顺醋业: sh600305', '万  科: sz000002', '劲嘉股份: sz002191', '立讯精密: sz002475', '中信建投: sh601066', '海康威视: sz002415', '涪陵榨菜: sz002507', '新乳业(: sz002946', '豪悦护理: sh605009', '健康元(: sh600380', '完美世界: sz002624', '柳药股份: sh603368', '恒生电子: sh600570', '三安光电: sh600703', '安琪酵母: sh600298', '玲珑轮胎: sh601966', '中国核电: sh601985', '中宠股份: sz002891', '伊利股份: sh600887', '新 和 : sz002001']










def traceToCsv(code):
  data = ts.get_hist_data(code, ktype='D', start='2020-12-23',end='2021-6-11')
  # data = ts.get_hist_data(code, ktype='D')
  data.to_csv('word/' + code+'.csv')

win_count = 0
lose_count = 0

def huiceStrategy(code):
  CSV_FILE_PATH = './word/'+ code +'.csv'
  length = 0
  with open(CSV_FILE_PATH, 'r') as f:
    length = len(f.readlines())

  df = pd.read_csv(CSV_FILE_PATH)
  data = df.head(length)
  data2 = data.sort_index(ascending=False)

  money = 100000
  arr = [] #记录拥有数量
  totalCount = 0
  buyMoney = 0
  buyPrice = 0

  for index,row in data2.iterrows():
    # print(row['ma5'],type(row['ma5']))
    #买    #价格
    price = row['close']
    row['price'] = price
    if(buyPrice!=0):
      row['buyPrice'] = buyPrice
    if(Trace.chengjiaoliangTrace(row) == 1 and money>price*100):
      count = int((money/price)/100)*100
      buyMoney += count*price
      money -= count*price
      # print("buy"+str(row['date']),'价格：'+ str(price)+' 总价格：'+ str(buyMoney))
      totalCount += count
      buyPrice = price

    if(Trace.chengjiaoliangTrace(row)==0 and totalCount>0):
      sellM = totalCount*price
      money = money + sellM
      arr.append(sellM-buyMoney)
      if(sellM - buyMoney > 0):
        global win_count
        win_count = win_count + 1
      else:
        global lose_count
        lose_count = lose_count + 1
      totalCount = 0
      # print('sell'+str(row['date']), sellM, sellM - buyMoney, money)
      buyMoney = 0
      buyPrice = 0  

    if(index == 0 and totalCount > 0):
      money += price*totalCount

  print(arr)
  print(money)


if __name__ == "__main__":

  index = 0
  # codes =['sz002959']
  for code in codes:
    print(code+'...................'+names[index])
    index = index + 1
    # traceToCsv(code)
    huiceStrategy(code)

  scale = 0
  if(win_count != 0):
    scale = win_count/(win_count+lose_count)
  print('胜率：'+str(scale))

