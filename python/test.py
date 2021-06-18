#!/usr/bin/python
# -*- coding:utf-8 -*-

import os
import re
from urllib import request
import tushare as ts

class Student():
    def __init__(self, id, name):
        self.id = id
        self.name = name
    def __repr__(self):#解释类函数
        return "me id:"+str(self.id)+"me name:"+self.name
    def __class__(self):
        print(f"my name is +{self.name}")

    @classmethod
    def f(cls):
        print(cls)

ming = Student(100, "zan")
print(ming)

#是否能被调用
print(callable(str))

#字典
map = dict(a="a", b="b")
print(map)

#打开文件
# print(os.path.abspath("."))
# fo = open("/Users/zhangshuailei/Desktop/python/test.rtf", mode='r', encoding='utf-8')
# print(fo.read())

#集合类型(集合中不能有重复的元素)
a = [1,2,3,4,4,5]
print(set(a))

#元组 (元组不能被改变)
print(tuple(a))

#nonlocal i 生命i为非局部变量， global i i为全局变量

def max_len(*lists):
    return max(*lists, key=lambda v:len(v))

r = max_len([1,2,3], [4,5])
print(r)

#正则表达式
s = "一共有20个央视的45，label"
pat = r'\d+\.?\d+'
r = re.findall(pat, s)
print(r)

s2 = 'mThis module provides regular epression matching operations similar to those found in Perl'
pat = r'^[emrt].*[lrt]$' # 查找以字符e,m,r或t开始以lrt结尾的字符串
r2 = re.findall(pat,s2)
print(r2)

#compile
pat = re.compile('\W+')
has = pat.search('fsdfew@4411%.')
print(has.group(0))
again = pat.findall("gsdgdsg@qq.com")
print(again)

#获取文件后缀名
file_ext = os.path.splitext('/test.rtf')
print(file_ext)
print(file_ext[1])

# f = open('/test.rtf')
# flist = f.read()
# f.close()
# print(flist)

work_dir = '/Users/zhangshuailei/work'
for filename in os.listdir(work_dir):
    #Sprint(filename)
    pat = r'.+\..+'
    f = re.findall(pat,str(filename))
    if len(f)>0:
        file_ext = os.path.splitext(filename)
        print(file_ext)

#生成器：用到的时候才生成减少消耗
#装饰器：对函数执行一些固定操作必须接受一个函数作为参数，返回另一个函数
#迭代器：
def call_print(f):
    def g():
        print('输出函数名：'+f.__name__)
        f()
    return g

@call_print
def fun():
    print('做一件我的事情！')

fun()

import turtle as p

#绘图
import turtle as p

def drawcircle(x, y, c='red'):
    p.pensize(3)
    p.pu()
    p.goto(x,y)#绘制圆的起始位置
    p.pd()
    p.color(c)
    p.circle(200, 360)


# drawcircle(0,0, 'blue')
# p.done()

#一个元素的元组 （5，）

i = 1
def f():
    global i
    i += 1

f()

a = [lambda x,i=i: x+i for i in range(3)] # YES!
for f in a:
    print(f(1))

def f(a):
  print(f'a:{a}')

f(1)

arr = {'a':'123'}
print(arr['a'][0])

#写文档
import xlrd,xlwt
# import time
# workbook = xlwt.Workbook()
# sheet = workbook.add_sheet("sheet")
# sheet.write(0,0,'代码')
# sheet.write(0,1,'是否买入')
# sheet.write(1,0, 'sz000002')
# sheet.write(1,1, 0)
# workbook.save("traceCode.xls")

#读数据
wordName = 'traceCode.xls'
if(not os.path.exists(wordName)):
    workbook = xlwt.Workbook()
    sheet = workbook.add_sheet("sheet")
    sheet.write(0,0,'代码')
    sheet.write(0,1,'是否买入')
    sheet.write(1,0, 'sz000002')
    sheet.write(1,1, 0)
    workbook.save(wordName)

table = xlrd.open_workbook(wordName)
sheet = table.sheet_by_index(0)
rows = sheet.nrows
cols = sheet.ncols
print('开始：')
obj = {}
for i in range(1, rows):
    obj[sheet.cell(i,0).value] = sheet.cell(i,1).value

# workbook = xlwt.Workbook()
# sheet = workbook.add_sheet("sheet")
# sheet.write(0,0,'code')
# sheet.write(0,1,'hasBuy')
# index = 1
# obj = {'a':'1', 'b':'2'}
# for k in obj:
#     sheet.write(index, 0, k)
#     sheet.write(index, 1, obj[k])
#     index = index + 1

# workbook.save(wordName)

print(1 == 1.0)

obj = [{'a':'b'}, {'b':'c'}]
for v in obj:
    for k in v:
        print(k, v[k])

arr=[]
arr.append({'a':'b'})
print(arr)


print(type({}) == dict)



# data = ts.get_hist_data('sz000002', ktype='D')
# print(data)
# df = ts.get_realtime_quotes('sz000002')
# for v in df:
#     print(v)
# print(df)

# df = ts.get_report_data(2021, 1)#获得eps
# print(df)

'''
import requests
from lxml import etree
import pandas as pd

url = 'http://www.weather.com.cn/weather1d/101010100.shtml#input'
with requests.get(url) as res:
    content = res.content
    html = etree.HTML(content)
    # print(content)
    location = html.xpath('//*[@id="around"]//a[@target="_blank"]/span/text()')
    temperature = html.xpath('//*[@id="around"]/div/ul/li/a/i/text()')
    print(location)
    print(temperature)

    df = pd.DataFrame({'location':location, 'temperature':temperature})
    print('温度列')
    print(df['temperature'])

    df['high'] = df['temperature'].apply(lambda x: int(re.match('(-?[0-9]*?)/-?[0-9]*?°C', x).group(1) ) )
    df['low'] = df['temperature'].apply(lambda x: int(re.match('-?[0-9]*?/(-?[0-9]*?)°C', x).group(1) ) )
    print(df)
    print(type(df))

array = [[1,2,3,4,5],[6,6,7,8,9]]
print(array[:3])
'''
ts.set_token('07d57668421685e33ddb01371a2b64b62d2fa5d69e370cae2f33b820')






