// use crate::constants::*;
use crate::state::*;
use crate::errors::*;

use anchor_lang::prelude::*;

use anchor_spl::{

    metadata::{
        create_metadata_accounts_v3, mpl_token_metadata::types::DataV2, CreateMetadataAccountsV3,
    },
    token::{ Mint, Token},
};




pub fn init_token(ctx: Context<InitToken>, metadata: InitCoinParams, currency: String, image: String, description: String ) -> Result<()> {
    // setup vault save data 
    let vault = &mut ctx.accounts.sol_vault;
    vault.balance = 0;
    vault.mint = ctx.accounts.mint.key();
    vault.bump = ctx.bumps.sol_vault;
    vault.symbol = metadata.symbol.clone();
    vault.name = metadata.name.clone();
    vault.currency = currency;
    vault.uri = metadata.uri.clone();
    vault.image = image;
    vault.description = description;

   

    // validate symbol
    require!(metadata.symbol.len() <= 4, CustomError::SymbolTooLong);
    require!(metadata.symbol.chars().all(|c| c.is_alphanumeric()), CustomError::SymbolNotAlphanumeric);
    
    // mint seeds 
    let payer_key = ctx.accounts.payer.key();
    let seeds = &["mint".as_bytes(), payer_key.as_ref(),  metadata.symbol.as_bytes(), &[ctx.bumps.mint]];
    let signer = [&seeds[..]];

       // setup Token Metadata
    let token_data: DataV2 = DataV2 {
        name: metadata.name.clone(),
        symbol: metadata.symbol.clone(),
        uri: metadata.uri.clone(),
        seller_fee_basis_points: 0, 
        creators: None,
        collection: None,
        uses: None,
    };

    // create metadata account
    let metadata_ctx = CpiContext::new_with_signer(
        ctx.accounts.token_metadata_program.to_account_info(),
        CreateMetadataAccountsV3 {
            payer: ctx.accounts.payer.to_account_info(),
            update_authority: ctx.accounts.mint.to_account_info(),
            mint: ctx.accounts.mint.to_account_info(),
            metadata: ctx.accounts.metadata.to_account_info(),
            mint_authority: ctx.accounts.mint.to_account_info(),
            system_program: ctx.accounts.system_program.to_account_info(),
            rent: ctx.accounts.rent.to_account_info(),
        },
        &signer,
    );
    //create_metadata_accounts_v3(metadata_ctx, token_data, false, true, None)?;
    create_metadata_accounts_v3(
        metadata_ctx,  
        token_data,
        false,
        true,
        None,
    )?;

    msg!("Token Mint Address: {:?}", ctx.accounts.mint.key());
    msg!("Vault Address: {:?}", ctx.accounts.sol_vault.key());
    msg!("Metadata Address: {:?}", ctx.accounts.metadata.key());
    msg!("Token successfully created with Symbol: {:?}", metadata.symbol);

    Ok(())
}

#[derive(Accounts)]
#[instruction(
    params: InitCoinParams
)]
pub struct InitToken<'info> {
    /// CHECK: New Metaplex Account being created
    #[account(mut)]
    pub metadata: UncheckedAccount<'info>,
    #[account(
        init,
        seeds = [b"mint", payer.key().as_ref(), params.symbol.as_bytes()],
        bump,
        payer = payer,
        mint::decimals = params.decimals,
        mint::authority = mint,
    )]
    pub mint: Account<'info, Mint>,
    #[account(mut)]
    pub payer: Signer<'info>,
    pub rent: Sysvar<'info, Rent>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    /// CHECK: Metaplex program ID
    pub token_metadata_program: UncheckedAccount<'info>,
    #[account(
        init,
        seeds = [b"sol_vault", mint.key().as_ref()],
        bump,
        payer = payer,
        space = 8 + VaultAccount::INIT_SPACE
    )]
    pub sol_vault: Account<'info, VaultAccount>,
}

#[derive(AnchorSerialize, AnchorDeserialize, Debug, Clone)]
pub struct InitCoinParams {
    pub name: String,
    pub symbol: String,
    pub uri: String,
    pub decimals: u8,
}