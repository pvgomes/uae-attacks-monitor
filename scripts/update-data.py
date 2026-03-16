#!/usr/bin/env python3
"""
UAE Attacks Monitor - Data Update Script (Python Version)

This script provides a simple way to update attack data in Supabase.
It can be run locally or in GitHub Actions.

Requirements:
    pip install supabase python-dotenv

Usage:
    python scripts/update-data.py                      # Interactive mode
    python scripts/update-data.py --date 2024-03-15 --uav 10 --cruise 2 --ballistic 5
    python scripts/update-data.py --csv data.csv      # Update from CSV file
"""

import os
import sys
import argparse
import csv
from datetime import datetime, date
from typing import Optional, Dict, List

try:
    from supabase import create_client, Client
    from dotenv import load_dotenv
except ImportError:
    print("❌ Missing required packages. Please install:")
    print("   pip install supabase python-dotenv")
    sys.exit(1)

# Load environment variables
load_dotenv()

class DataUpdater:
    def __init__(self):
        """Initialize Supabase client with service role key"""
        url = os.getenv('SUPABASE_URL') or os.getenv('VITE_SUPABASE_URL')
        service_key = os.getenv('SUPABASE_SERVICE_ROLE_KEY')
        
        if not url or not service_key:
            print("❌ Missing required environment variables:")
            if not url:
                print("   - SUPABASE_URL or VITE_SUPABASE_URL")
            if not service_key:
                print("   - SUPABASE_SERVICE_ROLE_KEY")
            sys.exit(1)
        
        self.supabase: Client = create_client(url, service_key)
        print("✅ Connected to Supabase")
    
    def update_single_day(self, date_str: str, uav: int, cruise: int, ballistic: int) -> bool:
        """Update or insert data for a single day"""
        try:
            response = self.supabase.table('attacks').upsert({
                'date': date_str,
                'uav': uav,
                'cruise': cruise,
                'ballistic': ballistic
            }, on_conflict='date').execute()
            
            print(f"✅ Updated {date_str}: UAV={uav}, Cruise={cruise}, Ballistic={ballistic}")
            return True
            
        except Exception as e:
            print(f"❌ Error updating {date_str}: {e}")
            return False
    
    def update_from_csv(self, csv_file: str) -> None:
        """Bulk update from CSV file"""
        if not os.path.exists(csv_file):
            print(f"❌ CSV file not found: {csv_file}")
            return
        
        success_count = 0
        error_count = 0
        
        with open(csv_file, 'r') as f:
            reader = csv.DictReader(f)
            for row in reader:
                try:
                    date_str = row['date']
                    uav = int(row.get('uav', 0))
                    cruise = int(row.get('cruise', 0))
                    ballistic = int(row.get('ballistic', 0))
                    
                    if self.update_single_day(date_str, uav, cruise, ballistic):
                        success_count += 1
                    else:
                        error_count += 1
                        
                except (KeyError, ValueError) as e:
                    print(f"❌ Skipping invalid row: {row} - {e}")
                    error_count += 1
        
        print(f"\n📊 CSV import complete:")
        print(f"   ✅ Success: {success_count}")
        print(f"   ❌ Errors: {error_count}")
    
    def interactive_update(self, date_str: Optional[str] = None) -> None:
        """Interactive mode for updating data"""
        if not date_str:
            date_str = date.today().isoformat()
        
        print(f"\n📅 Updating data for: {date_str}")
        print("Enter the number of attacks (press Enter for 0):\n")
        
        try:
            uav = int(input("UAV attacks: ") or "0")
            cruise = int(input("Cruise missile attacks: ") or "0")
            ballistic = int(input("Ballistic missile attacks: ") or "0")
            
            print(f"\n📊 Summary for {date_str}:")
            print(f"   UAV: {uav}")
            print(f"   Cruise: {cruise}")
            print(f"   Ballistic: {ballistic}")
            
            confirm = input("\nConfirm update? (y/n): ")
            
            if confirm.lower() == 'y':
                self.update_single_day(date_str, uav, cruise, ballistic)
            else:
                print("❌ Update cancelled")
                
        except ValueError:
            print("❌ Invalid input. Please enter numbers only.")
        except KeyboardInterrupt:
            print("\n❌ Update cancelled")
    
    def get_recent_data(self, days: int = 7) -> None:
        """Display recent data from the database"""
        try:
            response = self.supabase.table('attacks')\
                .select("*")\
                .order('date', desc=True)\
                .limit(days)\
                .execute()
            
            print(f"\n📊 Last {days} days of data:")
            print("Date       | UAV | Cruise | Ballistic")
            print("-----------|-----|--------|----------")
            
            for record in response.data:
                print(f"{record['date']} | {record['uav']:3d} | {record['cruise']:6d} | {record['ballistic']:9d}")
                
        except Exception as e:
            print(f"❌ Error fetching data: {e}")


def main():
    parser = argparse.ArgumentParser(description='Update UAE Attacks Monitor data')
    parser.add_argument('--date', help='Date to update (YYYY-MM-DD)')
    parser.add_argument('--uav', type=int, help='Number of UAV attacks')
    parser.add_argument('--cruise', type=int, help='Number of Cruise missile attacks')
    parser.add_argument('--ballistic', type=int, help='Number of Ballistic missile attacks')
    parser.add_argument('--csv', help='Import data from CSV file')
    parser.add_argument('--show', type=int, metavar='DAYS', 
                      help='Show recent data (last N days)')
    
    args = parser.parse_args()
    updater = DataUpdater()
    
    if args.show:
        updater.get_recent_data(args.show)
    elif args.csv:
        updater.update_from_csv(args.csv)
    elif args.date and args.uav is not None and args.cruise is not None and args.ballistic is not None:
        updater.update_single_day(args.date, args.uav, args.cruise, args.ballistic)
    else:
        updater.interactive_update(args.date)


if __name__ == '__main__':
    main()