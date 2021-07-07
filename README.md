# IDX Account Linker

Create verifiable credentials representing control of social media accounts (currently Github).

## Setup

A copy of the document definition IDs is checked into the repo, but should you need to generate a new set, the method is:

* `RANDBYTES=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")`
* `SEED=$RANDBYTES yarn bootstrap`

## Development

This is a create-react-app-based application, so all the usual procedures apply. To get it running should just be `yarn && yarn start`.