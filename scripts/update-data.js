#!/usr/bin/env node

/**
 * Data Ingestion Script for UAE Attacks Monitor
 * 
 * This script updates the Supabase database with attack data.
 * It requires the SUPABASE_SERVICE_ROLE_KEY which has write permissions.
 * 
 * Usage:
 *   node scripts/update-data.js                    # Update today's data
 *   node scripts/update-data.js --date 2024-03-15  # Update specific date
 *   node scripts/update-data.js --bulk             # Bulk update from JSON file
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Environment variables
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error('❌ Missing required environment variables:');
    if (!SUPABASE_URL) console.error('   - SUPABASE_URL or VITE_SUPABASE_URL');
    if (!SUPABASE_SERVICE_ROLE_KEY) console.error('   - SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
}

// Initialize Supabase client with service role key
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

// Parse command line arguments
const args = process.argv.slice(2);
const isHelp = args.includes('--help') || args.includes('-h');
const isBulk = args.includes('--bulk');
const dateIndex = args.indexOf('--date');
const specificDate = dateIndex !== -1 && args[dateIndex + 1] ? args[dateIndex + 1] : null;

if (isHelp) {
    console.log(`
UAE Attacks Monitor - Data Update Script

Usage:
  node scripts/update-data.js [options]

Options:
  --help, -h           Show this help message
  --date YYYY-MM-DD    Update data for a specific date
  --bulk               Bulk update from public/data.json
  
Examples:
  node scripts/update-data.js                    # Update today's data
  node scripts/update-data.js --date 2024-03-15  # Update March 15, 2024
  node scripts/update-data.js --bulk             # Import all data from JSON

Environment Variables Required:
  SUPABASE_URL or VITE_SUPABASE_URL
  SUPABASE_SERVICE_ROLE_KEY
`);
    process.exit(0);
}

/**
 * Format date to match the JSON format (e.g., "Mar 15")
 */
function formatDateShort(date) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                   'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const d = new Date(date);
    const month = months[d.getMonth()];
    const day = String(d.getDate()).padStart(2, '0');
    return `${month} ${day}`;
}

/**
 * Convert short date format to full date (e.g., "Mar 15" -> "2024-03-15")
 */
function parseShortDate(shortDate, year = new Date().getFullYear()) {
    const months = {
        'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04',
        'May': '05', 'Jun': '06', 'Jul': '07', 'Aug': '08',
        'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12'
    };
    
    const [monthName, day] = shortDate.split(' ');
    const month = months[monthName];
    return `${year}-${month}-${day.padStart(2, '0')}`;
}

/**
 * Update or insert a single day's data
 */
async function updateSingleDay(dateStr, uav, cruise, ballistic) {
    try {
        // Convert to short date format if it's a full date
        const shortDate = dateStr.length > 6 ? formatDateShort(dateStr) : dateStr;
        
        // First, check if record exists
        const { data: existing, error: selectError } = await supabase
            .from('attacks')
            .select('*')
            .eq('date', shortDate)
            .single();

        let result;
        if (selectError && selectError.code === 'PGRST116') {
            // Record doesn't exist, insert it
            result = await supabase
                .from('attacks')
                .insert({
                    date: shortDate,
                    uav: uav,
                    cruise: cruise,
                    ballistic: ballistic
                });
        } else if (existing) {
            // Record exists, update it
            result = await supabase
                .from('attacks')
                .update({
                    uav: uav,
                    cruise: cruise,
                    ballistic: ballistic
                })
                .eq('date', shortDate);
        } else {
            throw selectError;
        }

        const { error } = result;
        if (error) {
            console.error(`❌ Error updating ${shortDate}:`, error.message);
            return false;
        }

        console.log(`✅ Updated ${shortDate}: UAV=${uav}, Cruise=${cruise}, Ballistic=${ballistic}`);
        return true;
    } catch (err) {
        console.error(`❌ Unexpected error updating ${dateStr}:`, err);
        return false;
    }
}

/**
 * Bulk update from JSON file
 */
async function bulkUpdate() {
    try {
        const jsonPath = path.join(__dirname, '..', 'public', 'data.json');
        const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
        
        console.log(`📊 Starting bulk update of ${jsonData.length} records...`);
        
        let successCount = 0;
        let errorCount = 0;
        
        for (const record of jsonData) {
            // The JSON already has short date format, use it directly
            const success = await updateSingleDay(
                record.date,
                record.uav,
                record.cruise,
                record.ballistic
            );
            
            if (success) {
                successCount++;
            } else {
                errorCount++;
            }
            
            // Add a small delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        console.log(`\n📈 Bulk update complete:`);
        console.log(`   ✅ Success: ${successCount}`);
        console.log(`   ❌ Errors: ${errorCount}`);
        
    } catch (err) {
        console.error('❌ Failed to read or parse data.json:', err);
        process.exit(1);
    }
}

/**
 * Interactive update for today or specific date
 */
async function interactiveUpdate(date) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    
    const ask = (question) => new Promise(resolve => {
        rl.question(question, resolve);
    });
    
    try {
        console.log(`\n📅 Updating data for: ${date}`);
        console.log('Enter the number of attacks (press Enter for 0):\n');
        
        const uav = parseInt(await ask('UAV attacks: ') || '0');
        const cruise = parseInt(await ask('Cruise missile attacks: ') || '0');
        const ballistic = parseInt(await ask('Ballistic missile attacks: ') || '0');
        
        console.log(`\n📊 Summary for ${date}:`);
        console.log(`   UAV: ${uav}`);
        console.log(`   Cruise: ${cruise}`);
        console.log(`   Ballistic: ${ballistic}`);
        
        const confirm = await ask('\nConfirm update? (y/n): ');
        
        if (confirm.toLowerCase() === 'y') {
            await updateSingleDay(date, uav, cruise, ballistic);
        } else {
            console.log('❌ Update cancelled');
        }
        
    } finally {
        rl.close();
    }
}

/**
 * Main execution
 */
async function main() {
    if (isBulk) {
        await bulkUpdate();
    } else {
        const targetDate = specificDate || new Date().toISOString().split('T')[0];
        await interactiveUpdate(targetDate);
    }
    
    process.exit(0);
}

// Run the script
main().catch(err => {
    console.error('❌ Fatal error:', err);
    process.exit(1);
});