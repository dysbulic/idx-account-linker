# ETHDenver 2021

## Intro SourceCred

SourceCred is an automated system for rewarding value added to an organization. It takes contributions from Github, messages from Discord, and posts from Discourse; converts them into a graph; and then uses PageRank to "flow" a token until the distribution stabilizes.

Based on the distribution of that token, periodically a more valuable liquidity-backed token is minted and distributed to the participants.

## The Problem

To make the connections between content graphs, the SourceCred system needs to know which accounts across systems belong to the same user. Currently the solution is for users to interact with a Discord bot which creates the account links.

The weakness of this solution is there is no authentication, so it is possible to claim someone else's account.

## The Solution

IDX offers the IdentityLink service which generates a Verifiable Credential representing an account link authenticated by the user publishing their DID to the service.

For example, for Github, the user must create a gist which contains their DID.

The UI for generating an account link doesn't exist yet, so the first part of the Buidlathon was spent developing a simple interface for generating Github account links.

## Demo [IDX Account Linker](https://dysbulic.github.io/idx-account-linker/)  

## Demo [IDX SourceCred Interlink](https://github.com/All-in-on-IDX/idx-sourcecred-bridge)

I'm going to set both of these running since both have a slight startup delay.

On top, the account linker is looking up a DID for the user given their Ethereum address. Once that is found, the DID has to be pasted into a gist. Within five minutes, the program has to check and verify control of the account.

The bottom window is a program that has loaded a SourceCred ledger and is checking the Ethereum address of each account for an IDX DID. If it is found, the system checks for account links, and creates the appropriate aliases in SourceCred.

What to do when a user verifies the same account multiple times is not defined in the specification, and the current system is simply adding them. That's why, for my address, you see several failed attempts to create an account link with the same name.

Those are the systems 
