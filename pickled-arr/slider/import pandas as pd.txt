import pandas as pd
import os
import csv
import pickle

files=os.listdir("slider")
data={}
data['filename']=[]
data['val']=[]
for count,file in enumerate(files):
    with open(os.path.join("slider",file),"rb") as f:
        #print(os.path.join("slider",file))
        try:
            arr=pickle.load(f)
            data['filename'].append(file)
            data['val'].append(arr)
        except:pass
df=pd.DataFrame.from_dict(data)
df.to_csv("slider.csv",index=False)