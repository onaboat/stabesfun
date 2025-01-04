use anchor_lang::prelude::*;

use switchboard_on_demand::on_demand::accounts::pull_feed::PullFeedAccountData;

pub fn price(ctx: Context<Price>) -> Result<()> {
    let feed_account = ctx.accounts.feed.data.borrow();

    let feed = PullFeedAccountData::parse(feed_account).unwrap();

    let price = feed.value();

    msg!("price: {:?}", price);
    Ok(())
}

#[derive(Accounts)]
pub struct Price<'info> {
    /// CHECK: This is safe because we manually deserialize and verify the account data
    pub feed: AccountInfo<'info>,
}
