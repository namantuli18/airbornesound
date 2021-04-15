import pickle        
import base64
import csv
import os
import pandas as pd
import json
import numpy
from collections import Counter
arr=[]
with open(os.path.join("slider",'label_distributions.pb'),"rb") as f:
    try:
        arr.append(pickle.load(f))
    except Exception as e:
        print('Hello'+str(e))
with open(os.path.join("slider",'Y_cummulative.pb'),"rb") as f:
    try:
        temp=pickle.load(f)
        for i in temp:
            arr.append(i)
        for i in arr:
            print(i)
    except:pass

numpy.savetxt("l_dist.csv", arr, delimiter=",")


