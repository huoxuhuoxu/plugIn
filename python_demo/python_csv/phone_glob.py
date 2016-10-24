
# -*- coding: utf-8 -*-

import pickle, glob



for filename in glob.glob('phone_dir/*.pkl'):
	recfile = open(filename, 'rb')
	recode = pickle.load(recfile)
	recfile.close()
	
	if len(recode) > 1:
		arr = []
		arr_key = [] 
		for line in recode:
			if not line['phone_C'] in arr_key:
				arr_key.append(line['phone_C'])
				arr.append(line)

		if len(arr_key) > 1:
			with open('parse_dir/'+recode[0]['phone_A']+'.txt', 'w') as fp:
				for line in arr:
					for k,v in line.iteritems():
						fp.write("%s : %s\r" % (k,v))
					fp.write("\r\n")

			dbfile = open('parse_pickle/'+recode[0]['phone_A']+".pkl", 'wb')
			pickle.dump(arr, dbfile)
			dbfile.close()
















if __name__ == '__main__':

	pass

