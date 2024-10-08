use anchor_lang::prelude::*;
use anchor_lang::solana_program::system_program;

declare_id!("<Your-Actual-Program-ID>");

#[program]
pub mod cipher {
    use super::*;

    pub fn create_pool(ctx: Context<CreatePool>, initial_deposit: u64) -> Result<()> {
        let pool = &mut ctx.accounts.pool;
        pool.balance = initial_deposit;
        Ok(())
    }

    pub fn claim(ctx: Context<Claim>, amount: u64) -> Result<()> {
        let pool = &mut ctx.accounts.pool;
        if pool.balance >= amount {
            pool.balance -= amount;
            Ok(())
        } else {
            Err(ErrorCode::InsufficientFunds.into())
        }
    }
}

#[derive(Accounts)]
pub struct CreatePool<'info> {
    #[account(init, payer = user, space = 8 + 8)]
    pub pool: Account<'info, Pool>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Claim<'info> {
    #[account(mut)]
    pub pool: Account<'info, Pool>,
    pub user: Signer<'info>,
}

#[account]
pub struct Pool {
    pub balance: u64,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Insufficient funds in pool.")]
    InsufficientFunds,
}

