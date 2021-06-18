
from numpy.core.fromnumeric import size
import pandas as pd
import numpy as np

import matplotlib.pylab as plt

'''
s = pd.Series([1,2,3,4, np.nan])
print(np.nan)
print(s)

dates = pd.date_range('20200102', periods=6)
print(dates)

df = pd.DataFrame(np.random.randn(6,4), index=dates, columns=list('ABCD'))
# print(np.random.randn(6,4)) 生成6行4列随机数
print(df)

print(df.head(1))
print(df.tail(1))
print(df.index)
print(df.columns)

print(df.to_numpy())

print(df.describe())

print(df.T)

print(df.sort_index(axis=1, ascending=True))

print(df.sort_values(by='B'))

print(df.A)

print(df[1:3])

print(df.loc[dates[0], ['A','B']])#获取数据

print(df.iloc[3])#获取一列

print(df.iloc[3:5, 0:2])

print(df.iloc[1,1])#一行一列的数据

print(df[df.A>0])

df2 = df.copy()
df2['E'] = ['one', 'one', 'two', 'three', 'four', 'three']

print(df2[df2['E'].isin(['two', 'four'])])

df.iat[0,1] = 0

df.loc[:, 'D'] = np.array([5]*len(df))
print(np.array([5]*len(df)))

# print(df)

print(df.mean())
print(df.mean(1))
print(type(np.nan))

s = pd.Series([1,3,5, 2, 6,8]).shift(1)
print(s)

print(df.apply(np.cumsum))
print(df.apply(lambda x: x.max()-x.min()))
print(df)

s = pd.Series(np.random.randint(0,7, size=10))
print(s)
print(s.value_counts())

df = pd.DataFrame(np.random.randn(10,4))
print(df)

left = pd.DataFrame({'key':['foo', 'bar'], 'lval':[1,3]})
right = pd.DataFrame({'key':['foo', 'bar'], 'rval':[4,5]})

print(pd.merge(left, right, on='key'))

df = pd.DataFrame(np.random.randn(6, 4), columns=['A', 'B', 'c', 'd'])
s = df.iloc[3]
print(df.append(s, ignore_index=True)) #ignore_index忽略原来的index添加一个新的
print(np.random.randn(5))

df = pd.DataFrame({'id':[1,2,3,4,5,6], 'raw':['a','b','c','d','e','f']})
df['grade'] = df['raw'].astype('category')

print(df)

ts = pd.Series(np.random.randn(100), index=pd.date_range('1/1/2000', periods=100))
# print(ts.iloc[90:])
ts = ts.cumsum()
# print(ts.iloc[90:])
# ts.plot.line()

df = pd.DataFrame(np.random.randn(100,4), index=ts.index, columns=['a','b','c','d'])
df.cumsum()
# plt.figure()
# df.plot.line()
# plt.legend(loc='best')

# df.to_csv('word/test.csv')
# print(pd.read_csv('word/test.csv'))

# df.to_hdf('test.h5', key='df')
# pd.read_hdf('test.h5', key='df')

# df.to_excel('test.xlsx', sheet_name='sheet1')
# print(pd.read_excel('test.xlsx','sheet1',index_col=None,na_values=['NA']))

plt.show()
'''

index = pd.date_range('1/2/2020', periods=8)
print(index)
s = pd.Series(np.random.randn(5), index=['a','b','c','d','e'])
print(s)
df = pd.DataFrame(np.random.randn(8,3), index=index, columns=['a','b','c'])
print(df)

long_series = pd.Series(np.random.randn(10))
print(long_series.head())
print(long_series.tail())

df.columns = [x.upper() for x in df.columns]
print(df)

print(s.array)
print(s.index.array)
#提取numpy数据
print(s.to_numpy())
print(np.asarray(s))

#排序
df = pd.DataFrame({
    't1':pd.Series(np.random.randn(3), index=['a','b','c']),
    't2':pd.Series(np.random.randn(4), index=['a','b','c','d']),
    't3':pd.Series(np.random.randn(3), index=['a','b','c'])
})

sortdf = df.reindex(index=['a','c','d','b'], columns=['t3','t2','t1'])
print(sortdf)

print(sortdf.sort_index())
print(sortdf.sort_index(axis=1))

print(sortdf['t3'].sort_index())

print(sortdf.sort_values(by='t1'))

print(sortdf.sort_values(by=['t1', 't2'])) #先按照t1，t1一样按照t2

ser = pd.Series([1,2,3])
print(ser.searchsorted([0,2]))

s = pd.Series(np.random.permutation(10))
print(s)

print(s.sort_values())

print(s.nsmallest(3))

print(s.nlargest())

df = pd.read_excel('word/JJ.xlsx')
print(df['基金代码'][0][0:6])
print(len(df))


