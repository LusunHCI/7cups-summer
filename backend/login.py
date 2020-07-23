from flask import Flask, escape, url_for, request, render_template, redirect, request
import requests
import json
import mysql.connector
from datetime import datetime

app = Flask(__name__,static_folder='static',template_folder='static')

@app.route('/',methods=['POST','GET'])
def index():
	return render_template('login.html')

@app.route('/intents/')
def intent(userid=None):
	return render_template('intents.html')

@app.route('/chat/?<string:userid>')
def chat(userid):
    return render_template('chat.html')

@app.route('/userMessage/', methods=['POST','GET'])
def userMessage():
	if request.method =='GET':
		print("get")
	if request.method =='POST':
		mydb = mysql.connector.connect(
  		host="localhost",
  		user="root",
  		password="Lyh19970515@",
  		database="7cups_summer"
		)
		mycursor = mydb.cursor()
		message_id=request.json['message_id']
		chatroom_id=int(request.json['chatroom_id'])
		message=request.json['message']
		message_type=int(request.json['message_type'])
		timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
		sender_id=int(request.json['sender_id'])
		sql = "INSERT INTO codesign (message_id, chatroom_id, message, message_type, timestamp, send_id) VALUES (%s, %s, %s, %s, %s, %s)"
		val=(message_id, chatroom_id, message, message_type, timestamp, sender_id)
		mycursor.execute(sql,val)
		mydb.commit()
		mycursor.close()
		mydb.close()
		print(sql)
	return render_template('chat.html')

@app.route('/botResponse/', methods=['POST','GET'])
def botResponse():
	if request.method =='GET':
		print("get")
	if request.method =='POST':
		mydb = mysql.connector.connect(
  		host="localhost",
  		user="root",
  		password="Lyh19970515@",
  		database="7cups_summer"
		)
		mycursor = mydb.cursor()
		print(request.json)
		message_id=request.json['message_id']
		chatroom_id=int(request.json['chatroom_id'])
		message_type=int(request.json['message_type'])
		message=request.json['message']
		if message_type==0:
			msg=message['text']
		else :
			msg=""
			for m in message:
				msg+=str(m)
		timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
		sender_id=int(request.json['sender_id'])
		sql = "INSERT INTO codesign (message_id, chatroom_id, message, message_type, timestamp, send_id) VALUES (%s, %s, %s, %s, %s,%s)"
		val=(message_id, chatroom_id, msg, message_type, timestamp, sender_id)
		mycursor.execute(sql,val)
		mydb.commit()
		mycursor.close()
		mydb.close()
		print(sql)
	return render_template('chat.html')