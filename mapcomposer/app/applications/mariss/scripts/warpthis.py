import sys
import os
from glob import glob
#from osgeo import gdal, osr

# Define your projection here
#sr = osr.SpatialReference()
# For example, UTM Zone 11
#sr.SetUTM(11)
#sr_wkt = sr.ExportToWkt()

file_list = set()
for arg in sys.argv[1:]:
    file_list.update(glob(arg))
for file in file_list:
    os.system('mkdir -p %s' %('warp_'+os.path.dirname(file)))
    os.system('mkdir -p %s' %('new_'+os.path.dirname(file)))
    os.system('gdalwarp %s %s -t_srs EPSG:4326' %(file,'warp_'+file))
    os.system('gdal_translate -co "TILED=YES" -co "BLOCKXSIZE=512" -co "BLOCKYSIZE=512" %s %s ' %('warp_'+file,'new_'+file))
    os.system('gdaladdo -r cubic %s 2 4 8 16 32 64 128' %('new_'+file))