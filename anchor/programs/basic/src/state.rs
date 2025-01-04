use anchor_lang::prelude::*;
 
#[account]
#[derive(InitSpace)]
pub struct VaultAccount {
    pub balance: u64, 
    pub mint: Pubkey,
    pub bump: u8,
    #[max_len(5)] 
    pub symbol: String,
    #[max_len(32)]
    pub name: String,
    #[max_len(5)]
    pub currency: String,
    #[max_len(100)]
    pub uri: String,
    #[max_len(100)]
    pub image: String,
    #[max_len(100)]
    pub description: String,
}


