import pandas as pd
import os

def peek():
    csv_path = "data/business_dataset.csv"
    if os.path.exists(csv_path):
        print(f"--- {csv_path} ---")
        try:
            df = pd.read_csv(csv_path, nrows=5)
            print("Columns:", df.columns.tolist())
            print("First 2 rows:")
            print(df.head(2).to_string())
        except Exception as e:
            print(f"Error reading CSV: {e}")

    xlsx_path = "data/Influencer_Marketing_130_Screens_Full.xlsx"
    if os.path.exists(xlsx_path):
        print(f"\n--- {xlsx_path} ---")
        try:
            # Check if openpyxl is installed
            import openpyxl
            df = pd.read_excel(xlsx_path, nrows=5)
            print("Columns:", df.columns.tolist())
            print("First 2 rows:")
            print(df.head(2).to_string())
        except ImportError:
            print("openpyxl not installed, cannot read Excel")
        except Exception as e:
            print(f"Error reading Excel: {e}")

if __name__ == "__main__":
    peek()
