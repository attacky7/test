#!/usr/bin/python
# -*- coding: UTF-8 -*-

#超过多少比率
lageRatio = 0.02
#范围
fanwei = 0.1

#下锥倍数
BOTTOM_SCALE = 3
#上锥倍数
TOP_SCALE = 0.5
#止损百分比
SUN_RATIO = 0.05

# v_ma5 5日平均成交量
class Trace(object):
    
    def dingzhuiTrace(row):
        #这个是下顶锥策略
        open = row['open']
        close = row['close']
        high = row['high']
        low = row['low']

        ma5 =row['ma5']
        ma20 = row['ma20']

        v_ma5 =row['v_ma5']
        v_ma10 = row['v_ma10']
        v_ma20 = row['v_ma20']

        buyPrice = 0
        if('buyPrice' in row):
            buyPrice = row['buyPrice']
        price = row['price']
        #止损点
        if(buyPrice*(1-SUN_RATIO)>price):
            return 0

        #是否买
        if(open>close):
            #下锥
            bottomZ = close - low
            #上锥
            topZ = high - open

            if(bottomZ/(open-close)>BOTTOM_SCALE and topZ/(open-close)<TOP_SCALE and ma5<ma20 and v_ma5>v_ma20):
                return 1

            # if(topZ/(open-close)>BOTTOM_SCALE/2 and bottomZ/(open-close)<TOP_SCALE and ma5<ma20):
            #     return 0
            if(v_ma5<v_ma20 and ma5>ma20*(1+lageRatio)):
                return 0
        elif(open != close):
            #下锥   
            bottomZ = open - low
            #上锥
            topZ = high - close

            if(bottomZ/(close-open)>BOTTOM_SCALE and topZ/(close-open)<TOP_SCALE and ma5<ma20 and v_ma5>v_ma20):
                return 1

            # if(topZ/(close-open)>BOTTOM_SCALE/2 and bottomZ/(close-open)<TOP_SCALE and ma5<ma20):
            #     return 0
            if(v_ma5<v_ma20 and ma5>ma20*(1+lageRatio)):
                return 0

        return -1

    def chengjiaoliangTrace(row):

        ma5 =row['ma5']
        ma10 = row['ma10']
        ma20 = row['ma20']

        v_ma5 =row['v_ma5']
        v_ma10 = row['v_ma10']
        v_ma20 = row['v_ma20']

        buyPrice = 0
        if('buyPrice' in row):
            buyPrice = row['buyPrice']
        price = row['close']

        #止损跌15%
        if(buyPrice*(1-SUN_RATIO)>price):
            return 0

        #买下跌且缩量，卖上涨且放量
        if(ma5<ma20*(1-lageRatio) and v_ma5<v_ma20*(1-lageRatio*3)):
            return 1

        #止盈和止损
        if(ma5>ma20*(1+lageRatio) and v_ma5<v_ma20*(1-lageRatio)):
            return 0

        return -1
