# here i am try to make a connection on postgre sql to python 
import psycopg2

def get_db_connection():
      connection = psycopg2.connect(
            host='localhost',
            database='ai_tailor',
            user = 'postgres',
            password='Mdsuhail@123'
      )
      return connection
