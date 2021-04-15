import pickle        
import base64
import csv
import os
import pandas as pd
import json
import numpy
from collections import Counter
data={}
with open(os.path.join("slider",'Y.pb'),"rb") as f:
    try:
        arr=pickle.load(f)
        print(arr[3])
        data['values']= arr
        print(data['values'])
    except:pass
numpy.savetxt("U_vggish_Y.csv", arr, delimiter=",")

