
# -*- coding: utf-8 -*-

# 第四阶段,分析ip

import pickle, glob, os


for filename in glob.glob('parse_eq_pickle/*.pkl'):
	recfile = open(filename, 'rb')
	recode = pickle.load(recfile)
	recfile.close()

	for line2 in recode.values():	

		arr = []
		arr_key = []
		arr_user = {}

		for line in line2:
			if not line['ip'] in arr_key:
				arr_key.append(line['ip'])
				arr.append(line)
				arr_user[line['ip']] = set([line['user_id']])
			else:
				arr_user[line['ip']].add(line['user_id'])

		if len(arr) > 1:
			with open('parse_eq_wifi/'+line2[0]['phone_A']+'.txt', 'w') as fp:
				for line in arr:

					for k,v in line.iteritems():
						fp.write("%s : %s\r" % (k,v))

					fp.write("\r\n相关用户ID:\r\n\r\n")
					b_start = False
					for i in arr_user[line['ip']]:
						if b_start:
							fp.write(",%s" % i)
						else:
							b_start = True
							fp.write("%s" % i)
					fp.write("\r\n\r\n\r\n")



print("同A,同C,多个网络环境%s个" % len(os.listdir('./parse_eq_wifi')))




if __name__ == '__main__':

	pass




