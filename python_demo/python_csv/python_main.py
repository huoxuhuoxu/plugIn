
# -*- coding: utf-8 -*-

import csv, shelve, sys, os

if os.path.exists("people-shelve"):
	os.remove('people-shelve')


db = shelve.open("people-shelve")

count = 0


# 数据分类
class InitialData(object):

	def __init__(self):
		self.data = {}


	def run(self):

		global count

		csvfile = file("tiger_user_fingerprint.csv", 'rb')
		reader = csv.reader(csvfile)

		try:
			for line in reader:
				self.fnData_level_1(line)

		except Exception as err:
			print(str(err))
			csvfile.close()
			sys.exit(0)

		finally:
			csvfile.close()

		for k,v in self.data.iteritems():
			db[k] = v



	def fnData_level_1(self, line):
		data_id = line[0]
		user_id = line[1]
		phone_A = line[2]
		phone_B = line[3]
		phone_C = line[4]
		ip = line[7]
		ua = line[8]
		user_agent = line[11]

		data_A = {}
		data_A['data_id'] = data_id
		data_A['user_id'] = user_id
		data_A['phone_A'] = phone_A
		data_A['phone_B'] = phone_B
		data_A['phone_C'] = phone_C
		data_A['ip'] = ip
		data_A['ua'] = ua
		data_A['user_agent'] = user_agent

		if not phone_A in self.data:
			self.data[phone_A] = []
			self.data[phone_A].append(data_A)
			data_A = None
		else:
			self.data[phone_A].append(data_A)
			data_A = None


# 数据可视化
class SeeData(object):

	def __init__(self):
		pass

	def run(self):
		with open("phone_total.txt", 'w') as fp:
			for k,v in db.iteritems():
				fp.write('%s,机型有%s条数据\r\n' % (k, len(v)))

			fp.write('目前总机型有%s种' % len(db))


if __name__ == "__main__":

	
	if os.path.exists("phone_total.txt"):
		os.remove('phone_total.txt')

	a = InitialData()
	a.run()
	u = SeeData()
	u.run()



db.close()

print("end")

