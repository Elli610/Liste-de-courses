import sqlite3

conn = sqlite3.connect('liste.db')
cursor = conn.execute('SELECT * FROM liste')
for row in cursor:
    print("id = ", row[0])
    print("name = ", row[1])
    print("quantity = ", row[2])
    print("timestamp = ", row[3], "\n")
conn.close()
