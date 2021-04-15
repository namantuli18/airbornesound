import pickle        
import base64
import csv
import os
import pandas as pd
import json
import numpy
data={}
with open(os.path.join("slider",'U_mfcc.pb'),"rb") as f:
    try:
        arr=pickle.load(f)
        print(arr[3])
        data['values']= arr
        print(data['values'])
    except:pass
numpy.savetxt("foo.csv", arr, delimiter=",")
df=pd.DataFrame.from_dict(data)
pd.DataFrame(arr).to_csv("slider.csv")
