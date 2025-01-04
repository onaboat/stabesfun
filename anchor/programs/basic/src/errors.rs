use anchor_lang::prelude::*;

#[error_code]
pub enum CustomError {
    #[msg("Quantity must be greater than zero.")]
    InvalidQuantity,   
     #[msg("Token calculation resulted in zero tokens.")]
    InvalidCalculation,
    #[msg("Insufficient funds in the PDA.")]
    InsufficientFunds,
    #[msg("Invalid symbol.")]
    InvalidSymbol,
    #[msg("Symbol must be 4 characters or less.")]
    SymbolTooLong,
    #[msg("Symbol must be alphanumeric.")]
    SymbolNotAlphanumeric,
}
