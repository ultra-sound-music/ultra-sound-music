# Devnet

Our devnet DAO is hosted on [Realms](https://realms.today/dao/BJnj5DzcYhVEnib3UPFLBsXbnCfhUXsYEWfxEoV1gtnY?cluster=devnet).

The account is [BJnj5DzcYhVEnib3UPFLBsXbnCfhUXsYEWfxEoV1gtnY](https://explorer.solana.com/address/BJnj5DzcYhVEnib3UPFLBsXbnCfhUXsYEWfxEoV1gtnY?cluster=devnet)

### Wallet addresses (devnet):

| Member           | Wallet                                                                                                                                          |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| @0xChillDirector | [5Vgdr4j486H9DnHb224gMw8jwfYGJagDjqdjXGhCm4Kk](https://explorer.solana.com/address/5Vgdr4j486H9DnHb224gMw8jwfYGJagDjqdjXGhCm4Kk?cluster=devnet) |
| @veejeezy        | [9z4YL1LcS9i5BSpuQKhywiytZMzapzi1g6TuiN2msdWt](https://explorer.solana.com/address/9z4YL1LcS9i5BSpuQKhywiytZMzapzi1g6TuiN2msdWt?cluster=devnet) |
| @0xGambas        | [Agaf4v6JyiV4dRi5FA3GyiUKx3noQPbhakUAPpSLoMvK](https://explorer.solana.com/address/Agaf4v6JyiV4dRi5FA3GyiUKx3noQPbhakUAPpSLoMvK?cluster=devnet) |
| @grend3lxc       | [C89hE9rEQ6zo8GC26FRNuh27voJFRB3ZWbrf2bhBZW9d](https://explorer.solana.com/address/C89hE9rEQ6zo8GC26FRNuh27voJFRB3ZWbrf2bhBZW9d?cluster=devnet) |
| Wildcard?        | Should we create an extra wallet in case of an emergency?                                                                                       |

### Governance tokens

| Token           | Account                                                                                                                                                 |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Council Token   | [CCkVCT9h7xAzzREDib2uKgxq5igHdcrSaieL2rcVEtQL](https://explorer.solana.com/address/CCkVCT9h7xAzzREDib2uKgxq5igHdcrSaieL2rcVEtQL/largest?cluster=devnet) |
| Community Token | [EnEMDuYykVz8DC943GfQn2EDqFfUcb5WojxGEPXiUmZa](https://explorer.solana.com/address/EnEMDuYykVz8DC943GfQn2EDqFfUcb5WojxGEPXiUmZa/largest?cluster=devnet) |

### Governances

| Description                  | Account                                                                                                                                                 | Type              | tokens? |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- | ------- |
| Council Token Mint Authority | [6HaAke821jsaycJLFfG68rLmBWWV6fUuANfW2Lpu2Dss](https://explorer.solana.com/address/6HaAke821jsaycJLFfG68rLmBWWV6fUuANfW2Lpu2Dss/largest?cluster=devnet) | GovernanceV1      |         |
| Council Token Authority      | [EcfDJe1eMh3FFZZrknDfD2pDHjjU3XDDW4uG1dRA6yX4](https://explorer.solana.com/address/EcfDJe1eMh3FFZZrknDfD2pDHjjU3XDDW4uG1dRA6yX4/largest?cluster=devnet) | GovernanceV1      |         |
| Treasury                     | [6CZaruf4ZCn1jJh6FUaEyZPhjp3yVJSXCpgRxVqW1mvz](https://explorer.solana.com/address/6CZaruf4ZCn1jJh6FUaEyZPhjp3yVJSXCpgRxVqW1mvz/largest?cluster=devnet) | TokenGovernanceV1 | X       |
| ??                           | [Cqx8tj2JtV38oaFAaZinA63TxTAzfzncCznwxERLSdNJ](https://explorer.solana.com/address/Cqx8tj2JtV38oaFAaZinA63TxTAzfzncCznwxERLSdNJ?cluster=devnet)         | TokenGovernanceV2 | X       |
| General NFT Treasury         | [99TJMhx52USA6HLpYmYwCAaDWiYEjvAmccu5pwRfkcXr](https://explorer.solana.com/address/99TJMhx52USA6HLpYmYwCAaDWiYEjvAmccu5pwRfkcXr?cluster=devnet)         | TokenGovernanceV2 | X       |
| NFT Creator                  | [6ckMb1fXrELfqNJxKUFATfE1LM5wJxUmcpmGWEj91fY2](https://explorer.solana.com/address/6ckMb1fXrELfqNJxKUFATfE1LM5wJxUmcpmGWEj91fY2?cluster=devnet)         | TokenGovernanceV2 | X       |

#### Some things to note about the governance tokens:

- You can view all details related to either token using any [Solana Blockchain explorer](https://explorer.solana.com/address/CCkVCT9h7xAzzREDib2uKgxq5igHdcrSaieL2rcVEtQL/largest?cluster=devnet).
- You can see that the "Mint Authority" for the council token currently belongs to [A1foxhn58LRhpD2fWpE5GKrYWvCYkgBNEFLZHbZc4jhc](https://explorer.solana.com/address/A1foxhn58LRhpD2fWpE5GKrYWvCYkgBNEFLZHbZc4jhc?cluster=devnet), which is one of my dev wallets. The "Mint Authority" is the account that is authorized to mint more council tokens. Obv, if this were prod, we wouldn't want any one person to have mint authority over our tokens, but rather we would want the DAO to have that authority. I'll create a proposal later to change this mint authority to our devnet DAO.
- Note the decimals. Our devnet council token has a decimal value that goes to 9, meaning we can create fractionalized versions of this particular council token with up to 9 decimal places. In production we'll very likely want to set this to 0, meaning a token can only exist in an account as whole values.

We are using the [SPL-GOVERNANCE program](https://github.com/solana-labs/solana-program-library/tree/master/governance) (think of it as the Metaplex for DAOs). Check out the [user guide](https://github.com/coffeemug/spl-governance-docs).

The UI is under heavy active development. There is an [older UI](https://solana-labs.github.io/oyster-gov/#/realm/BJnj5DzcYhVEnib3UPFLBsXbnCfhUXsYEWfxEoV1gtnY?programId=GovER5Lthms3bLBqWub97yVrMmEogzX7xNjdXpPPCVZw) that is being deprecated. The [newer UI](https://realms.today/dao/BJnj5DzcYhVEnib3UPFLBsXbnCfhUXsYEWfxEoV1gtnY?cluster=devnet) is much slicker but may lack some features.

## Initial Setup exercise

1. Make sure you are on the devnet (click on cog in top right corner and select devnet)
2. In order to be able to vote on a proposal, you need to verify that you are a council member. The way to do this is by going to the "Old UI" link above, connecting your wallet (make sure you are on devnet), and deposit your "Council Token" (its the one that starts with CCkV...)
3. Note we currently have 3 governance accounts:
   - : This account was created to have governance over our "Treasury"
   - : This account was created to have governance over our the account that minted the council token
   - : This account was created to have governance over the council token itself.
4. Note that only the treasury governance has proposals.
5. Reject the "Give Me All Your Tokens" proposal
   - Go here: https://solana-labs.github.io/oyster-gov/#/proposal/7ySLzyo79s3bGLfCEyVntzE6YkNXFUL2T8zBSyUMaePV?programId=GovER5Lthms3bLBqWub97yVrMmEogzX7xNjdXpPPCVZw
   - Click on the "Nay" button
6. Approve the "Increase Max Voting Time To 4 Days" proposal.
7. Feel free to play around and create / cancel proposals and governances to your heart’s desire!
