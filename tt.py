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



ROOT_DIR = os.path.abspath(".")




DATA_DIR = '/kaggle/working/food-recognition-challenge'
# Directory to save logs and trained model
ROOT_DIR = ''

sys.path.append(os.path.join('.', 'Mask_RCNN'))  # To find local version of the library
sys.path.append(ROOT_DIR)

print("Hello I'm here")