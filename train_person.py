import pandas as pd
from sodapy import Socrata
import numpy as np

from sklearn.model_selection import train_test_split
from sklearn.neural_network import MLPClassifier
from sklearn.metrics import accuracy_score
from sklearn.preprocessing import OneHotEncoder
from sklearn import preprocessing

import pickle

# Unauthenticated client only works with public data sets. Note 'None'
# in place of application token, and no username or password:
client = Socrata("data.cityofnewyork.us", "9Vn3YU7fWrnw9y3m3Nh9rZzhi")

# Example authenticated client (needed for non-public datasets):
# client = Socrata(data.cityofnewyork.us,
#                  MyAppToken,
#                  username="user@example.com",
#                  password="AFakePassword")

# First 2000 results, returned as JSON from API / converted to Python list of
# dictionaries by sodapy.
'''
results = client.get("h9gi-nx95",limit = 100000)

# Convert to pandas DataFrame
df = pd.DataFrame.from_records(results)

#link = 'https://www.nyc.gov/assets/nypd/downloads/excel/traffic_data/cityacc-en-us.xlsx'
#results_2 = pd.read_excel(link,'GeoCollisions_1')
#df = results_2.head(86).tail(82)

#result_clean = df.drop(df.columns[[13]],axis = 1)
#print(result_clean)


df.rename(columns = {
                    'crash_date'        : 'date',
                    'crash_time'        : 'time',
                    'on_street_name'    : 'street_on',
                    'cross_street_name' : 'street_cross',
                    'off_street_name'   : 'street_off',
                    'number_of_persons_injured'     : 'total_injured',
                    'number_of_persons_killed'      : 'total_killed',
                    'number_of_pedestrians_injured' : 'ped_injured',
                    'number_of_pedestrians_killed'  : 'ped_killed',
                    'number_of_cyclist_injured'     : 'cyc_injured',
                    'number_of_cyclist_killed'      : 'cyc_killed',
                    'number_of_motorist_injured'    : 'moto_injured',
                    'number_of_motorist_killed'     : 'moto_killed',
                    'contributing_factor_vehicle_1' : 'veh_factor_1',
                    'contributing_factor_vehicle_2' : 'veh_factor_2',
                    'contributing_factor_vehicle_3' : 'veh_factor_3',
                    'contributing_factor_vehicle_4' : 'veh_factor_4',
                    'contributing_factor_vehicle_5' : 'veh_factor_5',
                    'vehicle_type_code1' : 'veh_type_1',
                    'vehicle_type_code2' : 'veh_type_2',
                    'vehicle_type_code_3' : 'veh_type_3',
                    'vehicle_type_code_4' : 'veh_type_4',
                    'vehicle_type_code_5' : 'veh_type_5'},inplace = True)

df = df[df.borough.notnull()]
df = df[df.veh_type_1.notnull()]
#df.loc[df['borough'].isnull(), 'borough'] = 'NYC'
#df['date'] = df['date'] + ' ' + df['time']
#df['date'] = pd.to_datetime(df.date)
#df['date_year'] = pd.to_datetime(df['date']).dt.year
#df['date_month'] = pd.to_datetime(df['date']).dt.month
df = df[(df['date'] > '2020-01-01')]
#print(df.info())
df = df.groupby(['veh_type_1','borough']).collision_id.count()
sum = df.sum().item()
count = df.count().item()
print (count)
df = df.to_frame()
print(df)
'''


#df['collision_id'] = df['collision_id'].apply(number_to_indices)



results2 = client.get("f55k-p6yu", limit=100000)
df2 = pd.DataFrame.from_records(results2)
print(df2.info())
df2.rename(columns = {
    'person_sex' :'sex',
    'person_age': 'age'
},inplace = True)
df2 = df2[(df2['ped_role'] == 'Driver')]
df2 = df2[(df2['sex'] != 'U')]

df2 = df2[df2.sex.notnull()]
df2 = df2[df2.age.notnull()]

df2.to_csv('out.csv', sep='\t')

df2 = df2.groupby(['age','sex']).unique_id.count()

sum2 = df2.sum().item()
df2 = df2.to_frame()
df2 = df2.reset_index(level = [0,1])

def number_to_indices_2(ind):
    if ind/sum2 < 0.01:
        return 1
    elif ind/sum2 <0.05:
        return 2
    elif ind/sum2 <0.1:
        return 3
    elif ind/sum2 < 0.2:
        return 4
    else:
        return 5

df2['unique_id'] = df2['unique_id'].apply(number_to_indices_2)
df2.rename(columns = {'unique_id':'index'},inplace = True)

def sex_to_int (s):
    if s == 'F':
        return '0'
    else:
        return '1'
df2['sex'] = df2['sex'].apply(sex_to_int)
#print(df2)
X = df2.drop(['index'],axis = 1)
y = df2['index']

X = X.values
y = y.values

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=123)
model = MLPClassifier()
model.fit(X_train, y_train)
accuracy_score(y_train, model.predict(X_train))
accuracy_score(y_test, model.predict(X_test))

filename = 'person_model.sav'
pickle.dump(model, open(filename,'wb'))

loaded_model = pickle.load(open(filename,'rb'))
