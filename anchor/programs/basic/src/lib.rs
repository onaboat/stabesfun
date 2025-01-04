pub mod constants;
pub mod errors;
pub mod instructions;
pub mod state;

use anchor_lang::prelude::*;

pub use constants::*;
pub use instructions::*;
pub use state::*;

declare_id!("7jGe9v39k4JzkwT4pZ7BqjBx9QCtbzGLg4UDj7rTTbAn");

#[program]
pub mod stablesfun {
    use super::*;

    pub fn init_coin_instruction(ctx: Context<InitToken>, metadata: InitCoinParams, currency: String, image:String, description:String) -> Result<()> {
        init_token(ctx, metadata, currency, image, description)
    }

    pub fn mint_coins_instruction(ctx: Context<MintTokens>, sol_amount: u64, symbol: String) -> Result<()> {
        mint_tokens(ctx, sol_amount, symbol)
    }

    pub fn burn_coins_instruction(ctx: Context<BurnTokens>, quantity: u64, symbol: String) -> Result<()> {
        burn_tokens(ctx, quantity, symbol)
    }

    pub fn get_price(ctx: Context<Price>) -> Result<()> {
        price(ctx)
    }
    
}
