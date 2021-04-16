import pickle        
import base64
import csv
import os
import pandas as pd
import json
import numpy
from collections import Counter
arr=[]
dire="slider"
with open(os.path.join(dire,'label_distributions.pb'),"rb") as f:
    try:
        arr.append(pickle.load(f))
    except Exception as e:
        print('Hello'+str(e))
with open(os.path.join(dire,'Y_cummulative.pb'),"rb") as f:
    try:
        temp=pickle.load(f)
        for i in temp:
            arr.append(i)
        for i in arr:
            print(i)
    except:pass

numpy.savetxt("../webApp/csv/"+dire+"/l_dist.csv", arr, delimiter=",")
with open(os.path.join(dire,'U_vggish.pb'),"rb") as f:
    try:
        arr2=(pickle.load(f))
    except Exception as e:
        print('Hello'+str(e))
numpy.savetxt("../webApp/csv/"+dire+"/U_vggish.csv", arr2, delimiter=",")
with open(os.path.join(dire,'Y.pb'),"rb") as f:
    try:
        arr3=(pickle.load(f))
    except Exception as e:
        print('Hello'+str(e))
numpy.savetxt("../webApp/csv/"+dire+"/Y.csv", arr3, delimiter=",")
with open(os.path.join(dire,'U_mfcc.pb'),"rb") as f:
    try:
        arr4=(pickle.load(f))
    except Exception as e:
        print('Hello'+str(e))
numpy.savetxt("../webApp/csv/"+dire+"/U_mfcc.csv", arr4, delimiter=",")

