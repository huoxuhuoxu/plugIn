
# -*- coding: utf-8 -*-

# 第二阶段 数据分类输出 与 数据格式存储    分别存储／详情 A码相关

import shelve, pickle

# db = shelve.open("people-shelve")

dbfile = open("total_data", 'rb')
db = pickle.load(dbfile)
dbfile.close()


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




# db.close()





if __name__ == "__main__":

	pass

