# ETHDenver 2021

Hi, I'm Will, aka. dysbulic, and this is my entry for the Buidlathon: allowing SourceCred to use IDX as a source of truth.

For the purpose of saving time, I'm going to demo the system as I describe it.

## Intro SourceCred

SourceCred is an automated system for rewarding value added to an organization. It takes contributions from Github, messages from Discord, and posts from Discourse; converts them into a graph; and then uses PageRank to "flow" a token until the distribution stabilizes.

Based on the distribution of that token, periodically a more valuable liquidity-backed token is minted and distributed to the participants.

## 

## The Problem

To make the connections between content graphs, the SourceCred system needs to know which accounts across systems belong to the same user. Currently the solution is for users to interact with a Discord bot which creates the account links.

The weakness of this solution is there is no authentication, so it is possible to claim someone else's account.

## The Solution

IDX offers the IdentityLink service which generates a Verifiable Credential representing control of an account. Authentication is done by the user publishing their DID into the service in question.

For example, for Github, the user creates a gist which contains their DID.

The UI for generating an account link didn't exist yet, so the first part of the Buidlathon was spent developing the simple interface seen here on top for generating Github account links.

The bottom window is a program that loads a SourceCred ledger, checks the associated Ethereum address for an IDX DID, then loads any account links, and converts them into SourceCred aliases.

When a user verifies an account multiple times, the credentials are appended to a list. That's why you see multiple errors for trying to create a duplicate alias.

Those are the systems. Thank you for your time.