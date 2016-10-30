
# -*- coding: utf-8 -*-

# 第三阶段 同型号手机 分类不同结果C码的情况，统计同一型号某C的出现率,并存储数据格式  C码相关

import pickle, glob, os



for filename in glob.glob('phone_dir/*.pkl'):
	recfile = open(filename, 'rb')
	recode = pickle.load(recfile)
	recfile.close()
	
	if len(recode) > 1:
		arr = []
		arr_key = []
		data_key = {} 
		data_user = {}
		data_c = {}
		for line in recode:
			if not line['phone_C'] in arr_key:
				arr_key.append(line['phone_C'])
				arr.append(line)
				data_key[line['phone_C']] = 1
				data_user[line['phone_C']] = set([line['user_id']])
				data_c[line['phone_C']] = [line]
			else:
				data_key[line['phone_C']] += 1
				data_user[line['phone_C']].add(line['user_id'])
				data_c[line['phone_C']].append(line)

		if len(arr_key) > 1:
			with open('parse_dir/'+recode[0]['phone_A']+'.txt', 'w') as fp:
				for line in arr:
					for k,v in line.iteritems():
						fp.write("%s : %s\r" % (k,v))
					

					fp.write("\r\n同型号C码:%s,出现%s次\r\n" % (line['phone_C'], data_key[line['phone_C']]))
					fp.write("\r\n相关用户ID:\r\n\r\n")
					b_start = False
					for i in  data_user[line['phone_C']]:
						if b_start:
							fp.write(",%s" % i)
						else:
							b_start = True
							fp.write("%s" % i)
					fp.write("\r\n\r\n\r\n")
					

			dbfile = open('parse_pickle/'+recode[0]['phone_A']+".pkl", 'wb')
			pickle.dump(arr, dbfile)
			dbfile.close()
		
		else:
			with open('parse_eq/'+recode[0]['phone_A']+'.txt', 'w') as fp:
				for line in arr:
					for k,v in line.iteritems():
						fp.write("%s : %s\r" % (k,v))
					

					fp.write("\r\n相关用户ID:\r\n\r\n")
					b_start = False
					for i in  data_user[line['phone_C']]:
						if b_start:
							fp.write(",%s" % i)
						else:
							b_start = True
							fp.write("%s" % i)
					fp.write("\r\n\r\n\r\n")

			# arr_ip = []
			# arr_ip_key = []
			# arr_ip_user = {}

			# for line in arr:

			# 	if not line['ip'] in arr_ip_key:
			# 		arr_ip_key.append(line['ip'])
			# 		arr_ip.append(line)
			# 		arr_ip_user[line['ip']] = set([line['user_id']])
			# 	else: 
			# 		arr_ip_user[line['ip']].add([line['user_id']])
					
			# with open('parse_eq_wifi/'+recode[0]['phone_A']+".txt", 'w') as fp:
			# 	for line in arr_ip:
			# 		for k,v in line.iteritems():
			# 			fp.write("%s : %s\r" % (k,v))

			# 		fp.write("\r\n相关用户ID:\r\n\r\n")
			# 		b_start = False
			# 		for i in arr_ip_user[line['ip']]:
			# 			if b_start:
			# 				fp.write(",%s" % i)
			# 			else:
			# 				b_start = True
			# 				fp.write("%s" % i)
			# 		fp.write("\r\n\r\n\r\n")
			
			dbfile = open('parse_eq_pickle/'+recode[0]['phone_A']+".pkl", 'wb')
			pickle.dump(data_c, dbfile)
			dbfile.close()




try:
	print('有差异的机型%s个' % len(os.listdir('./parse_dir')))
	print('无差异的机型%s个' % len(os.listdir('./parse_eq')))
	print('同A,同C有%s个' % len(os.listdir('./parse_eq_pickle')))
except Exception as err:
	print(str(err))








if __name__ == '__main__':

	pass

