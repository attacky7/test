import requests
from bs4 import BeautifulSoup
import re

codes = [
'sz002384', 'sz002959', 'sz002511', 'sz002007', 'sh603538', 'sz000157', 'sh603899', 'sz002311', 'sz000063', 'sz000100',
'sh600161', 'sh600900', 'sz000513', 'sh600276', 'sz002352', 'sh601012', 'sh601318', 'sz000977', 'sz000651', 'sh600305',
'sz000002', 'sz002191', 'sz002475', 'sh601066', 'sz002415', 'sz002507', 'sz002946', 'sh605009', 'sh600380', 'sz002624', 
'sh603368', 'sh600570', 'sh600703', 'sh600298', 'sh601966', 'sh601985', 'sz002891', 'sh600887', 'sz002001'
]
 
 
def getHTMLText(url):
    try:
        r = requests.get(url)
        r.raise_for_status()
        r.encoding = r.apparent_encoding
        return r.text
    except:
        return ""
 
 
def getStockList(lst):
    
    for code in codes:
        stockURL = 'http://quote.eastmoney.com/'+ code +'.html'
        html = getHTMLText(stockURL)
        
        pat = re.compile(r'<title>.*</title>')

        result = pat.findall(html)[0]
        print(result)
        lst.append(result[7:11] + ': ' + code)
 

#获取成交额与总市值
def getChengjiaoeList(lst):
    
    for code in codes:
        stockURL = 'http://quote.eastmoney.com/'+ code +'.html'
        html = getHTMLText(stockURL)
        # html = '<td>成交额：</td>\
        #             <td id="gt12" class="txtl" data-bind="48">18.85亿</td>'
        print(html)
        pat = re.compile(r'18.85亿')

        result = pat.findall(html)
        print(result)

if __name__ == "__main__":
    slist = []
    getChengjiaoeList(slist)


