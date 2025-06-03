#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, symbol_short, vec, Address, Env, Map, Symbol, Vec};

#[derive(Clone)]
#[contracttype]
pub struct EmojiRecord {
    pub emoji: Symbol,
    pub user: Address,
    pub timestamp: u64,
}

#[contract]
pub struct EmojiContract;

#[contractimpl]
impl EmojiContract {
    pub fn record_emoji(env: Env, emoji: Symbol, name: Symbol, user: Address) -> Symbol {
        // Store the emoji selection with timestamp
        let timestamp = env.ledger().timestamp();
        let emoji_record = EmojiRecord {
            emoji,
            user: user.clone(),
            timestamp,
        };
        
        // Get existing records
        let mut records = Self::get_records(&env);
        
        // Add new record
        records.push_back(emoji_record);
        
        // Store updated records
        env.storage().instance().set(&symbol_short!("records"), records);
        
        // Return success
        emoji
    }
    
    pub fn get_emoji_data(env: Env) -> Vec<EmojiRecord> {
        Self::get_records(&env)
    }
    
    pub fn get_total_votes(env: Env) -> u32 {
        Self::get_records(&env).len()
    }
    
    pub fn get_emoji_count(env: Env, emoji: Symbol) -> u32 {
        let records = Self::get_records(&env);
        let mut count = 0;
        
        for record in records.iter() {
            if record.emoji == emoji {
                count += 1;
            }
        }
        
        count
    }
    
    fn get_records(env: &Env) -> Vec<EmojiRecord> {
        env.storage().instance().get(&symbol_short!("records")).unwrap_or(vec![env])
    }
} 