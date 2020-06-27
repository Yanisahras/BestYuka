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


def main(imf_from_server):

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

#	print("Hello I'm here")


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


	result = model.detect([im])





	class_names = ['BG', 'water','pizza-margherita-baked','broccoli',
 'salad-leaf-salad-green',
 'zucchini',
 'egg',
 'butter',
 'bread-white',
 'apple',
 'dark-chocolate',
 'white-coffee-with-caffeine',
 'sweet-pepper',
 'mixed-salad-chopped-without-sauce',
 'tomato-sauce',
 'bread-wholemeal',
 'coffee-with-caffeine',
 'cucumber',
 'cheese',
 'pasta-spaghetti',
 'rice',
 'salmon',
 'carrot',
 'onion',
 'mixed-vegetables',
 'espresso-with-caffeine',
 'banana',
 'strawberries',
 'mayonnaise',
 'almonds',
 'wine-white',
 'hard-cheese',
 'ham-raw',
 'tomato',
 'french-beans',
 'mandarine',
 'wine-red',
 'potatoes-steamed',
 'croissant',
 'salami',
 'boisson-au-glucose-50g',
 'biscuits',
 'corn',
 'leaf-spinach',
 'jam',
 'tea-green',
 'chips-french-fries',
 'parmesan',
 'beer',
 'avocado',
 'bread-french-white-flour',
 'chicken',
 'soft-cheese',
 'tea',
 'sauce-savoury',
 'honey',
 'bread-whole-wheat',
 'bread-sourdough',
 'gruyere',
 'pickle',
 'mixed-nuts',
 'water-mineral']
	r = result[0]
	pred_score = list(result[0]['scores'])
	print(pred_score)
	visualize.display_instances(im, r['rois'], r['masks'], r['class_ids'], 
	                            class_names, r['scores'])

	pred_class = [class_names[i] for i in list(r['class_ids'])]
	pred_class





if __name__ == "__main__":
    # execute only if run as a script
    main(imf_from_server)