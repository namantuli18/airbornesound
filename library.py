import argparse
from tensorflow import keras
import numpy as np
import librosa

my_parser = argparse.ArgumentParser()
my_parser.add_argument('--type', action='store')
my_parser.add_argument('--audio', action='store',required=True)

args = my_parser.parse_args()

device=(args.type)
path=args.audio

dictionary=["pump","fan","valve","slider"]

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
	Y = data[:, 1]
	X = np.empty([X_.shape[0], 128])
	for i in range(X_.shape[0]):
		X[i] = (X_[i])
	X_test = X.reshape(len(X), 16, 8, 1)
	return (X_test)
if device:
	model1 = keras.models.load_model('webApp/models/6dB/{}.h5'.format(device))
	model2 = keras.models.load_model('webApp/models/-6dB/{}.h5'.format(device))
	model3 = keras.models.load_model('webApp/models/0dB/{}.h5'.format(device))

	print("Probability for the given {} sound being an anomaly is {}".format(device,0.8*model1.predict(output(path))[0][1]+0.1*model2.predict(output(path))[0][1]+0.1*model3.predict(output(path))[0][1]))


else:
	device = keras.models.load_model('webApp/models/6dB/instrument_classifier.h5')
	device = dictionary[np.argmax(device.predict(output(path)))]
	model1 = keras.models.load_model('webApp/models/6dB/{}.h5'.format(device))
	model2 = keras.models.load_model('webApp/models/-6dB/{}.h5'.format(device))
	model3 = keras.models.load_model('webApp/models/0dB/{}.h5'.format(device))
	print("Device type detected : {}".format(device))
	print("Probability for the given {} sound being an anomaly is {}".format(device,0.8*model1.predict(output(path))[0][1]+0.1*model2.predict(output(path))[0][1]+0.1*model3.predict(output(path))[0][1]))