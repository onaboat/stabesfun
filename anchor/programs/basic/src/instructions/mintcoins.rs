// use crate::constants::*;
use crate::state::*;
use crate::errors::*;

use anchor_lang::prelude::*;

use anchor_spl::{
    associated_token::AssociatedToken,
    token::{ mint_to, Mint, MintTo, Token, TokenAccount},
};

use switchboard_on_demand::on_demand::accounts::pull_feed::PullFeedAccountData;

pub fn mint_tokens(ctx: Context<MintTokens>, sol_amount: u64, symbol: String) -> Result<()> {
    require!(sol_amount > 0, CustomError::InvalidQuantity);

        // Transfer sol_amount to the vault
    let cpi_accounts = anchor_lang::system_program::Transfer {
        from: ctx.accounts.payer.to_account_info(),
        to: ctx.accounts.sol_vault.to_account_info(), // Transfer to the sol vault for the mint
    };
    let cpi_context = CpiContext::new(ctx.accounts.system_program.to_account_info(), cpi_accounts);

    // Perform the transfer
    anchor_lang::system_program::transfer(cpi_context, sol_amount)?;

    // update the vault balance 
    let vault = &mut ctx.accounts.sol_vault;
    vault.balance += sol_amount;

    msg!("Transferred {} SOL to the vault account.", sol_amount);
    
     // Get SOL/USD price from feed
    let feed_account = ctx.accounts.feed.data.borrow();
    
    let feed = PullFeedAccountData::parse(feed_account).unwrap();
  
    let price = feed.value().unwrap();
    msg!("price: {:?}", price);

    let price_f64 = price.to_string().parse::<f64>().expect("Failed to convert Decimal to f64");
    msg!("price_f64: {:?}", price_f64);

    let tokens_to_mint = (sol_amount as f64 * price_f64) as u64;
    msg!("tokens_to_mint: {:?}", tokens_to_mint);

    require!(tokens_to_mint > 0, CustomError::InvalidCalculation);

    msg!("SOL amount: {}, SOL/USD price: {:?}, Tokens to mint: {}", 
    sol_amount, price, tokens_to_mint);

    require!(tokens_to_mint > 0, CustomError::InvalidCalculation);

    // mint seeds 
    let payer_key = ctx.accounts.payer.key();
    let seeds = &["mint".as_bytes(), payer_key.as_ref(), symbol.as_bytes(), &[ctx.bumps.mint]];
    let signer = [&seeds[..]];

    mint_to(
        CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            MintTo {
                authority: ctx.accounts.mint.to_account_info(),
                to: ctx.accounts.destination.to_account_info(),
                mint: ctx.accounts.mint.to_account_info(),
            },
            &signer,
        ),
        tokens_to_mint,
    )?;

    Ok(())
}

#[derive(Accounts)]
#[instruction(sol_amount: u64, symbol: String)]
pub struct MintTokens<'info> {
    #[account(
        mut,
        seeds = [b"mint", payer.key().as_ref(), symbol.as_bytes()],
        bump,
        mint::authority = mint,
    )]
    pub mint: Account<'info, Mint>,
    #[account(
        init_if_needed,
        payer = payer,
        associated_token::mint = mint,
        associated_token::authority = payer,
    )]
    pub destination: Account<'info, TokenAccount>,
    #[account(mut)]
    pub payer: Signer<'info>,
     /// CHECK: This is safe because we manually deserialize and verify the account data
    pub feed: AccountInfo<'info>,
    pub rent: Sysvar<'info, Rent>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    #[account(mut,
        seeds = [b"sol_vault", mint.key().as_ref()],
        bump,
    )]
    pub sol_vault: Account<'info, VaultAccount>,
}
