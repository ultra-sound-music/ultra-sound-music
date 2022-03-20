# Overview

the governance accounts PDAs are the signing authorities when you use spl-governance. If you want any asset to be owned by realm then the ownership should be transferred to the governance PDA, for example for programs the upgrade_auhtority is transferred to governance PDA

Generally speaking the main primitive is the Governance PDA account. It represents authority over some assets (token accounts, NFT, programs, mints, etc...) plus the governance rules (quorum, voting time, proposal creation rules)
The default setup (implemented in the mvp UI) is 1 governance - 1 asset (governedAccount), but it can be 1 governance - N assets. It' exactly as you suggested, you can create ATAs for the governance PDA
We have exactly this setup in the yield farming DAO prototype, https://dao-beta.mango.markets/dao/Yield%20Farming The governance there owns RAY, SRM and RAY-SRM LP accounts https://dao.mango.markets/#/realm/8eUUtRpBCg7sJ5FXfPUMiwSQNqC3FjFLkmS2oFPKoiBi?programId=GovER5Lthms3bLBqWub97yVrMmEogzX7xNjdXpPPCVZw
and the setup in explorer https://explorer.solana.com/address/BB457CW2sN2BpEXzCCi3teaCnDT3hGPZDoCCutHb6BsQ/tokens

A treasury account I'm creating a new governance but the UI doesn't show the actual governance account...what the UI shows is the one ATA under the governance account that holds the mint that was specified when creating the treasury account

the 'treasury account' or 'shared wallet' concept is implemented using 2 accounts: 1) The Governance account which is the PDA authority and defines governance rules and 2) The SPL token account which holds the tokens and is owned by the Governance PDA
