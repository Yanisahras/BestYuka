#!/usr/bin/env python3
import os
import sys
import re
import random
import pandas as pd 
import numpy as np
import mrcnn.model as modellib
import matplotlib.pyplot as plt
import matplotlib.patches as patches
import matplotlib.lines as lines
import matplotlib
import math
import logging
import json
import itertools
import glob 
from flask import Flask, request, jsonify, Response
import cv2
#from tqdm import tqdm
#from pycocotools.cocoeval import COCOeval
#from pycocotools.coco import COCO
#from pycocotools import mask as maskUtils
from mrcnn.model import log
from mrcnn.config import Config
from mrcnn import visualize
from mrcnn import utils
from matplotlib.patches import Polygon
from imgaug import augmenters as iaa
from collections import defaultdict, Counter
from collections import OrderedDict

from PIL import Image
from numpy import asarray
import json
import io
import cv2
import base64 



class FoodChallengeConfig(Config):
    """Configuration for training on data in MS COCO format.
    Derives from the base Config class and overrides values specific
    to the COCO dataset.
    """
    # Give the configuration a recognizable name
    NAME = "crowdai-food-challenge"

    # We use a GPU with 12GB memory, which can fit two images.
    # Adjust down if you use a smaller GPU.
    IMAGES_PER_GPU = 2


    # Uncomment to train on 8 GPUs (default is 1)
    GPU_COUNT = 1
    BACKBONE = 'resnet50'
    # Number of classes (including background)
    NUM_CLASSES = 62  # 1 Background + 61 classes

    STEPS_PER_EPOCH=10
    VALIDATION_STEPS=10

    LEARNING_RATE=0.001
    IMAGE_MAX_DIM=256
    IMAGE_MIN_DIM=256


config = FoodChallengeConfig()
config.display()

class InferenceConfig(FoodChallengeConfig):
    GPU_COUNT = 1
    IMAGES_PER_GPU = 1
    NUM_CLASSES = 62  # 1 Background + 61 classes
    IMAGE_MAX_DIM=256
    IMAGE_MIN_DIM=256
    NAME = "food"
    DETECTION_MIN_CONFIDENCE=0

inference_config = InferenceConfig()
inference_config.display()




# Take in base64 string and return PIL image
def stringToImage(base64_string):
    imgdata = base64.b64decode(base64_string)
    return Image.open(io.BytesIO(imgdata))

# convert PIL Image to an RGB image( technically a numpy array ) that's compatible with opencv
def toRGB(image):
    return np.array(image)
  	#return cv2.cvtColor(np.array(image), cv2.COLOR_BGR2RGB)


def mainmodel(imf_from_server):

	ROOT_DIR = os.path.abspath(".")



	DATA_DIR = '/kaggle/working/food-recognition-challenge'
	# Directory to save logs and trained model
	ROOT_DIR = ''

	sys.path.append(os.path.join('.', 'Mask_RCNN'))  # To find local version of the library
	sys.path.append(ROOT_DIR)



	ROOT_DIR = os.getcwd()

	# Directory to save logs and trained model
	MODEL_DIR = os.path.join(ROOT_DIR, "logs")

	# Path to trained weights file
	# Download this file and place in the root of your 
	# project (See README file for details)
	model_path = os.path.join(ROOT_DIR, "maskrcnn.h5")



	#print(model_path)


	model = modellib.MaskRCNN(mode="inference", model_dir='', config=config)

	model.load_weights(model_path, by_name=True)

	ROOT_DIR = os.getcwd()

	# Directory to save logs and trained model
	MODEL_DIR = os.path.join(ROOT_DIR, "logs")

	# Path to trained weights file
	# Download this file and place in the root of your 
	# project (See README file for details)
	model_path = os.path.join(ROOT_DIR, "maskrcnn.h5")


	#im=Image.open("r'/home/yanis/projetannuel/testu.jpg'")

	im = stringToImage(imf_from_server)


	im = toRGB(im)


	#im=asarray(im)
	print(im.shape)

	print("Hi 4")

	model = modellib.MaskRCNN(mode='inference', 
	                          config=inference_config,
	                          
	                          model_dir=MODEL_DIR)

	model.load_weights(model_path, by_name=True)

	try:
		result = model.detect([im])
	except:
		return False

	dict_of_information = {
		'bread-white':{
		'calories':'12g',
		'lipide':'13g',
		'proteine':'200k'
		},
		'water':{
		'calories':'12g',
		'lipide':'13g',
		'proteine':'200k'
		},
		'pizza-margherita-baked':{
		'calories':'12g',
		'lipide':'13g',
		'proteine':'200k'
		},
		'broccoli':{
		'calories':'12g',
		'lipide':'13g',
		'proteine':'200k'
		},
		'salad-leaf-salad-green':{
		'calories':'12g',
		'lipide':'13g',
		'proteine':'200k'
		},
		'zucchini':{
		'calories':'12g',
		'lipide':'13g',
		'proteine':'200k'
		},
		'egg':{
		'calories':'12g',
		'lipide':'13g',
		'proteine':'200k'
		},
		'butter':{
		'calories':'12g',
		'lipide':'13g',
		'proteine':'200k'
		},
		'bread-white':{
		'calories':'12g',
		'lipide':'13g',
		'proteine':'200k'
		},
		'apple':{
		'calories':'12g',
		'lipide':'13g',
		'proteine':'200k'
		}
	}

	class_names = ["BG","eau", "pizza-margherita", "brocoli", "salade-feuille-salade-verte", "courgettes", "oeuf", "beurre", "blanc du pain", "pomme", "chocolat noir", "café blanc avec caféine", "poivre doux", "salade mixte hachée sans sauce", "sauce tomate", "farine du pain", "café avec caféine", "concombre", "fromage", "pâtes-spaghetti", "riz", "saumon", "carotte", "oignon", "légumes mélangés", "espresso-avec-caféine", "banane", "fraises", "mayonnaise", "amandes", "blanc de vin", "fromage à pâte dure", "jambon cru", "tomate", "haricots français", "mandarine", "rouge-vin", "pommes de terre à la vapeur", "salami", "boisson-au-glucose-50g", "biscuits", "maïs", "épinards à feuilles", "jam", "thé-vert", "frites-françaises", "parmesan", "bière", "avocat", "pain-français-farine blanche", "poulet", "fromage à pâte molle", "thé", "sauce-savoureuse", "miel", "pain-blé", "le pain et le le levain", "gruyère", "mixed-nuts", "eau-minérale"]
	r = result[0]
	print(r)

	if  len(r['class_ids']) == 0 :
		return False
	else:

		#pred_score = list(result[0]['scores'])
		#print(pred_score)
		# visualize.display_instances(im, r['rois'], r['masks'], r['class_ids'], 
		#                             class_names, r['scores'])


		#print(type(imtest))

		#pred_class = [class_names[i] for i in list(r['class_ids'])]
		pred_class = []

		for x in r['class_ids'] : 
			pred_class.append(class_names[x])

		#pred_class =  [ r ['class_ids'][0] ]
		#print(pred_class[0])


#		print(dict_of_information[pred_class[0]])
		#resultjson = {"label" : str(class_names[pred_class[0]])  ,"details" :{"calories":"265","lipide":"3.2","glucide":"49","proteine":"9" } }
		resultjson = {"labels" : pred_class }

		return resultjson


app = Flask(__name__)

@app.route('/', methods=['POST'])
#@app.route("/")
def hello():
#
    try:
        base64data = request.form['image']
        resultat =  mainmodel(base64data)
        print(type(resultat)) 
        print(resultat)
        #return jsonify(resultat
        if resultat :
        	return jsonify({"data": resultat}) 
        else :
        	return jsonify({"data": "not found"})
        # Response(json.dumps(resultat), status=200, mimetype='application/json')
    #      #flask.make_response(jsonify(resultat),200)
    except:
        print(resultat)
        print('erreur serveuuuuuur <-------------->')

if __name__ == '__main__':
    app.run(debug=True)


