// use crate::constants::*;
use crate::state::*;
use crate::errors::*;

use anchor_lang::prelude::*;

use anchor_spl::token::{burn, Burn, Mint,  Token, TokenAccount};

use switchboard_on_demand::on_demand::accounts::pull_feed::PullFeedAccountData;


pub fn burn_tokens(ctx: Context<BurnTokens>, quantity: u64, symbol: String) -> Result<()> {
    // Ensure quantity is valid


    // Fetch SOL/USD price from the oracle feed
    let feed_account = ctx.accounts.feed.data.borrow();
    let feed = PullFeedAccountData::parse(feed_account).unwrap();
    let price = feed.value().unwrap();
    msg!("Oracle price: {:?}", price);

    // Calculate the SOL amount to return
    let price_f64 = price.to_string().parse::<f64>().expect("Failed to convert Decimal to f64");
    msg!("price_f64: {:?}", price_f64);

    let sol_to_return = (quantity as f64 / price_f64) as u64;
    msg!("SOL to return: {:?}", sol_to_return);

    // Ensure the calculated SOL amount is valid
    require!(sol_to_return > 0, CustomError::InvalidCalculation);

    // Signer seeds for PDA
    let payer_key = ctx.accounts.payer.key();
    let seeds = &["mint".as_bytes(), payer_key.as_ref(), symbol.as_bytes(), &[ctx.bumps.mint]];
    let signer = [&seeds[..]];

    // Burn the specified quantity of SPL tokens
    burn(
        CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            Burn {
                mint: ctx.accounts.mint.to_account_info(),
                from: ctx.accounts.source.to_account_info(),
                authority: ctx.accounts.payer.to_account_info(),
            },
            &signer,
        ),
        quantity,
    )?;

    msg!("Burned {} tokens.", quantity);

    // Check if the vault owner is a PDA
    msg!("Vault Owner: {:?}", ctx.accounts.sol_vault.to_account_info().owner);

    // Fetch and log the vault balance
    let vault = &mut ctx.accounts.sol_vault;
    msg!("Vault balance: {:?}", vault.balance);

    // Ensure vault has sufficient funds
    require!(vault.balance >= sol_to_return, CustomError::InsufficientFunds);

    // Update the vault balance in the struct
    vault.balance = vault
        .balance
        .checked_sub(sol_to_return)
        .ok_or(CustomError::InsufficientFunds)?;

    // Transfer lamports directly using account references
    **ctx.accounts.sol_vault.to_account_info().try_borrow_mut_lamports()? -= sol_to_return;
    **ctx.accounts.payer.to_account_info().try_borrow_mut_lamports()? += sol_to_return;

    msg!("Returned {} SOL to payer.", sol_to_return);

    Ok(())
}

#[derive(Accounts)]
#[instruction(quantity: u64, symbol: String)] 
pub struct BurnTokens<'info> {
    #[account(
        mut,
        seeds = [b"mint", payer.key().as_ref(), symbol.as_bytes()],
        bump,
        mint::authority = mint, 
    )]
    pub mint: Account<'info, Mint>,
    #[account(
        mut,
        associated_token::mint = mint,
        associated_token::authority = payer,
    )]
    pub source: Account<'info, TokenAccount>, 
    #[account(mut)]
    pub payer: Signer<'info>, 
    /// CHECK: This is safe because we manually deserialize and verify the account data
    pub feed: AccountInfo<'info>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>, 
     #[account(mut,
        seeds = [b"sol_vault", mint.key().as_ref()],
        bump,
    )]
    pub sol_vault: Account<'info, VaultAccount>,
}
