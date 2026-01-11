import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
import os

def create_database():
    try:
        # Connect to default 'postgres' database to create the new one
        # Assuming the user is 'postgres' and password is provided
        conn = psycopg2.connect(
            dbname="postgres", 
            user="postgres", 
            password="Diva@2004", 
            host="localhost"
        )
        conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cur = conn.cursor()

        cur.execute("CREATE DATABASE pitch_platform")
        print("Database 'pitch_platform' created successfully.")
        
        cur.close()
        conn.close()
    except psycopg2.errors.DuplicateDatabase:
        print("Database 'pitch_platform' already exists.")
    except Exception as e:
        print(f"Error creating database: {e}")

if __name__ == "__main__":
    create_database()
