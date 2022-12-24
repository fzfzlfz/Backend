import sys
import pandas as pd
#from sodapy import Socrata
import numpy as np
import json

from sklearn.model_selection import train_test_split
from sklearn.neural_network import MLPClassifier
from sklearn.metrics import accuracy_score
from sklearn.preprocessing import OneHotEncoder
from sklearn import preprocessing

import pickle


age = eval(sys.argv[1])
sex = eval(sys.argv[2])

input = np.zeros((1,2))
input[0][0] = age
input[0][1] = sex

filename = 'person_model.sav'


loaded_model = pickle.load(open(filename,'rb'))
result = loaded_model.predict(input)
output = result[0]
file1 = open("price.txt","w+")
file1.write(str(output))

