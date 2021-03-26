# ETHDenver

## Intro SourceCred

*[Show [attribution graph](https://medium.com/sourcecred/network-formation-games-7a74491abf0e#e0b1:~:text=Here%20is%20an%20example%20of%20data%20collected%20using%20the%20Git%20and%20Github%20plugins%20in%20the%20SourceCred%20project%3A)]*

SourceCred is an automated system for rewarding value added to an organization. It takes contributions from Github, messages from Discord, and posts from Discourse; converts them into a graph; and then uses PageRank to "flow" a token until the distribution stabilizes.

Based on the distribution of that token, periodically a liquidity-backed token is minted and distributed to the participants.

## The Problem

To make the connections between content graphs, the SourceCred system needs to know which accounts across systems belong to the same user. Currently the solution is users interact with a Discord bot which creates the account links based on chat interactions.

The weakness of this solution is there is no authentication, so it is possible to claim someone else's account.

## The Solution

IDX offers the IdentityLink service which generates a Verifiable Credential representing an account link when a user publishes their DID to the service.

For example, for Github, the user must create a gist which contains their DID. Unfortunately, the UI for generating an account link doesn't exist yet, so the first part of the Buidlathon was spent developing a simple interface for generating Github account links.

## Demo [IDX Account Linker](https://dysbulic.github.io/idx-account-linker/)  

## SourceCred Integration

The second part of the hackathon was spent on a program that iterates over the users of a SourceCred instance, checks for identity links, and creates aliases as necessary.

## Demo [IDX SourceCred Interlink](https://github.com/All-in-on-IDX/idx-sourcecred-bridge)