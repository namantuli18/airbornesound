# filename = "venv/Scripts/activate_this.py"
# exec(compile(open(filename).read(),filename,'exec'), globals(), globals())
import os
import pandas as pd
import numpy as np
import tensorflow as tf
import librosa
from tensorflow import keras
import sys
import time
start_time = time.time()
#print(sys.argv[1])
input_dim = (16, 8,1)
dictionary=["pump","fan","valve","slider"]

def model_loader_instrument():
	model = keras.models.load_model('models/6dB/instrument_classifier.h5')
	model_1 = keras.models.load_model('models/6dB/pump.h5')
	model_2 = keras.models.load_model('models/6dB/fan.h5')
	model_3 = keras.models.load_model('models/6dB/valve.h5')
	model_4 = keras.models.load_model('models/6dB/slider.h5')
	return model,model_1,model_2,model_3,model_4

def output(file_name):
	feature=[]
	label=[]
	X, sample_rate = librosa.load(file_name, res_type='kaiser_fast')
	mels = np.mean(librosa.feature.melspectrogram(y=X, sr=sample_rate).T,axis=0)
	feature.append(mels)
	label.append("prime")
	temp = [feature,label]
	temp = np.array(temp)
	data = temp.transpose()
	X_ = data[:,0]
	#print(X_.shape)
	Y = data[:, 1]
	X = np.empty([X_.shape[0], 128])
	for i in range(X_.shape[0]):
		X[i] = (X_[i])
	X_test = X.reshape(len(X), 16, 8, 1)
	return (X_test)
models={}
models['classifier'],models['pump'],models['fan'],models['valve'],models['slider']=model_loader_instrument()


path='uploads/'+sys.argv[1]
#path='../00000000.wav'
type_=dictionary[np.argmax(models['classifier'].predict(output(path)))]
print(type_,"with probability",np.max(models['classifier'].predict(output(path))))
print(np.argmax(models[type_].predict(output(path))),"with probability",np.max(models[type_].predict(output(path))))
