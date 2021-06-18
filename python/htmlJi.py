import requests
from bs4 import BeautifulSoup
import re
import time
from datetime import datetime
import pandas as pd

RADIO = 0.05

# https://fundf10.eastmoney.com/F10DataApi.aspx?type=lsjz&code=260108&page=1&sdate=2021-04-19&edate=2021-06-18&per=20
def getHTMLText(url):
    try:
        r = requests.get(url)
        r.raise_for_status()
        r.encoding = r.apparent_encoding
        return r.text
    except:
        return ""
 
 
def getJJHistory(lst):

    left_time = time.strftime('%Y-%m-%d',time.localtime(time.time()-60*24*60*60))
    right_time = time.strftime('%Y-%m-%d',time.localtime())
    
    # print(left_time, right_time)
    codes, names = getJJCode()
    nameIndex = 0
    for code in codes:

        arr = []
        for page in range(1,3):
            stockURL = getUrl(code, left_time, right_time, str(page))
            html = getHTMLText(stockURL)
            
            pat = re.compile(r'<td class=\'tor bold\'>[0-9.]+</td>')

            result = pat.findall(html)

            index = 0
            for v in result:
                if(index%2==0):
                    pat2 = re.compile(r'[0-9.]+')
                    arr.append(float(pat2.findall(v)[0]))
                index = index + 1

        if(getJJLow(arr)):
            lst.append(names[nameIndex]+ '：' + code)
        nameIndex = nameIndex + 1

def getUrl(code, left, right, page):
    return 'https://fundf10.eastmoney.com/F10DataApi.aspx?type=lsjz&code='+ code +'&page='+page+'&sdate='+left+'&edate='+right+'&per=20'

#获得是否低估
def getJJLow(arr):

    sum = 0
    max = 0
    new = 0
    index = 0
    for v in arr:
        sum = sum + float(v)
        if(index == 0):
            new = float(v)
        
        if(float(v)>max):
            max = float(v)

        index = index + 1

    if(new <= max*(1-RADIO)):
        return True

    return False


def getJJCode():
    df = pd.read_excel('word/JJ.xlsx')
    codes = []
    names = []
    for v in range(len(df)-1):
        codes.append(df['基金代码'][v][0:6])
        names.append(df['基金简称'][v])
    return codes, names

if __name__ == "__main__":
    slist = []
    getJJHistory(slist)
    print('低估：', slist)
    # print(getJJCode())

