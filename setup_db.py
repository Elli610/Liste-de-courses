import sqlite3
import time

#generate db
def generate_db():
    conn = sqlite3.connect('liste.db')
    conn.execute('CREATE TABLE IF NOT EXISTS liste (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, quantity INTEGER, timestamp INTEGER NOT NULL)')
    print("Database created successfully")
    conn.close()

generate_db()


#insert data
def insert_data(name, quantity):
    conn = sqlite3.connect('liste.db')
    conn.execute('INSERT INTO liste (name, quantity, timestamp) VALUES (?, ?, ?)', (name, quantity, round(time.time())))
    conn.commit()
    print("Data inserted successfully")
    conn.close()

insert_data('pommes', 5)
insert_data('bananes', 3)
insert_data('poires', 2)

#read data
def read_data():
    conn = sqlite3.connect('liste.db')
    cursor = conn.execute('SELECT * FROM liste')
    for row in cursor:
        print("id = ", row[0])
        print("name = ", row[1])
        print("quantity = ", row[2])
        print("timestamp = ", row[3], "\n")
    conn.close()

read_data()




