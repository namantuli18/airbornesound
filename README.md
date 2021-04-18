# Anomaly Detection Using Airborne Sound 

## Working Prototype
  A working prototype of the model architecture is available at http://138.91.121.137/
  
  The user credentials to access the portal are:
    1. Username : Admin
    2. Password : Ad_quirk@123


- Instructions to reproduce the results are located at [instructions](https://github.com/namantuli18/airbornesound#custom-training)
- To use our pretrained library of models, check [demo](https://github.com/namantuli18/airbornesound#using-pre-existing-library-of-models)

## Description  
  Acoustic condition monitoring via airborne sound analysis in conjunction with advanced signal processing and machine learning methods has proved to be a powerful tool 
  for early detection of machinery breakdown. It allows timely detection of anomalies, which results in more efficient and cost-effective maintenance. It also
  provides a simple and effective method to retrofit to existing plants and environments where this could otherwise be costly.
  <p align="center">
    <img src ="https://github.com/namantuli18/airbornesound/blob/master/Gallery/inputnew.png" width="450" height="300">
  <p>
    
  We plan to implement a federated approach to build a robust algorithm that detects anomalous sounds using 
  Airborne Sound Analysis and incorporates ensembling based techniques to further improve upon the performance & efficiency of a solo model and ensures better scalability.
  
    
 ## Problems Faced <h2> 
   * Maintenance in various industries consuming unnecessary resources, increase operational costs and cripple daily operations. 
   * Defects going undetected and unaddressed leading to major industrial plant failures. 
   * Predictive Maintenance could be helpful but installing various sensors on individual machines in older plants can be costly. 
   * A new approach could be to use the airborne sound by placing various acoustic sensors strategically around the facility. 
  
  ## Ideation Strategies <h2> 
  We have implemented a Supervised Learning technique that encapsulates the following features into a robust algorithm for Anomaly Detection-
   * CNNs for primary Sound Classification.
   * Individual models for each volume level. 
   * Multi volume ensembling for more stable results.
   * Separate model for classifying the equipment.
   * Real time audio visualizations.
   * Optimal mic-array placing algorithm.

   ## Flow of Control for building the model [CNNs for Sound Classification ]<h2>
   * Loading the wave files.
   * Use an image spectrogram and convert the image to data points.
   * Convert labels to categorical data.
   * Build a CNN Model.
   * Train the model.
   * Pickled the model for further use.
   
  **Note:** The same procedure is followed to build an anomaly detection for each instrument belonging to each volume level.

  ## Features provided by **QUIRK** <h2>
  The Login Page not only provides site access for the user, but also allows the website to track user actions and behavior. 
  
  ![](https://github.com/namantuli18/airbornesound/blob/master/Gallery/dashboard.png)
  
  Real time plotting of the individual device predictions helps presenting data that are too numerous or complicated to be described adequately and efficiently.
  
   <img src="https://github.com/namantuli18/airbornesound/blob/master/Gallery/upload_area.png" width="400" height="300">          <img src="https://github.com/namantuli18/airbornesound/blob/master/Gallery/Final_analysis.png" width="400" height="300">
  
  The sample to be detected is uploaded as shown above. Final results show the predicted device and confidence in probability. There's also an option for the user to download the final predicted reports. Previous results are also displayed for future purposes.

  ## Semi-Supervised Image Classification
  **Why is there a need for Semi-Supervised Learning?**
  * Lack of readily available real world or industrial data.
  * Disparity between large amount of obtainable data and insufficient labeled data.
  * Class imbalance in case of audio anomaly detection.
  
  **Features of Semi-Supervised Learning-**
  * It is a combination of the Supervised & Unsupervised learning algorithms.
  * Provides benefits of both supervised & unsupervised approaches.
  * Cluster analysis can be used to visualize the data distribution better.
  * We can train basic models without having to use as much of the labeled data for training.
  
  **What is a Semi-Supervised approach?**
  * Train the model with the small amount of labeled training data just like you would in the supervised learning until it gives you good results.
  * Then us it with the unlabeled training dataset to predict the outputs which are pseudo labels since they may not be quite accurate.
  * Link the labels from the labeled training data with the pseudo labels created in the previous step.
  * Link the data inputs in the labeled training data with the inputs in the unlabeled data.ext 
  * Then, train the model the same way as you did with the labeled set in the beginning in order to decrese the error and improve the model's accuracy.

**Formulating the Semi-Supervised Learning Approach-**
* The dataset for the project has been fetched from Dataset: Sound Dataset for Malfunctioning Industrial.
*  n addition to the approach used in Supervised Learning based on MFCC’s, we have used VGG embeddings for the anomaly detection process.
*  VGGish is a model released by Google and uses Tensorflow to perceive the process of Audio Classification as an Image Classification task.
*  It has been trained on millions of sound files.
*  The output of the model is a 128-dimensional vector representing the learned feature representation of the audio that was used to feed into the fully-connected classification network to learn to classify on the AudioSet dataset, meaning that any information that was relevant in classifying AudioSet has been extracted and is contained in the embedding. 
*  Mel-frequency cepstral coefficients are a common audio feature representation, especially in the field of speech recognition, and give a representation of the timbre of a sound. 
*  They are calculated by first converting the audio into a Mel-frequency spectrogram using a short-term Fourier transform (STFT).
*  A Fourier transform is then taken along the frequency axis of the spectrogram which results in the values for MFCCs .
*  In this paper, two feature extraction methods are applied to the individual instrument datasets for anomaly detection- 128-dimensional VGGish embeddings and Mel-frequency cepstral coefficients (MFCCs).
*  The processed dataset (with audio embeddings) will be trained using a Random Forest classifier using EM.
*  Results will be compared based on performances from two feature extractors. We then investigate the likelihood of unlabeled audio data being accurately concluded from partially labeled audio inputs.
*  We have ensured that the comparison of model performance and scoring is done on the same splits of data which is stratified on the basis of distribution of classes.

### t-SNE Dimensional Reduction of VGGish Embeddings <h3>
<p align="center">
    <img src ="https://github.com/namantuli18/airbornesound/blob/master/Gallery/SS_VGGish.png" width="600" height="400">
  <p>
  
### t-SNE Dimensional Reduction of MFCC Embeddings <h3>
<p align="center">
    <img src ="https://github.com/namantuli18/airbornesound/blob/master/Gallery/SS_Mfccs.png" width="600" height="400">
  <p>
  
 As we increase the label distribution, the value of accuracy increases. As the label distribution reaches 1, the accuracy of semi-supervised methods approaches the accuracy of traditional supervised methods. Hence average test accuracy against the proportion of labeled data would look like
 
 <p align="center">
    <img src ="https://github.com/namantuli18/airbornesound/blob/master/Gallery/cum_test_accuracy.png" width="500" height="350">
  <p>
 
## Comparison of Model Performance
<p align="center">
    <img src ="https://github.com/namantuli18/airbornesound/blob/master/Gallery/Solo_models.png" >
  <p>

Model averaging is an approach to ensemble learning where each ensemble member contributes an equal amount to the final prediction. A weighted ensemble is an extension of a model averaging ensemble where the contribution of each member to the final prediction is weighted by the performance of the model.

<p align="center">
    <img src ="https://github.com/namantuli18/airbornesound/blob/master/Gallery/Solo%20vs%20Ensemble.png" >
  <p>

We can observe that the performance of weighted ensemble is always better than or similar to the solo models.

## Hardware Integration
* The entire modelling system is deployed on a Raspberry Pi based backbone device.
* When connected with an external microphone through the USB slot, it behaves as a separate anomaly detection device.
* When a prediction is made on the device, it automatically sends an API signal and the records in our database are immediately updated. 
* The performance of the entire system can be fine tuned with the use of an array of microphones for better results.
* Raspberry Pi when connected with an external microphone or a sound capturing device behaves as a standalone anomaly detection device.
* We can replace the microphone with a microphone array and can significantly improve the performance of our pre-existing system.

  <img src="https://github.com/namantuli18/airbornesound/blob/master/Gallery/ras_land.jfif" width="400" height="300">       <img src="https://github.com/namantuli18/airbornesound/blob/master/Gallery/ras_open.jfif" width="400" height="300">




## Custom Training

To fine tune the architecture on a custom dataset,  add the path in the INPUT_PATH variable and append the individual labels to the labels in file [supervised training](https://github.com/namantuli18/airbornesound/blob/master/utils/scripts/supervised_training.py)

```python
INPUT_PATH='ENTER PATH HERE'

for files in os.listdir(""):
    for individual_files in os.listdir(INPUT_PATH):
        for j in tqdm.tqdm(os.listdir(os.path.join(INPUT_PATH,files,individual_files))):
            file_name=os.path.join(INPUT_PATH,files,individual_files,j)
            X, sample_rate = librosa.load(file_name, res_type='kaiser_fast')
            mels = np.mean(librosa.feature.melspectrogram(y=X, sr=sample_rate).T,axis=0)
            feature.append(mels)
            label.append(individual_files)

```


## Using pre-existing library of Models
The file library.py takes 2 arguments.
The type argument is the device type from-
* valve
* pump
* slider
* fan

Argument audio is a mandatory argument that contains the path of the audio file. We have added another feature integration in which we just have a .wav file and don’t know the instrument which produced the sound.
The script when called first loads the model and recognizes the device type. 
After this, it uses the device’s model for anomaly detection.


If we know the device type

```console
foo@bar:~$ python3 library.py --type pump --audio "00000000.wav"
Probability for the given pump sound being an anomaly is 1.0

```
If the device type is unknown
```console
foo@bar:~$ python3 library.py --audio "00000000.wav"
Device type detected : pump
Probability for the given pump sound being an anomaly is 1.0

```















  
  
  


    
