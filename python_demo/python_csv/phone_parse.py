
# -*- coding: utf-8 -*-

import shelve, pickle

db = shelve.open("people-shelve")

data_line = []

with open("phone_total.txt", 'r') as fp:
	for line in fp.readlines():
		if line:
			arr = line.split(',')
			if len(arr)>1:
				data_line.append(arr[0])


for k in data_line:
	
	dbfile = open('phone_dir/'+k+".pkl", 'wb')
	pickle.dump(db[k], dbfile)
	dbfile.close()

	with open('phone_text/'+k+'.txt', 'w') as fp:
		for line in db[k]:
			for k,v in line.iteritems():
				fp.write("%s : %s\r" % (k,v))
			fp.write("\r\n")










if __name__ == "__main__":

	pass

